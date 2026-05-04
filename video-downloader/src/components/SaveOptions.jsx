import React from 'react'
import { motion } from 'framer-motion'
import { Download, HardDrive, Cloud, Share2, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiService } from '../services/api'

export const SaveOptions = ({ jobId, videoTitle, isOpen, onClose }) => {
  const handleDownload = () => {
    window.open(apiService.getFileUrl(jobId), '_blank')
    toast.success('Download started!')
  }

  const handleCopyLink = () => {
    const link = apiService.getFileUrl(jobId)
    navigator.clipboard.writeText(link)
    toast.success('Link copied to clipboard!')
  }

  const handleShare = () => {
    const link = apiService.getFileUrl(jobId)
    if (navigator.share) {
      navigator.share({
        title: videoTitle,
        text: 'Check out this video I downloaded!',
        url: link,
      }).catch(() => {})
    } else {
      handleCopyLink()
    }
  }

  return (
    <motion.div
      className="save-options"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="save-options-grid">
        <motion.button
          className="save-option-btn download"
          onClick={handleDownload}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="option-icon">
            <Download size={24} />
          </div>
          <span className="option-label">Download</span>
          <span className="option-desc">Save to device</span>
        </motion.button>

        <motion.button
          className="save-option-btn copy"
          onClick={handleCopyLink}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="option-icon">
            <Copy size={24} />
          </div>
          <span className="option-label">Copy Link</span>
          <span className="option-desc">Temporary link</span>
        </motion.button>

        <motion.button
          className="save-option-btn share"
          onClick={handleShare}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="option-icon">
            <Share2 size={24} />
          </div>
          <span className="option-label">Share</span>
          <span className="option-desc">Share with others</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
