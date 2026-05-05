import React from 'react'
import { motion } from 'framer-motion'
import { DownloaderTool } from './DownloaderTool'
import { useAppStore } from '../store/useAppStore'

export const PlatformPage = ({ title, tagline, description, platformName, features, faq }) => {
  const { darkMode } = useAppStore()

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="container" style={{ paddingTop: '120px' }}>
        <motion.header 
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="logo">
            <span className="logo-text">{title}</span>
          </motion.div>
          <motion.p 
            className="tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {tagline}
          </motion.p>
        </motion.header>

        {/* Downloader Tool */}
        <DownloaderTool />

        {/* Platform Specific Content */}
        <div className="home-rich-content">
          <motion.section 
            className="content-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <h2>About our {platformName} Downloader</h2>
            </div>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </motion.section>

          <motion.section 
            className="content-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <h2>Key Features for {platformName}</h2>
            </div>
            <ul className="platform-features-list">
              {features.map((feature, index) => (
                <li key={index}>
                  <strong>{feature.title}:</strong> {feature.text}
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section 
            className="content-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="platform-faq">
              {faq.map((item, index) => (
                <div key={index} className="faq-item-simple">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
