import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, Smartphone, Globe, CheckCircle, Info, HelpCircle } from 'lucide-react'

export const HomeContent = () => {
  return (
    <div className="home-rich-content">
      {/* Why Choose Section */}
      <motion.section 
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-header">
          <CheckCircle className="section-icon text-purple" />
          <h2>Why Choose Vidoon for Video Downloads?</h2>
        </div>
        <p>
          In today's digital age, video content is everywhere. Whether it's an educational tutorial on YouTube, 
          a viral reel on Instagram, or a funny clip on TikTok, we often find ourselves wanting to save these 
          videos for later. Vidoon provides a seamless, secure, and lightning-fast way to download high-quality 
          videos from over 40+ platforms directly to your device.
        </p>
        <p>
          Our platform is built with the user in mind. We understand that you want a tool that "just works" 
          without the need for intrusive software installations or complex configurations. Vidoon is a 100% 
          web-based utility, meaning you can access it from any browser, on any device, anywhere in the world.
        </p>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="section-header">
          <Zap className="section-icon text-blue" />
          <h2>Advanced Features & Capabilities</h2>
        </div>
        <div className="rich-features-grid">
          <div className="rich-feature-item">
            <h3><Globe size={20} /> Universal Compatibility</h3>
            <p>From mainstream social media like Facebook and Twitter to niche video hosting sites, our engine is constantly updated to support the latest platform changes.</p>
          </div>
          <div className="rich-feature-item">
            <h3><Smartphone size={20} /> Mobile-First Design</h3>
            <p>Download videos on your iPhone, Android, or tablet with ease. Our interface is fully responsive and optimized for mobile browsers.</p>
          </div>
          <div className="rich-feature-item">
            <h3><Shield size={20} /> Privacy Guaranteed</h3>
            <p>We do not store your download history on our servers, and we don't require any registration. Your activity remains completely private.</p>
          </div>
          <div className="rich-feature-item">
            <h3><Info size={20} /> Multiple Formats</h3>
            <p>Choose from various resolutions including 720p, 1080p Full HD, and even 4K where available. You can also extract audio as MP3 files.</p>
          </div>
        </div>
      </motion.section>

      {/* Platform Deep Dive */}
      <motion.section 
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="section-header">
          <Globe className="section-icon text-pink" />
          <h2>Supported Platforms Deep Dive</h2>
        </div>
        <div className="platform-description">
          <h3>YouTube Video Downloader</h3>
          <p>
            YouTube is the king of video content. Whether you're a student saving lectures or a fan 
            archiving music videos, our YouTube downloader ensures you get the highest possible bitrate 
            and resolution. We support Shorts, standard videos, and even full playlists.
          </p>
          
          <h3>Instagram Reels & Stories</h3>
          <p>
            Instagram content is fleeting. Our tool allows you to save those inspiring Reels and 
            important Stories before they disappear. Simply paste the link, and we'll handle the rest, 
            providing you with a high-quality MP4 file.
          </p>

          <h3>TikTok Without Watermark</h3>
          <p>
            Want to save a TikTok for your personal collection without the distracting watermark? 
            Vidoon's advanced processing can often extract the clean video file directly from the source, 
            giving you a professional-looking result.
          </p>

          <h3>Facebook & Twitter (X)</h3>
          <p>
            From news clips on X to family videos on Facebook, we make it easy to grab content from 
            your social feeds. No more "saving" posts only to have them deleted later—keep them forever 
            on your local drive.
          </p>
        </div>
      </motion.section>

      {/* How to Guide */}
      <motion.section 
        className="content-section last-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="section-header">
          <HelpCircle className="section-icon text-green" />
          <h2>Comprehensive Guide: How to Download Videos</h2>
        </div>
        <div className="guide-steps">
          <div className="guide-step">
            <span className="step-num">1</span>
            <div>
              <strong>Find the Video:</strong> Browse your favorite platform and locate the video you wish to download.
            </div>
          </div>
          <div className="guide-step">
            <span className="step-num">2</span>
            <div>
              <strong>Copy the Link:</strong> Click the "Share" button or copy the URL directly from your browser's address bar.
            </div>
          </div>
          <div className="guide-step">
            <span className="step-num">3</span>
            <div>
              <strong>Paste & Analyze:</strong> Return to Vidoon, paste the link into the search box, and click "Analyze". Our system will fetch all available quality options.
            </div>
          </div>
          <div className="guide-step">
            <span className="step-num">4</span>
            <div>
              <strong>Select Quality & Download:</strong> Choose your preferred resolution and click "Download Now". Once the processing is complete, save the file to your device!
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
