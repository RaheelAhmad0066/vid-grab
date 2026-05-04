import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Info, History as HistoryIcon, Save, Zap, ListVideo, Play, CheckCheck, Loader2, AlertCircle, Plus } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useBatchDownload } from '../hooks/useBatchDownload'
import { apiService } from '../services/api'

export const SettingsPanel = ({ onSaveFile }) => {
  const {
    showSettings, toggleSettings, clearHistory, history, removeFromHistory,
    autoDownload, toggleAutoDownload,
    batchQueue, addToBatch, removeFromBatch, clearBatch,
  } = useAppStore()

  const { startBatch } = useBatchDownload()
  const [batchInput, setBatchInput] = useState('')

  const handleAddBatch = () => {
    const lines = batchInput.split('\n').map(l => l.trim()).filter(Boolean)
    if (!lines.length) return
    addToBatch(lines)
    setBatchInput('')
  }

  const statusIcon = (item) => {
    if (item.status === 'analyzing' || item.status === 'downloading') return <Loader2 size={14} className="batch-spinner" />
    if (item.status === 'done') return <CheckCheck size={14} color="#22c55e" />
    if (item.status === 'error') return <AlertCircle size={14} color="#ef4444" />
    return null
  }

  const pendingCount = batchQueue.filter(i => i.status === 'idle' || i.status === 'error').length

  return (
    <AnimatePresence>
      {showSettings && (
        <>
          <motion.div
            className="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleSettings}
          />

          <motion.div
            className="settings-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="settings-header">
              <h2>Settings</h2>
              <button className="close-btn" onClick={toggleSettings}>
                <X size={24} />
              </button>
            </div>

            <div className="settings-content">

              {/* Auto-Download Toggle */}
              <div className="settings-section">
                <h3><Zap size={20} /> Auto Download</h3>
                <div className="setting-item setting-row">
                  <div>
                    <p className="setting-label">Auto-analyze &amp; download on paste</p>
                    <p className="setting-description">Paste a link and it starts downloading automatically with best quality</p>
                  </div>
                  <button
                    className={`toggle-btn ${autoDownload ? 'active' : ''}`}
                    onClick={toggleAutoDownload}
                    aria-label="Toggle auto download"
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
              </div>

              {/* Batch Download */}
              <div className="settings-section">
                <div className="section-header">
                  <h3><ListVideo size={20} /> Batch Download</h3>
                  {batchQueue.length > 0 && (
                    <button className="clear-all-btn" onClick={clearBatch}>
                      <Trash2 size={14} /> Clear
                    </button>
                  )}
                </div>

                <div className="batch-input-wrap">
                  <textarea
                    className="batch-textarea"
                    placeholder={'Paste multiple links here\n(one per line)'}
                    value={batchInput}
                    onChange={e => setBatchInput(e.target.value)}
                    rows={4}
                  />
                  <button className="batch-add-btn" onClick={handleAddBatch} disabled={!batchInput.trim()}>
                    <Plus size={16} /> Add to Queue
                  </button>
                </div>

                {batchQueue.length > 0 && (
                  <>
                    <div className="batch-list">
                      {batchQueue.map(item => (
                        <div key={item.id} className={`batch-item batch-${item.status}`}>
                          <div className="batch-item-status">{statusIcon(item)}</div>
                          <div className="batch-item-info">
                            <span className="batch-item-url">{item.title || item.url}</span>
                            {item.status === 'downloading' && (
                              <div className="batch-progress-bar">
                                <div className="batch-progress-fill" style={{ width: `${item.progress}%` }} />
                              </div>
                            )}
                            {item.status === 'error' && <span className="batch-error">{item.error}</span>}
                          </div>
                          <div className="batch-item-actions">
                            {item.status === 'done' && item.jobId && (
                              <button className="history-action-btn" onClick={() => window.open(apiService.getFileUrl(item.jobId), '_blank')} title="Save">
                                <Save size={14} />
                              </button>
                            )}
                            <button className="history-action-btn delete" onClick={() => removeFromBatch(item.id)} title="Remove">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="batch-start-btn"
                      onClick={startBatch}
                      disabled={pendingCount === 0}
                    >
                      <Play size={16} /> Start Batch ({pendingCount} pending)
                    </button>
                  </>
                )}
              </div>

              {/* Download History */}
              {history.length > 0 && (
                <div className="settings-section">
                  <div className="section-header">
                    <h3><HistoryIcon size={20} /> Download History ({history.length})</h3>
                    <button
                      className="clear-all-btn"
                      onClick={() => { if (window.confirm('Clear all download history?')) clearHistory() }}
                    >
                      <Trash2 size={14} /> Clear All
                    </button>
                  </div>
                  <div className="history-list-settings">
                    {history.map((item) => (
                      <div key={item.id} className="history-item-settings">
                        <span className="history-platform-icon" style={{ background: item.color }}>
                          {typeof item.icon === 'string' ? (
                            <img src={item.icon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                          ) : item.icon}
                        </span>
                        <div className="history-info-settings">
                          <span className="history-title-settings">{item.title}</span>
                          <span className="history-meta-settings">{item.platform} · {item.quality} · {item.time}</span>
                        </div>
                        <button className="history-action-btn" onClick={() => onSaveFile(item.jobId)} title="Download">
                          <Save size={16} />
                        </button>
                        <button className="history-action-btn delete" onClick={() => removeFromHistory(item.id)} title="Remove">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* About */}
              <div className="settings-section">
                <h3><Info size={20} /> About Vidoon</h3>
                <p className="about-text">
                  Version 1.0.0<br />
                  A modern video downloader supporting 10+ platforms<br />
                  <br />
                  <strong>Keyboard Shortcuts:</strong><br />
                  Ctrl/Cmd + V — Paste URL<br />
                  Ctrl/Cmd + Enter — Analyze<br />
                  Escape — Reset
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
