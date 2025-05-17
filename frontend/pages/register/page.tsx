"use client"
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import {setUser} from '../../action'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ 
    username: '',
    fullname: '',
    email: '', 
    password: '', 
    confirmPassword: '',
    phoneNumber: '',
    general: '' 
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error[name as keyof typeof error]) {
      setError(prev => ({ ...prev, [name]: '' }));
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

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newError.email = "Please enter a valid email address";
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

    setError(newError);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setError({ 
      username: '',
      fullname: '',
      email: '', 
      password: '', 
      confirmPassword: '',
      phoneNumber: '',
      general: '' 
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...dataToSend } = formData;
      console.log("Sending data:", dataToSend);
     console.log(confirmPassword)
      const response = await fetch(`https://oceanic-servernz.vercel.app/api/v1/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Registration failed';
        setError(prev => ({ ...prev, general: errorMessage }));
        return;
      }

      // Dispatch user data and redirect
      dispatch(setUser({
        uid: data.data?._id,
        email: data.data?.email,
        username: data.data?.username,
        role: data.data?.role,
        fullname: data.data?.fullname,
        createdAt: data.data?.createdAt,
        phoneNumber: data.data?.phoneNumber,
        lastLogin: new Date().toISOString()
      }));

      router.push('/markets');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(prev => ({ ...prev, general: errorMessage }));
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (    
  <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
  <div className="relative bg-gray-800/50 backdrop-blur-lg lg:p-10 p-6 w-full max-w-md lg:max-w-xl border border-gray-600/30 rounded-2xl shadow-xl overflow-hidden">
    {/* Gradient background elements */}
    <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100/50 rounded-full filter blur-3xl"></div>
    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-100/30 rounded-full filter blur-3xl"></div>
    
    <div className="relative z-10">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border border-gray-600/30 shadow-lg">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-16 h-16"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
            
            </svg>
          </div>
        </div>
        <h2 className="text-3xl lg:text-4xl font-light text-gray-100 mb-2">Create Account</h2>
        <p className="text-sm text-gray-400">Join our community today</p>
      </div>

      {error.general && (
        <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-lg text-sm border border-red-800/50">
          {error.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Username Field */}
          <div>
            <label className="text-sm block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={`w-full h-12 px-4 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                error.username ? 'border-red-500' : 'border-gray-600/50'
              }`}
              value={formData.username}
              onChange={handleChange}
            />
            {error.username && (
              <p className="text-sm text-red-400 mt-1">{error.username}</p>
            )}
          </div>

          {/* Fullname Field */}
          <div>
            <label className="text-sm block text-gray-300 mb-2">Full Name *</label>
            <input
              type="text"
              name="fullname"
              className={`w-full h-12 px-4 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                error.fullname ? 'border-red-500' : 'border-gray-600/50'
              }`}
              placeholder="Full name"
              value={formData.fullname}
              onChange={handleChange}
            />
            {error.fullname && (
              <p className="text-sm text-red-400 mt-1">{error.fullname}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="text-sm block text-gray-300 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            className={`w-full h-12 px-4 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
              error.email ? 'border-red-500' : 'border-gray-600/50'
            }`}
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
          />
          {error.email && (
            <p className="text-sm text-red-400 mt-1">{error.email}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Password Field */}
          <div>
            <label className="text-sm block text-gray-300 mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full h-12 px-4 bg-gray-700/50 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                  error.password ? 'border-red-500' : 'border-gray-600/50'
                }`}
                placeholder="••••••••"
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
            {error.password && (
              <p className="text-sm text-red-400 mt-1">{error.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="text-sm block text-gray-300 mb-2">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={`w-full h-12 px-4 bg-gray-700/50 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                  error.confirmPassword ? 'border-red-500' : 'border-gray-600/50'
                }`}
                placeholder="••••••••"
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
            {error.confirmPassword && (
              <p className="text-sm text-red-400 mt-1">{error.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Phone Number Field */}
        <div className="mb-6">
          <label className="text-sm block text-gray-300 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="+2347045689224"
            className={`w-full h-12 px-4 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
              error.phoneNumber ? 'border-red-500' : 'border-gray-600/50'
            }`}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {error.phoneNumber && (
            <p className="text-sm text-red-400 mt-1">{error.phoneNumber}</p>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg font-medium text-sm hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-50 flex justify-center items-center h-12"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
                ></path>
              </svg>
              Creating account...
            </>
          ) : 'Register Now'}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-700/50"></div>
        <span className="mx-4 text-gray-400 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-700/50"></div>
      </div>

      <button
        // onClick={handleGoogleLogin}
        className="w-full bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 p-3 rounded-lg font-medium text-sm transition-all duration-300 border border-gray-600/50 flex justify-center items-center h-12 mb-6"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.665 15.63 16.89 16.795 15.725 17.575V20.115H19.28C21.36 18.14 22.56 15.42 22.56 12.25Z" fill="#4285F4"/>
          <path d="M12 23C14.97 23 17.46 22.015 19.28 20.115L15.725 17.575C14.74 18.235 13.48 18.625 12 18.625C9.135 18.625 6.71 16.69 5.845 14.09H2.17V16.66C3.98 20.235 7.7 23 12 23Z" fill="#34A853"/>
          <path d="M5.845 14.09C5.625 13.43 5.5 12.725 5.5 12C5.5 11.275 5.625 10.57 5.845 9.91V7.34H2.17C1.4 8.735 1 10.315 1 12C1 13.685 1.4 15.265 2.17 16.66L5.845 14.09Z" fill="#FBBC05"/>
          <path d="M12 5.375C13.615 5.375 15.065 5.93 16.205 7.02L19.36 3.865C17.455 2.09 14.965 1 12 1C7.7 1 3.98 3.765 2.17 7.34L5.845 9.91C6.71 7.31 9.135 5.375 12 5.375Z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="text-center text-sm text-gray-400">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
</div>
  );
}