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
    <div className="flex justify-center items-center min-h-screen pt-20 lg:pt-10 pb-10 bg-[#f7f7fa] font-grotesk p-4">
      <div className="bg-white lg:p-8 p-6 px-8 w-full max-w-md lg:max-w-xl border border-[#D5D2E5] border-opacity-80 rounded-[18px] shadow-[0_0px_30px_5px_rgba(32,23,73,0.05)]">
        <div className="text-center mb-4 pt-6">
          <div className="flex justify-center mb-4">
            <div className="relative flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ADD8E6"  
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute w-20 h-20 z-20 top-3"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
                <rect x="8" y="14" width="8" height="2" rx="1" />
              </svg>
            </div>
          </div>
          <h2 className="text-[#201749] text-md lg:text-[42px] leading-[1.3] m-0">Register</h2>
        </div>

        {error.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={`w-full p-3 border text-sm rounded-lg focus:outline-none ${
                error.username ? 'border-red-500' : 'border-[#D5D2E5]'
              }`}
              value={formData.username}
              onChange={handleChange}
            />
            {error.username && (
              <p className="text-sm text-red-500 mt-1">{error.username}</p>
            )}
          </div>

          {/* Fullname Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Fullname *</label>
            <input
              type="text"
              name="fullname"
              className={`w-full p-3 border text-sm rounded-lg focus:outline-none ${
                error.fullname ? 'border-red-500' : 'border-[#D5D2E5]'
              }`}
              placeholder="Full name"
              value={formData.fullname}
              onChange={handleChange}
            />
            {error.fullname && (
              <p className="text-sm text-red-500 mt-1">{error.fullname}</p>
            )}
          </div>
          
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Email *</label>
            <input
              type="email"
              name="email"
              className={`w-full p-3 border text-sm rounded-lg focus:outline-none ${
                error.email ? 'border-red-500' : 'border-[#D5D2E5]'
              }`}
              placeholder="E-mail Address"
              value={formData.email}
              onChange={handleChange}
            />
            {error.email && (
              <p className="text-sm text-red-500 mt-1">{error.email}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`w-full p-3 border text-sm rounded-lg pr-10 focus:outline-none ${
                  error.password ? 'border-red-500' : 'border-[#D5D2E5]'
                }`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>
            {error.password && (
              <p className="text-sm text-red-500 mt-1">{error.password}</p>
            )}
          </div>
          
          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={`w-full p-3 border text-sm rounded-lg pr-10 focus:outline-none ${
                  error.confirmPassword ? 'border-red-500' : 'border-[#D5D2E5]'
                }`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>
            {error.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{error.confirmPassword}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="mb-5">
            <label className="block text-gray-700 mb-1 text-sm">Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="+2347045689224"
              className={`w-full p-3 border text-sm rounded-lg focus:outline-none ${
                error.phoneNumber ? 'border-red-500' : 'border-[#D5D2E5]'
              }`}
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {error.phoneNumber && (
              <p className="text-sm text-red-500 mt-1">{error.phoneNumber}</p>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-400 text-white p-3 rounded-lg font-semibold text-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"></path>
                </svg>
                Registering...
              </>
            ) : 'Register'}
          </button>
        </form>

        <div className="text-center text-sm lg:items-center items-start lg:flex-row flex flex-col lg:justify-between mt-4">
          <Link href="/resetpassword" className="text-blue-900 hover:text-blue-700">Forgot Password?</Link>
          <p className="mt-2 md:mt-0">
            Already have an account? <Link href="/login" className="text-blue-300 hover:text-blue-400">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}