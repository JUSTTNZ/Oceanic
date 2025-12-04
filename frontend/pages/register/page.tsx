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
  phoneNumber: string;
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
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RegisterErrorState>({
  username: "",
  fullname: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
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
      if (!formData.phoneNumber || formData.phoneNumber.length < 11) {
        newError.phoneNumber = "Phone number must be 11 digits";
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
      username: "", fullname: "", email: "", password: "", confirmPassword: "", phoneNumber: "", general: "",
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
          phoneNumber: formData.phoneNumber,
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
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="relative bg-gray-800/50 backdrop-blur-lg p-5 w-full max-w-sm border border-gray-600/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100/50 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-100/30 rounded-full filter blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border border-gray-600/30 shadow-lg">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-light text-gray-100 mb-1">
              Create Account
            </h2>
            <p className="text-xs text-gray-400">Join our community today</p>
          </div>

          {error.general && (
            <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-lg text-sm border border-red-800/50">
              {error.general}
            </div>
          )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className={`w-full h-10 px-4 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                      error.username ? "border-red-500" : "border-gray-600/50"
                    }`}
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Full name"
                    className={`w-full h-10 px-4 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                      error.fullname ? "border-red-500" : "border-gray-600/50"
                    }`}
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    className={`w-full h-10 px-4 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                      error.email ? "border-red-500" : "border-gray-600/50"
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className={`w-full h-10 px-4 bg-gray-700/50 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                        error.password ? "border-red-500" : "border-gray-600/50"
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
                        <FaEyeSlash className="text-gray-400 hover:text-gray-300" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      className={`w-full h-10 px-4 bg-gray-700/50 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                        error.confirmPassword
                          ? "border-red-500"
                          : "border-gray-600/50"
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
                        <FaEyeSlash className="text-gray-400 hover:text-gray-300" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+2347045689224"
                    className={`w-full h-10 px-4 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                      error.phoneNumber ? "border-red-500" : "border-gray-600/50"
                    }`}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg font-medium text-sm hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-50 flex justify-center items-center h-10"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register Now"}
              </button>
            </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700/50"></div>
            <span className="mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-700/50"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 p-2 rounded-lg font-medium text-sm transition-all duration-300 border border-gray-600/50 flex justify-center items-center h-10 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.665 15.63 16.89 16.795 15.725 17.575V20.115H19.28C21.36 18.14 22.56 15.42 22.56 12.25Z"
                fill="#4285F4"
              />
              <path
                d="M12 23C14.97 23 17.46 22.015 19.28 20.115L15.725 17.575C14.74 18.235 13.48 18.625 12 18.625C9.135 18.625 6.71 16.69 5.845 14.09H2.17V16.66C3.98 20.235 7.7 23 12 23Z"
                fill="#34A853"
              />
              <path
                d="M5.845 14.09C5.625 13.43 5.5 12.725 5.5 12C5.5 11.275 5.625 10.57 5.845 9.91V7.34H2.17C1.4 8.735 1 10.315 1 12C1 13.685 1.4 15.265 2.17 16.66L5.845 14.09Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.375C13.615 5.375 15.065 5.93 16.205 7.02L19.36 3.865C17.455 2.09 14.965 1 12 1C7.7 1 3.98 3.765 2.17 7.34L5.845 9.91C6.71 7.31 9.135 5.375 12 5.375Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="text-center text-sm text-gray-400">
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors"
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
