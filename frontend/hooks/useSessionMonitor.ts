import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

const CHECK_INTERVAL_MS = 60000 // Check every 1 minute

// Pages that don't require authentication
const PUBLIC_ROUTES = [
  '/login', '/auth/reset', '/signup', '/register', '/forgot-password',
  '/Landing',
  // Landing page nav links
  '/trades', '/resources', '/company'
]

// Exact paths that are public (don't use startsWith for these)
const PUBLIC_EXACT = ['/']

function isPublicPage() {
  // Use window.location directly — router.pathname can be stale during transitions
  if (typeof window === 'undefined') return false
  const path = window.location.pathname
  return PUBLIC_EXACT.includes(path) || PUBLIC_ROUTES.some(route => path.startsWith(route))
}

export function useSessionMonitor() {
  const router = useRouter()
  const [sessionState, setSessionState] = useState({
    isWarning: false,
    countdown: 0,
    reason: null as string | null
  })
  const authReady = useRef(false)
  const redirecting = useRef(false)
  // Track whether user was ever signed in during this browser session
  const wasSignedIn = useRef(false)

  const redirectToLogin = useCallback((reason?: string) => {
    if (redirecting.current || isPublicPage()) return
    redirecting.current = true
    const query = reason ? `?reason=${reason}` : ''
    router.push(`/login${query}`)
  }, [router])

  const checkSession = useCallback(async () => {
    if (isPublicPage()) return
    if (!authReady.current) return

    try {
      const { data } = await supabase.auth.getSession()

      if (!data?.session) {
        // Only say "expired" if the user was previously signed in
        redirectToLogin(wasSignedIn.current ? 'expired' : undefined)
        return
      }

      wasSignedIn.current = true
      setSessionState({ isWarning: false, countdown: 0, reason: null })
    } catch (error) {
      console.warn('Session check failed:', error)
    }
  }, [redirectToLogin])

  // Listen for Supabase auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        authReady.current = true
        redirecting.current = false
        if (session) wasSignedIn.current = true
      }

      if (event === 'SIGNED_OUT' && !isPublicPage()) {
        redirectToLogin('expired')
      }
    })
    return () => subscription.unsubscribe()
  }, [redirectToLogin])

  // Reset redirect guard when route changes (e.g. user logs in again)
  useEffect(() => {
    redirecting.current = false
  }, [router.pathname])

  useEffect(() => {
    if (isPublicPage()) return

    // Give Supabase time to fire INITIAL_SESSION before first poll
    const initialDelay = setTimeout(checkSession, 2000)
    const interval = setInterval(checkSession, CHECK_INTERVAL_MS)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [checkSession, router.pathname])

  const stayLoggedIn = useCallback(async () => {
    setSessionState({ isWarning: false, countdown: 0, reason: null })
  }, [])

  return {
    sessionState,
    stayLoggedIn
  }
}
