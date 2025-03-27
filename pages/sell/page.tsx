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
        className="flex items-center space-x-2 p-4 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <ArrowLeftIcon className="h-6 w-6" />
        <span>Back to home</span>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center items-center space-x-4 py-4">
        <button
          onClick={() => setActiveTab("buy")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "buy"
              ? "bg-[#0047AB] text-white shadow-lg scale-105"
              : "bg-gray-200 text-black"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab("sell")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "sell"
              ? "bg-[#0047AB] text-white shadow-lg scale-105"
              : "bg-gray-200 text-black"
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

