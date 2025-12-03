"use client"
import Link from 'next/link'
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Lock } from "lucide-react"

export default function ResetPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setMessage(null)

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email address." })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setMessage({ type: "error", text: "Please enter a valid email address." })
      return
    }

    try {
      setLoading(true)

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/recover`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      )

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ message: `HTTP error! status: ${resp.status}` }))
        throw new Error(errorData.message || `HTTP error! status: ${resp.status}`)
      }

      setSubmitted(true)
      setMessage({
        type: "success",
        text: "If this email exists, a reset link has been sent.",
      })
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to send reset email. Please try again."
      setMessage({ type: "error", text: msg })
      console.error("Recover error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && email && !loading) {
      handleSubmit()
    }
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
            {submitted ? (
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
                  Check Your Email
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 mb-6"
                >
                  If an account exists for <span className="text-blue-400 font-medium">{email}</span>, you&apos;ll receive a password reset link shortly.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <Link href="/login" passHref>
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-500/20"
                    >
                      Back to Login
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setMessage(null)
                      setEmail("")
                    }}
                    className="w-full bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-600"
                  >
                    Try Another Email
                  </button>
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
                  Forgot Password?
                </h1>
                <p className="text-gray-400 text-center mb-6 text-sm">
                  Enter your email and we&apos;ll send you a link to reset your password
                </p>

                {message && message.type === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{message.text}</span>
                    </p>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                    <Link href="/login" passHref>
                      <button
                        type="button"
                        disabled={loading}
                        className="flex-1 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Cancel
                      </button>
                    </Link>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !email}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send Reset Link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}