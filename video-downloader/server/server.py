import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import ssl
import certifi
import tempfile
import threading
import uuid

# ── Environment Configuration ──────────────────────────
PORT = int(os.environ.get('PORT', 8787))
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')

# ── Fix macOS SSL certificate issue ──────────────────────────
os.environ['SSL_CERT_FILE'] = certifi.where()
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
ssl_ctx = ssl.create_default_context(cafile=certifi.where())
ssl._create_default_https_context = lambda: ssl.create_default_context(cafile=certifi.where())

app = Flask(__name__)

# Configure CORS
if ALLOWED_ORIGINS == ['*']:
    CORS(app)
else:
    CORS(app, origins=ALLOWED_ORIGINS)

# Store download progress per job
progress_store = {}
DOWNLOAD_DIR = tempfile.mkdtemp()


def progress_hook(job_id):
    def hook(d):
        if d['status'] == 'downloading':
            total = d.get('total_bytes') or d.get('total_bytes_estimate', 0)
            downloaded = d.get('downloaded_bytes', 0)
            percent = int((downloaded / total) * 100) if total else 0
            progress_store[job_id] = {
                'status': 'downloading',
                'percent': percent,
                'speed': d.get('_speed_str', ''),
                'eta': d.get('_eta_str', ''),
            }
        elif d['status'] == 'finished':
            progress_store[job_id] = {
                'status': 'finished',
                'percent': 100,
                'filepath': d.get('filename', ''),
            }
        elif d['status'] == 'error':
            progress_store[job_id] = {'status': 'error', 'percent': 0}
    return hook


@app.route('/api/info', methods=['POST'])
def get_info():
    """Fetch video metadata + thumbnail URL"""
    data = request.get_json()
    url = data.get('url', '').strip()
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
        'noplaylist': True,
        'nocheckcertificate': False,  # certifi handles this
        'extract_flat': False,
        'socket_timeout': 30,
        'retries': 3,
        'fragment_retries': 3,
        'extractor_retries': 3,
        'file_access_retries': 3,
        'http_chunk_size': 16384,
        'extractor_args': {
            'instagram': {
                'skip_download': True,
                'extract_flat': False,
            }
        }
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        # Build formats list
        formats_raw = info.get('formats', [])
        seen = set()
        formats = []
        for f in reversed(formats_raw):
            height = f.get('height')
            ext = f.get('ext', '')
            vcodec = f.get('vcodec', 'none')
            acodec = f.get('acodec', 'none')

            if vcodec != 'none' and height and height not in seen:
                seen.add(height)
                formats.append({
                    'format_id': f['format_id'],
                    'label': f'{height}p {ext.upper()}',
                    'height': height,
                    'ext': ext,
                    'filesize': f.get('filesize') or f.get('filesize_approx'),
                })

        # Add audio-only option
        formats.append({'format_id': 'bestaudio/best', 'label': 'Audio Only (MP3)', 'height': 0, 'ext': 'mp3', 'filesize': None})

        # Sort by height descending
        formats = sorted([f for f in formats if f['height'] > 0], key=lambda x: x['height'], reverse=True) + \
                  [f for f in formats if f['height'] == 0]

        # Limit to top 5 video + audio
        formats = formats[:5] + [formats[-1]] if len(formats) > 1 else formats

        duration_secs = info.get('duration', 0)
        mins = int(duration_secs // 60)
        secs = int(duration_secs % 60)

        return jsonify({
            'title': info.get('title', 'Unknown Title'),
            'thumbnail': info.get('thumbnail', ''),
            'duration': f'{mins}:{secs:02d}',
            'uploader': info.get('uploader', ''),
            'view_count': info.get('view_count', 0),
            'formats': formats,
        })

    except yt_dlp.utils.DownloadError as e:
        error_msg = str(e).replace('ERROR: ', '')
        # Handle specific Instagram rate limit error
        if 'rate-limit' in error_msg.lower() or 'login required' in error_msg.lower():
            return jsonify({'error': 'Instagram is temporarily limiting requests. Please try again in a few minutes or use a different video.'}), 429
        return jsonify({'error': error_msg}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to fetch video info: {str(e)}'}), 500


@app.route('/api/download', methods=['POST'])
def start_download():
    """Start async download, return job_id"""
    data = request.get_json()
    url = data.get('url', '').strip()
    format_id = data.get('format_id', 'bestvideo+bestaudio/best')
    is_audio = data.get('is_audio', False)

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    job_id = str(uuid.uuid4())
    progress_store[job_id] = {'status': 'starting', 'percent': 0}

    def run_download():
        output_path = os.path.join(DOWNLOAD_DIR, f'{job_id}.%(ext)s')

        if is_audio:
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': output_path,
                'quiet': True,
                'no_warnings': True,
                'noplaylist': True,
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'progress_hooks': [progress_hook(job_id)],
            }
        else:
            ydl_opts = {
                'format': format_id if format_id != 'bestvideo+bestaudio/best' else 'bestvideo+bestaudio/best',
                'outtmpl': output_path,
                'quiet': True,
                'no_warnings': True,
                'noplaylist': True,
                'merge_output_format': 'mp4',
                'progress_hooks': [progress_hook(job_id)],
            }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                # Find the actual output file
                ext = 'mp3' if is_audio else 'mp4'
                filepath = os.path.join(DOWNLOAD_DIR, f'{job_id}.{ext}')
                # Try to find the file if extension differs
                if not os.path.exists(filepath):
                    for f in os.listdir(DOWNLOAD_DIR):
                        if f.startswith(job_id):
                            filepath = os.path.join(DOWNLOAD_DIR, f)
                            break
                progress_store[job_id] = {
                    'status': 'finished',
                    'percent': 100,
                    'filepath': filepath,
                    'title': info.get('title', 'video'),
                    'ext': ext,
                }
        except Exception as e:
            progress_store[job_id] = {'status': 'error', 'percent': 0, 'error': str(e)}

    thread = threading.Thread(target=run_download, daemon=True)
    thread.start()

    return jsonify({'job_id': job_id})


@app.route('/api/progress/<job_id>', methods=['GET'])
def get_progress(job_id):
    """Poll download progress"""
    info = progress_store.get(job_id, {'status': 'not_found', 'percent': 0})
    # Don't expose filepath in progress response
    return jsonify({
        'status': info.get('status'),
        'percent': info.get('percent', 0),
        'speed': info.get('speed', ''),
        'eta': info.get('eta', ''),
        'error': info.get('error', ''),
    })


@app.route('/api/file/<job_id>', methods=['GET'])
def serve_file(job_id):
    """Serve the downloaded file"""
    info = progress_store.get(job_id)
    if not info or info.get('status') != 'finished':
        return jsonify({'error': 'File not ready'}), 404

    filepath = info.get('filepath', '')
    if not filepath or not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    title = info.get('title', 'video')
    ext = info.get('ext', 'mp4')
    safe_title = ''.join(c for c in title if c.isalnum() or c in ' -_')[:60].strip()
    download_name = f'{safe_title}.{ext}'

    return send_file(
        filepath,
        as_attachment=True,
        download_name=download_name,
        mimetype='video/mp4' if ext == 'mp4' else 'audio/mpeg',
    )


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'yt_dlp': yt_dlp.version.__version__})


if __name__ == '__main__':
    print(f'🚀 VidGrab backend running on http://0.0.0.0:{PORT}')
    app.run(host='0.0.0.0', port=PORT, debug=False)
