"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  current_price_ngn?: number;
}

interface Country {
  name: string;
  code: string;
}

export default function BuyCrypto({ 
  coins, 
  selectedCoin, 
  selectedCountry 
}: { 
  coins: Coin[]; 
  selectedCoin: Coin | null; 
  selectedCountry: Country; 
}) {
  const [amount, setAmount] = useState<string>("");
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [ngnRate, setNgnRate] = useState<number>(0);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [searchCoin, setSearchCoin] = useState("");

  // Fetch USD to NGN rate (in a real app, use a reliable API)
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Note: In production, use a reliable exchange rate API
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        setNgnRate(data.rates.NGN || 1500); // Fallback to 1500 if API fails
      } catch (error) {
        console.error("Failed to fetch exchange rate, using fallback", error);
        setNgnRate(1500); // Fallback rate
      }
    };

    fetchExchangeRate();
  }, []);

  // Calculate coin amount when amount changes
  useEffect(() => {
    if (amount && selectedCoin && ngnRate > 0) {
      const nairaValue = parseFloat(amount) || 0;
      const coinValue = nairaValue / (selectedCoin.current_price * ngnRate);
      setCoinAmount(parseFloat(coinValue.toFixed(6)));
    } else {
      setCoinAmount(0);
    }
  }, [amount, selectedCoin, ngnRate]);

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchCoin.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchCoin.toLowerCase())
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

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
          Buy from 100+ cryptocurrencies at competitive rates. Pay with Naira and receive your crypto instantly.
        </p>
        
        <div className="pt-4">
          <h4 className="font-medium text-gray-700">Current Prices (≈ ₦):</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {coins.slice(0, 4).map(coin => (
              <div key={coin.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                <Image src={coin.image} alt={coin.name} width={24} height={24} className="mr-2" />
                <div>
                  <p className="font-medium">{coin.symbol.toUpperCase()}</p>
                  <p className="text-sm">₦{(coin.current_price * ngnRate).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right-Side Buy UI */}
      <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-center font-semibold text-lg mb-4">Buy Crypto</h2>

        {/* Coin Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Select Cryptocurrency</label>
          <div className="relative">
            <button
              onClick={() => setShowCoinDropdown(!showCoinDropdown)}
              className="flex items-center justify-between w-full border px-4 py-3 rounded-lg text-sm"
            >
              {selectedCoin ? (
                <div className="flex items-center">
                  <Image 
                    src={selectedCoin.image} 
                    alt={selectedCoin.name} 
                    width={24} 
                    height={24} 
                    className="mr-2"
                  />
                  <span>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</span>
                </div>
              ) : (
                <span>Select Coin</span>
              )}
              <ChevronDownIcon className="h-4 w-4 ml-2" />
            </button>

            {showCoinDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search coins..."
                    className="w-full px-3 py-2 text-sm border rounded-md"
                    value={searchCoin}
                    onChange={(e) => setSearchCoin(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredCoins.map((coin) => (
                    <button
                      key={coin.id}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => {
                        // setSelectedCoin(coin);
                        setShowCoinDropdown(false);
                        setSearchCoin("");
                      }}
                    >
                      <Image 
                        src={coin.image} 
                        alt={coin.name} 
                        width={20} 
                        height={20} 
                        className="mr-2"
                      />
                      {coin.name} ({coin.symbol.toUpperCase()}) - 
                      <span className="ml-2 font-medium">
                        ₦{(coin.current_price * ngnRate).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Amount in Naira (₦)</label>
          <input
            type="text"
            placeholder="0.00"
            className="border px-4 py-3 rounded-lg w-full text-right text-lg font-medium"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>

        {/* Conversion Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">You pay:</span>
            <span className="font-semibold">₦{parseFloat(amount || "0").toLocaleString('en-NG')}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">You receive:</span>
            <span className="font-semibold">
              {coinAmount} {selectedCoin?.symbol.toUpperCase()}
            </span>
          </div>
          {selectedCoin && (
            <div className="mt-2 text-xs text-gray-500">
              ≈ ₦{(selectedCoin.current_price * ngnRate).toLocaleString('en-NG')} per {selectedCoin.symbol.toUpperCase()}
            </div>
          )}
        </div>

        <button className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-4 hover:bg-blue-700 transition-colors">
          Continue to Payment
        </button>

        <div className="text-xs text-gray-500 text-center">
          Prices update in real-time. Rate locked for 30 seconds.
        </div>
      </div>
    </motion.div>
  );
}