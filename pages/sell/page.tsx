"use client";

import { useState, } from "react";
import {  AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

import { useRouter } from "next/router";
import BuyCrypto  from "./buycrypto";
import  SellCrypto  from "./sellcrypto";




export default function CryptoExchangePage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  const router = useRouter();





  return (
    <div className="bg-white min-h-screen">
      {/* Back Button */}
      <div
  className="flex items-center space-x-2 p-3 rounded-lg border border-gray-300 hover:border-[#0047AB] 
  bg-gray-100 hover:bg-[rgba(0,71,171,0.1)] text-gray-800 hover:text-[#0047AB] 
  transition-all duration-300 cursor-pointer"
  onClick={() => router.push("/")}
>
  <ArrowLeftIcon className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-1 text-[#0047AB]" />
  <span className="font-medium">Back to Home</span>
</div>

      {/* Tab Switcher */}
      <div className="flex justify-center items-center space-x-4 py-4">
  <button
    onClick={() => setActiveTab("buy")}
    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 
      has-checked:bg-[rgba(0,71,171,0.2)] has-checked:text-[#0047AB] has-checked:ring-[#0047AB]
      dark:has-checked:bg-[rgba(0,71,171,0.25)] dark:has-checked:text-[#0047AB] dark:has-checked:ring-[#0047AB]
      ${
        activeTab === "buy"
          ? "bg-[rgba(0,71,171,0.2)] text-[#0047AB] border-[#0047AB]" // Transparent blue selection
          : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300" // Light gray inactive
      }`}
  >
    Buy
  </button>
  <button
    onClick={() => setActiveTab("sell")}
    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 
      has-checked:bg-[rgba(0,71,171,0.2)] has-checked:text-[#0047AB] has-checked:ring-[#0047AB]
      dark:has-checked:bg-[rgba(0,71,171,0.25)] dark:has-checked:text-[#0047AB] dark:has-checked:ring-[#0047AB]
      ${
        activeTab === "sell"
          ? "bg-[rgba(0,71,171,0.2)] text-[#0047AB] border-[#0047AB]" // Transparent blue selection
          : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300" // Light gray inactive
      }`}
  >
    Sell
  </button>
</div>




      {/* {showCountryList && (
        <div className="absolute bg-white border mt-2 w-64 max-h-60 overflow-auto rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Search country..."
            className="p-2 w-full border-b outline-none"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
          />
          <ul>
            {countries
              .filter((country) =>
                country.name.toLowerCase().includes(searchCountry.toLowerCase())
              )
              .map((country) => (
                <li
                  key={country.code}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCountry(country);
                    setShowCountryList(false);
                  }}
                >
                  <Image
                    src={country.flag}
                    alt={country.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span>{country.name}</span> */}
                {/* </li>
              ))}
          </ul>
        </div>
      )} */}
      
      <AnimatePresence mode="wait">
        {activeTab === "buy" ? (
          <BuyCrypto
      
          />
        ) : (
          <SellCrypto
          
          />
        )}
      </AnimatePresence>
    </div>
  );
}

