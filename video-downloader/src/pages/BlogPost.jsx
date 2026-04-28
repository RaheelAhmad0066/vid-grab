import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import toast from 'react-hot-toast'

export const BlogPost = () => {
  const { darkMode } = useAppStore()
  const { slug } = useParams()

  const blogPosts = {
    'how-to-download-youtube-videos': {
      title: "How to Download YouTube Videos for Offline Viewing",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Tutorial",
      content: `
        <p>Downloading YouTube videos for offline viewing is a common practice for many users who want to watch content without an internet connection. However, it's important to understand both the technical aspects and legal considerations.</p>
        
        <h2>Why Download Videos?</h2>
        <p>There are several legitimate reasons to download videos:</p>
        <ul>
          <li>Watching during flights or commutes without internet</li>
          <li>Creating personal backups of content you own</li>
          <li>Educational purposes and research</li>
          <li>Archiving important content for future reference</li>
        </ul>
        
        <h2>Legal Considerations</h2>
        <p>Before downloading any video, consider these important points:</p>
        <ul>
          <li>Respect copyright laws in your jurisdiction</li>
          <li>Only download content you have permission to use</li>
          <li>Don't redistribute downloaded content without authorization</li>
          <li>Use downloaded content for personal, non-commercial purposes</li>
        </ul>
        
        <h2>Best Practices</h2>
        <p>Follow these best practices when downloading videos:</p>
        <ul>
          <li>Choose appropriate quality for your needs</li>
          <li>Organize your downloaded files properly</li>
          <li>Keep your downloads secure and private</li>
          <li>Regularly review and delete unused downloads</li>
        </ul>
        
        <h2>Technical Tips</h2>
        <p>For the best experience:</p>
        <ul>
          <li>Use reliable download tools like VidGrab</li>
          <li>Ensure sufficient storage space before downloading</li>
          <li>Check your internet connection for stable downloads</li>
          <li>Verify file integrity after download</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Downloading videos can be a useful tool for personal use, but always ensure you're doing so legally and responsibly. Respect content creators and their intellectual property rights.</p>
      `
    },
    'understanding-copyright-laws': {
      title: "Understanding Copyright Laws for Video Downloads",
      date: "2024-01-10",
      readTime: "8 min read",
      category: "Legal",
      content: `
        <p>Copyright laws govern how digital content can be used, distributed, and downloaded. Understanding these laws is crucial for anyone who downloads videos from the internet.</p>
        
        <h2>What is Copyright?</h2>
        <p>Copyright is a legal right that grants the creator of original work exclusive rights to its use and distribution. This includes videos, music, images, and other creative content.</p>
        
        <h2>Fair Use Doctrine</h2>
        <p>The fair use doctrine allows limited use of copyrighted material without permission for purposes such as:</p>
        <ul>
          <li>Criticism and commentary</li>
          <li>News reporting</li>
          <li>Teaching and education</li>
          <li>Research and scholarship</li>
        </ul>
        
        <h2>Downloading for Personal Use</h2>
        <p>Downloading videos for personal viewing is generally acceptable in many jurisdictions, but there are important caveats:</p>
        <ul>
          <li>You must have legal access to the content</li>
          <li>The download should be for personal, non-commercial use</li>
          <li>You should not circumvent digital rights management (DRM)</li>
          <li>Laws vary significantly by country</li>
        </ul>
        
        <h2>Platform Terms of Service</h2>
        <p>Each video platform has its own terms of service that may restrict downloading:</p>
        <ul>
          <li>YouTube's terms generally prohibit downloading without permission</li>
          <li>Some platforms allow downloads for premium subscribers</li>
          <li>Violating terms can result in account termination</li>
        </ul>
        
        <h2>International Considerations</h2>
        <p>Copyright laws vary by country:</p>
        <ul>
          <li>US copyright law is different from EU laws</li>
          <li>Some countries have more lenient fair use provisions</li>
          <li>International treaties create some standardization</li>
        </ul>
        
        <h2>Best Practices</h2>
        <p>To stay compliant:</p>
        <ul>
          <li>Always check the platform's terms of service</li>
          <li>Respect content creators' rights</li>
          <li>Use downloads only for personal use</li>
          <li>Don't redistribute downloaded content</li>
        </ul>
      `
    },
    'best-video-quality-options': {
      title: "Best Video Quality Options for Different Devices",
      date: "2024-01-05",
      readTime: "4 min read",
      category: "Tips",
      content: `
        <p>Choosing the right video quality depends on your device, storage space, and viewing preferences. Here's a guide to help you decide.</p>
        
        <h2>Understanding Video Quality</h2>
        <p>Video quality is measured in resolution (pixels) and affects both file size and viewing experience:</p>
        <ul>
          <li>360p: Basic quality, small file size</li>
          <li>480p: Standard definition, good for small screens</li>
          <li>720p: HD quality, good for tablets and laptops</li>
          <li>1080p: Full HD, ideal for most devices</li>
          <li>4K: Ultra HD, best for large screens</li>
        </ul>
        
        <h2>Smartphones</h2>
        <p>For mobile viewing:</p>
        <ul>
          <li>720p is usually sufficient for most phones</li>
          <li>Consider 1080p for larger phones or if you plan to cast</li>
          <li>Lower quality saves storage space</li>
        </ul>
        
        <h2>Tablets</h2>
        <p>For tablet viewing:</p>
        <ul>
          <li>1080p provides excellent quality</li>
          <li>720p is acceptable for smaller tablets</li>
          <li>Consider storage capacity when choosing</li>
        </ul>
        
        <h2>Desktop/Laptop</h2>
        <p>For computer viewing:</p>
        <ul>
          <li>1080p is ideal for most monitors</li>
          <li>4K for 4K monitors or future-proofing</li>
          <li>Higher quality uses more storage space</li>
        </ul>
        
        <h2>Storage Considerations</h2>
        <p>Higher quality means larger files:</p>
        <ul>
          <li>720p: ~500MB per hour</li>
          <li>1080p: ~1-2GB per hour</li>
          <li>4K: ~5-10GB per hour</li>
        </ul>
      `
    },
    'top-10-video-platforms': {
      title: "Top 10 Video Platforms You Can Download From",
      date: "2023-12-28",
      readTime: "6 min read",
      category: "Guide",
      content: `
        <p>There are numerous video platforms available today. Here's a comprehensive guide to the most popular ones and how to download content from them.</p>
        
        <h2>1. YouTube</h2>
        <p>The world's largest video platform with billions of videos. Supports various qualities from 360p to 4K.</p>
        
        <h2>2. Facebook</h2>
        <p>Huge social media platform with extensive video content. Good quality downloads available.</p>
        
        <h2>3. Instagram</h2>
        <p>Popular for short-form video content. Reels and IGTV videos can be downloaded.</p>
        
        <h2>4. TikTok</h2>
        <p>Leading platform for short videos. High-quality downloads available for most content.</p>
        
        <h2>5. Twitter/X</h2>
        <p>Microblogging platform with video content. Good for news and viral videos.</p>
        
        <h2>6. Vimeo</h2>
        <p>Professional video platform with high-quality content. Excellent for creative work.</p>
        
        <h2>7. Reddit</h2>
        <p>Community-driven platform with diverse video content across various subreddits.</p>
        
        <h2>8. Twitch</h2>
        <p>Live streaming platform. VODs (Video on Demand) can be downloaded.</p>
        
        <h2>9. Pinterest</h2>
        <p>Visual discovery platform with video pins. Good quality downloads available.</p>
        
        <h2>10. Dailymotion</h2>
        <p>Video sharing platform with diverse content. Good alternative to YouTube.</p>
        
        <h2>Legal Considerations</h2>
        <p>Always respect copyright and platform terms of service when downloading from any platform.</p>
      `
    },
    'converting-videos-to-mp3': {
      title: "Converting Videos to MP3: A Complete Guide",
      date: "2023-12-20",
      readTime: "7 min read",
      category: "Tutorial",
      content: `
        <p>Converting videos to MP3 allows you to extract audio for music listening, podcasts, or other audio-only purposes. Here's everything you need to know.</p>
        
        <h2>Why Convert to MP3?</h2>
        <p>Common reasons for video-to-audio conversion:</p>
        <ul>
          <li>Creating music playlists from videos</li>
          <li>Extracting podcasts for offline listening</li>
          <li>Reducing file size for audio-only content</li>
          <li>Compatibility with audio players</li>
        </ul>
        
        <h2>Quality Considerations</h2>
        <p>MP3 quality is measured in bitrate:</p>
        <ul>
          <li>128kbps: Acceptable quality, small file size</li>
          <li>192kbps: Good quality, balanced size</li>
          <li>256kbps: High quality, larger file size</li>
          <li>320kbps: Maximum MP3 quality</li>
        </ul>
        
        <h2>How to Convert</h2>
        <p>Using VidGrab for MP3 conversion:</p>
        <ul>
          <li>Paste the video URL</li>
          <li>Select "Audio Only (MP3)" option</li>
          <li>Click download</li>
          <li>Save the MP3 file</li>
        </ul>
        
        <h2>Best Practices</h2>
        <ul>
          <li>Choose appropriate bitrate for your needs</li>
          <li>Organize your audio files properly</li>
          <li>Add metadata for better organization</li>
          <li>Respect copyright when converting content</li>
        </ul>
      `
    },
    'video-downloading-safety-tips': {
      title: "Video Downloading Safety Tips",
      date: "2023-12-15",
      readTime: "5 min read",
      category: "Security",
      content: `
        <p>Downloading videos from the internet can expose you to security risks if not done properly. Here are essential safety tips to protect your device and data.</p>
        
        <h2>Use Trusted Tools</h2>
        <ul>
          <li>Only use reputable download tools like VidGrab</li>
          <li>Avoid tools from unknown sources</li>
          <li>Read reviews before using new tools</li>
          <li>Check for malware and viruses regularly</li>
        </ul>
        
        <h2>Verify URLs</h2>
        <ul>
          <li>Ensure the URL is from a legitimate source</li>
          <li>Watch for suspicious or shortened URLs</li>
          <li>Check the platform's official domain</li>
          <li>Avoid clicking on suspicious links</li>
        </ul>
        
        <h2>Protect Your Device</h2>
        <ul>
          <li>Keep your antivirus software updated</li>
          <li>Use a VPN when downloading from public networks</li>
          <li>Regularly scan downloaded files</li>
          <li>Keep your operating system updated</li>
        </ul>
        
        <h2>Data Privacy</h2>
        <ul>
          <li>Don't share personal information unnecessarily</li>
          <li>Use tools that respect privacy</li>
          <li>Read privacy policies before using services</li>
          <li>Clear download history regularly</li>
        </ul>
        
        <h2>Legal Safety</h2>
        <ul>
          <li>Only download content you have permission to use</li>
          <li>Respect copyright laws</li>
          <li>Follow platform terms of service</li>
          <li>Don't redistribute downloaded content</li>
        </ul>
      `
    }
  }

  const post = blogPosts[slug]

  if (!post) {
    return (
      <div className={`legal-page ${darkMode ? 'dark' : 'light'}`}>
        <div className="legal-container">
          <h1>Post Not Found</h1>
          <p>The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="contact-link">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href
        })
      } catch (e) {
        if (e.name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      toast.error('Sharing not supported on this browser')
    }
  }

  return (
    <motion.div 
      className={`legal-page ${darkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="legal-container blog-post-container">
        <Link to="/blog" className="back-link">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <div className="blog-post-header">
          <div className="blog-category">{post.category}</div>
          <h1>{post.title}</h1>
          <div className="blog-meta">
            <span className="blog-meta-item">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="blog-meta-item">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>
          <button className="share-btn" onClick={handleShare}>
            <Share2 size={16} /> Share
          </button>
        </div>

        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="blog-post-footer">
          <Link to="/blog" className="contact-link">
            <ArrowLeft size={16} /> Read More Articles
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
