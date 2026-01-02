import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { apiClients } from '@/lib/apiClient'

interface SessionState {
  isWarning: boolean
  countdown: number
  reason: 'idle_timeout' | 'absolute_timeout' | null
}

const WARNING_TIME_MINUTES = 2
const CHECK_INTERVAL_MS = 60000 // Check every 1 minute

export function useSessionMonitor() {
  const router = useRouter()
  const [sessionState, setSessionState] = useState<SessionState>({
    isWarning: false,
    countdown: WARNING_TIME_MINUTES * 60,
    reason: null
  })

  const checkSession = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession()

      if (!session?.session) {
        // No session - redirect to login
        console.log('🚪 No session found, redirecting to login')
        router.push('/login?reason=expired')
        return
      }

      // Test API call to check if session is still valid
      const response = await apiClients.request('/api/v1/users/current', {
        method: 'GET'
      })

      if (response.ok) {
        // Session is valid, reset warning state
        setSessionState(prev => ({
          ...prev,
          isWarning: false,
          countdown: WARNING_TIME_MINUTES * 60,
          reason: null
        }))
      }
    } catch (error: any) {
      console.warn('Session check failed:', error)

      // Check if it's a timeout error
      if (error?.message?.includes('401') || error?.status === 401) {
        const reason = error?.reason || 'idle_timeout'

        if (reason === 'idle_timeout' || reason === 'absolute_timeout') {
          // Start warning countdown
          setSessionState({
            isWarning: true,
            countdown: WARNING_TIME_MINUTES * 60,
            reason: reason as 'idle_timeout' | 'absolute_timeout'
          })
        } else {
          // Other auth error - redirect immediately
          router.push('/login?reason=expired')
        }
      }
    }
  }, [router])

  // Countdown timer effect
  useEffect(() => {
    if (!sessionState.isWarning) return

    const interval = setInterval(() => {
      setSessionState(prev => {
        if (prev.countdown <= 1) {
          // Countdown reached zero - logout
          supabase.auth.signOut()
          router.push('/login?reason=expired')
          return prev
        }
        return {
          ...prev,
          countdown: prev.countdown - 1
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionState.isWarning, router])

  // Session check effect
  useEffect(() => {
    // Initial check
    checkSession()

    // Set up periodic checks
    const interval = setInterval(checkSession, CHECK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [checkSession])

  // Stay logged in function
  const stayLoggedIn = useCallback(async () => {
    try {
      await apiClients.request('/api/v1/auth/activity', {
        method: 'PATCH'
      })

      // Reset warning state
      setSessionState({
        isWarning: false,
        countdown: WARNING_TIME_MINUTES * 60,
        reason: null
      })

      console.log('✅ Stayed logged in, session refreshed')
    } catch (error) {
      console.error('Failed to stay logged in:', error)
      // If refresh fails, logout
      supabase.auth.signOut()
      router.push('/login?reason=expired')
    }
  }, [router])

  return {
    sessionState,
    stayLoggedIn
  }
}
