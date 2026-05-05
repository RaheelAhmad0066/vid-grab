import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Info, HelpCircle, FileText, Shield, Mail, Download } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export const Navigation = () => {
  const { darkMode } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/blog', label: 'Blog', icon: HelpCircle },
    { path: '/about', label: 'About', icon: Info },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/privacy', label: 'Privacy Policy', icon: FileText },
    { path: '/terms', label: 'Terms of Service', icon: Shield },
    { path: '/dmca', label: 'DMCA', icon: Shield },
    { path: '/contact', label: 'Contact', icon: Mail },
    { path: '/youtube-downloader', label: 'YouTube Downloader', icon: Download },
    { path: '/instagram-downloader', label: 'Instagram Downloader', icon: Download },
    { path: '/facebook-downloader', label: 'Facebook Downloader', icon: Download },
    { path: '/tiktok-downloader', label: 'TikTok Downloader', icon: Download },
  ]

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className={`mobile-menu-btn ${darkMode ? 'dark' : 'light'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`mobile-menu ${darkMode ? 'dark' : 'light'}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="mobile-menu-header">
              <h2>Menu</h2>
              <button onClick={closeMenu} className="close-menu-btn">
                <X size={24} />
              </button>
            </div>
            <nav className="mobile-nav">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <nav className={`desktop-nav ${darkMode ? 'dark' : 'light'}`}>
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
          About
        </Link>
        <Link to="/faq" className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}>
          FAQ
        </Link>
        <Link to="/blog" className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}>
          Blog
        </Link>
        <div className="nav-divider" />
        <Link to="/youtube-downloader" className={`nav-link ${location.pathname === '/youtube-downloader' ? 'active' : ''}`}>
          YouTube
        </Link>
        <Link to="/instagram-downloader" className={`nav-link ${location.pathname === '/instagram-downloader' ? 'active' : ''}`}>
          Instagram
        </Link>
        <Link to="/privacy" className={`nav-link ${location.pathname === '/privacy' ? 'active' : ''}`}>
          Privacy
        </Link>
        <Link to="/terms" className={`nav-link ${location.pathname === '/terms' ? 'active' : ''}`}>
          Terms
        </Link>
        <Link to="/dmca" className={`nav-link ${location.pathname === '/dmca' ? 'active' : ''}`}>
          DMCA
        </Link>
        <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
          Contact
        </Link>
      </nav>
    </>
  )
}
