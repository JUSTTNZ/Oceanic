
"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaEye, FaEyeSlash,  } from 'react-icons/fa';

import Image from 'next/image';

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface ApiCountry {
  cca2: string;
  name: {
    common: string;
  };
  flags: {
    png?: string;
    svg?: string;
  };
  code?: Record<string, unknown>;
}

export default function RegistePage  ()  {
  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phone, setPhone] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [accountType, setAccountType] = useState<'individual' | 'business'>('individual');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const safeSelectedCountry = selectedCountry || {
    code: 'US',
    name: 'United States',
    flag: '/default-flag.png'
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/country');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiCountry[] = await response.json();
        
        const formattedCountries = data
          .filter(country => country.cca2 && country.name?.common)
          .map(country => ({
            code: country.cca2,
            name: country.name.common,
            flag: country.flags?.png || country.flags?.svg || '/default-flag.png'
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
        
        // Set default country to Nigeria if available, otherwise first country
        const nigeria = formattedCountries.find(c => c.code === 'NG');
        setSelectedCountry(nigeria || formattedCountries[0] || null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading countries...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!countries.length) {
    return <div className="p-4 text-center">No countries available</div>;
  }



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
            <h2 className=" text-[#201749] text-md lg:text-[42px] leading-[1.3] m-0 font-light">Create your account</h2>
            <hr className="border-t border-[#D5D2E5] my-4" />


                    <div className='flex justify-center'>
                    <ul className="flex border-b border-gray-300">
  <li
    className={`px-4 py-2 cursor-pointer ${
      accountType === "individual" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"
    }`}
    onClick={() => setAccountType("individual")}
  >
    Individual
  </li>
  <li
    className={`px-4 py-2 cursor-pointer ${
      accountType === "business" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"
    }`}
    onClick={() => setAccountType("business")}
  >
    Business
  </li>
</ul>
                    </div>

          </div>

          <form>
          <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1 text-sm">Country</label>
        <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option>Italy</option>
          <option>United States</option>
          <option>Canada</option>
          <option>United Kingdom</option>
        </select>
      </div>

      {/* Username Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1 text-sm">Username</label>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <span className="bg-gray-200 p-3 px-5 ">
            <span className='text-center '>O</span>
          </span>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 focus:outline-none"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          O will be added as the first letter of the username you have provided (example: Ojohn)
        </p>
      </div>
      {accountType === 'business' && (
            <>
              <label className="text-sm font-medium block mb-2">Business Name *</label>
              <input
                type="text"
                className="w-full h-[50px] p-3 border text-sm border-[#D5D2E5] border-opacity-80 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Business Name"
              />
            </>
          )}
          <div className='w-full flex justify-between space-x-3'>
          <div className='w-full'>
            <label className="w-full  text-sm font-medium block mb-2">First name *</label>
            <input
              type="name"
              className="w-full h-[50px] p-3 border text-sm border-[#D5D2E5] border-opacity-80 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Firstname"
            />
            </div>
            <div className='w-full'>
            <label className=" w-full text-sm font-medium block mb-2">Last name *</label>
            <input
              type="name"
              className="w-full h-[50px] p-3 border text-sm border-[#D5D2E5] border-opacity-80 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Lastname"
            />
            </div>
            </div>

            <div>
            <label className="  text-sm font-medium block mb-2">E-mail Address *</label>
            <input
              type="email"
              className="w-full h-[50px] p-3 border text-sm border-[#D5D2E5] border-opacity-80 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="E-mail Address"
            />
            </div>
       

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

    <div className="mb-5 pb-4">
      <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
      <div className="relative">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <button
           type="button"
            className="flex items-center px-3 py-2 focus:outline-none"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            disabled={!countries.length}
          >
            {safeSelectedCountry.flag && (
              <Image 
                src={safeSelectedCountry.flag} 
                alt={`${safeSelectedCountry.name} flag`}
                width={24}
                height={16}
                className="object-contain mr-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-flag.png';
                }}
              />
            )}
            <span className="mr-2">+{/* You might want to add country code here */}</span>
            <FaChevronDown className="text-gray-500" />
          </button>
          <input
            type="tel"
            placeholder="312 345 6789"
            className="w-full p-3 focus:outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {showDropdown && (
          <div 
            className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
          >
            {countries.map((country) => (
              <button
               type="button"
                key={country.code}
                className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-left ${
                  country.code === safeSelectedCountry.code ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  setSelectedCountry(country);
                  setShowDropdown(false);
                }}
                role="option"
                aria-selected={country.code === safeSelectedCountry.code}
              >
                <span className="mr-2">
                  <Image 
                    src={country.flag} 
                    alt={`${country.name} flag`}
                    width={24}
                    height={16}
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-flag.png';
                    }}
                  />
                </span>
                {country.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
 




            <button type='submit' className="w-full bg-blue-400 text-white p-3 rounded-lg font-semibold text-sm">Sign In</button>
          </form>

          <div className="text-center text-sm lg:items-center items-start lg:flex-row flex flex-col lg:justify-between mt-4">
            <Link href="/resetpassword" className="text-blue-900 ">Forgot Password?</Link>
            <p className="mt-2 md:mt-0">
              Already have an account ? <Link href="/login" className="text-blue-300  ">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
 
  );
};


