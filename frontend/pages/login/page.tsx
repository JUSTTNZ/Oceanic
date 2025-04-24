"use client"
import { setUser } from '@/action';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ 
    email: '', 
    password: '', 
    general: '' 
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newError.email = "Please enter a valid email address";
      isValid = false;
    }


    setError(newError);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setError({ 
      email: '', 
      password: '', 
      general: '' 
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
  
      const response = await fetch('https://oceanic-servernz.vercel.app/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
        
      });
  
      const data = await response.json();
      console.log("Login response:", data);
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      
  
      if (!response.ok) {
        const errorMessage = data.message || data.error || "Login failed";
        setError(prev => ({ ...prev, general: errorMessage }));
        return;
      }
    
      // Dispatch user data to Redux
      dispatch(setUser({
        uid: data.data.user?._id,
        email: data.data.user?.email,
        username: data.data.user?.username,
        role: data.data.user?.role,
        fullname: data.data.user?.fullname,
        createdAt: data.data.user?.createdAt,
        phoneNumber: data.data.user?.phoneNumber,
        lastLogin: new Date().toISOString()
      }));
      
      router.push("/markets");
  
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(prev => ({ ...prev, general: errorMessage }));
      console.error("Login error:", err);
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
          <h2 className="text-[#201749] text-md lg:text-[42px] leading-[1.3] m-0 font-light">Sign in</h2>
          <hr className="border-t border-[#D5D2E5] my-4" />

          <p className="text-sm text-gray-600 mb-4 pt-7">Please check that you are visiting the correct URL</p>
          <div className="border border-[#D5D2E5] rounded-full inline-block mb-4">
            <p className="text-blue-300 m-0 p-2">
              https://app.oceanic.io/signin
            </p>
          </div>
        </div>

        {error.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error.general}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="text-sm block text-gray-700 mb-2">Email*</label>
            <input
              type="email"
              name="email"
              className={`w-full h-[50px] p-3 border text-sm rounded-lg focus:outline-none ${
                error.email ? 'border-red-500' : 'border-[#D5D2E5]'
              }`}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {error.email && (
              <p className="text-sm text-red-500 mt-1">{error.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 text-sm">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`w-full p-3 h-[50px] text-sm border rounded-lg pr-10 focus:outline-none ${
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
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>

        <div className="text-center text-sm lg:items-center items-start lg:flex-row flex flex-col lg:justify-between mt-4">
          <Link href="/resetpassword" className="text-blue-900 hover:text-blue-700">Forgot Password?</Link>
          <p className="mt-2 md:mt-0">
            Not signed up yet? <Link href="/register" className="text-blue-300 hover:text-blue-400">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}