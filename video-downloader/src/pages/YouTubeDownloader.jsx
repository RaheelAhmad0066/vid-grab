import React from 'react'
import { PlatformPage } from '../components/PlatformPage'

export const YouTubeDownloader = () => {
  return (
    <PlatformPage
      title="YouTube Video Downloader"
      tagline="Download YouTube videos in HD, 4K, and MP3"
      platformName="YouTube"
      description={`
        <p>
          Vidoon's YouTube Downloader is the ultimate tool for saving your favorite videos from the world's 
          largest video sharing platform. Whether you want to download educational content, music videos, 
          or full-length documentaries, our tool provides a fast and reliable way to do so.
        </p>
        <p>
          We support all types of YouTube content, including standard videos, Shorts, and even Live Stream 
          archives once they are processed by YouTube. Our system automatically detects the best available 
          quality, ranging from 144p to 4K Ultra HD.
        </p>
      `}
      features={[
        { title: "High Resolution", text: "Download videos in 1080p, 2K, and 4K quality for the best viewing experience." },
        { title: "Audio Extraction", text: "Convert any YouTube video into a high-quality 320kbps MP3 file." },
        { title: "No Limits", text: "Download as many videos as you want without any daily or monthly restrictions." },
        { title: "Fast Processing", text: "Our servers process YouTube links in milliseconds, so you don't have to wait." }
      ]}
      faq={[
        { question: "Is it legal to download YouTube videos?", answer: "Downloading for personal, non-commercial use is generally acceptable, but we recommend checking YouTube's Terms of Service and your local copyright laws." },
        { question: "Can I download YouTube Shorts?", answer: "Yes! Simply paste the Shorts link, and we'll provide the video in its original vertical format." },
        { question: "Do I need to install any software?", answer: "No, our tool is 100% web-based. You don't need to install any apps or browser extensions." }
      ]}
    />
  )
}
