"use client";

import { useState, } from "react";
import {  AnimatePresence } from "framer-motion";

import BuyCrypto  from "./buycrypto";
import  SellCrypto  from "./sellcrypto";




export default function CryptoExchangePage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");


  return (
    <div className="bg-white min-h-screen pt-20  pb-10 font-grotesk">
      
      {/* Tab Switcher */}
      <div className="flex justify-center items-center space-x-4 py-4">
      <button
     onClick={() => setActiveTab("buy")}
     className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 border-2 
       has-checked:bg-[rgba(0,71,171,0.2)] has-checked:text-[#0047AB] has-checked:ring-[#0047AB]
       dark:has-checked:bg-[rgba(0,71,171,0.25)] dark:has-checked:text-[#0047AB] dark:has-checked:ring-[#0047AB]
       ${
         activeTab === "buy"
           ? "bg-[rgba(0,71,171,0.2)] text-[#0047AB] border-[#0047AB]" // Transparent blue selection
           : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-300" // Light gray inactive
       }`}
   >
     Buy
   </button>
   <button
     onClick={() => setActiveTab("sell")}
     className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 border-2 
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

