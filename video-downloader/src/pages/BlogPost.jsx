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
        <p>There are several legitimate reasons to download videos for offline use. In an era where data costs can be high and internet connectivity is not always guaranteed—especially during travel or in remote areas—having your favorite content saved locally is a game-changer.</p>
        <p>Key benefits include:</p>
        <ul>
          <li><strong>Continuous Viewing:</strong> Watch during flights, commutes, or in areas with poor cellular reception without buffering.</li>
          <li><strong>Personal Backups:</strong> Ensure you have a copy of educational content or personal memories even if the original video is removed from the platform.</li>
          <li><strong>Educational Efficiency:</strong> Students and researchers can review lectures and tutorials multiple times without consuming additional data.</li>
          <li><strong>Archiving:</strong> Preserve important cultural or historical content for future reference.</li>
        </ul>
        
        <h2>Legal & Ethical Considerations</h2>
        <p>Before you hit that download button, it's vital to consider the legal framework surrounding digital content. At Vidoon, we advocate for responsible and legal use of our tool.</p>
        <ul>
          <li><strong>Copyright Compliance:</strong> Always respect the intellectual property rights of creators. If a video is copyrighted, you generally need permission for anything beyond personal viewing.</li>
          <li><strong>Terms of Service:</strong> Platforms like YouTube have their own rules. Be aware that downloading content might technically violate their service agreements.</li>
          <li><strong>Non-Commercial Use:</strong> Never use downloaded content for commercial gain or redistribution without express permission.</li>
        </ul>
        
        <h2>Vidoon's Best Practices</h2>
        <p>To get the most out of our downloader, we recommend the following workflow:</p>
        <ul>
          <li><strong>Select Optimal Quality:</strong> If you're on a mobile device, 720p is often perfect. For big screens, go for 1080p or 4K.</li>
          <li><strong>Organize Your Library:</strong> Rename your files immediately after download to keep your collection searchable.</li>
          <li><strong>Security First:</strong> Always use a trusted tool like Vidoon to avoid malware often found on less reputable "free downloader" sites.</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Downloading videos is a powerful way to take control of your digital media consumption. By following these guides and respecting content creators, you can build a valuable library of content that is available to you whenever you need it, regardless of your internet connection status.</p>
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
        <p>Copyright is a legal right that grants the creator of original work exclusive rights to its use and distribution. This includes videos, music, images, and other creative content. When you watch a video on a platform, the creator typically retains the copyright, and the platform has a license to display it.</p>
        
        <h2>The Fair Use Doctrine Explained</h2>
        <p>The fair use doctrine is a crucial legal principle that allows limited use of copyrighted material without requiring permission from the rights holders. However, it's often misunderstood. Whether a use is "fair" depends on four factors:</p>
        <ul>
          <li><strong>Purpose of Use:</strong> Is it for nonprofit educational purposes or commercial?</li>
          <li><strong>Nature of the Work:</strong> Is the original work factual or highly creative?</li>
          <li><strong>Amount Used:</strong> How much of the total work was taken?</li>
          <li><strong>Effect on Market:</strong> Does your use hurt the creator's ability to profit from their work?</li>
        </ul>
        
        <h2>Downloading for Personal Use</h2>
        <p>In many jurisdictions, downloading a video for "time-shifting" (watching it later at a more convenient time) is considered a form of personal use. However, you should always be careful:</p>
        <ul>
          <li><strong>Legal Access:</strong> You should only download content that you have a legal right to view in the first place.</li>
          <li><strong>Private Viewing:</strong> The download must be kept for private use. Public screenings of downloaded copyrighted content are generally illegal.</li>
          <li><strong>No Circumvention:</strong> Avoid breaking encryption or digital locks (DRM) to download content.</li>
        </ul>
        
        <h2>Best Practices for Legal Safety</h2>
        <p>To ensure you stay on the right side of the law while using tools like Vidoon, we recommend:</p>
        <ol>
          <li>Always check the specific license of the video (e.g., Creative Commons vs. All Rights Reserved).</li>
          <li>Prioritize downloading your own content or public domain videos.</li>
          <li>Use the content only for the purposes you intended (e.g., studying or offline entertainment).</li>
          <li>Support your favorite creators by watching their videos on official platforms whenever possible.</li>
        </ol>
      `
    },
    'best-video-quality-options': {
      title: "Best Video Quality Options for Different Devices",
      date: "2024-01-05",
      readTime: "4 min read",
      category: "Tips",
      content: `
        <h2>Understanding Video Resolution</h2>
        <p>Video resolution refers to the number of pixels displayed on a screen. The higher the pixel count, the sharper and more detailed the image will appear. However, higher resolution also means significantly larger file sizes, which is an important factor when downloading content for mobile devices.</p>
        <ul>
          <li><strong>360p & 480p (SD):</strong> Best for small screens or when you have very limited storage space. These look "fuzzy" on modern monitors but are perfectly watchable on older smartphones.</li>
          <li><strong>720p (HD):</strong> The "sweet spot" for many. It offers a clear picture on tablets and laptops without the massive file size of 1080p.</li>
          <li><strong>1080p (Full HD):</strong> The standard for most modern content. It looks great on almost any screen, including large TVs.</li>
          <li><strong>4K (Ultra HD):</strong> Offers incredible detail but requires a 4K-capable screen and significant storage space (often 5-10 times larger than 1080p).</li>
        </ul>
        
        <h2>How to Choose Based on Your Device</h2>
        <p>When using Vidoon, you'll often see multiple quality options. Here's our recommended selection guide:</p>
        <h3>Mobile Phones</h3>
        <p>On a standard 6-inch smartphone screen, the human eye struggle to see the difference between 720p and 1080p. To save battery and space, <strong>720p</strong> is usually the best choice. If you're planning to watch on a plane, downloading a dozen 720p videos is much more efficient than three 4K ones.</p>
        <h3>Tablets & Laptops</h3>
        <p>For screens between 10 and 15 inches, <strong>1080p</strong> is the ideal choice. It ensures that the image remains crisp even when you're sitting close to the screen.</p>
        <h3>Large TV Screens</h3>
        <p>If you're downloading a video to cast to your 55-inch living room TV, go for the highest quality available—<strong>4K or 1440p</strong>. The larger the screen, the more visible the compression artifacts of lower resolutions become.</p>
        
        <h2>Summary Table</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
          <thead>
            <tr style="border-bottom: 1px solid #ccc;">
              <th style="padding: 10px; text-align: left;">Resolution</th>
              <th style="padding: 10px; text-align: left;">Recommended For</th>
              <th style="padding: 10px; text-align: left;">Approx. File Size (10 min)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px;">480p</td>
              <td style="padding: 10px;">Small Phones / Limited Space</td>
              <td style="padding: 10px;">50 MB</td>
            </tr>
            <tr>
              <td style="padding: 10px;">720p</td>
              <td style="padding: 10px;">Standard Mobile / Tablets</td>
              <td style="padding: 10px;">150 MB</td>
            </tr>
            <tr>
              <td style="padding: 10px;">1080p</td>
              <td style="padding: 10px;">Laptops / Large Monitors</td>
              <td style="padding: 10px;">350 MB</td>
            </tr>
            <tr>
              <td style="padding: 10px;">4K</td>
              <td style="padding: 10px;">Big Screen TVs</td>
              <td style="padding: 10px;">1.5 GB</td>
            </tr>
          </tbody>
        </table>
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
        <p>Using Vidoon for MP3 conversion:</p>
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
          <li>Only use reputable download tools like Vidoon</li>
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
