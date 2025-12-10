'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, CheckCircle2, Loader2, Lock, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Reset() {
  const [ready, setReady] = useState(false)
  const [pwd, setPwd] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))
    const token = params.get('access_token')
    if (token) {
      setAccessToken(token)
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
        setAccessToken(session?.access_token || null)
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      setReady(true)
      if (data?.session?.access_token) {
        setAccessToken(data.session.access_token)
      }
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const submit = async () => {
    setMsg(null)
    setLoading(true)

    try {
      if (!accessToken) {
        throw new Error('No access token found. The reset link may be invalid or expired.')
      }
      
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/resetpassword`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: accessToken,
            newPassword: pwd,
          }),
        }
      )

      if (!resp.ok) {
        const errorData = await resp.json()
        throw new Error(errorData.message || 'Failed to update password.')
      }

      setSuccess(true)
    } catch (err) {
      const error = err as Error
      setMsg(error.message)
      console.error('Password reset error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pwd && accessToken && !loading) {
      submit()
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl shadow-2xl p-8"
        >
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl shadow-2xl p-8">
          <AnimatePresence mode="wait">
            {!accessToken && ready ? (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="bg-red-500/10 border border-red-500/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Link Invalid</h1>
                <p className="text-gray-400 mb-6">
                  This password reset link is invalid or has expired. Please request a new password reset.
                </p>
                <Link href="/login" passHref>
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Back to Login
                  </button>
                </Link>
              </motion.div>
            ) : success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-3"
                >
                  Password Updated Successfully!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 mb-6"
                >
                  You can now use your new password to log in.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href="/login" passHref>
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-500/20"
                    >
                      Proceed to Login
                    </button>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-full w-12 h-12 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white text-center mb-2">
                  Set New Password
                </h1>
                <p className="text-gray-400 text-center mb-6 text-sm">
                  Enter a strong password to secure your account
                </p>

                {msg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{msg}</span>
                    </p>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={submit}
                    disabled={loading || !pwd || !accessToken}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>

                <p className="text-gray-500 text-xs text-center mt-6">
                  Use at least 8 characters with a mix of letters, numbers, and symbols
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}