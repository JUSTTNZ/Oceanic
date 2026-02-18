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

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/resetpassword',
  '/auth/callback',
  '/auth/reset',
  '/Landing',
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )
}

export function useSessionMonitor() {
  const router = useRouter()
  const [sessionState, setSessionState] = useState<SessionState>({
    isWarning: false,
    countdown: WARNING_TIME_MINUTES * 60,
    reason: null
  })

  const checkSession = useCallback(async () => {
    // Skip session checks on public routes
    if (isPublicRoute(router.pathname)) return

    try {
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData?.session) {
        // No session on a protected route - redirect to login
        console.log('No session found, redirecting to login')
        router.push('/login?reason=expired')
        return
      }

      // Test API call to check if backend session is still valid
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

      if (error?.message?.includes('401') || error?.status === 401) {
        const reason = error?.reason || 'idle_timeout'

        if (reason === 'idle_timeout' || reason === 'absolute_timeout') {
          setSessionState({
            isWarning: true,
            countdown: WARNING_TIME_MINUTES * 60,
            reason: reason as 'idle_timeout' | 'absolute_timeout'
          })
        } else {
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

  // Session check effect - only on protected routes
  useEffect(() => {
    if (isPublicRoute(router.pathname)) return

    checkSession()

    const interval = setInterval(checkSession, CHECK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [checkSession, router.pathname])

  // Stay logged in function
  const stayLoggedIn = useCallback(async () => {
    try {
      await apiClients.request('/api/v1/auth/activity', {
        method: 'PATCH'
      })

      setSessionState({
        isWarning: false,
        countdown: WARNING_TIME_MINUTES * 60,
        reason: null
      })

      console.log('Session refreshed successfully')
    } catch (error) {
      console.error('Failed to stay logged in:', error)
      supabase.auth.signOut()
      router.push('/login?reason=expired')
    }
  }, [router])

  return {
    sessionState,
    stayLoggedIn
  }
}
