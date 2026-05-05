import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Clipboard, X, CheckCheck, 
  Save, Film, User, AlertCircle, Loader2,
  Share2, Copy, Play, Download
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useVideoDownload } from '../hooks/useVideoDownload'
import { useClipboard } from '../hooks/useClipboard'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { PlatformBadges } from './PlatformBadges'
import { VideoPreviewModal } from './VideoPreviewModal'
import { detectPlatform } from '../utils/platform'
import { DOWNLOAD_STATUS } from '../constants/platforms'
import toast from 'react-hot-toast'

export const DownloaderTool = () => {
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
    setUrl,
    setSelectedFormat,
  } = useAppStore()

  const { analyzeVideo, downloadVideo, saveFile, resetDownload } = useVideoDownload()
  const { pasteHint, pasteFromClipboard, copyToClipboard, shareContent } = useClipboard()

  const [showPreview, setShowPreview] = React.useState(false)
  const detectedPlatform = detectPlatform(url)

  useKeyboardShortcuts({
    onPaste: () => pasteFromClipboard(setUrl),
    onAnalyze: analyzeVideo,
    onReset: resetDownload,
    canAnalyze: url && status === DOWNLOAD_STATUS.IDLE,
  })

  const handleShare = () => {
    shareContent(videoInfo?.title, `Check out: ${videoInfo?.title}`, url)
  }

  return (
    <>
      <PlatformBadges detectedPlatform={detectedPlatform} />

      <VideoPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        videoInfo={videoInfo}
        url={url}
        platform={platform}
      />

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
    </>
  )
}
