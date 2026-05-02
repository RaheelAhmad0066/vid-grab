import React from 'react'
import { motion } from 'framer-motion'
import { Download, Shield, Zap, Globe } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export const About = () => {
  const { darkMode } = useAppStore()

  return (
    <motion.div 
      className={`legal-page ${darkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="legal-container about-container">
        <h1>About VidRivo</h1>
        <p className="about-intro">
          Your trusted companion for downloading videos from the internet's most popular platforms.
        </p>

        <section className="about-mission">
          <h2>Our Mission</h2>
          <p>
            VidRivo was founded with a simple mission: to make it easy for people to save and enjoy 
            videos from their favorite platforms for personal, offline viewing. We believe that once 
            you've found content you love, you should have the freedom to watch it anytime, anywhere.
          </p>
        </section>

        <section className="about-story">
          <h2>Our Story</h2>
          <p>
            VidRivo started as a personal project born out of frustration. We wanted a simple, 
            reliable way to download videos for offline viewing without complicated software or 
            confusing interfaces. What began as a small tool has grown into a platform that helps 
            thousands of users worldwide.
          </p>
          <p>
            Today, VidRivo supports over 10 major video platforms, including YouTube, Facebook, 
            Instagram, TikTok, Twitter, Vimeo, Reddit, Twitch, Pinterest, and Dailymotion. We're 
            constantly adding new platforms and improving our service based on user feedback.
          </p>
        </section>

        <section className="about-features">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Download size={32} />
              <h3>Easy Downloads</h3>
              <p>Download videos in seconds with our simple, intuitive interface. Just paste the URL and go.</p>
            </div>
            <div className="feature-card">
              <Zap size={32} />
              <h3>Fast & Reliable</h3>
              <p>Our optimized servers ensure quick downloads with minimal wait times.</p>
            </div>
            <div className="feature-card">
              <Shield size={32} />
              <h3>Secure & Private</h3>
              <p>We respect your privacy. No account required, no personal data stored.</p>
            </div>
            <div className="feature-card">
              <Globe size={32} />
              <h3>Multi-Platform</h3>
              <p>Support for 10+ major video platforms, all in one place.</p>
            </div>
          </div>
        </section>

        <section className="about-values">
          <h2>Our Values</h2>
          <ul>
            <li><strong>User-First:</strong> Everything we do is focused on making your experience better.</li>
            <li><strong>Privacy:</strong> We believe in protecting your data and respecting your privacy.</li>
            <li><strong>Simplicity:</strong> Great technology should be easy to use.</li>
            <li><strong>Transparency:</strong> We're open about how our service works and what we do with data.</li>
            <li><strong>Responsibility:</strong> We encourage responsible use of downloaded content.</li>
          </ul>
        </section>

        <section className="about-legal">
          <h2>Legal & Responsible Use</h2>
          <p>
            VidRivo is designed for personal, non-commercial use. We encourage all users to:
          </p>
          <ul>
            <li>Respect copyright and intellectual property rights</li>
            <li>Use downloaded content for personal viewing only</li>
            <li>Follow the terms of service of content platforms</li>
            <li>Not redistribute downloaded content without permission</li>
          </ul>
          <p>
            We comply with the DMCA and respond to valid copyright infringement notices. 
            See our <a href="/dmca">DMCA Policy</a> for more information.
          </p>
        </section>

        <section className="about-team">
          <h2>Our Team</h2>
          <p>
            VidRivo is built and maintained by a small team of passionate developers who believe in 
            the power of accessible technology. We're constantly improving our service based on your 
            feedback and needs.
          </p>
        </section>

        <section className="about-contact">
          <h2>Get in Touch</h2>
          <p>
            Have questions, feedback, or suggestions? We'd love to hear from you. Reach out to us at 
            <a href="mailto:support@vidrivo.com">support@vidrivo.com</a> or use our <a href="/contact">contact form</a>.
          </p>
        </section>

        <section className="about-version">
          <h2>Version Information</h2>
          <p>Current Version: 1.0.0</p>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </motion.div>
  )
}
