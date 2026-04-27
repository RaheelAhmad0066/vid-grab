import { API_BASE_URL } from '../constants/platforms'

class ApiService {
  async fetchVideoInfo(url) {
    const response = await fetch(`${API_BASE_URL}/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    
    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.error || 'Could not fetch video info')
    }
    
    return data
  }

  async startDownload(url, formatId, isAudio) {
    const response = await fetch(`${API_BASE_URL}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        format_id: formatId,
        is_audio: isAudio,
      }),
    })
    
    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.error || 'Download failed')
    }
    
    return data
  }

  async getProgress(jobId) {
    const response = await fetch(`${API_BASE_URL}/progress/${jobId}`)
    return response.json()
  }

  getFileUrl(jobId) {
    return `${API_BASE_URL}/file/${jobId}`
  }
}

export const apiService = new ApiService()
