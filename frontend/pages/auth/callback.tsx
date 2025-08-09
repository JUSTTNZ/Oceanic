'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({}) 
        })
      }
      router.replace('/markets') // or admin redirect after fetching /api/profile/me to check role
    })()
  }, [router])

  return null
}
