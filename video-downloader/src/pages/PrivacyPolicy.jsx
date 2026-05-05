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
        <p className="last-updated">Last Updated: May 5, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Vidoon. We value your privacy and are committed to protecting your personal data. 
            This Privacy Policy will inform you as to how we look after your personal data when you visit 
            our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <h2>2. Advertising and Cookies (AdSense Compliance)</h2>
          <p>
            Vidoon uses third-party vendors, including Google, to serve ads when you visit our website. 
            These companies may use information about your visits to this and other websites in order to 
            provide advertisements about goods and services of interest to you.
          </p>
          <ul>
            <li>
              <strong>Google's Use of Cookies:</strong> Google, as a third-party vendor, uses cookies 
              to serve ads on your site. Google's use of advertising cookies enables it and its partners 
              to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
            </li>
            <li>
              <strong>Opt-Out:</strong> Users may opt out of personalized advertising by visiting 
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"> Google Ads Settings</a>. 
              Alternatively, you can opt out of a third-party vendor's use of cookies for personalized 
              advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you use our video 
            download tool or contact us for support. This may include:
          </p>
          <ul>
            <li>Video URLs submitted for processing</li>
            <li>Usage data and technical logs</li>
            <li>Communication history (if you contact us)</li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies and Web Beacons</h2>
          <p>
            We use "cookies" to collect information and improve our Services. A cookie is a small data file 
            that we transfer to your device. We may use "persistent cookies" to save your registration ID 
            and login password for future logins to the Service. We may use "session ID cookies" to enable 
            certain features of the Service, to better understand how you interact with the Service and to 
            monitor aggregate usage and web traffic routing on the Service.
          </p>
        </section>

        <section>
          <h2>5. Third Party Privacy Policies</h2>
          <p>
            Vidoon's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising 
            you to consult the respective Privacy Policies of these third-party ad servers for more 
            detailed information. It may include their practices and instructions about how to opt-out 
            of certain options.
          </p>
        </section>

        <section>
          <h2>6. Children's Information</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. 
            We encourage parents and guardians to observe, participate in, and/or monitor and guide 
            their online activity.
          </p>
          <p>
            Vidoon does not knowingly collect any Personal Identifiable Information from children under 
            the age of 13. If you think that your child provided this kind of information on our website, 
            we strongly encourage you to contact us immediately and we will do our best efforts to 
            promptly remove such information from our records.
          </p>
        </section>

        <section>
          <h2>7. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </section>

        <section>
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to 
            contact us at support@vidrivo.com.
          </p>
        </section>
      </div>
    </motion.div>
  )
}
