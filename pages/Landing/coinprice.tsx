// /src/components/coinprice.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
import { Line } from "react-chartjs-2";
import { Coin } from "./page";

interface CoinLiveProps {
  coins: Coin[];
}

export default function CoinLive({ coins }: CoinLiveProps) {
  const [search, setSearch] = useState("");

  const filteredCoins = Array.isArray(coins) ? coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  ) : [];
  

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0047AB]">Popular Cryptocurrencies</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-[#0047AB]"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredCoins.map((coin) => {
          const trendUp = coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length - 1] >= coin.sparkline_in_7d.price[0];
          return (
            <div key={coin.id} className="p-4 border rounded-lg shadow-md bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Image src={coin.image} alt={coin.name} width={32} height={32} className="w-6 h-6" />
                  <h2 className="font-bold">{coin.name} ({coin.symbol.toUpperCase()})</h2>
                </div>
                <span className={`text-sm px-2 py-1 rounded ${trendUp ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{trendUp ? '▲' : '▼'}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">${coin.current_price.toFixed(2)}</h3>
              <Line
                data={{
                  labels: coin.sparkline_in_7d.price.map((_, idx) => idx),
                  datasets: [{
                    data: coin.sparkline_in_7d.price,
                    borderColor: trendUp ? 'green' : 'red',
                    fill: false,
                    tension: 0.1
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } }
                }}
                height={100}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
