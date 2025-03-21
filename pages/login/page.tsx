/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Link from 'next/link';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage  ()  {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (

    
      <div className="flex justify-center items-center min-h-screen pt-20 lg:pt-30 pb-10 bg-[#f7f7fa] font-maven p-4">
<div className="bg-white lg:p-8 p-6 px-8 w-full max-w-md lg:max-w-xl border border-[#D5D2E5] border-opacity-80 rounded-[5px] shadow-[0_0px_30px_5px_rgba(32,23,73,0.05)]">

          <div className="text-center mb-4 pt-6">
          <div className="flex justify-center mb-4">
  <div className="relative flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full ">
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
            <h2 className=" text-[#201749] text-md lg:text-[42px] leading-[1.3] m-0 font-light">Sign in</h2>
            <hr className="border-t border-[#D5D2E5] my-4" />


            <p className="text-sm text-gray-600 mb-4 pt-7">Please check that you are visiting the correct URL</p>
            <div className="border border-[#D5D2E5] rounded-full inline-block mb-4">
  <p className="text-blue-300  m-0 p-2">
    https://app.oceanic.io/signin
  </p>
</div>
         
          </div>

          <form>
            <label className="  text-sm font-medium block mb-2">E-mail Address *</label>
            <input
              type="email"
              className="w-full h-[50px] p-3 border text-sm border-[#D5D2E5] border-opacity-80 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="E-mail Address"
            />

<div className="relative mb-4">
      <label className="block mb-2 text-sm font-medium">Password *</label>
      <input
        type={showPassword ? 'text' : 'password'}
        className="w-full p-3 h-[50px] text-sm border border-[#D5D2E5] border-opacity-80 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Password"
      />
      <span
        className="absolute inset-y-0 top-7 right-10  flex items-center   cursor-pointer border-l border-[#D5D2E5]"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <FaEyeSlash className="text-gray-500 relative left-4" />
        ) : (
          <FaEye className="text-gray-500  relative left-4" />
        )}
      </span>
    </div>

<div className="mb-4">
<ReCAPTCHA
          sitekey="6LdsiPkqAAAAAKTQ0AsrTskmsAePkAUM_ZKDr1ym" // Replace with your site key
          onChange={(value) => setCaptchaValue(value)}
        />
        
      </div>


            <button className="w-full bg-blue-400 text-white p-3 rounded-lg font-semibold text-sm">Sign In</button>
          </form>

          <div className="text-center text-sm lg:items-center items-start lg:flex-row flex flex-col lg:justify-between mt-4">
            <Link href="/resetpassword" className="text-blue-900 ">Forgot Password?</Link>
            <p className="mt-2 md:mt-0">
              Not signed up yet? <a href="#" className="text-blue-300  ">Create Account</a>
            </p>
          </div>
        </div>
      </div>
 
  );
};


