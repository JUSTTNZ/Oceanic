import { useEffect, useCallback, useRef } from 'react'
import { apiClients } from '@/lib/apiClient'

export function useActivityTracker() {
  const lastActivityRef = useRef<number>(Date.now())
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const updateActivity = useCallback(async () => {
    try {
      // Only update if it's been more than 1 minute since last update
      const now = Date.now()
      if (now - lastActivityRef.current < 60000) return

      await apiClients.request('/api/v1/auth/activity', {
        method: 'PATCH',
      })

      lastActivityRef.current = now
      console.log('🔄 Activity updated on backend')
    } catch (error) {
      console.warn('Failed to update activity:', error)
      // Don't throw - activity updates are not critical
    }
  }, [])

  const debouncedUpdate = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    updateTimeoutRef.current = setTimeout(() => {
      updateActivity()
    }, 1000) // Debounce for 1 second
  }, [updateActivity])

  useEffect(() => {
    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    const handleActivity = () => {
      debouncedUpdate()
    }

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Initial activity update
    updateActivity()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [debouncedUpdate, updateActivity])

  return { updateActivity }
}
