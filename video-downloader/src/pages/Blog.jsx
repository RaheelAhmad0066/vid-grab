import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export const Blog = () => {
  const { darkMode } = useAppStore()

  const blogPosts = [
    {
      id: 1,
      title: "How to Download YouTube Videos for Offline Viewing",
      excerpt: "Learn the best practices for downloading YouTube videos to watch offline without violating terms of service.",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Tutorial",
      slug: "how-to-download-youtube-videos"
    },
    {
      id: 2,
      title: "Understanding Copyright Laws for Video Downloads",
      excerpt: "A comprehensive guide to copyright laws and what you need to know before downloading videos from the internet.",
      date: "2024-01-10",
      readTime: "8 min read",
      category: "Legal",
      slug: "understanding-copyright-laws"
    },
    {
      id: 3,
      title: "Best Video Quality Options for Different Devices",
      excerpt: "Discover which video quality settings work best for smartphones, tablets, and desktop computers.",
      date: "2024-01-05",
      readTime: "4 min read",
      category: "Tips",
      slug: "best-video-quality-options"
    },
    {
      id: 4,
      title: "Top 10 Video Platforms You Can Download From",
      excerpt: "Explore the most popular video platforms and how to download content from each one legally.",
      date: "2023-12-28",
      readTime: "6 min read",
      category: "Guide",
      slug: "top-10-video-platforms"
    },
    {
      id: 5,
      title: "Converting Videos to MP3: A Complete Guide",
      excerpt: "Learn how to extract audio from videos and convert them to MP3 format for music listening.",
      date: "2023-12-20",
      readTime: "7 min read",
      category: "Tutorial",
      slug: "converting-videos-to-mp3"
    },
    {
      id: 6,
      title: "Video Downloading Safety Tips",
      excerpt: "Essential safety tips to keep your device secure while downloading videos from the internet.",
      date: "2023-12-15",
      readTime: "5 min read",
      category: "Security",
      slug: "video-downloading-safety-tips"
    }
  ]

  return (
    <motion.div 
      className={`legal-page ${darkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="legal-container blog-container">
        <h1>Blog</h1>
        <p className="blog-intro">
          Tips, tutorials, and guides about video downloading and digital content management.
        </p>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="blog-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="blog-category">{post.category}</div>
              <h2 className="blog-title">{post.title}</h2>
              <p className="blog-excerpt">{post.excerpt}</p>
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
              <Link to={`/blog/${post.slug}`} className="blog-read-more">
                Read More <ArrowRight size={16} />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
