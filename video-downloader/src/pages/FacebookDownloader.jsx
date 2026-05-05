import React from 'react'
import { PlatformPage } from '../components/PlatformPage'

export const FacebookDownloader = () => {
  return (
    <PlatformPage
      title="Facebook Video Downloader"
      tagline="Download Facebook videos in HD and SD quality"
      platformName="Facebook"
      description={`
        <p>
          Facebook hosts millions of hours of video content, from live streams to viral clips. 
          Vidoon's Facebook Downloader makes it easy to grab these videos and watch them offline 
          on any device.
        </p>
        <p>
          Our system supports both public Facebook videos and videos from public groups. We provide 
          multiple quality options, including HD (High Definition) and SD (Standard Definition), 
          so you can manage your data usage and storage effectively.
        </p>
      `}
      features={[
        { title: "HD Video Support", text: "Download Facebook videos in up to 1080p resolution whenever available." },
        { title: "Group Video Support", text: "Download content from any public Facebook group easily." },
        { title: "Secure Downloads", text: "We use encrypted connections to ensure your downloads are safe from interception." },
        { title: "No Registration", text: "You don't need to link your Facebook account to use our downloader." }
      ]}
      faq={[
        { question: "How do I download a Facebook video?", answer: "Click 'Share' on the video, then 'Copy Link'. Paste that link into Vidoon and hit 'Analyze'." },
        { question: "Can I download videos from Facebook Live?", answer: "Yes, but only after the live stream has ended and the video has been saved to the creator's page." },
        { question: "Are there any length limits?", answer: "No, we can process Facebook videos of any length, from short clips to multi-hour streams." }
      ]}
    />
  )
}
