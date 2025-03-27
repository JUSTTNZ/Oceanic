"use client";


import { motion } from "framer-motion";
import Image from "next/image";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

interface Country {
  name: string;
  code: string;
}

export default function BuyCrypto  ({coins, selectedCoin,selectedCountry,}: { coins: Coin[]; selectedCoin: Coin | null; selectedCountry: Country;})  {
  return (
    <motion.div
      key="buy"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4"
    >
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Want to buy crypto? <br /> It's never been simpler.
        </h1>
        <p className="text-gray-600 text-base">
          100+ cryptocurrencies. Plenty of ways to pay. Absolutely zero hassle.
        </p>
      </div>

      {/* Right-Side Buy UI */}
      <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-center font-semibold text-lg mb-4">Buy Crypto</h2>

        {/* Country & Coin Selector */}
        <div className="flex items-center justify-between">
          <Image
            src={selectedCoin?.image || ""}
            alt={selectedCoin?.name || ""}
            width={32}
            height={32}
          />
          <span>{selectedCoin?.name || "Select Coin"}</span>
        </div>

        <p className="text-center text-4xl font-semibold mt-6">₦ 0</p>
        <p className="text-center text-gray-500 text-sm">
          0 {selectedCoin?.symbol?.toUpperCase()}
        </p>

        <button className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-6">
          Continue
        </button>
      </div>
    </motion.div>
  );
};