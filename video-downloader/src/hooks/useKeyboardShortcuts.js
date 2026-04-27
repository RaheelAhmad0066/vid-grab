import { useEffect } from 'react'

export const useKeyboardShortcuts = (handlers) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      const { onPaste, onAnalyze, onReset, canAnalyze } = handlers

      // Ctrl/Cmd + V to paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        onPaste?.()
      }

      // Ctrl/Cmd + Enter to analyze
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canAnalyze) {
        e.preventDefault()
        onAnalyze?.()
      }

      // Escape to reset
      if (e.key === 'Escape') {
        onReset?.()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handlers])
}
