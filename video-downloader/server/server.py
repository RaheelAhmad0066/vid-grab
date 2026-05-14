import os
import re
import json
import html as html_module
import urllib.request
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import ssl
import certifi
import tempfile
import threading
import uuid

# ── Environment Configuration ─────────────────────────────────────────────────
PORT = int(os.environ.get('PORT', 8787))
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')

# Optional: path to a Netscape-format cookies file for Instagram auth
# Set INSTAGRAM_COOKIES=/path/to/cookies.txt in your environment
INSTAGRAM_COOKIES_FILE = os.environ.get('INSTAGRAM_COOKIES', '').strip() or None

# Optional: path to a Netscape-format cookies file for YouTube auth
# Set YOUTUBE_COOKIES=/path/to/youtube_cookies.txt in your environment
YOUTUBE_COOKIES_FILE = os.environ.get('YOUTUBE_COOKIES', '').strip() or None

os.environ['SSL_CERT_FILE']       = certifi.where()
os.environ['REQUESTS_CA_BUNDLE']  = certifi.where()
ssl_ctx = ssl.create_default_context(cafile=certifi.where())
ssl._create_default_https_context = lambda: ssl.create_default_context(cafile=certifi.where())

app = Flask(__name__)
if ALLOWED_ORIGINS == ['*']:
    CORS(app)
else:
    CORS(app, origins=ALLOWED_ORIGINS)

progress_store = {}
DOWNLOAD_DIR   = tempfile.mkdtemp()

# ── Domain matchers ───────────────────────────────────────────────────────────
MOVIEBOX_DOMAINS   = re.compile(r'moviebox\.ph|moviebox\.com|movieboxpro\.com', re.IGNORECASE)
SNAPCHAT_DOMAINS   = re.compile(r'snapchat\.com',  re.IGNORECASE)
INSTAGRAM_DOMAINS  = re.compile(r'instagram\.com', re.IGNORECASE)

# ── Common headers ────────────────────────────────────────────────────────────
BROWSER_HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    ),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

MOBILE_HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) '
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    ),
    'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

SNAPCHAT_HEADERS = {
    **MOBILE_HEADERS,
    'Referer': 'https://www.snapchat.com/',
    'Origin':  'https://www.snapchat.com',
}

INSTAGRAM_EMBED_HEADERS = {
    **BROWSER_HEADERS,
    'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Referer':         'https://www.instagram.com/',
    'sec-fetch-dest':  'iframe',
    'sec-fetch-mode':  'navigate',
    'sec-fetch-site':  'same-origin',
}


# ─────────────────────────────────────────────────────────────────────────────
# Helper: process yt-dlp info dict → our API format
# ─────────────────────────────────────────────────────────────────────────────

def _ydl_to_response(info):
    """Convert a yt-dlp info dict to the API response dict."""
    formats_raw = info.get('formats', [])
    seen, formats = set(), []
    for f in reversed(formats_raw):
        height = f.get('height')
        ext    = f.get('ext', '')
        if f.get('vcodec', 'none') != 'none' and height and height not in seen:
            seen.add(height)
            formats.append({
                'format_id': f['format_id'],
                'label':     f'{height}p {ext.upper()}',
                'height':    height,
                'ext':       ext,
                'filesize':  f.get('filesize') or f.get('filesize_approx'),
            })

    formats.append({
        'format_id': 'bestaudio/best',
        'label':     'Audio Only (MP3)',
        'height':    0, 'ext': 'mp3', 'filesize': None,
    })
    formats = (
        sorted([f for f in formats if f['height'] > 0], key=lambda x: x['height'], reverse=True)
        + [f for f in formats if f['height'] == 0]
    )
    formats = formats[:5] + [formats[-1]] if len(formats) > 1 else formats

    duration_secs = info.get('duration', 0) or 0
    return {
        'title':      info.get('title', 'Unknown'),
        'thumbnail':  info.get('thumbnail', ''),
        'duration':   f'{int(duration_secs // 60)}:{int(duration_secs % 60):02d}',
        'uploader':   info.get('uploader', ''),
        'view_count': info.get('view_count', 0),
        'formats':    formats,
    }


# ─────────────────────────────────────────────────────────────────────────────
# MovieBox scraper
# ─────────────────────────────────────────────────────────────────────────────

def fetch_moviebox_info(url):
    req = urllib.request.Request(url, headers=BROWSER_HEADERS)
    with urllib.request.urlopen(req, timeout=15, context=ssl_ctx) as resp:
        page      = resp.read().decode('utf-8', errors='replace')
        final_url = resp.geturl()

    if final_url != url and 'moviebox' in final_url:
        req2 = urllib.request.Request(final_url, headers=BROWSER_HEADERS)
        with urllib.request.urlopen(req2, timeout=15, context=ssl_ctx) as resp2:
            page = resp2.read().decode('utf-8', errors='replace')

    title_m = re.search(r'<title[^>]*>(.*?)</title>', page, re.DOTALL)
    title   = html_module.unescape(title_m.group(1).strip()) if title_m else 'MovieBox Video'
    title   = re.sub(r'\s*[-|]\s*MovieBox.*$', '', title, flags=re.IGNORECASE).strip()

    thumb_m   = re.search(r'(https?://[^\s"<>]+\.(?:jpg|jpeg|png|webp)[^\s"<>]*)', page)
    thumbnail = thumb_m.group(1) if thumb_m else ''

    mp4_m = re.search(r'(https?://[^\s"<>]+\.mp4[^\s"<>]*)', page)
    if not mp4_m:
        raise ValueError('Could not find video URL on MovieBox page')

    dur_m         = re.search(r'"duration"\s*:\s*(\d+)', page)
    duration_secs = int(dur_m.group(1)) if dur_m else 0

    return {
        'title':      title,
        'thumbnail':  thumbnail,
        'duration':   f'{duration_secs // 60}:{duration_secs % 60:02d}',
        'uploader':   'MovieBox',
        'view_count': 0,
        'video_url':  mp4_m.group(1),
        'formats': [
            {'format_id': 'direct_mp4',       'label': 'Best Quality (MP4)', 'height': 720, 'ext': 'mp4', 'filesize': None},
            {'format_id': 'bestaudio/best',   'label': 'Audio Only (MP3)',   'height': 0,   'ext': 'mp3', 'filesize': None},
        ],
    }


# ─────────────────────────────────────────────────────────────────────────────
# Snapchat scraper
# ─────────────────────────────────────────────────────────────────────────────

def _parse_iso_duration(dur_str):
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', dur_str or '')
    if not m:
        return '0:00'
    hours = int(m.group(1) or 0)
    mins  = int(m.group(2) or 0) + hours * 60
    secs  = int(m.group(3) or 0)
    return f'{mins}:{secs:02d}'


def _og(page, prop):
    pattern = (
        rf'<meta[^>]+property=["\']og:{prop}["\'][^>]+content=["\']([^"\']+)["\']'
        rf'|<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:{prop}["\']'
    )
    m = re.search(pattern, page, re.IGNORECASE)
    return html_module.unescape(m.group(1) or m.group(2)) if m else ''


def fetch_snapchat_info(url):
    req = urllib.request.Request(url, headers=SNAPCHAT_HEADERS)
    with urllib.request.urlopen(req, timeout=20, context=ssl_ctx) as resp:
        page = resp.read().decode('utf-8', errors='replace')

    title, thumbnail, video_url, duration, uploader = 'Snapchat Video', '', None, '0:00', 'Snapchat'

    for jld_m in re.finditer(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        page, re.DOTALL | re.IGNORECASE,
    ):
        try:
            ld = json.loads(jld_m.group(1))
            if isinstance(ld, list):
                ld = ld[0]
            content_url = ld.get('contentUrl') or ld.get('embedUrl')
            if content_url:
                video_url = content_url
                title     = ld.get('name', title)
                thumb     = ld.get('thumbnailUrl', '')
                thumbnail = (thumb[0] if isinstance(thumb, list) and thumb else thumb) or thumbnail
                duration  = _parse_iso_duration(ld.get('duration', ''))
                if isinstance(ld.get('author'), dict):
                    uploader = ld['author'].get('name', uploader)
                break
        except Exception:
            continue

    if not video_url:
        video_url = _og(page, 'video:url') or _og(page, 'video') or None
    if not video_url:
        mp4_m = re.search(r'(https?://[^\s"\'<>]+\.mp4[^\s"\'<>]*)', page)
        video_url = mp4_m.group(1) if mp4_m else None

    if not video_url:
        raise ValueError('Could not extract video from this Snapchat link. Only public Spotlight / Story videos are supported.')

    if title == 'Snapchat Video':
        title = _og(page, 'title') or title
    if not thumbnail:
        thumbnail = _og(page, 'image') or ''

    return {
        'title': title, 'thumbnail': thumbnail, 'duration': duration,
        'uploader': uploader, 'view_count': 0, 'video_url': video_url,
        'formats': [
            {'format_id': 'direct_snap',    'label': 'Best Quality (MP4)', 'height': 1080, 'ext': 'mp4', 'filesize': None},
            {'format_id': 'bestaudio/best', 'label': 'Audio Only (MP3)',   'height': 0,    'ext': 'mp3', 'filesize': None},
        ],
    }


# ─────────────────────────────────────────────────────────────────────────────
# Instagram scraper  (embed endpoint — works for public posts & reels)
# ─────────────────────────────────────────────────────────────────────────────

def fetch_instagram_via_embed(url):
    """
    Fetch an Instagram post/reel via the /embed/captioned/ endpoint.
    Works for public content without requiring login.
    """
    m = re.search(r'/(?:p|reel|tv)/([A-Za-z0-9_-]+)', url)
    if not m:
        raise ValueError('Unsupported Instagram URL. Only posts and reels are supported.')
    shortcode = m.group(1)
    embed_url = f'https://www.instagram.com/p/{shortcode}/embed/captioned/'

    req = urllib.request.Request(embed_url, headers=INSTAGRAM_EMBED_HEADERS)
    with urllib.request.urlopen(req, timeout=20, context=ssl_ctx) as resp:
        page = resp.read().decode('utf-8', errors='replace')

    # Instagram typically embeds video data as JSON inside the page.
    # Pattern: "video_url":"https://..." (JSON-escaped)
    video_url = None
    for vm in re.finditer(r'"video_url"\s*:\s*"(https://[^"]+)"', page):
        raw = vm.group(1)
        try:
            video_url = json.loads(f'"{raw}"')   # handles & etc.
        except Exception:
            video_url = raw.replace('\\/', '/').replace('\\u0026', '&')
        break

    # Fallback: <video src="...">
    if not video_url:
        vm = re.search(r'<video[^>]+src=["\']([^"\']+)["\']', page, re.IGNORECASE)
        if vm:
            video_url = html_module.unescape(vm.group(1))

    # Fallback: og:video
    if not video_url:
        video_url = _og(page, 'video:url') or _og(page, 'video') or None

    if not video_url:
        raise ValueError(
            'Could not extract video from this Instagram post. '
            'It may be private or age-restricted. '
            'Set INSTAGRAM_COOKIES=/path/to/cookies.txt in your environment for full access.'
        )

    # Title: prefer og:description (usually the caption), then og:title
    title = _og(page, 'description') or _og(page, 'title') or ''
    title = re.sub(r'\s*[•·|]\s*Instagram.*$', '', title, flags=re.IGNORECASE).strip()
    title = (title[:120] + '…') if len(title) > 120 else title
    title = title or 'Instagram Video'

    thumbnail = _og(page, 'image') or ''

    return {
        'title': title, 'thumbnail': thumbnail, 'duration': '0:00',
        'uploader': 'Instagram', 'view_count': 0, 'video_url': video_url,
        'formats': [
            {'format_id': 'direct_instagram', 'label': 'Best Quality (MP4)', 'height': 1080, 'ext': 'mp4', 'filesize': None},
        ],
    }


def _instagram_ydl_info(url, skip_download=True):
    """
    Try multiple yt-dlp strategies for Instagram, then fall back to embed scraper.
    Returns (info_dict_or_scraper_result, is_direct_url).
    """
    base = {
        'quiet': True, 'no_warnings': True,
        'skip_download': skip_download, 'noplaylist': True,
        'socket_timeout': 25, 'retries': 2,
        'extractor_args': {'instagram': {'include_feeds': False}},
    }

    strategies = [
        # 1. Default headers
        {},
        # 2. Facebook crawler UA — bypasses some login walls
        {'http_headers': {'User-Agent': 'facebookexternalhit/1.1'}},
        # 3. Mobile UA
        {'http_headers': MOBILE_HEADERS},
    ]

    # 4. Cookies from env file
    if INSTAGRAM_COOKIES_FILE and os.path.exists(INSTAGRAM_COOKIES_FILE):
        strategies.append({'cookiesfile': INSTAGRAM_COOKIES_FILE})

    # 5. Cookies from installed browsers
    for browser in ('chrome', 'firefox', 'chromium', 'brave', 'edge', 'safari'):
        strategies.append({'cookiesfrombrowser': (browser, None, None, None)})

    last_err = None
    for extra in strategies:
        try:
            opts = {**base, **extra}
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=False)
            return info, False
        except Exception as e:
            last_err = e
            continue

    # All yt-dlp strategies failed — try embed scraper
    try:
        result = fetch_instagram_via_embed(url)
        return result, True          # True = is_direct_url (not a yt-dlp info dict)
    except Exception as e:
        raise ValueError(
            'Instagram is blocking this request. '
            'To fix: log in to Instagram in Chrome, then restart the server. '
            f'(Last error: {last_err})'
        ) from e


# ─────────────────────────────────────────────────────────────────────────────
# Progress hook
# ─────────────────────────────────────────────────────────────────────────────

def progress_hook(job_id):
    def hook(d):
        if d['status'] == 'downloading':
            total      = d.get('total_bytes') or d.get('total_bytes_estimate', 0)
            downloaded = d.get('downloaded_bytes', 0)
            percent    = int((downloaded / total) * 100) if total else 0
            progress_store[job_id] = {
                'status': 'downloading', 'percent': percent,
                'speed': d.get('_speed_str', ''), 'eta': d.get('_eta_str', ''),
            }
        elif d['status'] == 'finished':
            progress_store[job_id] = {'status': 'finished', 'percent': 100, 'filepath': d.get('filename', '')}
        elif d['status'] == 'error':
            progress_store[job_id] = {'status': 'error', 'percent': 0}
    return hook


# ─────────────────────────────────────────────────────────────────────────────
# Helper: stream a direct URL to disk
# ─────────────────────────────────────────────────────────────────────────────

def direct_download(job_id, video_url, title, ext, request_headers):
    filepath = os.path.join(DOWNLOAD_DIR, f'{job_id}.{ext}')
    progress_store[job_id] = {'status': 'downloading', 'percent': 0}
    try:
        req = urllib.request.Request(video_url, headers=request_headers)
        with urllib.request.urlopen(req, timeout=120, context=ssl_ctx) as resp:
            total      = int(resp.headers.get('Content-Length', 0))
            downloaded = 0
            with open(filepath, 'wb') as f:
                while True:
                    chunk = resp.read(65536)
                    if not chunk:
                        break
                    f.write(chunk)
                    downloaded += len(chunk)
                    progress_store[job_id] = {
                        'status': 'downloading',
                        'percent': int((downloaded / total) * 100) if total else 0,
                    }
        progress_store[job_id] = {
            'status': 'finished', 'percent': 100,
            'filepath': filepath, 'title': title, 'ext': ext,
        }
    except Exception as e:
        progress_store[job_id] = {'status': 'error', 'percent': 0, 'error': str(e)}


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/api/info', methods=['POST'])
def get_info():
    data = request.get_json()
    url  = data.get('url', '').strip()
    cookies = data.get('cookies', '').strip()  # Optional cookies string
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    # ── MovieBox ──────────────────────────────────────────────────────────────
    if MOVIEBOX_DOMAINS.search(url):
        try:
            return jsonify(fetch_moviebox_info(url))
        except Exception as e:
            return jsonify({'error': f'Failed to fetch MovieBox video: {e}'}), 400

    # ── Snapchat ──────────────────────────────────────────────────────────────
    if SNAPCHAT_DOMAINS.search(url):
        snap_ydl_opts = {
            'quiet': True, 'no_warnings': True, 'skip_download': True,
            'noplaylist': True, 'socket_timeout': 20, 'retries': 2,
            'http_headers': SNAPCHAT_HEADERS,
        }
        try:
            with yt_dlp.YoutubeDL(snap_ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
            return jsonify(_ydl_to_response(info))
        except Exception:
            pass
        try:
            return jsonify(fetch_snapchat_info(url))
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    # ── Instagram ─────────────────────────────────────────────────────────────
    if INSTAGRAM_DOMAINS.search(url):
        try:
            info, is_direct = _instagram_ydl_info(url, skip_download=True)
            if is_direct:
                return jsonify(info)          # already our API format
            return jsonify(_ydl_to_response(info))
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    # ── YouTube ───────────────────────────────────────────────────────────────
    if 'youtube.com' in url or 'youtu.be' in url:
        base_opts = {
            'quiet': True, 'no_warnings': True, 'skip_download': True,
            'noplaylist': True, 'nocheckcertificate': False,
            'socket_timeout': 30, 'retries': 3,
            'fragment_retries': 3, 'extractor_retries': 3,
            'file_access_retries': 3, 'http_chunk_size': 16384,
        }
        
        strategies = [{}]  # Try without cookies first
        
        # Add cookies from request if provided
        if cookies:
            # Write cookies to a temporary file
            cookie_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt')
            cookie_file.write(cookies)
            cookie_file.close()
            strategies.append({'cookiesfile': cookie_file.name})
        
        # Add cookies from environment file
        if YOUTUBE_COOKIES_FILE and os.path.exists(YOUTUBE_COOKIES_FILE):
            strategies.append({'cookiesfile': YOUTUBE_COOKIES_FILE})
        
        # Add browser cookies
        for browser in ('chrome', 'firefox', 'chromium', 'brave', 'edge', 'safari'):
            strategies.append({'cookiesfrombrowser': (browser, None, None, None)})
        
        last_err = None
        for extra in strategies:
            try:
                opts = {**base_opts, **extra}
                with yt_dlp.YoutubeDL(opts) as ydl:
                    info = ydl.extract_info(url, download=False)
                return jsonify(_ydl_to_response(info))
            except Exception as e:
                last_err = e
                continue
        
        return jsonify({'error': str(last_err).replace('ERROR: ', '')}), 400

    # ── All other platforms (yt-dlp) ──────────────────────────────────────────
    base_opts = {
        'quiet': True, 'no_warnings': True, 'skip_download': True,
        'noplaylist': True, 'nocheckcertificate': False,
        'socket_timeout': 30, 'retries': 3,
        'fragment_retries': 3, 'extractor_retries': 3,
        'file_access_retries': 3, 'http_chunk_size': 16384,
    }
    
    strategies = [{}]  # Try without cookies first
    
    # Add cookies from request if provided
    if cookies:
        cookie_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt')
        cookie_file.write(cookies)
        cookie_file.close()
        strategies.append({'cookiesfile': cookie_file.name})
    
    # Add browser cookies
    for browser in ('chrome', 'firefox', 'chromium', 'brave', 'edge', 'safari'):
        strategies.append({'cookiesfrombrowser': (browser, None, None, None)})
    
    last_err = None
    for extra in strategies:
        try:
            opts = {**base_opts, **extra}
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=False)
            return jsonify(_ydl_to_response(info))
        except Exception as e:
            last_err = e
            continue
    
    return jsonify({'error': str(last_err).replace('ERROR: ', '')}), 400


@app.route('/api/download', methods=['POST'])
def start_download():
    data      = request.get_json()
    url       = data.get('url', '').strip()
    format_id = data.get('format_id', 'bestvideo+bestaudio/best')
    is_audio  = data.get('is_audio', False)
    cookies   = data.get('cookies', '').strip()  # Optional cookies string

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    job_id = str(uuid.uuid4())
    progress_store[job_id] = {'status': 'starting', 'percent': 0}

    # ── MovieBox ──────────────────────────────────────────────────────────────
    if MOVIEBOX_DOMAINS.search(url):
        def run_moviebox():
            try:
                mb = fetch_moviebox_info(url)
                direct_download(job_id, mb['video_url'], mb['title'], 'mp4', BROWSER_HEADERS)
            except Exception as e:
                progress_store[job_id] = {'status': 'error', 'percent': 0, 'error': str(e)}
        threading.Thread(target=run_moviebox, daemon=True).start()
        return jsonify({'job_id': job_id})

    # ── Snapchat ──────────────────────────────────────────────────────────────
    if SNAPCHAT_DOMAINS.search(url):
        def run_snapchat():
            if format_id == 'direct_snap':
                try:
                    snap = fetch_snapchat_info(url)
                    direct_download(job_id, snap['video_url'], snap['title'], 'mp4', SNAPCHAT_HEADERS)
                    return
                except Exception as e:
                    progress_store[job_id] = {'status': 'error', 'percent': 0, 'error': str(e)}
                    return
            output_path = os.path.join(DOWNLOAD_DIR, f'{job_id}.%(ext)s')
            ydl_opts = {
                'format': 'bestaudio/best' if is_audio else format_id,
                'outtmpl': output_path, 'quiet': True, 'no_warnings': True,
                'noplaylist': True, 'merge_output_format': 'mp4',
                'http_headers': SNAPCHAT_HEADERS,
                'progress_hooks': [progress_hook(job_id)],
            }
            if is_audio:
                ydl_opts['postprocessors'] = [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '192'}]
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(url, download=True)
                ext      = 'mp3' if is_audio else 'mp4'
                filepath = os.path.join(DOWNLOAD_DIR, f'{job_id}.{ext}')
                if not os.path.exists(filepath):
                    for f in os.listdir(DOWNLOAD_DIR):
                        if f.startswith(job_id):
                            filepath = os.path.join(DOWNLOAD_DIR, f); break
                progress_store[job_id] = {
                    'status': 'finished', 'percent': 100, 'filepath': filepath,
                    'title': info.get('title', 'Snapchat Video'), 'ext': ext,
                }
            except Exception:
                try:
                    snap = fetch_snapchat_info(url)
                    direct_download(job_id, snap['video_url'], snap['title'], 'mp4', SNAPCHAT_HEADERS)
                except Exception as e2:
                    progress_store[job_id] = {'status': 'error', 'percent': 0, 'error': str(e2)}
        threading.Thread(target=run_snapchat, daemon=True).start()
        return jsonify({'job_id': job_id})

    # ── Instagram ─────────────────────────────────────────────────────────────
    if INSTAGRAM_DOMAINS.search(url):
        def run_instagram():
            # direct_instagram = came from embed scraper, just stream it
            if format_id == 'direct_instagram':
                try:
                    ig = fetch_instagram_via_embed(url)
                    direct_download(job_id, ig['video_url'], ig['title'], 'mp4', INSTAGRAM_EMBED_HEADERS)
                    return
                except Exception as e:
                    progress_store[job_id] = {'status': 'error', 'percent': 0, 'error': str(e)}
                    return

            # yt-dlp path (format came from yt-dlp info)
            output_path = os.path.join(DOWNLOAD_DIR, f'{job_id}.%(ext)s')
            base_opts = {
                'outtmpl': output_path, 'quiet': True, 'no_warnings': True,
                'noplaylist': True, 'merge_output_format': 'mp4',
                'progress_hooks': [progress_hook(job_id)],
                'extractor_args': {'instagram': {'include_feeds': False}},
            }
            if is_audio:
                base_opts['format'] = 'bestaudio/best'
                base_opts['postprocessors'] = [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '192'}]
            else:
                base_opts['format'] = format_id

            strategies = [{}]
            if INSTAGRAM_COOKIES_FILE and os.path.exists(INSTAGRAM_COOKIES_FILE):
                strategies.append({'cookiesfile': INSTAGRAM_COOKIES_FILE})
            for browser in ('chrome', 'firefox', 'chromium', 'brave', 'edge', 'safari'):
                strategies.append({'cookiesfrombrowser': (browser, None, None, None)})

            for extra in strategies:
                try:
                    opts = {**base_opts, **extra}
                    with yt_dlp.YoutubeDL(opts) as ydl:
                        info = ydl.extract_info(url, download=True)
                    ext      = 'mp3' if is_audio else 'mp4'
                    filepath = os.path.join(DOWNLOAD_DIR, f'{job_id}.{ext}')
                    if not os.path.exists(filepath):
                        for f in os.listdir(DOWNLOAD_DIR):
                            if f.startswith(job_id):
                                filepath = os.path.join(DOWNLOAD_DIR, f); break
                    progress_store[job_id] = {
                        'status': 'finished', 'percent': 100, 'filepath': filepath,
                        'title': info.get('title', 'Instagram Video'), 'ext': ext,
                    }
                    return
                except Exception:
                    continue

            # Last resort: embed scraper direct download
            try:
                ig = fetch_instagram_via_embed(url)
                direct_download(job_id, ig['video_url'], ig['title'], 'mp4', INSTAGRAM_EMBED_HEADERS)
            except Exception as e:
                progress_store[job_id] = {'status': 'error', 'percent': 0, 'error': str(e)}

        threading.Thread(target=run_instagram, daemon=True).start()
        return jsonify({'job_id': job_id})

    # ── YouTube ───────────────────────────────────────────────────────────────
    if 'youtube.com' in url or 'youtu.be' in url:
        def run_youtube():
            output_path = os.path.join(DOWNLOAD_DIR, f'{job_id}.%(ext)s')
            base_opts = {
                'outtmpl': output_path, 'quiet': True, 'no_warnings': True,
                'noplaylist': True, 'merge_output_format': 'mp4',
                'progress_hooks': [progress_hook(job_id)],
            }
            if is_audio:
                base_opts['format'] = 'bestaudio/best'
                base_opts['postprocessors'] = [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '192'}]
            else:
                base_opts['format'] = format_id
            
            strategies = [{}]  # Try without cookies first
            
            # Add cookies from request if provided
            if cookies:
                cookie_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt')
                cookie_file.write(cookies)
                cookie_file.close()
                strategies.append({'cookiesfile': cookie_file.name})
            
            # Add cookies from environment file
            if YOUTUBE_COOKIES_FILE and os.path.exists(YOUTUBE_COOKIES_FILE):
                strategies.append({'cookiesfile': YOUTUBE_COOKIES_FILE})
            
            # Add browser cookies
            for browser in ('chrome', 'firefox', 'chromium', 'brave', 'edge', 'safari'):
                strategies.append({'cookiesfrombrowser': (browser, None, None, None)})
            
            for extra in strategies:
                try:
                    opts = {**base_opts, **extra}
                    with yt_dlp.YoutubeDL(opts) as ydl:
                        info = ydl.extract_info(url, download=True)
                    ext      = 'mp3' if is_audio else 'mp4'
                    filepath = os.path.join(DOWNLOAD_DIR, f'{job_id}.{ext}')
                    if not os.path.exists(filepath):
                        for f in os.listdir(DOWNLOAD_DIR):
                            if f.startswith(job_id):
                                filepath = os.path.join(DOWNLOAD_DIR, f); break
                    progress_store[job_id] = {
                        'status': 'finished', 'percent': 100, 'filepath': filepath,
                        'title': info.get('title', 'YouTube Video'), 'ext': ext,
                    }
                    return
                except Exception:
                    continue
            
            progress_store[job_id] = {'status': 'error', 'percent': 0, 'error': 'All cookie strategies failed'}

        threading.Thread(target=run_youtube, daemon=True).start()
        return jsonify({'job_id': job_id})

    # ── All other platforms ───────────────────────────────────────────────────
    def run_download():
        output_path = os.path.join(DOWNLOAD_DIR, f'{job_id}.%(ext)s')
        base_opts = {
            'outtmpl': output_path, 'quiet': True, 'no_warnings': True,
            'noplaylist': True, 'merge_output_format': 'mp4',
            'progress_hooks': [progress_hook(job_id)],
        }
        if is_audio:
            base_opts['format'] = 'bestaudio/best'
            base_opts['postprocessors'] = [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '192'}]
        else:
            base_opts['format'] = format_id
        
        strategies = [{}]  # Try without cookies first
        
        # Add cookies from request if provided
        if cookies:
            cookie_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt')
            cookie_file.write(cookies)
            cookie_file.close()
            strategies.append({'cookiesfile': cookie_file.name})
        
        # Add browser cookies
        for browser in ('chrome', 'firefox', 'chromium', 'brave', 'edge', 'safari'):
            strategies.append({'cookiesfrombrowser': (browser, None, None, None)})
        
        for extra in strategies:
            try:
                opts = {**base_opts, **extra}
                with yt_dlp.YoutubeDL(opts) as ydl:
                    info = ydl.extract_info(url, download=True)
                ext      = 'mp3' if is_audio else 'mp4'
                filepath = os.path.join(DOWNLOAD_DIR, f'{job_id}.{ext}')
                if not os.path.exists(filepath):
                    for f in os.listdir(DOWNLOAD_DIR):
                        if f.startswith(job_id):
                            filepath = os.path.join(DOWNLOAD_DIR, f); break
                progress_store[job_id] = {
                    'status': 'finished', 'percent': 100, 'filepath': filepath,
                    'title': info.get('title', 'video'), 'ext': ext,
                }
                return
            except Exception:
                continue
        
        progress_store[job_id] = {'status': 'error', 'percent': 0, 'error': 'All cookie strategies failed'}

    threading.Thread(target=run_download, daemon=True).start()
    return jsonify({'job_id': job_id})


@app.route('/api/progress/<job_id>', methods=['GET'])
def get_progress(job_id):
    info = progress_store.get(job_id, {'status': 'not_found', 'percent': 0})
    return jsonify({
        'status':  info.get('status'),
        'percent': info.get('percent', 0),
        'speed':   info.get('speed', ''),
        'eta':     info.get('eta', ''),
        'error':   info.get('error', ''),
    })


@app.route('/api/file/<job_id>', methods=['GET'])
def serve_file(job_id):
    info = progress_store.get(job_id)
    if not info or info.get('status') != 'finished':
        return jsonify({'error': 'File not ready'}), 404

    filepath = info.get('filepath', '')
    if not filepath or not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    title         = info.get('title', 'video')
    ext           = info.get('ext', 'mp4')
    safe_title    = ''.join(c for c in title if c.isalnum() or c in ' -_')[:60].strip()
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
    print(f'🚀 VidRivo backend running on http://0.0.0.0:{PORT}')
    app.run(host='0.0.0.0', port=PORT, debug=False)
