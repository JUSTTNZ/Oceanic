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
  flag: string;
}

interface ApiCountry {
  name: { common: string };
  cca2: string;
  flags: { png: string };
}

export default function CryptoExchangePage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: "Nigeria",
    code: "NG",
    flag: "https://flagcdn.com/w320/ng.png",
  });
  const [showCountryList, setShowCountryList] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .map((c: ApiCountry) => ({
            name: c.name.common,
            code: c.cca2,
            flag: c.flags.png,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(sorted);
      });
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Back Button */}
      <div
        className="flex items-center space-x-2 p-4 cursor-pointer"
        onClick={() => setShowCountryList(!showCountryList)}
      >
        <Image
          src={selectedCountry.flag}
          alt={selectedCountry.name}
          width={24}
          height={24}
          className="rounded-full"
        />
        <span>{selectedCountry.name}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </div>

      {showCountryList && (
        <div className="absolute bg-white border mt-2 w-64 max-h-60 overflow-auto rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Search country..."
            className="p-2 w-full border-b outline-none"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
          />
          <ul>
            {countries
              .filter((country) =>
                country.name.toLowerCase().includes(searchCountry.toLowerCase())
              )
              .map((country) => (
                <li
                  key={country.code}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCountry(country);
                    setShowCountryList(false);
                  }}
                >
                  <Image
                    src={country.flag}
                    alt={country.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span>{country.name}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
      
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

              <p className="text-center text-4xl font-semibold mt-6">{selectedCountry.code} 0</p>
              <p className="text-center text-gray-500 text-sm">0 BTC</p>

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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}