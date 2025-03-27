"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";

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

interface ApiCountry {
  name: { common: string };
  cca2: string;
}

// Bybit Wallet Addresses (Replace with actual addresses)
const BYBIT_WALLET_ADDRESSES: Record<string, Record<string, string>> = {
  USDT: { NG: "0xYourBybitUSDTWallet", US: "0xYourBybitUSDTWalletUS" },
  BTC: { NG: "bc1YourBybitBTCWallet", US: "bc1YourBybitBTCWalletUS" },
  ETH: { NG: "0xYourBybitETHWallet", US: "0xYourBybitETHWalletUS" },
};

export default function CryptoExchangePage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [showCoinList, setShowCoinList] = useState(false);
  const [searchCoin, setSearchCoin] = useState("");

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country>({ code: "NG", name: "Nigeria" });
  const [showCountryList, setShowCountryList] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");

  const [txid, setTxid] = useState("");
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCoins = async () => {
      const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd");
      const data = await res.json();
      setCoins(data);
      setSelectedCoin(data[0]);
    };

    const fetchCountries = async () => {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data: ApiCountry[] = await res.json();
      const sorted = data.map((c: ApiCountry) => ({
        name: c.name.common,
        code: c.cca2,
      })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));
      setCountries(sorted);
    };

    fetchCoins();
    fetchCountries();
  }, []);

  const copyToClipboard = () => {
    const walletAddress = selectedCoin
      ? BYBIT_WALLET_ADDRESSES[selectedCoin.symbol.toUpperCase()][selectedCountry.code]
      : "";
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Back Button */}
      <div className="flex items-center space-x-2 p-4 cursor-pointer" onClick={() => router.push("/")}>
        <ArrowLeftIcon className="h-6 w-6" />
        <span>Back to home</span>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center items-center space-x-4 py-4">
        <button
          onClick={() => setActiveTab("buy")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "buy" ? "bg-[#0047AB] text-white shadow-lg scale-105" : "bg-gray-200 text-black"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab("sell")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "sell" ? "bg-[#0047AB] text-white shadow-lg scale-105" : "bg-gray-200 text-black"
          }`}
        >
          Sell
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "buy" ? (
          /** ======== BUY UI ======== */
          <motion.div
            key="buy"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4"
          >
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">Want to buy crypto? <br /> It’s never been simpler.</h1>
              <p className="text-gray-600 text-base">100+ cryptocurrencies. Plenty of ways to pay. Absolutely zero hassle.</p>
            </div>

            {/* Right-Side Buy UI */}
            <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-center font-semibold text-lg mb-4">Buy Crypto</h2>

              {/* Country & Coin Selector */}
              <div className="flex items-center justify-between">
                <Image src={selectedCoin?.image || ""} alt={selectedCoin?.name || ""} width={32} height={32} />
                <span>{selectedCoin?.name || "Select Coin"}</span>
              </div>

              <p className="text-center text-4xl font-semibold mt-6">₦ 0</p>
              <p className="text-center text-gray-500 text-sm">0 {selectedCoin?.symbol?.toUpperCase()}</p>

              <button className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-6">Continue</button>
            </div>
          </motion.div>
        ) : (
          /** ======== SELL UI ======== */
          <motion.div
            key="sell"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4"
          >
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">Sell your crypto <br /> Instantly and securely.</h1>
              <p className="text-gray-600 text-base">Copy our wallet address, send your crypto, and enter your transaction hash (TXID) to confirm.</p>
            </div>

            <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-center font-semibold text-lg mb-4">Sell Crypto</h2>
              <p className="text-gray-500">Send to: {selectedCoin ? BYBIT_WALLET_ADDRESSES[selectedCoin.symbol.toUpperCase()][selectedCountry.code] : "Select a coin"}</p>
              <input type="text" placeholder="Enter TXID" className="border px-4 py-3 rounded-lg w-full mt-4" value={txid} onChange={(e) => setTxid(e.target.value)} />
              <button className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-4">Submit TXID</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
