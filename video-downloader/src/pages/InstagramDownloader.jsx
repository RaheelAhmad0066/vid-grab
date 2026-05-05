import React from 'react'
import { PlatformPage } from '../components/PlatformPage'

export const InstagramDownloader = () => {
  return (
    <PlatformPage
      title="Instagram Downloader"
      tagline="Save Instagram Reels, Stories, and Videos instantly"
      platformName="Instagram"
      description={`
        <p>
          Instagram is a hub for creative short-form content, but it doesn't always make it easy to save 
          the videos you love. Vidoon's Instagram Downloader solves this by allowing you to download 
          Reels, IGTV videos, and standard posts in high quality.
        </p>
        <p>
          Our tool is optimized for Instagram's unique delivery system, ensuring that you get the full 
          resolution of the original upload without any loss in quality. Whether it's an inspiring 
          travel Reel or a helpful cooking tutorial, keep it forever on your device.
        </p>
      `}
      features={[
        { title: "Reels Downloader", text: "Download Instagram Reels in high definition with just one click." },
        { title: "Stories & Highlights", text: "Save public stories and highlights before they expire." },
        { title: "Private Content", text: "While we primarily support public videos, our engine is designed to handle complex Instagram URLs." },
        { title: "Mobile Optimized", text: "Perfectly formatted for saving directly to your phone's camera roll." }
      ]}
      faq={[
        { question: "How do I get the link for an Instagram Reel?", answer: "Tap the three dots on the Reel, select 'Link', and then paste it into our search box." },
        { question: "Does the video include the Instagram watermark?", answer: "No, our downloader extracts the original video file without any added overlays." },
        { question: "Can I download videos from private accounts?", answer: "Currently, we only support downloading from public Instagram accounts for privacy and technical reasons." }
      ]}
    />
  )
}
