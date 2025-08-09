'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Reset() {
  const [ready, setReady] = useState(false)
  const [pwd, setPwd] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    supabase.auth.getSession().then(() => setReady(true))
    return () => sub.subscription.unsubscribe()
  }, [])

  const submit = async () => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: pwd })
    setLoading(false)
    setMsg(error ? error.message : 'Password updated. You can sign in now.')
  }

  if (!ready) return null
  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-xl font-semibold mb-4">Set a new password</h1>
      <input className="border rounded w-full p-2 mb-3" type="password"
             placeholder="New password" value={pwd} onChange={(e)=>setPwd(e.target.value)} />
      <button disabled={loading || !pwd} onClick={submit} className="w-full border p-2 rounded">
        {loading ? 'Updating…' : 'Update password'}
      </button>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  )
}
