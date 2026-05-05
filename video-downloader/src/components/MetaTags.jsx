import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const metaData = {
  '/': {
    title: 'Vidoon - Universal Video Downloader | YouTube, Instagram, TikTok',
    description: 'Download high-quality videos from YouTube, Instagram, Facebook, TikTok, and 40+ other platforms. Free, fast, and secure video downloader tool.'
  },
  '/youtube-downloader': {
    title: 'YouTube Video Downloader - Download YT Videos in HD & 4K',
    description: 'Save YouTube videos for offline viewing. Support for HD, 4K, and MP3 conversion. Fast and free YouTube downloader.'
  },
  '/instagram-downloader': {
    title: 'Instagram Downloader - Save Reels, Stories & Posts',
    description: 'Download Instagram Reels, Stories, and IGTV videos in high quality. No watermark, fast and easy Instagram downloader.'
  },
  '/facebook-downloader': {
    title: 'Facebook Video Downloader - Save FB Videos in HD',
    description: 'Easy way to download Facebook videos from posts and groups. Support for HD and SD quality. Free Facebook downloader.'
  },
  '/tiktok-downloader': {
    title: 'TikTok Downloader - Download TikToks Without Watermark',
    description: 'Get TikTok videos without watermark in HD quality. Fast, free, and secure TikTok downloader for any device.'
  },
  '/blog': {
    title: 'Vidoon Blog - Video Downloading Tips & Guides',
    description: 'Explore our latest articles, tutorials, and guides about digital content management and video downloading.'
  },
  '/about': {
    title: 'About Vidoon - Our Mission & Story',
    description: 'Learn about the team behind Vidoon and our mission to provide the best video downloading experience.'
  },
  '/faq': {
    title: 'Frequently Asked Questions - Vidoon Support',
    description: 'Find answers to common questions about using Vidoon, legal considerations, and technical support.'
  },
  '/privacy': {
    title: 'Privacy Policy - Vidoon',
    description: 'Read our privacy policy to understand how we handle your data and respect your privacy.'
  },
  '/terms': {
    title: 'Terms of Service - Vidoon',
    description: 'Review the terms and conditions for using our video downloader service.'
  },
  '/dmca': {
    title: 'DMCA Policy - Vidoon',
    description: 'Our policy regarding copyright infringement and DMCA takedown requests.'
  },
  '/contact': {
    title: 'Contact Us - Vidoon Support',
    description: 'Get in touch with our team for support, feedback, or business inquiries.'
  }
}

export const MetaTags = () => {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname
    const data = metaData[path] || metaData['/']

    document.title = data.title
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', data.description)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = data.description
      document.head.appendChild(meta)
    }
  }, [location])

  return null
}
