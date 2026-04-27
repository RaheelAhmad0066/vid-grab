import { useState } from 'react'
import toast from 'react-hot-toast'

export const useClipboard = () => {
  const [pasteHint, setPasteHint] = useState(false)

  const pasteFromClipboard = async (onPaste) => {
    try {
      const text = await navigator.clipboard.readText()
      onPaste(text)
      setPasteHint(true)
      toast.success('URL pasted!')
      setTimeout(() => setPasteHint(false), 2000)
    } catch {
      toast.error('Failed to paste from clipboard')
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  const shareContent = async (title, text, url) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        toast.success('Shared successfully!')
      } catch (e) {
        if (e.name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      await copyToClipboard(url)
    }
  }

  return {
    pasteHint,
    pasteFromClipboard,
    copyToClipboard,
    shareContent,
  }
}
