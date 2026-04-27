import { useState, useCallback, useRef, useEffect } from 'react'
import './App.css'

const API = 'http://localhost:8787/api'

const PLATFORMS = [
  { name: 'YouTube',     pattern: /youtube\.com|youtu\.be/i,   color: '#FF0000', gradient: 'linear-gradient(135deg,#FF0000,#cc0000)', icon: '▶', bg: '#FF000022' },
  { name: 'Facebook',    pattern: /facebook\.com|fb\.watch/i,  color: '#1877F2', gradient: 'linear-gradient(135deg,#1877F2,#0d5dbf)', icon: 'f', bg: '#1877F222' },
  { name: 'Instagram',   pattern: /instagram\.com/i,           color: '#E1306C', gradient: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', icon: '📷', bg: '#E1306C22' },
  { name: 'Twitter / X', pattern: /twitter\.com|x\.com/i,     color: '#1DA1F2', gradient: 'linear-gradient(135deg,#1DA1F2,#0d8bd9)', icon: '𝕏', bg: '#1DA1F222' },
  { name: 'TikTok',      pattern: /tiktok\.com/i,             color: '#ff0050', gradient: 'linear-gradient(135deg,#ff0050,#00f2ea)', icon: '♪', bg: '#ff005022' },
  { name: 'Vimeo',       pattern: /vimeo\.com/i,              color: '#1AB7EA', gradient: 'linear-gradient(135deg,#1AB7EA,#0d9bc7)', icon: '▷', bg: '#1AB7EA22' },
  { name: 'Reddit',      pattern: /reddit\.com/i,             color: '#FF4500', gradient: 'linear-gradient(135deg,#FF4500,#cc3700)', icon: '🤖', bg: '#FF450022' },
  { name: 'Dailymotion', pattern: /dailymotion\.com/i,        color: '#0066DC', gradient: 'linear-gradient(135deg,#0066DC,#0052b3)', icon: '◉', bg: '#0066DC22' },
  { name: 'Twitch',      pattern: /twitch\.tv/i,              color: '#9146FF', gradient: 'linear-gradient(135deg,#9146FF,#6c2bd9)', icon: '🎮', bg: '#9146FF22' },
  { name: 'Pinterest',   pattern: /pinterest\.com/i,          color: '#E60023', gradient: 'linear-gradient(135deg,#E60023,#b3001b)', icon: '📌', bg: '#E6002322' },
]

function detectPlatform(url) {
  for (const p of PLATFORMS) if (p.pattern.test(url)) return p
  return null
}
function isValidUrl(url) {
  try { new URL(url); return true } catch { return false }
}
function formatBytes(b) {
  if (!b) return ''
  return b < 1048576 ? `${(b/1024).toFixed(0)}KB` : `${(b/1048576).toFixed(1)}MB`
}
function formatViews(n) {
  if (!n) return ''
  if (n >= 1e9) return `${(n/1e9).toFixed(1)}B views`
  if (n >= 1e6) return `${(n/1e6).toFixed(1)}M views`
  if (n >= 1e3) return `${(n/1e3).toFixed(0)}K views`
  return `${n} views`
}

// Particle component
function Particles() {
  return (
    <div className="particles" aria-hidden="true">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="particle" style={{
          '--delay': `${Math.random() * 8}s`,
          '--duration': `${6 + Math.random() * 6}s`,
          '--x': `${Math.random() * 100}%`,
          '--size': `${4 + Math.random() * 8}px`,
          '--opacity': `${0.2 + Math.random() * 0.4}`,
        }} />
      ))}
    </div>
  )
}

// Typewriter hook
function useTypewriter(texts, speed = 60) {
  const [display, setDisplay] = useState('')
  const [idx, setIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[idx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1800)
        } else {
          setCharIdx(c => c + 1)
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setIdx(i => (i + 1) % texts.length)
          setCharIdx(0)
        } else {
          setCharIdx(c => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, idx, texts, speed])

  return display
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
  const [ripple, setRipple]       = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [copied, setCopied]       = useState(false)
  const pollRef                   = useRef(null)
  const inputRef                  = useRef(null)
  const cardRef                   = useRef(null)

  const detectedPlatform = detectPlatform(url)

  const typeText = useTypewriter([
    'YouTube videos…',
    'Facebook reels…',
    'Instagram clips…',
    'TikTok videos…',
    'Twitter/X posts…',
    'Vimeo films…',
    'Reddit videos…',
  ], 55)

  // Auto-focus input
  useEffect(() => { inputRef.current?.focus() }, [])

  // Scroll to card on analyze
  const scrollToCard = () => {
    setTimeout(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
  }

  // ── Analyze ──────────────────────────────────────────────
  const handleAnalyze = useCallback(async () => {
    const trimmed = url.trim()
    if (!trimmed) { inputRef.current?.focus(); return }
    if (!isValidUrl(trimmed)) {
      setErrorMsg('Please enter a valid URL.')
      setStatus('error')
      return
    }
    setRipple(true)
    setTimeout(() => setRipple(false), 600)
    setStatus('analyzing')
    setErrorMsg('')
    setVideoInfo(null)
    setPlatform(detectedPlatform)
    scrollToCard()

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
        body: JSON.stringify({ url: url.trim(), format_id: selectedFmt.format_id, is_audio: isAudio }),
      })
      const data = await res.json()
      if (!res.ok || data.error) { setErrorMsg(data.error || 'Download failed.'); setStatus('error'); return }

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
              id: Date.now(), title: videoInfo.title,
              platform: platform?.name || 'Unknown',
              quality: selectedFmt.label,
              color: platform?.color || '#888',
              gradient: platform?.gradient || '',
              icon: platform?.icon || '▶',
              time: new Date().toLocaleTimeString(),
              jobId: id, isAudio,
              thumbnail: videoInfo.thumbnail,
            }, ...prev.slice(0, 9)])
          } else if (pd.status === 'error') {
            clearInterval(pollRef.current)
            setErrorMsg(pd.error || 'Download failed.')
            setStatus('error')
          }
        } catch { clearInterval(pollRef.current); setErrorMsg('Lost connection to backend.'); setStatus('error') }
      }, 600)
    } catch { setErrorMsg('Backend not reachable.'); setStatus('error') }
  }, [url, selectedFmt, videoInfo, platform])

  const handleSaveFile = (jId) => window.open(`${API}/file/${jId}`, '_blank')

  const handleReset = () => {
    clearInterval(pollRef.current)
    setUrl(''); setStatus('idle'); setVideoInfo(null); setPlatform(null)
    setProgress(0); setErrorMsg(''); setJobId(null); setSpeed(''); setEta('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text); setPasteHint(true)
      setTimeout(() => setPasteHint(false), 2000)
      setTimeout(() => handleAnalyzeRef.current?.(), 300)
    } catch { inputRef.current?.focus() }
  }

  // Store latest handleAnalyze in ref for paste auto-trigger
  const handleAnalyzeRef = useRef(null)
  useEffect(() => { handleAnalyzeRef.current = handleAnalyze }, [handleAnalyze])

  const handleCopyLink = async (title) => {
    await navigator.clipboard.writeText(title)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isLoading = status === 'analyzing' || status === 'downloading'

  return (
    <div className="app">
      <Particles />
      <div className="bg-mesh" />
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <div className="container">

        {/* ── HERO ── */}
        <header className="hero-header">
          <div className="logo-wrap">
            <div className="logo-icon-wrap">
              <span className="logo-icon">⬇</span>
              <div className="logo-ring" />
            </div>
            <div>
              <h1 className="logo-text">VidGrab</h1>
              <p className="logo-sub">Pro Video Downloader</p>
            </div>
          </div>
          <p className="hero-tagline">
            Download <span className="typewriter">{typeText}<span className="cursor">|</span></span>
          </p>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">1000+</span><span className="stat-label">Sites</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">4K</span><span className="stat-label">Quality</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">Free</span><span className="stat-label">Always</span></div>
          </div>
        </header>

        {/* ── PLATFORM BADGES ── */}
        <div className="platforms-scroll">
          <div className="platforms-track">
            {[...PLATFORMS, ...PLATFORMS].map((p, i) => (
              <span key={i} className={`platform-chip ${detectedPlatform?.name === p.name ? 'active' : ''}`}
                style={{ '--p-color': p.color, '--p-bg': p.bg, '--p-gradient': p.gradient }}>
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── MAIN INPUT CARD ── */}
        <div className="input-card" ref={cardRef}>
          <div className={`url-input-group ${detectedPlatform ? 'detected' : ''} ${status === 'error' ? 'error' : ''}`}
            style={detectedPlatform ? { '--p-color': detectedPlatform.color } : {}}>

            {/* Platform glow indicator */}
            {detectedPlatform && (
              <div className="platform-glow" style={{ background: detectedPlatform.gradient }} />
            )}

            <div className="input-row">
              {detectedPlatform && (
                <div className="detected-badge" style={{ background: detectedPlatform.gradient }}>
                  <span>{detectedPlatform.icon}</span>
                  <span>{detectedPlatform.name}</span>
                </div>
              )}
              <input
                ref={inputRef}
                type="url"
                className="main-input"
                placeholder={`Paste URL to download ${typeText}`}
                value={url}
                onChange={e => { setUrl(e.target.value); if (status !== 'idle') { setStatus('idle'); setErrorMsg('') } }}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                disabled={isLoading}
                aria-label="Video URL"
                autoComplete="off"
                spellCheck="false"
              />
              <div className="input-actions">
                <button className={`icon-btn paste-btn ${pasteHint ? 'success' : ''}`}
                  onClick={handlePaste} title="Paste & Auto-Analyze" aria-label="Paste URL">
                  {pasteHint ? '✓' : '📋'}
                </button>
                {url && (
                  <button className="icon-btn clear-btn" onClick={handleReset} title="Clear" aria-label="Clear">✕</button>
                )}
              </div>
            </div>

            {status === 'error' && (
              <div className="error-banner">
                <span className="error-icon">⚠</span>
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Analyze button */}
          {(status === 'idle' || status === 'error') && (
            <button className={`analyze-btn ${ripple ? 'ripple' : ''}`} onClick={handleAnalyze} disabled={!url.trim()}>
              <span className="btn-shine" />
              <span className="btn-content">
                <span className="btn-icon-wrap">🔍</span>
                <span>Analyze Video</span>
              </span>
            </button>
          )}

          {/* Analyzing */}
          {status === 'analyzing' && (
            <div className="loading-state">
              <div className="loading-dots">
                <span /><span /><span />
              </div>
              <span className="loading-text">Fetching video info…</span>
            </div>
          )}

          {/* ── VIDEO RESULT ── */}
          {(status === 'ready' || status === 'done') && videoInfo && (
            <div className={`result-card ${status === 'done' ? 'done' : ''}`}>
              {/* Thumbnail */}
              <div className="thumb-container">
                {videoInfo.thumbnail
                  ? <img src={videoInfo.thumbnail} alt="thumbnail" className="thumb-img" />
                  : <div className="thumb-fallback">🎬</div>
                }
                <div className="thumb-overlay">
                  <div className="play-btn-overlay">▶</div>
                </div>
                <span className="duration-badge">{videoInfo.duration}</span>
                {platform && (
                  <span className="platform-tag" style={{ background: platform.gradient }}>
                    {platform.icon} {platform.name}
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="result-meta">
                <div className="result-title-row">
                  <h3 className="result-title">{videoInfo.title}</h3>
                  <button className="copy-title-btn" onClick={() => handleCopyLink(videoInfo.title)}
                    title="Copy title" aria-label="Copy title">
                    {copied ? '✓' : '📋'}
                  </button>
                </div>

                <div className="result-info-chips">
                  {videoInfo.uploader && <span className="info-chip">👤 {videoInfo.uploader}</span>}
                  {videoInfo.view_count > 0 && <span className="info-chip">👁 {formatViews(videoInfo.view_count)}</span>}
                </div>

                {/* Format selector */}
                {status === 'ready' && (
                  <div className="format-section">
                    <p className="format-label">Choose Quality</p>
                    <div className="format-grid">
                      {videoInfo.formats?.map(fmt => (
                        <button key={fmt.format_id}
                          className={`format-btn ${selectedFmt?.format_id === fmt.format_id ? 'selected' : ''} ${fmt.label.includes('Audio') ? 'audio-btn' : ''}`}
                          onClick={() => setSelectedFmt(fmt)}
                          style={selectedFmt?.format_id === fmt.format_id ? { '--p-gradient': platform?.gradient || 'linear-gradient(135deg,#7c3aed,#ec4899)' } : {}}>
                          <span className="fmt-icon">{fmt.label.includes('Audio') ? '🎵' : fmt.label.includes('1920') || fmt.label.includes('1080') ? '🔥' : '📹'}</span>
                          <span className="fmt-label">{fmt.label}</span>
                          {fmt.filesize && <span className="fmt-size">{formatBytes(fmt.filesize)}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {status === 'done' ? (
                  <div className="done-actions">
                    <div className="done-badge">
                      <span>🎉</span>
                      <span>Ready to save!</span>
                    </div>
                    <button className="save-btn" onClick={() => handleSaveFile(jobId)}>
                      <span>💾</span> Save File
                    </button>
                    <button className="another-btn" onClick={handleReset}>
                      ↩ Download Another
                    </button>
                  </div>
                ) : (
                  <button className="download-btn" onClick={handleDownload} disabled={!selectedFmt}>
                    <span className="btn-shine" />
                    <span className="btn-content">
                      <span>⬇</span>
                      <span>Download Now</span>
                      {selectedFmt && <span className="dl-quality-tag">{selectedFmt.label}</span>}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── PROGRESS ── */}
          {status === 'downloading' && (
            <div className="progress-section">
              <div className="progress-header">
                <div className="progress-left">
                  <div className="progress-spinner" />
                  <span>Downloading…</span>
                  {speed && <span className="speed-pill">{speed}</span>}
                </div>
                <span className="progress-right">
                  <span className="progress-pct">{progress}%</span>
                  {eta && <span className="eta-text"> · {eta}</span>}
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }}>
                  <div className="progress-glow" />
                </div>
              </div>
              <p className="progress-title">{videoInfo?.title}</p>
            </div>
          )}
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className="how-section">
          <h2 className="section-title">How it works</h2>
          <div className="steps-row">
            {[
              { num: '01', icon: '🔗', title: 'Copy URL', desc: 'Copy any video link from YouTube, Instagram, TikTok or 1000+ sites' },
              { num: '02', icon: '📋', title: 'Paste & Analyze', desc: 'Paste the URL and click Analyze — we fetch all available formats instantly' },
              { num: '03', icon: '⬇', title: 'Download', desc: 'Pick your quality and download. MP4 video or MP3 audio — your choice' },
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="features-section">
          <h2 className="section-title">Why VidGrab?</h2>
          <div className="features-grid">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Powered by yt-dlp — the fastest video extraction engine' },
              { icon: '🎯', title: '1000+ Sites', desc: 'YouTube, Instagram, TikTok, Facebook, Twitter and hundreds more' },
              { icon: '🎬', title: '4K Quality', desc: 'Download in the highest available quality up to 4K Ultra HD' },
              { icon: '🎵', title: 'Audio Extract', desc: 'Extract MP3 audio from any video with one click' },
              { icon: '📱', title: 'Mobile Ready', desc: 'Works perfectly on any device — phone, tablet or desktop' },
              { icon: '🔒', title: '100% Private', desc: 'No tracking, no ads, no account needed. Just download.' },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ '--delay': `${i * 0.08}s` }}>
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HISTORY ── */}
        {history.length > 0 && (
          <section className="history-section">
            <div className="history-header" onClick={() => setShowHistory(h => !h)}>
              <h2 className="section-title" style={{ margin: 0 }}>
                Recent Downloads <span className="history-count">{history.length}</span>
              </h2>
              <span className={`history-toggle ${showHistory ? 'open' : ''}`}>▼</span>
            </div>
            {showHistory && (
              <div className="history-list">
                {history.map((item, i) => (
                  <div key={item.id} className="history-item" style={{ '--delay': `${i * 0.05}s` }}>
                    <div className="history-thumb">
                      {item.thumbnail
                        ? <img src={item.thumbnail} alt="" className="history-thumb-img" />
                        : <span style={{ background: item.gradient }} className="history-icon">{item.icon}</span>
                      }
                    </div>
                    <div className="history-info">
                      <span className="history-title">{item.title}</span>
                      <div className="history-chips">
                        <span className="history-chip" style={{ background: item.color + '22', color: item.color }}>{item.platform}</span>
                        <span className="history-chip">{item.quality}</span>
                        <span className="history-chip">🕐 {item.time}</span>
                      </div>
                    </div>
                    <button className="history-dl-btn" onClick={() => handleSaveFile(item.jobId)} title="Save file">
                      💾
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-logo">⬇ VidGrab</div>
          <p className="footer-text">Download responsibly · Respect copyright · Platform ToS apply</p>
          <div className="footer-platforms">
            {PLATFORMS.map(p => (
              <span key={p.name} className="footer-platform" style={{ color: p.color }}>{p.icon}</span>
            ))}
          </div>
        </footer>

      </div>
    </div>
  )
}
