import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

export const TermsOfService = () => {
  const { darkMode } = useAppStore()

  return (
    <motion.div 
      className={`legal-page ${darkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using VidGrab, you agree to be bound by these Terms of Service. If you 
            do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            VidGrab is a video downloader tool that allows users to download videos from various 
            online platforms for personal, non-commercial use. Our service is provided "as is" without 
            any warranties.
          </p>
        </section>

        <section>
          <h2>3. Acceptable Use Policy</h2>
          <p>You agree to use our service only for lawful purposes and in accordance with these Terms:</p>
          <ul>
            <li>Download videos only for personal, non-commercial use</li>
            <li>Respect copyright and intellectual property rights</li>
            <li>Do not use our service to infringe on others' rights</li>
            <li>Do not attempt to circumvent security measures</li>
            <li>Do not use automated tools to abuse our service</li>
            <li>Do not redistribute downloaded content without permission</li>
          </ul>
        </section>

        <section>
          <h2>4. Copyright and Intellectual Property</h2>
          <p>
            VidGrab does not claim ownership of any content downloaded through our service. All 
            downloaded content remains the property of their respective owners. Users are responsible 
            for ensuring they have the right to download and use any content.
          </p>
          <p>
            We comply with the Digital Millennium Copyright Act (DMCA) and will respond to valid 
            copyright infringement notices.
          </p>
        </section>

        <section>
          <h2>5. User Responsibilities</h2>
          <p>By using our service, you agree to:</p>
          <ul>
            <li>Use downloaded content responsibly and legally</li>
            <li>Respect the terms of service of content platforms</li>
            <li>Not use downloaded content for commercial purposes without permission</li>
            <li>Not remove or alter copyright notices from downloaded content</li>
          </ul>
        </section>

        <section>
          <h2>6. Disclaimer of Warranties</h2>
          <p>
            VidGrab is provided "as is" without any warranties, express or implied. We do not guarantee:
          </p>
          <ul>
            <li>Uninterrupted or error-free service</li>
            <li>Compatibility with all video platforms</li>
            <li>Download speeds or quality</li>
            <li>That the service will meet your requirements</li>
          </ul>
        </section>

        <section>
          <h2>7. Limitation of Liability</h2>
          <p>
            VidGrab shall not be liable for any indirect, incidental, special, or consequential 
            damages arising from the use of our service. Our total liability is limited to the amount 
            you paid, if any, for using our service.
          </p>
        </section>

        <section>
          <h2>8. Service Modifications</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue our service at any time without 
            prior notice. We are not liable for any modifications or discontinuations.
          </p>
        </section>

        <section>
          <h2>9. User Content</h2>
          <p>
            You retain ownership of any content you submit to our service. By submitting content, you 
            grant us a license to use, modify, and display it for the purpose of providing our service.
          </p>
        </section>

        <section>
          <h2>10. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your access to our service at any time, with 
            or without cause, with or without notice.
          </p>
        </section>

        <section>
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
            in which VidGrab operates. Any disputes shall be resolved in the courts of that jurisdiction.
          </p>
        </section>

        <section>
          <h2>12. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. Continued use of our service after modifications 
            constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2>13. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:
          </p>
          <p>Email: support@vidgrab.com</p>
        </section>
      </div>
    </motion.div>
  )
}
