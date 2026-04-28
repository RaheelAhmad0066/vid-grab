import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export const FAQ = () => {
  const { darkMode } = useAppStore()
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "What is VidGrab?",
      answer: "VidGrab is a free online tool that allows you to download videos from various popular platforms like YouTube, Facebook, Instagram, TikTok, Twitter, Vimeo, Reddit, and more. It's designed for personal, non-commercial use."
    },
    {
      question: "Is VidGrab free to use?",
      answer: "Yes, VidGrab is completely free to use. No registration or payment required. Simply paste the video URL and download."
    },
    {
      question: "What video quality options are available?",
      answer: "VidGrab offers multiple quality options depending on the source video. You can typically choose from 360p, 480p, 720p, 1080p, and higher resolutions when available. We also offer an audio-only option for MP3 downloads."
    },
    {
      question: "Is it legal to download videos?",
      answer: "Downloading videos for personal, non-commercial use is generally acceptable in many jurisdictions. However, laws vary by country. We recommend checking your local laws and the terms of service of the content platform. VidGrab is intended for personal use only."
    },
    {
      question: "Do I need to create an account?",
      answer: "No, you don't need to create an account. VidGrab is designed to be simple and accessible without registration. Just paste the URL and download."
    },
    {
      question: "What platforms does VidGrab support?",
      answer: "VidGrab supports YouTube, Facebook, Instagram, TikTok, Twitter/X, Vimeo, Reddit, Dailymotion, Twitch, and Pinterest. We're constantly adding support for more platforms."
    },
    {
      question: "Are there any download limits?",
      answer: "Currently, there are no strict download limits. However, we may implement fair usage policies to prevent abuse and ensure service quality for all users."
    },
    {
      question: "How do I download a video?",
      answer: "It's simple: 1) Copy the video URL from the platform, 2) Paste it into VidGrab's input field, 3) Click 'Analyze Video', 4) Select your preferred quality, 5) Click 'Download Now'."
    },
    {
      question: "Can I download videos on mobile devices?",
      answer: "Yes, VidGrab works on all devices including smartphones and tablets. Our website is fully responsive and optimized for mobile browsers."
    },
    {
      question: "What file formats are supported?",
      answer: "Videos are typically downloaded in MP4 format, which is compatible with most devices. Audio downloads are in MP3 format. The exact format may vary depending on the source platform."
    },
    {
      question: "Is VidGrab safe to use?",
      answer: "Yes, VidGrab is safe to use. We don't require any personal information, and we don't host any files on our servers. All downloads are processed securely. We also don't install any software on your device."
    },
    {
      question: "What should I do if a download fails?",
      answer: "If a download fails, try these steps: 1) Check that the URL is correct, 2) Make sure the video is publicly accessible, 3) Try a different quality option, 4) Refresh the page and try again. If issues persist, contact us."
    },
    {
      question: "Can I use downloaded videos commercially?",
      answer: "No, downloaded videos should only be used for personal, non-commercial purposes. Commercial use may violate copyright laws and the terms of service of the content platform."
    },
    {
      question: "How long are downloaded files available?",
      answer: "Downloaded files are available immediately after the download completes. We recommend saving them to your device promptly, as temporary files on our servers may be cleaned up periodically."
    },
    {
      question: "Does VidGrab work with private or restricted videos?",
      answer: "No, VidGrab only works with publicly accessible videos. Private, restricted, or age-restricted content cannot be downloaded."
    },
    {
      question: "How can I contact support?",
      answer: "You can reach our support team at support@vidgrab.com or use the contact form on our website. We typically respond within 24-48 hours."
    },
    {
      question: "Does VidGrab collect my data?",
      answer: "We collect minimal data necessary to provide our service, including usage analytics and technical information. We don't collect personal data without your consent. See our Privacy Policy for details."
    },
    {
      question: "What happens if a platform changes its API?",
      answer: "Platform changes can occasionally affect our service. When this happens, our team works quickly to restore compatibility. We appreciate your patience during such times."
    },
    {
      question: "Can I suggest new features or platforms?",
      answer: "Absolutely! We welcome suggestions. Please use our contact form to share your ideas. We regularly review user feedback and implement popular requests."
    },
    {
      question: "How do I report a copyright issue?",
      answer: "If you believe your copyrighted content is being misused through our service, please send a DMCA takedown notice to dmca@vidgrab.com. See our DMCA Policy for the required information."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <motion.div 
      className={`legal-page ${darkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="legal-container faq-container">
        <h1>Frequently Asked Questions</h1>
        <p className="faq-intro">
          Find answers to common questions about VidGrab. Can't find what you're looking for? 
          <a href="/contact"> Contact us</a>.
        </p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    className="faq-answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <section className="faq-contact">
          <h2>Still Have Questions?</h2>
          <p>
            If you couldn't find the answer you were looking for, please don't hesitate to reach out.
          </p>
          <a href="/contact" className="contact-link">Contact Our Support Team</a>
        </section>
      </div>
    </motion.div>
  )
}
