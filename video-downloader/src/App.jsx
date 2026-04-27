import { useState, useCallback, useRef } from 'react'
import './App.css'

const API = 'http://localhost:8787/api'

const PLATFORMS = [
  { name: 'YouTube',     pattern: /youtube\.com|youtu\.be/i,      color: '#FF0000', icon: '▶' },
  { name: 'Facebook',    pattern: /facebook\.com|fb\.watch/i,      color: '#1877F2', icon: 'f' },
  { name: 'Instagram',   pattern: /instagram\.com/i,               color: '#E1306C', icon: '📷' },
  { name: 'Twitter / X', pattern: /twitter\.com|x\.com/i,          color: '#1DA1F2', icon: '𝕏' },
  { name: 'TikTok',      pattern: /tiktok\.com/i,                  color: '#ff0050', icon: '♪' },
  { name: 'Vimeo',       pattern: /vimeo\.com/i,                   color: '#1AB7EA', icon: '▷' },
  { name: 'Reddit',      pattern: /reddit\.com/i,                  color: '#FF4500', icon: '🤖' },
  { name: 'Dailymotion', pattern: /dailymotion\.com/i,             color: '#0066DC', icon: '◉' },
  { name: 'Twitch',      pattern: /twitch\.tv/i,                   color: '#9146FF', icon: '🎮' },
  { name: 'Pinterest',   pattern: /pinterest\.com/i,               color: '#E60023', icon: '📌' },
]

function detectPlatform(url) {
  for (const p of PLATFORMS) {
    if (p.pattern.test(url)) return p
  }
  return null
}

function isValidUrl(url) {
  try { new URL(url); return true } catch { return false }
}

function formatBytes(bytes) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function App() {
  const [url, setUrl]             = useState('')
  const [status, setStatus]       = useState('idle')
  const [platform, setPlatform]   = useState(null)
  const [videoInfo, setVideoInfo] = useState(null)
  const [selectedFmt, setSelectedFmt] = useState(null)
  const [progress, setProgress]   = useState(0)
  const [speed, setSpeed]         = useState('')
  const [eta, setEta]             = useState('')
  const [history, setHistory]     = useState([])
  const [errorMsg, setErrorMsg]   = useState('')
  const [pasteHint, setPasteHint] = useState(false)
  const [jobId, setJobId]         = useState(null)
  const pollRef                   = useRef(null)

  const detectedPlatform = detectPlatform(url)

  // ── Analyze ──────────────────────────────────────────────
  const handleAnalyze = useCallback(async () => {
    const trimmed = url.trim()
    if (!trimmed) return
    if (!isValidUrl(trimmed)) {
      setErrorMsg('Please enter a valid URL.')
      setStatus('error')
      return
    }
    setStatus('analyzing')
    setErrorMsg('')
    setVideoInfo(null)
    setPlatform(detectedPlatform)

    try {
      const res = await fetch(`${API}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Could not fetch video info.')
        setStatus('error')
        return
      }
      setVideoInfo(data)
      setSelectedFmt(data.formats?.[0] || null)
      setStatus('ready')
    } catch {
      setErrorMsg('Backend not reachable. Make sure the Python server is running on port 8787.')
      setStatus('error')
    }
  }, [url, detectedPlatform])

  // ── Download ─────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!selectedFmt) return
    setStatus('downloading')
    setProgress(0)
    setSpeed('')
    setEta('')
    const isAudio = selectedFmt.label?.includes('Audio')

    try {
      const res = await fetch(`${API}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          format_id: selectedFmt.format_id,
          is_audio: isAudio,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Download failed.')
        setStatus('error')
        return
      }

      const id = data.job_id
      setJobId(id)

      pollRef.current = setInterval(async () => {
        try {
          const pr = await fetch(`${API}/progress/${id}`)
          const pd = await pr.json()
          setProgress(pd.percent || 0)
          setSpeed(pd.speed || '')
          setEta(pd.eta || '')
          if (pd.status === 'finished') {
            clearInterval(pollRef.current)
            setProgress(100)
            setStatus('done')
            setHistory(prev => [{
              id: Date.now(),
              title: videoInfo.title,
              platform: platform?.name || 'Unknown',
              quality: selectedFmt.label,
              color: platform?.color || '#888',
              icon: platform?.icon || '▶',
              time: new Date().toLocaleTimeString(),
              jobId: id,
              isAudio,
            }, ...prev.slice(0, 9)])
          } else if (pd.status === 'error') {
            clearInterval(pollRef.current)
            setErrorMsg(pd.error || 'Download failed.')
            setStatus('error')
          }
        } catch {
          clearInterval(pollRef.current)
          setErrorMsg('Lost connection to backend.')
          setStatus('error')
        }
      }, 600)
    } catch {
      setErrorMsg('Backend not reachable.')
      setStatus('error')
    }
  }, [url, selectedFmt, videoInfo, platform])

  const handleSaveFile = (jId) => window.open(`${API}/file/${jId}`, '_blank')

  const handleReset = () => {
    clearInterval(pollRef.current)
    setUrl('')
    setStatus('idle')
    setVideoInfo(null)
    setPlatform(null)
    setProgress(0)
    setErrorMsg('')
    setJobId(null)
    setSpeed('')
    setEta('')
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
      setPasteHint(true)
      setTimeout(() => setPasteHint(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <div className="app">
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <div className="container">

        {/* ── Header ── */}
        <header className="header">
          <div className="logo">
            <span className="logo-icon">⬇</span>
            <span className="logo-text">VidGrab</span>
          </div>
          <p className="tagline">Download videos from any platform, instantly</p>
        </header>

        {/* ── Platform strip ── */}
        <div className="platforms-strip">
          {PLATFORMS.map(p => (
            <span
              key={p.name}
              className={`platform-badge ${detectedPlatform?.name === p.name ? 'active' : ''}`}
              style={{ '--p-color': p.color }}
            >
              <span className="platform-icon">{p.icon}</span>
              <span className="platform-name">{p.name}</span>
            </span>
          ))}
        </div>

        {/* ── Main card ── */}
        <div className="card">

          {/* URL input */}
          <div className="input-section">
            <div className={`input-wrapper ${detectedPlatform ? 'has-platform' : ''} ${status === 'error' ? 'has-error' : ''}`}>
              {detectedPlatform && (
                <span className="input-platform-badge" style={{ background: detectedPlatform.color }}>
                  {detectedPlatform.icon} {detectedPlatform.name}
                </span>
              )}
              <input
                type="url"
                className="url-input"
                placeholder="Paste video URL here… (YouTube, Facebook, Instagram, TikTok…)"
                value={url}
                onChange={e => { setUrl(e.target.value); setStatus('idle'); setErrorMsg('') }}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                disabled={status === 'analyzing' || status === 'downloading'}
                aria-label="Video URL"
              />
              <button
                className={`paste-btn ${pasteHint ? 'pasted' : ''}`}
                onClick={handlePaste}
                title="Paste from clipboard"
              >
                {pasteHint ? '✓' : '📋'}
              </button>
              {url && (
                <button className="clear-btn" onClick={handleReset} title="Clear">✕</button>
              )}
            </div>
            {status === 'error' && (
              <div className="error-msg" role="alert">
                <span>⚠</span> {errorMsg}
              </div>
            )}
          </div>

          {/* Analyze button */}
          {(status === 'idle' || status === 'error') && (
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={!url.trim()}
            >
              <span className="btn-icon">🔍</span>
              Analyze Video
            </button>
          )}

          {/* Analyzing spinner */}
          {status === 'analyzing' && (
            <div className="analyzing-state">
              <div className="spinner" />
              <span>Fetching video info…</span>
            </div>
          )}

          {/* Video info */}
          {(status === 'ready' || status === 'done') && videoInfo && (
            <div className={`video-info ${status === 'done' ? 'done' : ''}`}>
              <div className="video-thumb-wrap">
                {videoInfo.thumbnail
                  ? <img src={videoInfo.thumbnail} alt="thumbnail" className="video-thumb" />
                  : <div className="thumb-placeholder">🎬</div>
                }
                <span className="video-duration">{videoInfo.duration}</span>
                {platform && (
                  <span className="video-platform-tag" style={{ background: platform.color }}>
                    {platform.icon} {platform.name}
                  </span>
                )}
              </div>

              <div className="video-meta">
                <h3 className="video-title">{videoInfo.title}</h3>
                {videoInfo.uploader && (
                  <p className="video-uploader">👤 {videoInfo.uploader}</p>
                )}

                {/* Format selector */}
                {status === 'ready' && (
                  <div className="format-select-wrap">
                    <label className="quality-label">Quality:</label>
                    <div className="quality-options">
                      {videoInfo.formats?.map(fmt => (
                        <button
                          key={fmt.format_id}
                          className={`quality-btn ${selectedFmt?.format_id === fmt.format_id ? 'selected' : ''}`}
                          onClick={() => setSelectedFmt(fmt)}
                        >
                          {fmt.label}
                          {fmt.filesize
                            ? <span className="fmt-size"> · {formatBytes(fmt.filesize)}</span>
                            : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {status === 'done' ? (
                  <div className="done-state">
                    <span className="done-icon">✅</span>
                    <span>Ready to save!</span>
                    <button className="download-btn save-btn" onClick={() => handleSaveFile(jobId)}>
                      💾 Save File
                    </button>
                    <button className="reset-btn" onClick={handleReset}>
                      Download another
                    </button>
                  </div>
                ) : (
                  <button
                    className="download-btn"
                    onClick={handleDownload}
                    disabled={!selectedFmt}
                  >
                    <span className="btn-icon">⬇</span> Download Now
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Progress bar */}
          {status === 'downloading' && (
            <div className="download-progress">
              <div className="progress-info">
                <span>
                  Downloading…
                  {speed && <span className="speed-tag">{speed}</span>}
                </span>
                <span className="progress-pct">
                  {progress}% {eta && `· ETA ${eta}`}
                </span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-sub">{videoInfo?.title}</p>
            </div>
          )}

        </div>

        {/* ── How it works ── */}
        <div className="how-it-works">
          <h2>How it works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-text">
                <strong>Copy the URL</strong>
                <span>Go to any supported platform and copy the video link</span>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-text">
                <strong>Paste & Analyze</strong>
                <span>Paste the URL above and click Analyze</span>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-text">
                <strong>Download</strong>
                <span>Choose quality and hit Download Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── History ── */}
        {history.length > 0 && (
          <div className="history-section">
            <h2>Recent Downloads</h2>
            <div className="history-list">
              {history.map(item => (
                <div key={item.id} className="history-item">
                  <span
                    className="history-platform"
                    style={{ background: item.color }}
                  >
                    {item.icon}
                  </span>
                  <div className="history-info">
                    <span className="history-title">{item.title}</span>
                    <span className="history-meta">
                      {item.platform} · {item.quality} · {item.time}
                    </span>
                  </div>
                  <button
                    className="history-save-btn"
                    onClick={() => handleSaveFile(item.jobId)}
                    title="Save file"
                  >
                    💾
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="footer">
          <p>VidGrab — Download responsibly. Respect copyright and platform terms of service.</p>
        </footer>
      </div>
    </div>
  )
}
