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
import { HomeContent } from './components/HomeContent'
import { DownloaderTool } from './components/DownloaderTool'
import { MetaTags } from './components/MetaTags'
import { CookieConsent } from './components/CookieConsent'

// Pages
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfService } from './pages/TermsOfService'
import { DMCA } from './pages/DMCA'
import { Contact } from './pages/Contact'
import { About } from './pages/About'
import { FAQ } from './pages/FAQ'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { YouTubeDownloader } from './pages/YouTubeDownloader'
import { InstagramDownloader } from './pages/InstagramDownloader'
import { FacebookDownloader } from './pages/FacebookDownloader'
import { TikTokDownloader } from './pages/TikTokDownloader'

// Utils
import { detectPlatform } from './utils/platform'
import { isValidUrl } from './utils/validators'
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
    autoDownload,
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

  // Auto-analyze when URL is pasted and auto-download is on
  useEffect(() => {
    if (!autoDownload) return
    if (!url.trim() || !isValidUrl(url.trim())) return
    if (status !== DOWNLOAD_STATUS.IDLE) return
    const timer = setTimeout(() => analyzeVideo(), 700)
    return () => clearTimeout(timer)
  }, [url, autoDownload])

  // Auto-start download once analysis is ready
  useEffect(() => {
    if (!autoDownload) return
    if (status !== DOWNLOAD_STATUS.READY) return
    if (!selectedFormat) return
    downloadVideo()
  }, [status, autoDownload, selectedFormat])

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
      <MetaTags />
      <CookieConsent />
      <TopBar />
      <Navigation />

      <SettingsPanel onSaveFile={saveFile} />
      
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
              alt="Vidoon Logo" 
              className="logo-image"
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            />
            <span className="logo-text">Vidoon</span>
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

        {/* Main Card / Downloader Tool */}
        <DownloaderTool />

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

        {/* Rich Content for AdSense */}
        <HomeContent />

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
              <strong>Copyright Disclaimer:</strong> Vidoon is a tool for personal, non-commercial use only. 
              Users are responsible for ensuring their use of downloaded content complies with applicable laws 
              and platform terms of service. We do not host any content on our servers.
            </p>
            <div className="footer-links">
              <a href="/youtube-downloader">YouTube Downloader</a>
              <span>·</span>
              <a href="/instagram-downloader">Instagram Downloader</a>
              <span>·</span>
              <a href="/facebook-downloader">Facebook Downloader</a>
              <span>·</span>
              <a href="/tiktok-downloader">TikTok Downloader</a>
            </div>
            <div className="footer-links" style={{ marginTop: '8px' }}>
              <a href="/privacy">Privacy Policy</a>
              <span>·</span>
              <a href="/terms">Terms of Service</a>
              <span>·</span>
              <a href="/dmca">DMCA</a>
              <span>·</span>
              <a href="/contact">Contact</a>
            </div>
            <p className="footer-copy">
              © {new Date().getFullYear()} Vidoon. All rights reserved.
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
        <Route path="/youtube-downloader" element={<YouTubeDownloader />} />
        <Route path="/instagram-downloader" element={<InstagramDownloader />} />
        <Route path="/facebook-downloader" element={<FacebookDownloader />} />
        <Route path="/tiktok-downloader" element={<TikTokDownloader />} />
      </Routes>
    </div>
  )
}
