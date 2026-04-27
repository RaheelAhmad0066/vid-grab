import { motion } from 'framer-motion'
import { Moon, Sun, Settings } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export const TopBar = () => {
  const { darkMode, toggleDarkMode, toggleSettings } = useAppStore()

  return (
    <div className="top-bar">
      <motion.button
        className="icon-btn"
        onClick={toggleDarkMode}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Toggle theme"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>
      <motion.button
        className="icon-btn"
        onClick={toggleSettings}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Settings"
      >
        <Settings size={20} />
      </motion.button>
    </div>
  )
}
