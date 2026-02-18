import { useEffect, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { apiClients } from '@/lib/apiClient'

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

export function useActivityTracker() {
  const router = useRouter()
  const lastActivityRef = useRef<number>(Date.now())
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check auth state on mount and listen for changes
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setIsAuthenticated(!!data?.session)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const updateActivity = useCallback(async () => {
    // Skip if not authenticated or on a public route
    if (!isAuthenticated || isPublicRoute(router.pathname)) return

    try {
      const now = Date.now()
      if (now - lastActivityRef.current < 60000) return

      await apiClients.request('/api/v1/auth/activity', {
        method: 'PATCH',
      })

      lastActivityRef.current = now
    } catch (error) {
      console.warn('Failed to update activity:', error)
    }
  }, [isAuthenticated, router.pathname])

  const debouncedUpdate = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    updateTimeoutRef.current = setTimeout(() => {
      updateActivity()
    }, 1000)
  }, [updateActivity])

  useEffect(() => {
    // Don't attach listeners if not authenticated or on public route
    if (!isAuthenticated || isPublicRoute(router.pathname)) return

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

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Initial activity update
    updateActivity()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [debouncedUpdate, updateActivity, isAuthenticated, router.pathname])

  return { updateActivity }
}
