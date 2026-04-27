import { useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { apiService } from '../services/api'
import { isValidUrl } from '../utils/validators'
import { detectPlatform } from '../utils/platform'
import { DOWNLOAD_STATUS } from '../constants/platforms'
import toast from 'react-hot-toast'

export const useVideoDownload = () => {
  const pollRef = useRef(null)
  
  const {
    url,
    selectedFormat,
    videoInfo,
    platform,
    setStatus,
    setPlatform,
    setVideoInfo,
    setError,
    clearError,
    setProgress,
    setJobId,
    addToHistory,
    reset,
  } = useAppStore()

  const analyzeVideo = async () => {
    const trimmed = url.trim()
    
    if (!trimmed) return
    
    if (!isValidUrl(trimmed)) {
      setError('Please enter a valid URL')
      toast.error('Please enter a valid URL')
      return
    }

    setStatus(DOWNLOAD_STATUS.ANALYZING)
    clearError()
    setVideoInfo(null)
    setPlatform(detectPlatform(trimmed))
    toast.loading('Analyzing video...', { id: 'analyze' })

    try {
      const data = await apiService.fetchVideoInfo(trimmed)
      setVideoInfo(data)
      setStatus(DOWNLOAD_STATUS.READY)
      toast.success('Video info loaded!', { id: 'analyze' })
    } catch (error) {
      setError(error.message)
      toast.error(error.message, { id: 'analyze' })
    }
  }

  const downloadVideo = async () => {
    if (!selectedFormat) return

    setStatus(DOWNLOAD_STATUS.DOWNLOADING)
    setProgress(0, '', '')
    const isAudio = selectedFormat.label?.includes('Audio')

    try {
      const data = await apiService.startDownload(
        url.trim(),
        selectedFormat.format_id,
        isAudio
      )

      const jobId = data.job_id
      setJobId(jobId)

      // Poll for progress
      pollRef.current = setInterval(async () => {
        try {
          const progressData = await apiService.getProgress(jobId)
          
          setProgress(
            progressData.percent || 0,
            progressData.speed || '',
            progressData.eta || ''
          )

          if (progressData.status === 'finished') {
            clearInterval(pollRef.current)
            setProgress(100, '', '')
            setStatus(DOWNLOAD_STATUS.DONE)
            
            addToHistory({
              id: Date.now(),
              title: videoInfo.title,
              platform: platform?.name || 'Unknown',
              quality: selectedFormat.label,
              color: platform?.color || '#888',
              icon: platform?.icon || '',
              time: new Date().toLocaleTimeString(),
              jobId,
              isAudio,
            })
            
            toast.success('Download complete!')
          } else if (progressData.status === 'error') {
            clearInterval(pollRef.current)
            setError(progressData.error || 'Download failed')
            toast.error(progressData.error || 'Download failed')
          }
        } catch (error) {
          clearInterval(pollRef.current)
          setError('Lost connection to backend')
          toast.error('Lost connection to backend')
        }
      }, 600)
    } catch (error) {
      setError(error.message)
      toast.error(error.message)
    }
  }

  const saveFile = (jobId) => {
    window.open(apiService.getFileUrl(jobId), '_blank')
  }

  const resetDownload = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
    }
    reset()
  }

  return {
    analyzeVideo,
    downloadVideo,
    saveFile,
    resetDownload,
  }
}
