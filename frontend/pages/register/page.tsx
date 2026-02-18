"use client"
import { supabase } from '@/lib/supabase'
import Link from 'next/link';
import { useToast } from "../../hooks/toast";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type RegisterErrorState = {
  username: string;
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  general: string;
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RegisterErrorState>({
  username: "",
  fullname: "",
  email: "",
  password: "",
  confirmPassword: "",
  general: "",
});

  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error[name as keyof typeof error]) {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
    if (error.general) {
      setError((prev) => ({ ...prev, general: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newError = { ...error };

      if (!formData.username || formData.username.length < 4) {
        newError.username = "Username must be at least 4 characters";
        isValid = false;
      }
      if (!formData.fullname || formData.fullname.length < 6) {
        newError.fullname = "Full name must be at least 6 characters";
        isValid = false;
      }
      if (!formData.password || formData.password.length < 6) {
        newError.password = "Password must be at least 6 characters";
        isValid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        newError.confirmPassword = "Passwords do not match";
        isValid = false;
      }

    const emailToValidate = formData.email;
    if (
      !emailToValidate ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate)
    ) {
      newError.email = "Please enter a valid email address";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError({
      username: "", fullname: "", email: "", password: "", confirmPassword: "", general: "",
    });

    if (!validateForm()) return;

    try {
      setLoading(true);

      const email = formData.email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          fullname: formData.fullname,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      const msg = error.message?.toLowerCase() || "";
      if (msg.includes("email rate limit")) {
        showToast("Too many attempts. Please try again later.", "error");
      } else if (msg.includes("password")) {
        showToast("Password is too weak. Please use a stronger password.", "error");
      } else if (msg.includes("email address is invalid")) {
        showToast("Please enter a valid email address.", "error");
      } else {
        showToast(error.message || "Registration failed", "error");
      }
      return;
    }

    if (data?.user && !data.session) {
      showToast(
        "Registration successful! Check your inbox and click the verification link to continue.",
        "success"
      );
    } else {
      showToast("Registration successful!", "success");
    }

    setTimeout(() => router.push("/login"), 1800);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Signup error:", err);
    showToast(msg || "Registration failed", "error");
  } finally {
    setLoading(false);
  }
};

const handleGoogleLogin = async () => {
  setLoading(true)
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) throw error
  } catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  showToast(msg || 'Google sign-up failed', 'error');
} finally {
  setLoading(false);
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
        <div className="absolute bottom-[38%] right-[12%] animate-float-slow opacity-45">
          <div className="w-12 h-12 rounded-full shadow-xl shadow-[#9945ff]/25 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#14f195] via-[#9945ff] to-[#5d1db5]" />
            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#14f195]/80 via-[#9945ff] to-[#7c3aed] border border-white/10" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/15 via-transparent to-black/15" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm drop-shadow-md">S</span>
            </div>
          </div>
        </div>

        {/* Center branding */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Oceanic
          </h1>
          <p className="text-[#7eb8ff] text-lg leading-relaxed mb-8">
            Join thousands of traders buying and selling crypto seamlessly.
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

      {/* ===== RIGHT PANEL — Register form ===== */}
      <div className="flex-1 flex items-center justify-center relative p-4 lg:p-8 overflow-y-auto scrollbar-hide">
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
          <div className="absolute bottom-[10%] left-[6%] animate-float-fast opacity-12">
            <div className="w-16 h-16 rounded-full relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#4dcfa0] via-[#26a17b] to-[#1a7a5a]" />
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-b from-[#33c48b] via-[#26a17b] to-[#1e8c6a]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-black/15" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg drop-shadow-md">₮</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#0047AB]/10 blur-[100px]" />
        </div>

        {/* Form card */}
        <div className="relative z-10 w-full max-w-[420px]">
          <div className="bg-[#0a1628]/80 backdrop-blur-xl border border-[#1e3a5f]/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#0047AB]/5">
            <div className="absolute -top-px left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#0047AB]/50 to-transparent" />

            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-1">
                Create account
              </h2>
              <p className="text-sm text-[#5a9bdb]/70">
                Join the Oceanic community today
              </p>
            </div>

            {error.general && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-3 mb-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs block text-[#8baac9] mb-1.5 font-medium">Username</label>
                    <input
                      type="text"
                      name="username"
                      placeholder="johndoe"
                      className={`w-full h-11 px-4 bg-[#0d1f3c]/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0047AB]/60 focus:border-[#0047AB]/60 text-white placeholder-[#3d5a80] transition-all duration-200 text-sm ${
                        error.username ? "border-red-500" : "border-[#1e3a5f]/60"
                      }`}
                      value={formData.username}
                      onChange={handleChange}
                    />
                    {error.username && <p className="text-xs text-red-400 mt-1">{error.username}</p>}
                  </div>
                  <div>
                    <label className="text-xs block text-[#8baac9] mb-1.5 font-medium">Full name</label>
                    <input
                      type="text"
                      name="fullname"
                      placeholder="John Doe"
                      className={`w-full h-11 px-4 bg-[#0d1f3c]/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0047AB]/60 focus:border-[#0047AB]/60 text-white placeholder-[#3d5a80] transition-all duration-200 text-sm ${
                        error.fullname ? "border-red-500" : "border-[#1e3a5f]/60"
                      }`}
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                    {error.fullname && <p className="text-xs text-red-400 mt-1">{error.fullname}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs block text-[#8baac9] mb-1.5 font-medium">Email address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    className={`w-full h-11 px-4 bg-[#0d1f3c]/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0047AB]/60 focus:border-[#0047AB]/60 text-white placeholder-[#3d5a80] transition-all duration-200 text-sm ${
                      error.email ? "border-red-500" : "border-[#1e3a5f]/60"
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {error.email && <p className="text-xs text-red-400 mt-1">{error.email}</p>}
                </div>

                <div>
                  <label className="text-xs block text-[#8baac9] mb-1.5 font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Min. 6 characters"
                      className={`w-full h-11 px-4 bg-[#0d1f3c]/60 border rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/60 focus:border-[#0047AB]/60 text-white placeholder-[#3d5a80] transition-all duration-200 text-sm ${
                        error.password ? "border-red-500" : "border-[#1e3a5f]/60"
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-[#3d5a80] hover:text-[#8baac9] transition-colors" />
                      ) : (
                        <FaEye className="text-[#3d5a80] hover:text-[#8baac9] transition-colors" />
                      )}
                    </button>
                  </div>
                  {error.password && <p className="text-xs text-red-400 mt-1">{error.password}</p>}
                </div>

                <div>
                  <label className="text-xs block text-[#8baac9] mb-1.5 font-medium">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      className={`w-full h-11 px-4 bg-[#0d1f3c]/60 border rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/60 focus:border-[#0047AB]/60 text-white placeholder-[#3d5a80] transition-all duration-200 text-sm ${
                        error.confirmPassword ? "border-red-500" : "border-[#1e3a5f]/60"
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-[#3d5a80] hover:text-[#8baac9] transition-colors" />
                      ) : (
                        <FaEye className="text-[#3d5a80] hover:text-[#8baac9] transition-colors" />
                      )}
                    </button>
                  </div>
                  {error.confirmPassword && <p className="text-xs text-red-400 mt-1">{error.confirmPassword}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-[#0047AB] to-[#1e6fdb] text-white rounded-xl font-medium text-sm hover:from-[#0052c7] hover:to-[#2a7de8] transition-all duration-300 shadow-lg shadow-[#0047AB]/25 disabled:opacity-50 flex justify-center items-center relative overflow-hidden group"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative">
                  {loading ? "Creating account..." : "Create account"}
                </span>
              </button>
            </form>

            <div className="flex items-center my-5">
              <div className="flex-grow border-t border-[#1e3a5f]/40"></div>
              <span className="mx-4 text-[#3d5a80] text-xs">or continue with</span>
              <div className="flex-grow border-t border-[#1e3a5f]/40"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-11 bg-[#0d1f3c]/60 hover:bg-[#0d1f3c] text-[#8baac9] rounded-xl font-medium text-sm transition-all duration-200 border border-[#1e3a5f]/40 hover:border-[#1e3a5f]/70 flex justify-center items-center gap-2 mb-5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.665 15.63 16.89 16.795 15.725 17.575V20.115H19.28C21.36 18.14 22.56 15.42 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.015 19.28 20.115L15.725 17.575C14.74 18.235 13.48 18.625 12 18.625C9.135 18.625 6.71 16.69 5.845 14.09H2.17V16.66C3.98 20.235 7.7 23 12 23Z" fill="#34A853" />
                <path d="M5.845 14.09C5.625 13.43 5.5 12.725 5.5 12C5.5 11.275 5.625 10.57 5.845 9.91V7.34H2.17C1.4 8.735 1 10.315 1 12C1 13.685 1.4 15.265 2.17 16.66L5.845 14.09Z" fill="#FBBC05" />
                <path d="M12 5.375C13.615 5.375 15.065 5.93 16.205 7.02L19.36 3.865C17.455 2.09 14.965 1 12 1C7.7 1 3.98 3.765 2.17 7.34L5.845 9.91C6.71 7.31 9.135 5.375 12 5.375Z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-sm text-[#5a9bdb]/60">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#3b82f6] hover:text-[#60a5fa] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {ToastComponent}
    </div>
  );
}
