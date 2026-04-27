import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, ExternalLink } from 'lucide-react'
import React from 'react'

export const VideoPreviewModal = ({ isOpen, onClose, videoInfo, url, platform }) => {
  const [isPlaying, setIsPlaying] = React.useState(false)

  // Reset playing state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false)
    }
  }, [isOpen])

  const handlePlayClick = () => {
    setIsPlaying(true)
  }

  // Get embed URL based on platform
  const getEmbedUrl = () => {
    if (!url) return null

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : new URLSearchParams(url.split('?')[1]).get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : null
    }

    // Dailymotion
    if (url.includes('dailymotion.com')) {
      const videoId = url.split('/video/')[1]?.split('?')[0]
      return videoId ? `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1` : null
    }

    // For other platforms, return null (will show "Open Original" button)
    return null
  }

  const embedUrl = getEmbedUrl()

  // Debug logging
  React.useEffect(() => {
    if (isOpen) {
      console.log('Modal opened')
      console.log('URL:', url)
      console.log('Embed URL:', embedUrl)
      console.log('Is Playing:', isPlaying)
    }
  }, [isOpen, url, embedUrl, isPlaying])

  return (
    <AnimatePresence>
      {isOpen && videoInfo && (
        <>
          {/* Backdrop */}
          <motion.div
            className="preview-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="preview-modal"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1002
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="preview-header">
              <h3>Video Preview</h3>
              <button className="preview-close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <div className="preview-content">
              {/* Video Player or Thumbnail */}
              <div className="preview-thumbnail-container">
                {isPlaying && embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="preview-video-player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video Player"
                  />
                ) : (
                  <>
                    {videoInfo.thumbnail ? (
                      <>
                        <img 
                          src={videoInfo.thumbnail} 
                          alt={videoInfo.title}
                          className="preview-thumbnail"
                          onError={(e) => {
                            console.error('Preview thumbnail failed to load:', videoInfo.thumbnail)
                            e.target.style.display = 'none'
                            const noThumb = e.target.parentElement.querySelector('.preview-no-thumbnail')
                            if (noThumb) noThumb.style.display = 'flex'
                          }}
                        />
                        <div className="preview-no-thumbnail" style={{ display: 'none' }}>
                          <Play size={64} />
                          <p>No preview available</p>
                        </div>
                        {embedUrl && (
                          <div className="preview-play-overlay" onClick={handlePlayClick}>
                            <motion.div
                              className="preview-play-button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Play size={48} fill="white" />
                            </motion.div>
                            <p className="preview-play-text">Click to Play</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="preview-no-thumbnail">
                        <Play size={64} />
                        <p>No preview available</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Video Info */}
              <div className="preview-info">
                <h4 className="preview-title">{videoInfo.title}</h4>
                
                {videoInfo.uploader && (
                  <p className="preview-uploader">
                    <strong>Uploader:</strong> {videoInfo.uploader}
                  </p>
                )}

                <div className="preview-meta">
                  {videoInfo.duration && (
                    <span className="preview-meta-item">
                      <strong>Duration:</strong> {videoInfo.duration}
                    </span>
                  )}
                  {videoInfo.view_count && (
                    <span className="preview-meta-item">
                      <strong>Views:</strong> {videoInfo.view_count.toLocaleString()}
                    </span>
                  )}
                  {platform && (
                    <span className="preview-meta-item">
                      <strong>Platform:</strong> {platform.name}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="preview-actions">
                  {!isPlaying && embedUrl && (
                    <motion.button
                      onClick={handlePlayClick}
                      className="preview-play-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play size={18} />
                      Play Video
                    </motion.button>
                  )}
                  
                  <motion.a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="preview-open-link"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink size={18} />
                    Open Original
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
