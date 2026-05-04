import { useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { apiService } from '../services/api'
import { isValidUrl } from '../utils/validators'
import { detectPlatform } from '../utils/platform'
import toast from 'react-hot-toast'

export const useBatchDownload = () => {
  const pollRefs = useRef({})

  const processItem = async (item) => {
    const { id, url } = item
    const { updateBatchItem, addToHistory } = useAppStore.getState()

    if (!isValidUrl(url)) {
      updateBatchItem(id, { status: 'error', error: 'Invalid URL' })
      return
    }

    updateBatchItem(id, { status: 'analyzing' })

    try {
      const data = await apiService.fetchVideoInfo(url)
      const format = data.formats?.[0]

      if (!format) {
        updateBatchItem(id, { status: 'error', error: 'No formats found' })
        return
      }

      updateBatchItem(id, { status: 'downloading', title: data.title, progress: 0 })

      const isAudio = format.label?.includes('Audio')
      const dlData = await apiService.startDownload(url, format.format_id, isAudio)
      const jobId = dlData.job_id
      updateBatchItem(id, { jobId })

      await new Promise((resolve, reject) => {
        pollRefs.current[id] = setInterval(async () => {
          try {
            const p = await apiService.getProgress(jobId)
            updateBatchItem(id, { progress: p.percent || 0 })

            if (p.status === 'finished') {
              clearInterval(pollRefs.current[id])
              updateBatchItem(id, { status: 'done', progress: 100 })
              const platform = detectPlatform(url)
              addToHistory({
                id: Date.now(),
                title: data.title,
                platform: platform?.name || 'Unknown',
                quality: format.label,
                color: platform?.color || '#888',
                icon: platform?.icon || '',
                time: new Date().toLocaleTimeString(),
                jobId,
                isAudio,
              })
              resolve()
            } else if (p.status === 'error') {
              clearInterval(pollRefs.current[id])
              updateBatchItem(id, { status: 'error', error: p.error || 'Download failed' })
              reject(new Error(p.error))
            }
          } catch (e) {
            clearInterval(pollRefs.current[id])
            updateBatchItem(id, { status: 'error', error: 'Connection lost' })
            reject(e)
          }
        }, 800)
      })
    } catch (err) {
      updateBatchItem(id, { status: 'error', error: err.message })
    }
  }

  const startBatch = async () => {
    const pending = useAppStore.getState().batchQueue.filter(i => i.status === 'idle' || i.status === 'error')

    if (!pending.length) {
      toast.error('No URLs in queue to process')
      return
    }

    toast.success(`Processing ${pending.length} URL${pending.length > 1 ? 's' : ''}…`)

    for (const item of pending) {
      await processItem({ ...item, url: item.url })
    }

    toast.success('Batch complete!')
  }

  const saveItem = (jobId) => {
    window.open(apiService.getFileUrl(jobId), '_blank')
  }

  return { startBatch, saveItem }
}
