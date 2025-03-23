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
        return <div className="p-10 text-white">Loading...</div>;
    }

    const trendUp = coin.market_data.sparkline_7d.price[coin.market_data.sparkline_7d.price.length - 1] >= coin.market_data.sparkline_7d.price[0];

    return (
        <div className="p-10 bg-[#0f0c29] text-white min-h-screen">

            {/* Back to Market */}
            <button
                onClick={() => router.push("/")}
                className="mb-6 text-[#4c8bf5] hover:underline flex items-center gap-2"
            >
                ← Back to Market
            </button>

            <div className="flex items-center space-x-4 mb-6">
                <Image src={coin.image.large} alt={coin.name} width={50} height={50} />
                <h1 className="text-3xl font-bold">{coin.name} ({coin.symbol.toUpperCase()})</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Coin Data */}
                <div>
                    <p className="mb-2 text-lg">Current Price: <span className="font-bold">${coin.market_data.current_price.usd.toLocaleString()}</span></p>
                    <p className={`mb-2 text-lg ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                        24h Change: {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                    </p>
                    <p className="mb-2 text-lg">Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}</p>
                    <p className="mb-2 text-lg">Total Volume: ${coin.market_data.total_volume.usd.toLocaleString()}</p>
                </div>

                {/* Upgraded Chart */}
                <div className="h-[350px] bg-[#1c1c3b] p-4 rounded-lg">
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
                            }]
                        }}
                        options={{
                            responsive: true,
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
                                    ticks: { color: '#cbd5e1' },
                                    grid: { color: '#334155' },
                                },
                                y: {
                                    display: true,
                                    ticks: { color: '#cbd5e1', callback: (val) => `$${val}` },
                                    grid: { color: '#334155' }
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Coin Description */}
            <div className="mt-8 text-gray-300 leading-7">
                <h2 className="text-xl font-semibold mb-2">About {coin.name}</h2>
                <p dangerouslySetInnerHTML={{ __html: coin.description.en?.split('. ')[0] + '.' }} />
            </div>
        </div>
    );
}
