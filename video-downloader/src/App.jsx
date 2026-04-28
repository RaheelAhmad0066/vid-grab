import { useEffect } from 'react'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { 
  Download, Search, Clipboard, X, CheckCheck, 
  Save, Film, User, AlertCircle, Loader2, ArrowRight,
  Share2, Trash2, History, Copy, Play
} from 'lucide-react'

// Store & Hooks
import { useAppStore } from './store/useAppStore'
import { useVideoDownload } from './hooks/useVideoDownload'
import { useClipboard } from './hooks/useClipboard'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

// Components
import { TopBar } from './components/TopBar'
import { PlatformBadges } from './components/PlatformBadges'
import { SettingsPanel } from './components/SettingsPanel'
import { VideoPreviewModal } from './components/VideoPreviewModal'
import { Navigation } from './components/Navigation'

// Pages
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfService } from './pages/TermsOfService'
import { DMCA } from './pages/DMCA'
import { Contact } from './pages/Contact'
import { About } from './pages/About'
import { FAQ } from './pages/FAQ'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'

// Utils
import { detectPlatform } from './utils/platform'
import { DOWNLOAD_STATUS } from './constants/platforms'
import logo from './assets/logo.png'
import lineLeft from './assets/ine_left.svg'
import lineRight from './assets/line_right.svg'

export default function App() {
  // Store
  const {
    url,
    status,
    platform,
    videoInfo,
    selectedFormat,
    progress,
    speed,
    eta,
    errorMsg,
    history,
    darkMode,
    setUrl,
    setSelectedFormat,
    removeFromHistory,
    clearHistory,
    loadHistory,
    loadTheme,
    toggleSettings,
  } = useAppStore()

  // Custom Hooks
  const { analyzeVideo, downloadVideo, saveFile, resetDownload } = useVideoDownload()
  const { pasteHint, pasteFromClipboard, copyToClipboard, shareContent } = useClipboard()

  const [showPreview, setShowPreview] = React.useState(false)
  const detectedPlatform = detectPlatform(url)
  
  // Debug: Log detected platform
  React.useEffect(() => {
    if (url) {
      console.log('URL:', url)
      console.log('Detected Platform:', detectedPlatform)
    }
  }, [url, detectedPlatform])

  // Load saved data
  useEffect(() => {
    loadHistory()
    loadTheme()
  }, [loadHistory, loadTheme])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPaste: () => pasteFromClipboard(setUrl),
    onAnalyze: analyzeVideo,
    onReset: resetDownload,
    canAnalyze: url && status === DOWNLOAD_STATUS.IDLE,
  })

  const handleDeleteHistory = (id) => {
    removeFromHistory(id)
    toast.success('Removed from history')
  }

  const handleClearHistory = () => {
    clearHistory()
    toast.success('History cleared')
  }

  const handleShare = () => {
    shareContent(videoInfo?.title, `Check out: ${videoInfo?.title}`, url)
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#1a1a2e' : '#fff',
            color: darkMode ? '#f1f0f7' : '#0a0a0f',
            border: `1px solid ${darkMode ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.2)'}`,
          },
        }}
      />

      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <TopBar />
      <Navigation />

      <SettingsPanel onSaveFile={saveFile} />
      
      <VideoPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        videoInfo={videoInfo}
        url={url}
        platform={platform}
      />

      <Routes>
        <Route path="/" element={
          <div className="container">
        {/* Header */}
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

        {/* Platform Badges */}
        <PlatformBadges detectedPlatform={detectedPlatform} />

        {/* Main Card */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* URL Input */}
          <div className="input-section">
            <div className={`input-wrapper ${detectedPlatform ? 'has-platform' : ''} ${status === DOWNLOAD_STATUS.ERROR ? 'has-error' : ''}`}>
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
                onChange={e => { setUrl(e.target.value); }}
                onKeyDown={e => e.key === 'Enter' && analyzeVideo()}
                disabled={status === DOWNLOAD_STATUS.ANALYZING || status === DOWNLOAD_STATUS.DOWNLOADING}
                aria-label="Video URL"
              />
              <button
                className={`paste-btn ${pasteHint ? 'pasted' : ''}`}
                onClick={() => pasteFromClipboard(setUrl)}
                title="Paste from clipboard"
              >
                {pasteHint ? <CheckCheck size={18} /> : <Clipboard size={18} />}
              </button>
              {url && (
                <>
                  <button className="clear-btn" onClick={() => copyToClipboard(url)} title="Copy link">
                    <Copy size={18} />
                  </button>
                  <button className="clear-btn" onClick={resetDownload} title="Clear">
                    <X size={18} />
                  </button>
                </>
              )}
            </div>
            <AnimatePresence mode="wait">
              {status === DOWNLOAD_STATUS.ERROR && (
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

          {/* Analyze Button */}
          <AnimatePresence mode="wait">
            {(status === DOWNLOAD_STATUS.IDLE || status === DOWNLOAD_STATUS.ERROR) && (
              <motion.button
                className="analyze-btn"
                onClick={analyzeVideo}
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

          {/* Analyzing State */}
          <AnimatePresence mode="wait">
            {status === DOWNLOAD_STATUS.ANALYZING && (
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

          {/* Video Info */}
          <AnimatePresence mode="wait">
            {(status === DOWNLOAD_STATUS.READY || status === DOWNLOAD_STATUS.DONE) && videoInfo && (
              <motion.div 
                className={`video-info ${status === DOWNLOAD_STATUS.DONE ? 'done' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="video-thumb-wrap">
                  {videoInfo.thumbnail ? (
                    <>
                      <img 
                        src={videoInfo.thumbnail} 
                        alt="thumbnail" 
                        className="video-thumb"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Thumbnail failed to load:', videoInfo.thumbnail)
                          e.target.style.display = 'none'
                          const placeholder = e.target.parentElement.querySelector('.thumb-placeholder')
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                      <div className="thumb-placeholder" style={{ display: 'none' }}>
                        <Film size={48} />
                      </div>
                      {/* Preview Overlay */}
                      <motion.div 
                        className="thumb-preview-overlay"
                        onClick={() => setShowPreview(true)}
                        whileHover={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                      >
                        <motion.div
                          className="thumb-play-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play size={32} fill="white" />
                        </motion.div>
                        <span className="preview-text">Preview</span>
                      </motion.div>
                    </>
                  ) : (
                    <div className="thumb-placeholder">
                      <Film size={48} />
                    </div>
                  )}
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
                  
                  {status === DOWNLOAD_STATUS.READY && (
                    <motion.button
                      className="share-btn"
                      onClick={handleShare}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 size={16} /> Share
                    </motion.button>
                  )}

                  {status === DOWNLOAD_STATUS.READY && (
                    <div className="format-select-wrap">
                      <label className="quality-label">Select Quality:</label>
                      <div className="quality-options">
                        {videoInfo.formats?.map(fmt => (
                          <motion.button
                            key={fmt.format_id}
                            className={`quality-btn ${selectedFormat?.format_id === fmt.format_id ? 'selected' : ''}`}
                            onClick={() => setSelectedFormat(fmt)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {fmt.label}
                            {fmt.filesize && <span className="fmt-size"> · {fmt.filesize}</span>}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {status === DOWNLOAD_STATUS.DONE ? (
                    <div className="done-state">
                      <span className="done-icon"><CheckCheck size={24} /></span>
                      <span>Ready to save!</span>
                      <button className="download-btn save-btn" onClick={() => saveFile(useAppStore.getState().jobId)}>
                        <Save size={20} /> Save File
                      </button>
                      <button className="reset-btn" onClick={resetDownload}>
                        Download another
                      </button>
                    </div>
                  ) : (
                    <motion.button
                      className="download-btn"
                      onClick={downloadVideo}
                      disabled={!selectedFormat}
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

          {/* Progress Bar */}
          <AnimatePresence mode="wait">
            {status === DOWNLOAD_STATUS.DOWNLOADING && (
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

        {/* How It Works */}
        <motion.div
          className="how-it-works"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>How it works</h2>
          <div className="steps-container">
            <motion.div
              className="step-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="step-icon-wrapper purple-gradient">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H6C5.46957 3 4.96086 3.21071 4.58579 3.58579C4.21071 3.96086 4 4.46957 4 5V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V8L15 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 15L12 18L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 9V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Copy URL</h3>
              <p>Go to any supported platform and copy the video link</p>
            </motion.div>
            <div className="step-divider">
              <img src={lineRight} alt="" className="line-svg" />
            </div>
            <motion.div
              className="step-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="step-icon-wrapper blue-gradient">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/>
                  <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M11 8V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 11H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Paste & Analyze</h3>
              <p>Paste the URL above and click Analyze</p>
            </motion.div>
            <div className="step-divider">
              <img src={lineLeft} alt="" className="line-svg" />
            </div>
            <motion.div
              className="step-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="step-icon-wrapper pink-gradient">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Download</h3>
              <p>Choose quality and hit Download Now</p>
            </motion.div>
          </div>
        </motion.div>

        {/* History */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div 
              className="history-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="history-header">
                <h2><History size={24} /> Recent Downloads</h2>
                {history.length > 3 && (
                  <motion.button
                    className="view-all-btn"
                    onClick={toggleSettings}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View All ({history.length})
                  </motion.button>
                )}
              </div>
              <div className="history-list">
                {history.slice(0, 3).map((item, index) => (
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
                      onClick={() => saveFile(item.jobId)}
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
          <div className="footer-content">
            <p className="footer-disclaimer">
              <strong>Copyright Disclaimer:</strong> VidGrab is a tool for personal, non-commercial use only. 
              Users are responsible for ensuring their use of downloaded content complies with applicable laws 
              and platform terms of service. We do not host any content on our servers.
            </p>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <span>·</span>
              <a href="/terms">Terms of Service</a>
              <span>·</span>
              <a href="/dmca">DMCA</a>
              <span>·</span>
              <a href="/contact">Contact</a>
            </div>
            <p className="footer-copy">
              © {new Date().getFullYear()} VidGrab. All rights reserved.
            </p>
          </div>
        </footer>
          </div>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/dmca" element={<DMCA />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </div>
  )
}
