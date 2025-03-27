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
import BuyCrypto  from "./buycrypto";
import  SellCrypto  from "./sellcrypto";


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

export default function CryptoExchangePage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [showCoinList, setShowCoinList] = useState(false);
  const [searchCoin, setSearchCoin] = useState("");

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: "NG",
    name: "Nigeria",
  });
  const [showCountryList, setShowCountryList] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");

  const [txid, setTxid] = useState("");
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCoins = async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
      );
      const data = await res.json();
      setCoins(data);
      setSelectedCoin(data[0]);
    };

    const fetchCountries = async () => {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data: ApiCountry[] = await res.json();
      const sorted = data
        .map((c: ApiCountry) => ({
          name: c.name.common,
          code: c.cca2,
        }))
        .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
      setCountries(sorted);
    };

    fetchCoins();
    fetchCountries();
  }, []);

  const copyToClipboard = () => {
    const walletAddress = selectedCoin
      ? BYBIT_WALLET_ADDRESSES[selectedCoin.symbol.toUpperCase()][
          selectedCountry.code
        ]
      : "";
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Back Button */}
      <div
        className="flex items-center space-x-2 p-4 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <ArrowLeftIcon className="h-6 w-6" />
        <span>Back to home</span>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center items-center space-x-4 py-4">
        <button
          onClick={() => setActiveTab("buy")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "buy"
              ? "bg-[#0047AB] text-white shadow-lg scale-105"
              : "bg-gray-200 text-black"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab("sell")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "sell"
              ? "bg-[#0047AB] text-white shadow-lg scale-105"
              : "bg-gray-200 text-black"
          }`}
        >
          Sell
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "buy" ? (
          <BuyCrypto
            coins={coins}
            selectedCoin={selectedCoin}
            selectedCountry={selectedCountry}
          />
        ) : (
          <SellCrypto
            selectedCoin={selectedCoin}
            selectedCountry={selectedCountry}
            txid={txid}
            setTxid={setTxid}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Bybit Wallet Addresses (Replace with actual addresses)
const BYBIT_WALLET_ADDRESSES: Record<string, Record<string, string>> = {
  USDT: { NG: "0xYourBybitUSDTWallet", US: "0xYourBybitUSDTWalletUS" },
  BTC: { NG: "bc1YourBybitBTCWallet", US: "bc1YourBybitBTCWalletUS" },
  ETH: { NG: "0xYourBybitETHWallet", US: "0xYourBybitETHWalletUS" },
};