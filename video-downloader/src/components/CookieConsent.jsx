import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { darkMode } = useAppStore()

  useEffect(() => {
    const consent = localStorage.getItem('vidoon-cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('vidoon-cookie-consent', 'true')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={`cookie-banner ${darkMode ? 'dark' : 'light'}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          <div className="cookie-content">
            <div className="cookie-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="cookie-text">
              <p>
                We use cookies to enhance your experience and serve personalized ads through Google AdSense. 
                By clicking "Accept", you consent to our use of cookies. 
                Read our <Link to="/privacy">Privacy Policy</Link> to learn more.
              </p>
            </div>
            <div className="cookie-actions">
              <button className="cookie-btn cookie-accept" onClick={handleAccept}>
                Accept All
              </button>
              <button className="cookie-btn cookie-close" onClick={() => setIsVisible(false)}>
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
