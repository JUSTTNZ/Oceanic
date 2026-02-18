"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import green from '../../public/Images/greentrend.png'
import red from '../../public/Images/redtrend.png'

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  sparkline_in_7d: {
    price: number[];
  };
}

interface CoinLiveProps {
  coins: Coin[];
}

export default function CoinLive({ coins }: CoinLiveProps) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Popular");

  const categories = ["Popular", "Top Gainers", "Top Losers"];

  const filteredCoins = Array.isArray(coins) ? coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  ) : [];

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
    return filteredCoins.slice(0, 50);
  })();

  const visibleCoins = showAll ? categoryCoins : categoryCoins.slice(0, 10);

  return (
    <section className="py-14 sm:py-16 md:py-20 font-grotesk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Live Market Prices
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto px-2">
            Track real-time prices across 100+ cryptocurrencies
          </p>
        </motion.div>

        {/* Pill-style Category Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-1 gap-0.5 sm:gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#0047AB] text-white shadow-lg shadow-[#0047AB]/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-5 sm:mb-6 max-w-sm sm:max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search coin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-4 py-2.5 sm:py-3 rounded-xl placeholder-gray-500 text-white text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
          />
        </div>

        {/* Desktop Table - Glass Card */}
        <div className="hidden md:block rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
          <div className="grid grid-cols-7 py-3.5 px-6 border-b border-white/[0.08] font-semibold uppercase text-xs text-gray-500 tracking-wider">
            <div>#</div>
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
              <div
                key={coin.id}
                className="grid grid-cols-7 py-3.5 px-6 items-center border-b border-white/5 text-sm hover:bg-white/[0.03] transition-colors"
              >
                <div className="text-gray-500">{index + 1}</div>
                <div className="flex items-center space-x-3 col-span-2">
                  <Image src={coin.image} alt={coin.name} width={28} height={28} className="rounded-full" />
                  <span className="text-white font-medium">
                    {coin.name} <span className="text-gray-500">({coin.symbol.toUpperCase()})</span>
                  </span>
                </div>
                <div className="text-white">${coin.current_price.toLocaleString()}</div>
                <div className={trendUp ? "text-green-400" : "text-red-400"}>{change.toFixed(2)}%</div>
                <div>
                  <Image src={trendUp ? green : red} alt="trend" width={60} height={20} />
                </div>
                <div>
                  <Link href={`/coin/${coin.id}`}>
                    <button className="bg-[#0047AB] hover:bg-[#3b82f6] text-white py-1.5 px-4 rounded-lg text-xs font-medium transition-colors cursor-pointer">
                      Trade
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-2.5">
          {visibleCoins.map((coin) => {
            const trendUp = (coin.sparkline_in_7d.price.at(-1) ?? 0) >= (coin.sparkline_in_7d.price[0] ?? 0);

            return (
              <Link key={coin.id} href={`/coin/${coin.id}`}>
                <div className="flex justify-between items-center rounded-xl p-3.5 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 min-w-0">
                    <Image src={coin.image} alt={coin.name} width={30} height={30} className="rounded-full shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-white">{coin.symbol.toUpperCase()}</div>
                      <div className="text-xs text-gray-500 truncate">{coin.name}</div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-0.5 shrink-0 ml-3">
                    <div className="text-white font-semibold text-sm">${coin.current_price.toLocaleString()}</div>
                    <Image src={trendUp ? green : red} alt="trend" width={48} height={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Toggle Button */}
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[#3b82f6] hover:text-white font-semibold text-sm transition-colors cursor-pointer px-4 py-2 rounded-lg hover:bg-white/5"
          >
            {showAll ? "Show Less" : "See All Coins \u2192"}
          </button>
        </div>
      </div>
    </section>
  );
}
