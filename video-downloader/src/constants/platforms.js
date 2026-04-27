// Platform icons
import youtubeIcon from '../assets/youtube.png'
import facebookIcon from '../assets/facebook.png'
import instagramIcon from '../assets/instagram.png'
import twitterIcon from '../assets/twitter.png'
import tiktokIcon from '../assets/tik-tok.png'
import vimeoIcon from '../assets/vimeo.png'
import redditIcon from '../assets/redlit.png'
import twitchIcon from '../assets/twitch.png'
import pinterestIcon from '../assets/pintrest.png'
import dailymotionIcon from '../assets/daily-motion.png'

export const PLATFORMS = [
  { name: 'YouTube',     pattern: /youtube\.com|youtu\.be/i,      color: '#FF0000', icon: youtubeIcon },
  { name: 'Facebook',    pattern: /facebook\.com|fb\.watch/i,      color: '#1877F2', icon: facebookIcon },
  { name: 'Instagram',   pattern: /instagram\.com/i,               color: '#E1306C', icon: instagramIcon },
  { name: 'Twitter / X', pattern: /twitter\.com|x\.com/i,          color: '#1DA1F2', icon: twitterIcon },
  { name: 'TikTok',      pattern: /tiktok\.com/i,                  color: '#ff0050', icon: tiktokIcon },
  { name: 'Vimeo',       pattern: /vimeo\.com/i,                   color: '#1AB7EA', icon: vimeoIcon },
  { name: 'Reddit',      pattern: /reddit\.com/i,                  color: '#FF4500', icon: redditIcon },
  { name: 'Dailymotion', pattern: /dailymotion\.com/i,             color: '#0066DC', icon: dailymotionIcon },
  { name: 'Twitch',      pattern: /twitch\.tv/i,                   color: '#9146FF', icon: twitchIcon },
  { name: 'Pinterest',   pattern: /pinterest\.com/i,               color: '#E60023', icon: pinterestIcon },
]

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api'

export const DOWNLOAD_STATUS = {
  IDLE: 'idle',
  ANALYZING: 'analyzing',
  READY: 'ready',
  DOWNLOADING: 'downloading',
  DONE: 'done',
  ERROR: 'error',
}

export const STORAGE_KEYS = {
  HISTORY: 'vidgrab-history',
  THEME: 'vidgrab-theme',
}
