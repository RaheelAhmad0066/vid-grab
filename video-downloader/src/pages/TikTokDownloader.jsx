import React from 'react'
import { PlatformPage } from '../components/PlatformPage'

export const TikTokDownloader = () => {
  return (
    <PlatformPage
      title="TikTok Downloader"
      tagline="Download TikTok videos without watermark in HD"
      platformName="TikTok"
      description={`
        <p>
          TikTok is the world's most popular destination for short-form mobile video. 
          Vidoon's TikTok Downloader allows you to save these videos without the distracting 
          watermark, making them perfect for offline viewing or personal collections.
        </p>
        <p>
          Our tool is incredibly easy to use and works on both desktop and mobile. 
          Simply paste the link to the TikTok you want to save, and we'll provide a 
          high-quality MP4 file in seconds.
        </p>
      `}
      features={[
        { title: "No Watermark", text: "Download clean TikTok videos without the moving watermark." },
        { title: "Original Quality", text: "We extract the video in its original resolution and bitrate." },
        { title: "Super Fast", text: "Most TikTok videos are processed and ready for download in under 3 seconds." },
        { title: "Audio Only", text: "Love the song? You can also download just the TikTok audio as an MP3." }
      ]}
      faq={[
        { question: "Is the watermark really gone?", answer: "Yes! Our system uses advanced techniques to fetch the original video file before TikTok adds the watermark." },
        { question: "Can I download TikToks on my iPhone?", answer: "Absolutely. Our site works perfectly in Safari on iOS. Just follow the same steps." },
        { question: "Is it free to download TikToks?", answer: "Yes, our TikTok downloader is completely free and requires no subscription." }
      ]}
    />
  )
}
