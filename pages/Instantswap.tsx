/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Header from './login/header';
import Footer from './login/footer';
import { FaExchangeAlt } from 'react-icons/fa';

export default function InstantSwap() {
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0); // Mock balance
  const [error, setError] = useState('');

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handlePercentageClick = (percentage:number) => {
    const newAmount = (balance * (percentage / 100)).toFixed(8);
    setAmount(newAmount);
  };

  return (
    <section>
      <Header />
      <div className="flex justify-center items-center min-h-screen pt-20 lg:pt-30 pb-10 bg-[#f7f7fa] font-maven p-4">
  <div className="bg-white lg:p-8 p-6 px-8 w-full max-w-md lg:max-w-xl border border-[#D5D2E5] border-opacity-80 rounded-[5px] shadow-[0_0px_30px_5px_rgba(32,23,73,0.05)]">
    <div className="text-center mb-6 pt-6">
      <div className="flex justify-center mb-6">
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
      <h2 className="text-[#201749] text-md lg:text-[42px] leading-[1.3] m-0 font-light">Instant Swap</h2>
      <p className="text-sm text-gray-600 mb-6 pt-4">A simple way to buy or sell cryptocurrency in less than a minute.</p>
    </div>
    
    <div className='space-y-4'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className='w-full'>
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <select
            className="w-full p-3 border border-[#D5D2E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
          </select>
        </div>
        
        <div className='w-full'>
          <label className="block text-sm font-medium text-gray-700 mb-2 md:mt-0">To</label>
          <select
            className="w-full p-3 border border-[#D5D2E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="USDT">Tether (USDT)</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 h-[50px] text-sm border border-[#D5D2E5] rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="0.00000000"
          />
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer border-l border-[#D5D2E5] pl-3"
            onClick={handleSwap}
          >
            <FaExchangeAlt className="text-gray-500" />
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-1 mt-4">
        {[25, 50, 75, 100].map((percent) => (
          <button
            key={percent}
            className="text-sm py-2 border border-[#D5D2E5] rounded hover:bg-gray-50 transition-colors"
            onClick={() => handlePercentageClick(percent)}
          >
            {percent}%
          </button>
        ))}
      </div>
      
      <p className="text-gray-500 text-sm mt-2">Your balance: {balance} {fromCurrency}</p>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      <button
        onClick={() => alert(`Swapping ${amount} ${fromCurrency} to ${toCurrency}`)}
        className="w-full mt-6 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
      >
        Continue
      </button>
    </div>
  </div>
</div>
      <Footer />
    </section>
  );
}