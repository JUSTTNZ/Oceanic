"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Coin } from "./page";

interface CoinLiveProps {
  coins: Coin[];
}

export default function CoinLive({ coins }: CoinLiveProps) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Newly Listed");

  const categories = ["Popular", "Top Gainers", "Top Losers"];

  const filteredCoins = Array.isArray(coins) ? coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  ) : [];

  // Custom filtering based on selected category
  const categoryCoins = (() => {
    if (activeCategory === "Top Gainers") {
      return [...filteredCoins].sort((a, b) => {
        const changeA = (a.sparkline_in_7d.price.at(-1) ?? 0) - (a.sparkline_in_7d.price[0] ?? 0);
        const changeB = (b.sparkline_in_7d.price.at(-1) ?? 0) - (b.sparkline_in_7d.price[0] ?? 0);
        return changeB - changeA;
      });
    }
    if (activeCategory === "Top Losers") {
      return [...filteredCoins].sort((a, b) => {
        const changeA = (a.sparkline_in_7d.price.at(-1) ?? 0) - (a.sparkline_in_7d.price[0] ?? 0);
        const changeB = (b.sparkline_in_7d.price.at(-1) ?? 0) - (b.sparkline_in_7d.price[0] ?? 0);
        return changeA - changeB;
      });
    }
    // Simulate "Newly Listed" based on coin ID or fallback to all coins
    return filteredCoins.slice(0, 50);
  })();

  const visibleCoins = showAll ? categoryCoins : categoryCoins.slice(0, 10);

  return (
    <div className="p-4 md:bg-[#0f0c29] bg-gray-200  text-white">
      {/* Category Tabs */}
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`pb-2 font-bold whitespace-nowrap ${
              activeCategory === cat ? "border-b-2 border-[#0047AB] text-[#0047AB]" : "text-gray-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Coin"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:bg-[#1c1c3b] bg-gray-300  border border-gray-600 px-3 py-2 rounded md:placeholder-gray-400 placeholder-gray-500 md:text-white text-gray-900 focus:outline-none"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 py-3 border-b border-gray-700 font-semibold uppercase text-sm">
          <div>No</div>
          <div className="col-span-2">Name</div>
          <div>Last Price</div>
          <div>Change</div>
          <div>Market Stats</div>
          <div></div>
        </div>

        {visibleCoins.map((coin, index) => {
          const trendUp = (coin.sparkline_in_7d.price.at(-1) ?? 0) >= (coin.sparkline_in_7d.price[0] ?? 0);
          const change = (((coin.sparkline_in_7d.price.at(-1) ?? 0) - (coin.sparkline_in_7d.price[0] ?? 0)) / (coin.sparkline_in_7d.price[0] ?? 1)) * 100;

          return (
            <div key={coin.id} className="grid grid-cols-7 py-4 items-center border-b border-gray-700 text-sm">
              <div>{index + 1}</div>
              <div className="flex items-center space-x-2 col-span-2">
                <Image src={coin.image} alt={coin.name} width={24} height={24} />
                <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
              </div>
              <div>${coin.current_price.toLocaleString()}</div>
              <div className={trendUp ? "text-green-400" : "text-red-400"}>{change.toFixed(2)}%</div>
              <div>
                <Image
                  src={trendUp ? "/Images/greentrend.png" : "/Images/redtrend.png"}
                  alt="trend"
                  width={60}
                  height={20}
                />
              </div>
              <div>
                <Link href={`/coin/${coin.id}`}>
                  <button className="bg-[#0047AB] text-white py-1 px-3 rounded hover:bg-blue-600">
                    Trade
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Small Screen Card */}
      <div className="block md:hidden space-y-3">
        {visibleCoins.map((coin) => {
          const trendUp = (coin.sparkline_in_7d.price.at(-1) ?? 0) >= (coin.sparkline_in_7d.price[0] ?? 0);
          // Removed unused 'change' variable

          return (
            <div key={coin.id} className="flex justify-between items-center border rounded-lg p-3 bg-white text-black">
              <div className="flex items-center space-x-2">
                <Image src={coin.image} alt={coin.name} width={30} height={30} />
                <div>
                  <div className="font-bold text-sm">{coin.symbol.toUpperCase()}</div>
                  <div className="text-xs text-gray-500">{coin.name}</div>
                </div>
              </div>

              <div className="text-right text-xs flex flex-col items-end">
                <div className="text-black font-semibold">USDT ${coin.current_price.toFixed(4)}</div>
                <Image
                  src={trendUp ? "/images/greentrend.png" : "/images/redtrend.png"}
                  alt="trend"
                  width={50}
                  height={15}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Toggle Button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-[#0047AB] font-semibold hover:underline text-sm"
        >
          {showAll ? "Show Less" : "See All Coins →"}
        </button>
      </div>
    </div>
  );
}
