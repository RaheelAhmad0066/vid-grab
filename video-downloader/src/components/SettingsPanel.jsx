import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Trash2, Info } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { API_BASE_URL } from '../constants/platforms'

export const SettingsPanel = () => {
  const { showSettings, toggleSettings, clearHistory } = useAppStore()

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
            onClick={toggleSettings}
          />

          {/* Panel */}
          <motion.div
            className="settings-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="settings-header">
              <h2>Settings</h2>
              <button className="close-btn" onClick={toggleSettings}>
                <X size={24} />
              </button>
            </div>

            <div className="settings-content">
              {/* API Settings */}
              <div className="settings-section">
                <h3><Info size={20} /> API Configuration</h3>
                <div className="setting-item">
                  <label>Backend URL</label>
                  <input 
                    type="text" 
                    value={API_BASE_URL} 
                    readOnly 
                    className="setting-input"
                  />
                  <p className="setting-description">
                    Current backend endpoint. Update in constants/platforms.js
                  </p>
                </div>
              </div>

              {/* Download Settings */}
              <div className="settings-section">
                <h3><Download size={20} /> Download Settings</h3>
                <div className="setting-item">
                  <label>Default Quality</label>
                  <select className="setting-select">
                    <option>Best Available</option>
                    <option>1080p</option>
                    <option>720p</option>
                    <option>480p</option>
                  </select>
                </div>
              </div>

              {/* Data Management */}
              <div className="settings-section">
                <h3><Trash2 size={20} /> Data Management</h3>
                <div className="setting-item">
                  <button 
                    className="danger-btn"
                    onClick={() => {
                      clearHistory()
                      toggleSettings()
                    }}
                  >
                    <Trash2 size={18} /> Clear All History
                  </button>
                  <p className="setting-description">
                    Remove all download history from local storage
                  </p>
                </div>
              </div>

              {/* About */}
              <div className="settings-section">
                <h3>About VidGrab</h3>
                <p className="about-text">
                  Version 1.0.0<br />
                  A modern video downloader supporting 10+ platforms
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
