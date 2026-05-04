import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Download, CheckCircle2, AlertCircle, Play, Pause, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppStore } from '../store/useAppStore'
import { isValidUrl } from '../utils/validators'
import { detectPlatform } from '../utils/platform'

export const BatchUpload = ({ onBatchAdd, onBatchStart }) => {
  const [textInput, setTextInput] = useState('')
  const [showBatch, setShowBatch] = useState(false)
  const { batchQueue, removeFromBatch, clearBatch } = useAppStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const parseUrls = (text) => {
    return text
      .split(/[\n,\r]/)
      .map(url => url.trim())
      .filter(url => url.length > 0 && isValidUrl(url))
  }

  const handleAddUrls = () => {
    const urls = parseUrls(textInput)

    if (urls.length === 0) {
      toast.error('No valid URLs found')
      return
    }

    onBatchAdd(urls)
    setTextInput('')
    toast.success(`Added ${urls.length} video${urls.length > 1 ? 's' : ''} to queue`)
  }

  const handleStartBatch = () => {
    if (batchQueue.length === 0) {
      toast.error('No videos in queue')
      return
    }
    setIsProcessing(true)
    onBatchStart()
  }

  const validUrlCount = parseUrls(textInput).length

  return (
    <div className="batch-upload">
      <motion.button
        className={`batch-toggle-btn ${showBatch ? 'active' : ''}`}
        onClick={() => setShowBatch(!showBatch)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={20} /> Batch Download
        {batchQueue.length > 0 && (
          <span className="batch-badge">{batchQueue.length}</span>
        )}
      </motion.button>

      <AnimatePresence>
        {showBatch && (
          <motion.div
            className="batch-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBatch(false)}
          >
            <motion.div
              className="batch-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="batch-modal-header">
                <h2>Batch Download Videos</h2>
                <button className="close-btn" onClick={() => setShowBatch(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="batch-modal-body">
                {/* Input Section */}
                <div className="batch-input-section">
                  <label>Paste multiple video URLs (one per line or comma-separated):</label>
                  <textarea
                    className="batch-textarea"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="https://youtube.com/watch?v=...&#10;https://instagram.com/p/...&#10;https://tiktok.com/@.../video/..."
                    rows="6"
                  />
                  <div className="batch-input-footer">
                    <span className="url-count">
                      {validUrlCount} valid URL{validUrlCount !== 1 ? 's' : ''} found
                    </span>
                    <motion.button
                      className="add-urls-btn"
                      onClick={handleAddUrls}
                      disabled={validUrlCount === 0}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={16} /> Add to Queue
                    </motion.button>
                  </div>
                </div>

                {/* Queue Section */}
                {batchQueue.length > 0 && (
                  <div className="batch-queue-section">
                    <div className="queue-header">
                      <h3>Download Queue ({batchQueue.length})</h3>
                      <motion.button
                        className="clear-queue-btn"
                        onClick={clearBatch}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 size={16} /> Clear All
                      </motion.button>
                    </div>

                    <div className="batch-queue">
                      {batchQueue.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className={`queue-item ${item.status}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <span className="queue-num">{index + 1}</span>
                          <div className="queue-info">
                            <p className="queue-url" title={item.url}>{item.url}</p>
                            {item.title && (
                              <p className="queue-title">{item.title}</p>
                            )}
                          </div>
                          <div className="queue-status">
                            {item.status === 'idle' && (
                              <span className="status-badge idle">Waiting</span>
                            )}
                            {item.status === 'analyzing' && (
                              <span className="status-badge analyzing">Analyzing…</span>
                            )}
                            {item.status === 'downloading' && (
                              <span className="status-badge downloading">
                                {item.progress}%
                              </span>
                            )}
                            {item.status === 'done' && (
                              <span className="status-badge done">
                                <CheckCircle2 size={16} /> Done
                              </span>
                            )}
                            {item.status === 'error' && (
                              <span className="status-badge error">
                                <AlertCircle size={16} /> Error
                              </span>
                            )}
                          </div>
                          <motion.button
                            className="remove-item-btn"
                            onClick={() => removeFromBatch(item.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X size={18} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      className="start-batch-btn"
                      onClick={handleStartBatch}
                      disabled={isProcessing || batchQueue.some(i => i.status !== 'idle' && i.status !== 'done' && i.status !== 'error')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isProcessing ? (
                        <>
                          <Pause size={18} /> Processing…
                        </>
                      ) : (
                        <>
                          <Download size={18} /> Start Batch Download
                        </>
                      )}
                    </motion.button>
                  </div>
                )}

                {batchQueue.length === 0 && textInput === '' && (
                  <div className="batch-empty-state">
                    <Download size={48} />
                    <p>Paste multiple URLs to get started</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
