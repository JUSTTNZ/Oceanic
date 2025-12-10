"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
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

interface CoinDetail {
    id: string;
    name: string;
    symbol: string;
    image: { large: string };
    market_data: {
        current_price: { usd: number };
        price_change_percentage_24h: number;
        sparkline_7d: { price: number[] };
        market_cap: { usd: number };
        total_volume: { usd: number };
    };
    description: { en: string };
}

export default function CoinDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [coin, setCoin] = useState<CoinDetail | null>(null);

    useEffect(() => {
        if (!id) return;
        async function fetchCoin() {
            const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?sparkline=true`);
            const data = await res.json();
            setCoin(data);
        }
        fetchCoin();
    }, [id]);

    if (!coin) {
        return (
            <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    const trendUp = coin.market_data.sparkline_7d.price[coin.market_data.sparkline_7d.price.length - 1] >= coin.market_data.sparkline_7d.price[0];

    return (
        <div className="min-h-screen bg-[#0f0c29] text-white overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-10">

                {/* Back to Market */}
                <button
                    onClick={() => router.push("/")}
                    className="mb-4 sm:mb-6 text-[#4c8bf5] hover:underline flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base"
                >
                    ← Back to Market
                </button>

                {/* Coin Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex-shrink-0">
                            <Image 
                                src={coin.image.large} 
                                alt={coin.name} 
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold break-words flex-1 min-w-0">
                            {coin.name} ({coin.symbol.toUpperCase()})
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Coin Data */}
                    <div className="bg-[#1c1c3b] p-3 sm:p-4 md:p-6 rounded-lg">
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-[#4c8bf5]">Market Data</h2>
                        
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2 gap-2">
                                <span className="text-gray-400 text-xs sm:text-sm md:text-base whitespace-nowrap">Current Price:</span>
                                <span className="font-bold text-sm sm:text-base md:text-lg text-right break-all">
                                    ${coin.market_data.current_price.usd.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-gray-700 pb-2 gap-2">
                                <span className="text-gray-400 text-xs sm:text-sm md:text-base whitespace-nowrap">24h Change:</span>
                                <span className={`font-bold text-sm sm:text-base md:text-lg text-right ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                                    {coin.market_data.price_change_percentage_24h > 0 ? '+' : ''}
                                    {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-gray-700 pb-2 gap-2">
                                <span className="text-gray-400 text-xs sm:text-sm md:text-base whitespace-nowrap">Market Cap:</span>
                                <span className="font-semibold text-xs sm:text-sm md:text-base text-right break-all">
                                    ${coin.market_data.market_cap.usd.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center gap-2">
                                <span className="text-gray-400 text-xs sm:text-sm md:text-base whitespace-nowrap">Total Volume:</span>
                                <span className="font-semibold text-xs sm:text-sm md:text-base text-right break-all">
                                    ${coin.market_data.total_volume.usd.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-[#1c1c3b] p-3 sm:p-4 md:p-6 rounded-lg overflow-hidden">
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-[#4c8bf5]">7 Day Price Chart</h2>
                        <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full">
                            <Line
                                data={{
                                    labels: coin.market_data.sparkline_7d.price.map((_, idx) => {
                                        const date = new Date();
                                        date.setHours(date.getHours() - (168 - idx));
                                        return date.toLocaleString("en-US", { weekday: "short", hour: "2-digit", hour12: true });
                                    }),
                                    datasets: [{
                                        label: `${coin.name} Price (7D)`,
                                        data: coin.market_data.sparkline_7d.price,
                                        borderColor: trendUp ? '#4ade80' : '#f87171',
                                        backgroundColor: trendUp ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                                        fill: true,
                                        tension: 0.3,
                                        borderWidth: 2,
                                        pointRadius: 0,
                                        pointHoverRadius: 4,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    interaction: { mode: 'index', intersect: false },
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => `$${(context.raw as number).toFixed(2)}`
                                            }
                                        },
                                        legend: { display: false }
                                    },
                                    scales: {
                                        x: {
                                            display: true,
                                            ticks: { 
                                                color: '#cbd5e1',
                                                maxRotation: 45,
                                                minRotation: 0,
                                                autoSkip: true,
                                                maxTicksLimit: window.innerWidth < 385 ? 4 : window.innerWidth < 640 ? 6 : 8,
                                                font: {
                                                    size: window.innerWidth < 385 ? 8 : 10
                                                }
                                            },
                                            grid: { color: '#334155' },
                                        },
                                        y: {
                                            display: true,
                                            ticks: { 
                                                color: '#cbd5e1', 
                                                callback: (val) => `${val}`,
                                                font: {
                                                    size: window.innerWidth < 385 ? 8 : 10
                                                }
                                            },
                                            grid: { color: '#334155' }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Coin Description */}
                <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 bg-[#1c1c3b] p-3 sm:p-4 md:p-6 rounded-lg overflow-hidden">
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-[#4c8bf5]">
                        About {coin.name}
                    </h2>
                    <div 
                        className="text-gray-300 leading-5 sm:leading-6 md:leading-7 text-xs sm:text-sm md:text-base break-words overflow-wrap-anywhere"
                        dangerouslySetInnerHTML={{ __html: coin.description.en?.split('. ').slice(0, 3).join('. ') + '.' }} 
                    />
                </div>
            </div>
        </div>
    );
}