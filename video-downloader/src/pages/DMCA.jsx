import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

export const DMCA = () => {
  const { darkMode } = useAppStore()

  return (
    <motion.div 
      className={`legal-page ${darkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="legal-container">
        <h1>DMCA & Copyright Policy</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Copyright Infringement Policy</h2>
          <p>
            VidGrab respects the intellectual property rights of others and expects users of our service 
            to do the same. We comply with the Digital Millennium Copyright Act (DMCA) and other 
            applicable copyright laws.
          </p>
        </section>

        <section>
          <h2>2. Our Position on Copyright</h2>
          <p>
            VidGrab is a tool designed to help users download videos for personal, non-commercial use. 
            We do not host any content on our servers. All content is downloaded from third-party platforms.
          </p>
          <p>
            We believe that users have the right to:
          </p>
          <ul>
            <li>Download videos for personal viewing and archiving</li>
            <li>Create backups of content they have legal access to</li>
            <li>Use content for educational purposes under fair use</li>
          </ul>
          <p>
            However, users are responsible for ensuring their use of downloaded content complies with 
            applicable laws and the terms of service of the content platforms.
          </p>
        </section>

        <section>
          <h2>3. DMCA Takedown Procedure</h2>
          <p>
            If you believe that your copyrighted work has been copied in a way that constitutes 
            copyright infringement and is accessible on our service, please notify us immediately.
          </p>
        </section>

        <section>
          <h2>4. DMCA Takedown Notice Requirements</h2>
          <p>
            To file a DMCA takedown notice, please include the following information:
          </p>
          <ul>
            <li>Your physical or electronic signature</li>
            <li>Identification of the copyrighted work claimed to have been infringed</li>
            <li>Identification of the material that is claimed to be infringing</li>
            <li>Your contact information (address, phone number, email)</li>
            <li>A statement that you have a good faith belief that the use is not authorized</li>
            <li>A statement that the information is accurate under penalty of perjury</li>
            <li>A statement that you are authorized to act on behalf of the copyright owner</li>
          </ul>
        </section>

        <section>
          <h2>5. How to Submit a DMCA Notice</h2>
          <p>
            Please send your DMCA takedown notice to:
          </p>
          <p><strong>Email:</strong> dmca@vidgrab.com</p>
          <p><strong>Subject:</strong> DMCA Takedown Notice</p>
        </section>

        <section>
          <h2>6. Our Response to DMCA Notices</h2>
          <p>
            Upon receiving a valid DMCA notice, we will:
          </p>
          <ul>
            <li>Acknowledge receipt of the notice within 24-48 hours</li>
            <li>Review the notice for completeness and validity</li>
            <li>Take appropriate action, which may include removing access to the infringing content</li>
            <li>Notify the user who submitted the content (if applicable)</li>
            <li>Forward the notice to the user (if applicable)</li>
          </ul>
        </section>

        <section>
          <h2>7. Counter-Notification Procedure</h2>
          <p>
            If you believe that content was removed in error, you may file a counter-notification. 
            Your counter-notification must include:
          </p>
          <ul>
            <li>Your physical or electronic signature</li>
            <li>Identification of the material that was removed</li>
            <li>A statement that you have a good faith belief the material was removed in error</li>
            <li>Your contact information</li>
            <li>A statement consenting to jurisdiction in your local district court</li>
          </ul>
        </section>

        <section>
          <h2>8. Repeat Infringers</h2>
          <p>
            We reserve the right to terminate access to our service for users who are repeat infringers 
            of copyright.
          </p>
        </section>

        <section>
          <h2>9. Educational Use and Fair Use</h2>
          <p>
            We support the principles of fair use and educational use of copyrighted material. Users 
            should be aware that fair use is a complex legal doctrine and should consult legal counsel 
            if they have questions about whether their use qualifies as fair use.
          </p>
        </section>

        <section>
          <h2>10. Contact Information</h2>
          <p>
            For copyright-related inquiries, please contact us at:
          </p>
          <p><strong>Email:</strong> dmca@vidgrab.com</p>
          <p><strong>General Inquiries:</strong> support@vidgrab.com</p>
        </section>
      </div>
    </motion.div>
  )
}
