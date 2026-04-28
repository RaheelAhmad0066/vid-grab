import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

export const PrivacyPolicy = () => {
  const { darkMode } = useAppStore()

  return (
    <motion.div 
      className={`legal-page ${darkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            VidGrab ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, and safeguard your information when you use our video downloader service.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li>Video URLs that you submit for download</li>
            <li>Contact information if you reach out to us (email, name)</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <ul>
            <li>IP address and browser type</li>
            <li>Device information and operating system</li>
            <li>Usage data and analytics</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our video download service</li>
            <li>To analyze usage patterns and optimize performance</li>
            <li>To respond to your inquiries and support requests</li>
            <li>To ensure security and prevent abuse</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Storage and Retention</h2>
          <p>
            Downloaded files are stored temporarily on our servers and are automatically deleted after 
            a short period. We do not permanently store your downloaded videos. User data is retained 
            only as long as necessary for the purposes outlined in this policy.
          </p>
        </section>

        <section>
          <h2>5. Cookies and Tracking</h2>
          <p>
            We use cookies to enhance your experience, remember your preferences, and analyze site traffic. 
            You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2>6. Third-Party Services</h2>
          <p>
            We may use third-party services for analytics, hosting, and other functionality. These services 
            may have their own privacy policies. We are not responsible for the practices of third-party services.
          </p>
        </section>

        <section>
          <h2>7. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information. However, no method of 
            transmission over the internet is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of certain data collection</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2>9. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13. We do not knowingly collect personal 
            information from children under 13.
          </p>
        </section>

        <section>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes 
            by posting the new policy on our website.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p>Email: support@vidgrab.com</p>
        </section>
      </div>
    </motion.div>
  )
}
