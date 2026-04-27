import { useState, useCallback, useRef } from 'react'
import './App.css'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, Search, Clipboard, X, CheckCheck, 
  Save, Film, User, AlertCircle, Loader2, ArrowRight
} from 'lucide-react'

// Import logo and platform icons
import logo from './assets/logo.png'
import youtubeIcon from './assets/youtube.png'
import facebookIcon from './assets/facebook.png'
import instagramIcon from './assets/instagram.png'
import twitterIcon from './assets/twitter.png'
import tiktokIcon from './assets/tik-tok.png'
import vimeoIcon from './assets/vimeo.png'
import redditIcon from './assets/redlit.png'
import twitchIcon from './assets/twitch.png'
import pinterestIcon from './assets/pintrest.png'

const API = 'http://localhost:8787/api'

const PLATFORMS = [
  { name: 'YouTube',     pattern: /youtube\.com|youtu\.be/i,      color: '#FF0000', icon: youtubeIcon },
  { name: 'Facebook',    pattern: /facebook\.com|fb\.watch/i,      color: '#1877F2', icon: facebookIcon },
  { name: 'Instagram',   pattern: /instagram\.com/i,               color: '#E1306C', icon: instagramIcon },
  { name: 'Twitter / X', pattern: /twitter\.com|x\.com/i,          color: '#1DA1F2', icon: twitterIcon },
  { name: 'TikTok',      pattern: /tiktok\.com/i,                  color: '#ff0050', icon: tiktokIcon },
  { name: 'Vimeo',       pattern: /vimeo\.com/i,                   color: '#1AB7EA', icon: vimeoIcon },
  { name: 'Reddit',      pattern: /reddit\.com/i,                  color: '#FF4500', icon: redditIcon },
  { name: 'Dailymotion', pattern: /dailymotion\.com/i,             color: '#0066DC', icon: <Film size={16} /> },
  { name: 'Twitch',      pattern: /twitch\.tv/i,                   color: '#9146FF', icon: twitchIcon },
  { name: 'Pinterest',   pattern: /pinterest\.com/i,               color: '#E60023', icon: pinterestIcon },
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
        <motion.header 
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.img 
              src={logo} 
              alt="VidGrab Logo" 
              className="logo-image"
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            />
            <span className="logo-text">VidGrab</span>
          </motion.div>
          <motion.p 
            className="tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Download videos from any platform, instantly
          </motion.p>
        </motion.header>

        {/* ── Platform strip ── */}
        <motion.div 
          className="platforms-strip"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {PLATFORMS.map((p, index) => (
            <motion.span
              key={p.name}
              className={`platform-badge ${detectedPlatform?.name === p.name ? 'active' : ''}`}
              style={{ '--p-color': p.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="platform-icon">
                {typeof p.icon === 'string' ? (
                  <img src={p.icon} alt={p.name} style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                ) : (
                  p.icon
                )}
              </span>
              <span className="platform-name">{p.name}</span>
            </motion.span>
          ))}
        </motion.div>

        {/* ── Main card ── */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >

          {/* URL input */}
          <div className="input-section">
            <div className={`input-wrapper ${detectedPlatform ? 'has-platform' : ''} ${status === 'error' ? 'has-error' : ''}`}>
              {detectedPlatform && (
                <span className="input-platform-badge" style={{ background: detectedPlatform.color }}>
                  {typeof detectedPlatform.icon === 'string' ? (
                    <img src={detectedPlatform.icon} alt={detectedPlatform.name} style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                  ) : (
                    detectedPlatform.icon
                  )} {detectedPlatform.name}
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
                {pasteHint ? <CheckCheck size={18} /> : <Clipboard size={18} />}
              </button>
              {url && (
                <button className="clear-btn" onClick={handleReset} title="Clear">
                  <X size={18} />
                </button>
              )}
            </div>
            <AnimatePresence mode="wait">
              {status === 'error' && (
                <motion.div 
                  className="error-msg" 
                  role="alert"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle size={18} /> {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Analyze button */}
          <AnimatePresence mode="wait">
            {(status === 'idle' || status === 'error') && (
              <motion.button
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={!url.trim()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <span className="btn-icon"><Search size={20} /></span>
                Analyze Video
              </motion.button>
            )}
          </AnimatePresence>

          {/* Analyzing spinner */}
          <AnimatePresence mode="wait">
            {status === 'analyzing' && (
              <motion.div 
                className="analyzing-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Loader2 className="spinner" size={32} />
                <span>Fetching video info…</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video info */}
          <AnimatePresence mode="wait">
            {(status === 'ready' || status === 'done') && videoInfo && (
              <motion.div 
                className={`video-info ${status === 'done' ? 'done' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
              <div className="video-thumb-wrap">
                {videoInfo.thumbnail
                  ? <img src={videoInfo.thumbnail} alt="thumbnail" className="video-thumb" />
                  : <div className="thumb-placeholder"><Film size={48} /></div>
                }
                <span className="video-duration">{videoInfo.duration}</span>
                {platform && (
                  <span className="video-platform-tag" style={{ background: platform.color }}>
                    {typeof platform.icon === 'string' ? (
                      <img src={platform.icon} alt={platform.name} style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                    ) : (
                      platform.icon
                    )} {platform.name}
                  </span>
                )}
              </div>

              <div className="video-meta">
                <h3 className="video-title">{videoInfo.title}</h3>
                {videoInfo.uploader && (
                  <p className="video-uploader"><User size={16} /> {videoInfo.uploader}</p>
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
                    <span className="done-icon"><CheckCheck size={24} /></span>
                    <span>Ready to save!</span>
                    <button className="download-btn save-btn" onClick={() => handleSaveFile(jobId)}>
                      <Save size={20} /> Save File
                    </button>
                    <button className="reset-btn" onClick={handleReset}>
                      Download another
                    </button>
                  </div>
                ) : (
                  <motion.button
                    className="download-btn"
                    onClick={handleDownload}
                    disabled={!selectedFmt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="btn-icon"><Download size={20} /></span> Download Now
                  </motion.button>
                )}
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <AnimatePresence mode="wait">
            {status === 'downloading' && (
              <motion.div 
                className="download-progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

        {/* ── How it works ── */}
        <motion.div 
          className="how-it-works"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>How it works</h2>
          <div className="steps">
            <motion.div 
              className="step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="step-num">1</div>
              <div className="step-text">
                <strong>Copy the URL</strong>
                <span>Go to any supported platform and copy the video link</span>
              </div>
            </motion.div>
            <motion.div 
              className="step-arrow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <ArrowRight size={24} />
            </motion.div>
            <motion.div 
              className="step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="step-num">2</div>
              <div className="step-text">
                <strong>Paste & Analyze</strong>
                <span>Paste the URL above and click Analyze</span>
              </div>
            </motion.div>
            <motion.div 
              className="step-arrow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <ArrowRight size={24} />
            </motion.div>
            <motion.div 
              className="step"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="step-num">3</div>
              <div className="step-text">
                <strong>Download</strong>
                <span>Choose quality and hit Download Now</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── History ── */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div 
              className="history-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Recent Downloads</h2>
              <div className="history-list">
                {history.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ x: 8, scale: 1.02 }}
                  >
                  <span
                    className="history-platform"
                    style={{ background: item.color }}
                  >
                    {typeof item.icon === 'string' ? (
                      <img src={item.icon} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                    ) : (
                      item.icon
                    )}
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
                    <Save size={18} />
                  </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="footer">
          <p>VidGrab — Download responsibly. Respect copyright and platform terms of service.</p>
        </footer>
      </div>
    </div>
  )
}
