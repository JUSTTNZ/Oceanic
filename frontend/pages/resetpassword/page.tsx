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
    <div className="flex h-screen bg-[#040d21] overflow-hidden">
      {/* ===== LEFT PANEL — Desktop branding side ===== */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0047AB]/30 via-[#040d21] to-[#0047AB]/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#0047AB]/15 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#1e6fdb]/10 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-[#0047AB]/12 blur-[100px]" />

        <div className="absolute inset-0 opacity-[0.03] login-grid-pattern" />

        {/* Floating coins — realistic 3D style */}
        <div className="absolute top-[12%] left-[15%] animate-float-slow opacity-70">
          <div className="w-20 h-20 rounded-full shadow-2xl shadow-[#f7931a]/30 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f9a825] via-[#f7931a] to-[#c67610]" />
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-b from-[#fbc02d] via-[#f7931a] to-[#e28a17] border border-[#fdd835]/30" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M21.4 13.3c.3-2.1-1.3-3.2-3.4-3.9l.7-2.8-1.7-.4-.7 2.7c-.4-.1-.9-.2-1.4-.3l.7-2.8-1.7-.4-.7 2.8c-.4-.1-.7-.2-1-.2l-2.3-.6-.5 1.8s1.3.3 1.2.3c.7.2.8.6.8 1l-.8 3.2c0 0 .1 0 .2.1h-.2l-1.1 4.5c-.1.2-.3.5-.7.4 0 0-1.2-.3-1.2-.3l-.8 1.9 2.2.5c.4.1.8.2 1.2.3l-.7 2.9 1.7.4.7-2.8c.5.1.9.2 1.4.3l-.7 2.8 1.7.4.7-2.8c3 .6 5.2.3 6.1-2.4.8-2.1 0-3.3-1.6-4.1 1.1-.3 2-1.1 2.2-2.7zm-3.9 5.5c-.6 2.2-4.3 1-5.5.7l1-4c1.2.3 5.1.9 4.5 3.3zm.6-5.5c-.5 2-3.6.9-4.6.7l.9-3.6c1 .3 4.3.7 3.7 2.9z" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="absolute top-[28%] right-[18%] animate-float-medium opacity-60">
          <div className="w-[72px] h-[72px] rounded-full shadow-2xl shadow-[#627eea]/30 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#8c9eff] via-[#627eea] to-[#3d51c5]" />
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-b from-[#7986cb] via-[#627eea] to-[#4a5bc7] border border-[#9fa8da]/30" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="24" height="38" viewBox="0 0 24 38" fill="none">
                <path d="M12 0L4.5 19.2 12 23.4l7.5-4.2L12 0z" fill="white" fillOpacity="0.9"/>
                <path d="M4.5 19.2L12 26l7.5-6.8L12 23.4 4.5 19.2z" fill="white" fillOpacity="0.7"/>
                <path d="M12 28l-7.5-6.8L12 38l7.5-16.8L12 28z" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[22%] left-[22%] animate-float-fast opacity-50">
          <div className="w-14 h-14 rounded-full shadow-xl shadow-[#26a17b]/25 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#4dcfa0] via-[#26a17b] to-[#1a7a5a]" />
            <div className="absolute inset-[2px] rounded-full bg-gradient-to-b from-[#33c48b] via-[#26a17b] to-[#1e8c6a] border border-[#66d9a8]/20" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/15 via-transparent to-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg drop-shadow-md">₮</span>
            </div>
          </div>
        </div>

        {/* Center branding */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Oceanic
          </h1>
          <p className="text-[#7eb8ff] text-lg leading-relaxed mb-8">
            Secure account recovery — we&apos;ve got you covered.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[#5a9bdb]/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Secure</span>
            </div>
            <div className="w-px h-4 bg-[#1e3a5f]" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fast</span>
            </div>
            <div className="w-px h-4 bg-[#1e3a5f]" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Reliable</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Reset form ===== */}
      <div className="flex-1 flex items-center justify-center relative p-4 lg:p-8">
        {/* Mobile-only coin background */}
        <div className="lg:hidden absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0047AB]/20 via-[#040d21] to-[#040d21]" />
          <div className="absolute top-[8%] left-[8%] animate-float-slow opacity-20">
            <div className="w-24 h-24 rounded-full relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f9a825] via-[#f7931a] to-[#c67610]" />
              <div className="absolute inset-[3px] rounded-full bg-gradient-to-b from-[#fbc02d] via-[#f7931a] to-[#e28a17]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/15 via-transparent to-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
                  <path d="M21.4 13.3c.3-2.1-1.3-3.2-3.4-3.9l.7-2.8-1.7-.4-.7 2.7c-.4-.1-.9-.2-1.4-.3l.7-2.8-1.7-.4-.7 2.8c-.4-.1-.7-.2-1-.2l-2.3-.6-.5 1.8s1.3.3 1.2.3c.7.2.8.6.8 1l-.8 3.2c0 0 .1 0 .2.1h-.2l-1.1 4.5c-.1.2-.3.5-.7.4 0 0-1.2-.3-1.2-.3l-.8 1.9 2.2.5c.4.1.8.2 1.2.3l-.7 2.9 1.7.4.7-2.8c.5.1.9.2 1.4.3l-.7 2.8 1.7.4.7-2.8c3 .6 5.2.3 6.1-2.4.8-2.1 0-3.3-1.6-4.1 1.1-.3 2-1.1 2.2-2.7zm-3.9 5.5c-.6 2.2-4.3 1-5.5.7l1-4c1.2.3 5.1.9 4.5 3.3zm.6-5.5c-.5 2-3.6.9-4.6.7l.9-3.6c1 .3 4.3.7 3.7 2.9z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute top-[5%] right-[10%] animate-float-medium opacity-15">
            <div className="w-20 h-20 rounded-full relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#8c9eff] via-[#627eea] to-[#3d51c5]" />
              <div className="absolute inset-[3px] rounded-full bg-gradient-to-b from-[#7986cb] via-[#627eea] to-[#4a5bc7]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/15 via-transparent to-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="18" height="30" viewBox="0 0 24 38" fill="none">
                  <path d="M12 0L4.5 19.2 12 23.4l7.5-4.2L12 0z" fill="white" fillOpacity="0.9"/>
                  <path d="M4.5 19.2L12 26l7.5-6.8L12 23.4 4.5 19.2z" fill="white" fillOpacity="0.7"/>
                  <path d="M12 28l-7.5-6.8L12 38l7.5-16.8L12 28z" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#0047AB]/10 blur-[100px]" />
        </div>

        {/* Form card */}
        <div className="relative z-10 w-full max-w-[420px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#0a1628]/80 backdrop-blur-xl border border-[#1e3a5f]/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#0047AB]/5">
              <div className="absolute -top-px left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#0047AB]/50 to-transparent" />

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
                      className="bg-emerald-500/10 border border-emerald-500/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-semibold text-white mb-3"
                    >
                      Check your email
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-[#5a9bdb]/70 text-sm mb-6"
                    >
                      If an account exists for <span className="text-[#3b82f6] font-medium">{email}</span>, you&apos;ll receive a password reset link shortly.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-col gap-3"
                    >
                      <Link href="/login">
                        <button
                          type="button"
                          className="w-full h-11 bg-gradient-to-r from-[#0047AB] to-[#1e6fdb] text-white rounded-xl font-medium text-sm hover:from-[#0052c7] hover:to-[#2a7de8] transition-all duration-300 shadow-lg shadow-[#0047AB]/25"
                        >
                          Back to login
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false)
                          setMessage(null)
                          setEmail("")
                        }}
                        className="w-full h-11 bg-[#0d1f3c]/60 hover:bg-[#0d1f3c] text-[#8baac9] rounded-xl font-medium text-sm transition-all duration-200 border border-[#1e3a5f]/40 hover:border-[#1e3a5f]/70"
                      >
                        Try another email
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
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-[#0047AB]/10 border border-[#0047AB]/30 rounded-full w-12 h-12 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-[#3b82f6]" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-white text-center mb-1">
                      Forgot password?
                    </h2>
                    <p className="text-sm text-[#5a9bdb]/70 text-center mb-6">
                      Enter your email and we&apos;ll send you a reset link
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
                        <label className="text-xs font-medium text-[#8baac9] block mb-1.5">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d5a80]" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                            className="w-full h-11 bg-[#0d1f3c]/60 border border-[#1e3a5f]/60 rounded-xl pl-10 pr-4 text-white placeholder-[#3d5a80] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/60 focus:border-[#0047AB]/60 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                        <Link href="/login" className="flex-1">
                          <button
                            type="button"
                            disabled={loading}
                            className="w-full h-11 bg-[#0d1f3c]/60 hover:bg-[#0d1f3c] text-[#8baac9] rounded-xl font-medium text-sm transition-all duration-200 border border-[#1e3a5f]/40 hover:border-[#1e3a5f]/70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Cancel
                          </button>
                        </Link>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={loading || !email}
                          className="flex-1 h-11 bg-gradient-to-r from-[#0047AB] to-[#1e6fdb] text-white rounded-xl font-medium text-sm hover:from-[#0052c7] hover:to-[#2a7de8] transition-all duration-300 shadow-lg shadow-[#0047AB]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <span className="relative flex items-center gap-2">
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4" />
                                Send link
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-[#1e3a5f]/30">
                      <p className="text-center text-sm text-[#5a9bdb]/60">
                        Remember your password?{" "}
                        <Link
                          href="/login"
                          className="text-[#3b82f6] hover:text-[#60a5fa] font-medium transition-colors"
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
      </div>
    </div>
  )
}
