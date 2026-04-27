import { motion } from 'framer-motion'
import { PLATFORMS } from '../constants/platforms'

export const PlatformBadges = ({ detectedPlatform }) => {
  return (
    <motion.div 
      className="platforms-strip"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {PLATFORMS.map((p, index) => (
        <motion.span
          key={p.name}
          className={`platform-badge ${detectedPlatform?.name === p.name ? 'active' : ''}`}
          style={{ '--p-color': p.color }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="platform-icon">
            {typeof p.icon === 'string' ? (
              <img src={p.icon} alt={p.name} style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            ) : (
              p.icon
            )}
          </span>
          <span className="platform-name">{p.name}</span>
        </motion.span>
      ))}
    </motion.div>
  )
}
