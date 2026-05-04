import { create } from 'zustand'
import { DOWNLOAD_STATUS, STORAGE_KEYS } from '../constants/platforms'

export const useAppStore = create((set, get) => ({
  // UI State
  darkMode: true,
  showSettings: false,

  // Download State
  url: '',
  status: DOWNLOAD_STATUS.IDLE,
  platform: null,
  videoInfo: null,
  selectedFormat: null,
  progress: 0,
  speed: '',
  eta: '',
  jobId: null,
  errorMsg: '',

  // Settings
  autoDownload: false,

  // Batch Queue
  batchQueue: [],

  // History
  history: [],
  
  // Actions
  setUrl: (url) => set({ url }),

  toggleAutoDownload: () => {
    const newVal = !get().autoDownload
    set({ autoDownload: newVal })
    localStorage.setItem('vidrivo-auto-download', newVal ? 'true' : 'false')
  },

  // Batch actions
  addToBatch: (urls) => {
    const items = urls.map(url => ({ id: Date.now() + Math.random(), url: url.trim(), status: 'idle', progress: 0, title: '', error: '', jobId: null }))
    set({ batchQueue: [...get().batchQueue, ...items] })
  },
  removeFromBatch: (id) => set({ batchQueue: get().batchQueue.filter(i => i.id !== id) }),
  clearBatch: () => set({ batchQueue: [] }),
  updateBatchItem: (id, updates) => set({
    batchQueue: get().batchQueue.map(i => i.id === id ? { ...i, ...updates } : i),
  }),
  
  setStatus: (status) => set({ status }),
  
  setPlatform: (platform) => set({ platform }),
  
  setVideoInfo: (videoInfo) => set({ 
    videoInfo,
    selectedFormat: videoInfo?.formats?.[0] || null 
  }),
  
  setSelectedFormat: (format) => set({ selectedFormat: format }),
  
  setProgress: (progress, speed = '', eta = '') => set({ progress, speed, eta }),
  
  setJobId: (jobId) => set({ jobId }),
  
  setError: (errorMsg) => set({ errorMsg, status: DOWNLOAD_STATUS.ERROR }),
  
  clearError: () => set({ errorMsg: '' }),
  
  toggleDarkMode: () => {
    const newMode = !get().darkMode
    set({ darkMode: newMode })
    localStorage.setItem(STORAGE_KEYS.THEME, newMode ? 'dark' : 'light')
  },
  
  toggleSettings: () => set({ showSettings: !get().showSettings }),
  
  addToHistory: (item) => {
    const history = [item, ...get().history.slice(0, 9)]
    set({ history })
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
  },
  
  removeFromHistory: (id) => {
    const history = get().history.filter(item => item.id !== id)
    set({ history })
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
  },
  
  clearHistory: () => {
    set({ history: [] })
    localStorage.removeItem(STORAGE_KEYS.HISTORY)
  },
  
  loadHistory: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY)
    if (saved) {
      try { set({ history: JSON.parse(saved) }) } catch (e) { console.error('Failed to load history', e) }
    }
    const auto = localStorage.getItem('vidrivo-auto-download')
    if (auto !== null) set({ autoDownload: auto === 'true' })
  },
  
  loadTheme: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME)
    if (saved) {
      set({ darkMode: saved === 'dark' })
    }
  },
  
  reset: () => set({
    url: '',
    status: DOWNLOAD_STATUS.IDLE,
    videoInfo: null,
    platform: null,
    progress: 0,
    errorMsg: '',
    jobId: null,
    speed: '',
    eta: '',
  }),
}))
