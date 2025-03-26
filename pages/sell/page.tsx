"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon,
  PlayPauseIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function SendPage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [searchCoin, setSearchCoin] = useState("");
  const [coins, setCoins] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<any | null>(null);
  const [showCoinList, setShowCoinList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>({ code: "NG", name: "Nigeria" });
  const [searchCountry, setSearchCountry] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);

  const router = useRouter();

  const handleBack = () => router.push("/");

  useEffect(() => {
    const fetchCoins = async () => {
      const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd");
      const data = await res.json();
      setCoins(data);
      setSelectedCoin(data[0]);
    };
    const fetchCountries = async () => {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();
      const sorted = data.map(c => ({
        name: c.name.common,
        code: c.cca2
      })).sort((a, b) => a.name.localeCompare(b.name));
      setCountries(sorted);
    };
    fetchCoins();
    fetchCountries();
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchCoin.toLowerCase())
  );

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchCountry.toLowerCase())
  );

  if (showSettings) {
    return (
      <div className="bg-white min-h-screen p-6">
        <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={() => setShowSettings(false)}>
          <ArrowLeftIcon className="h-6 w-6" />
          <span className="font-semibold">Settings</span>
        </div>
        <ul className="space-y-4">
          <li className="flex justify-between items-center cursor-pointer hover:bg-gray-100 px-4 py-3 rounded-md">
            <div className="flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Preferences</span>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-500" />
          </li>
          <li className="flex justify-between items-center cursor-pointer hover:bg-gray-100 px-4 py-3 rounded-md">
            <div className="flex items-center space-x-2">
              <InformationCircleIcon className="h-5 w-5" />
              <span>Help</span>
            </div>
            <ArrowRightIcon className="h-4 w-4 text-gray-500" />
          </li>
          <li className="flex justify-between items-center cursor-pointer hover:bg-gray-100 px-4 py-3 rounded-md">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Terms & Privacy</span>
            </div>
            <ArrowRightIcon className="h-4 w-4 text-gray-500" />
          </li>
        </ul>
        <p className="text-xs text-center text-gray-400 mt-6">Powered by Oceanic</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="flex items-center space-x-2 p-4 cursor-pointer" onClick={handleBack}>
        <ArrowLeftIcon className="h-6 w-6" />
        <span>Back to home</span>
      </div>
      <hr className="text-gray-400" />

      <div className="flex justify-center items-center space-x-4 py-4">
        <button onClick={() => setActiveTab("buy")} className={`px-4 py-2 rounded-md font-semibold ${activeTab === "buy" ? "bg-[#0047AB] text-white" : "bg-gray-200 text-black"}`}>Buy</button>
        <button onClick={() => setActiveTab("sell")} className={`px-4 py-2 rounded-md font-semibold ${activeTab === "sell" ? "bg-[#0047AB] text-white" : "bg-gray-200 text-black"}`}>Sell</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto py-10 px-4">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Want to {activeTab} crypto? <br />It’s never been simpler.
          </h1>
          <p className="text-gray-600 text-base">
            100+ cryptocurrencies. Plenty of ways to pay. Absolutely zero hassle.
            <br />
            Oceanic makes it easy to buy, sell, and swap crypto. Open your free account today.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="bg-black text-white px-6 py-2 rounded-md font-semibold">Get started</button>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 px-3 py-2 rounded-md">★</div>
              <div>
                <p className="font-bold text-sm">TrustScore 4.2</p>
                <p className="text-xs text-gray-500">93K+ Reviews</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto border rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
            <PlayPauseIcon className="w-5 h-5 bg-gray-100 p-1 rounded-full" />
            <p className="font-bold text-black capitalize">{activeTab}</p>
            <Cog6ToothIcon onClick={() => setShowSettings(true)} className="w-5 h-5 bg-gray-100 p-1 rounded-full cursor-pointer" />
          </div>

          <div className="text-center text-4xl font-semibold text-black mb-1">₦ 0</div>
          <div className="text-center text-sm text-gray-500 mb-6 flex justify-center items-center gap-1">
            <ArrowsRightLeftIcon className="w-4 h-4" />
            0 {selectedCoin?.symbol?.toUpperCase() || "BTC"}
          </div>

          {/* Country Dropdown remains unchanged */}

          {/* Coin Dropdown */}
          <div className="relative mb-4">
            <div
              className="flex items-center justify-between border px-4 py-3 rounded-xl cursor-pointer"
              onClick={() => setShowCoinList(!showCoinList)}
            >
              <div className="flex items-center gap-3">
                {selectedCoin && (
                  <Image src={selectedCoin.image} alt={selectedCoin.name} width={32} height={32} />
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs text-gray-500">{activeTab === "buy" ? "Buy" : "Sell"}</span>
                  <span className="font-semibold">{selectedCoin?.name || "Select Coin"}</span>
                </div>
              </div>
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </div>

            {showCoinList && (
              <div className="absolute z-10 bg-white w-full border mt-2 rounded-lg shadow-md p-3 max-h-60 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Search coin..."
                  value={searchCoin}
                  onChange={(e) => setSearchCoin(e.target.value)}
                  className="w-full mb-2 border px-3 py-2 rounded-md"
                />
                <h4 className="text-sm font-semibold text-gray-500 px-2 mb-2">Popular tokens</h4>
                <ul>
                  {filteredCoins.map((coin) => (
                    <li
                      key={coin.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedCoin(coin);
                        setShowCoinList(false);
                        setSearchCoin("");
                      }}
                    >
                      <Image src={coin.image} alt={coin.name} width={24} height={24} />
                      <div>
                        <p className="font-semibold">{coin.name}</p>
                        <p className="text-xs text-gray-500">{coin.symbol.toUpperCase()} • {coin.name}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full">
            Continue
          </button>

          <p className="text-xs text-center text-gray-400 mt-3">Powered by Oceanic</p>
        </div>
      </div>
    </div>
  );
}
