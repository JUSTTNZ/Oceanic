import { useEffect, useState } from 'react'

export interface NetworkStatus {
  isOnline: boolean
  lastMessage: string
  showMessage: boolean
}

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastMessage: '',
    showMessage: false,
  })

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: true,
        lastMessage: 'Welcome back online!',
        showMessage: true,
      }))

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          showMessage: false,
        }))
      }, 3000)

      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        lastMessage: 'No internet connection',
        showMessage: true,
      }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return status
}
