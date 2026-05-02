import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Info, History as HistoryIcon, Save } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export const SettingsPanel = ({ onSaveFile }) => {
  const { showSettings, toggleSettings, clearHistory, history, removeFromHistory } = useAppStore()

  return (
    <AnimatePresence>
      {showSettings && (
        <>
          {/* Backdrop */}
          <motion.div
            className="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleSettings}
          />

          {/* Panel */}
          <motion.div
            className="settings-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'tween',
              duration: 0.25,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <div className="settings-header">
              <h2>Settings</h2>
              <button className="close-btn" onClick={toggleSettings}>
                <X size={24} />
              </button>
            </div>

            <div className="settings-content">
              {/* Download History - Only show if history exists */}
              {history.length > 0 && (
                <div className="settings-section">
                  <div className="section-header">
                    <h3><HistoryIcon size={20} /> Download History ({history.length})</h3>
                    <button 
                      className="clear-all-btn"
                      onClick={() => {
                        if (window.confirm('Clear all download history?')) {
                          clearHistory()
                        }
                      }}
                    >
                      <Trash2 size={14} /> Clear All
                    </button>
                  </div>
                  <div className="history-list-settings">
                    {history.map((item) => (
                      <div key={item.id} className="history-item-settings">
                        <span
                          className="history-platform-icon"
                          style={{ background: item.color }}
                        >
                          {typeof item.icon === 'string' ? (
                            <img src={item.icon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                          ) : (
                            item.icon
                          )}
                        </span>
                        <div className="history-info-settings">
                          <span className="history-title-settings">{item.title}</span>
                          <span className="history-meta-settings">
                            {item.platform} · {item.quality} · {item.time}
                          </span>
                        </div>
                        <button
                          className="history-action-btn"
                          onClick={() => onSaveFile(item.jobId)}
                          title="Download"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          className="history-action-btn delete"
                          onClick={() => removeFromHistory(item.id)}
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Management - Only show if history exists */}
              {history.length > 0 && (
                <div className="settings-section">
                  <h3><Trash2 size={20} /> Data Management</h3>
                  <div className="setting-item">
                    <p className="setting-description">
                      You have {history.length} download{history.length !== 1 ? 's' : ''} in your history
                    </p>
                  </div>
                </div>
              )}

              {/* About */}
              <div className="settings-section">
                <h3><Info size={20} /> About VidRivo</h3>
                <p className="about-text">
                  Version 1.0.0<br />
                  A modern video downloader supporting 10+ platforms<br />
                  <br />
                  <strong>Keyboard Shortcuts:</strong><br />
                  Ctrl/Cmd + V - Paste URL<br />
                  Ctrl/Cmd + Enter - Analyze<br />
                  Escape - Reset
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
