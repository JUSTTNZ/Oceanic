"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

export default function BuyCrypto() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchCoin, setSearchCoin] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const serviceFee = 30; // Your ₦30 gain

  // Fetch coins from CoinGecko API
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
        );
        const data = await response.json();
        setCoins(data);
        if (data.length > 0) {
          setSelectedCoin(data[0]);
        }
      } catch (err) {
        setError("Failed to fetch cryptocurrencies");
        console.error("Error fetching coins:", err);
      }
    };

    fetchCoins();
  }, []);

  // Fetch countries from RestCountries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        
        const formattedCountries = data
          .filter((country: any) => 
            country.currencies && Object.keys(country.currencies).length > 0
          )
          .map((country: any) => {
            const currencyCode = Object.keys(country.currencies)[0];
            return {
              code: country.cca2,
              name: country.name.common,
              flag: country.flag,
              currency: currencyCode,
              currencySymbol: country.currencies[currencyCode].symbol || currencyCode
            };
          })
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
        // Set default country to Nigeria if available
        const nigeria = formattedCountries.find((c: Country) => c.code === "NG");
        setSelectedCountry(nigeria || formattedCountries[0]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch countries");
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, []);

  // Fetch exchange rate based on selected country
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (!selectedCountry) return;

      try {
        // Using ExchangeRate-API (you'll need an API key for production)
        // This is a free tier simulation - replace with actual API call
        const rates: Record<string, number> = {
          NG: 1500, // Nigeria - NGN
          US: 1,    // USA - USD
          GH: 12,   // Ghana - GHS
          KE: 150,  // Kenya - KES
          ZA: 18,   // South Africa - ZAR
          UK: 0.8,  // UK - GBP
          EU: 0.9   // Eurozone - EUR
        };
        
        // Simulated API response
        setExchangeRate(rates[selectedCountry.code] || 1);
        
        /* 
        // Production API call example:
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD`
        );
        const data = await response.json();
        setExchangeRate(data.conversion_rates[selectedCountry.currency] || 1);
        */
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
        setExchangeRate(1); // Fallback to 1:1 rate
      }
    };

    fetchExchangeRate();
  }, [selectedCountry]);

  // Calculate coin amount when inputs change
  useEffect(() => {
    if (amount && selectedCoin && exchangeRate > 0 && selectedCountry) {
      const localValue = parseFloat(amount) || 0;
      const amountAfterFee = localValue - serviceFee;
      const coinValue = amountAfterFee > 0 ? 
        amountAfterFee / (selectedCoin.current_price * exchangeRate) : 
        0;
      setCoinAmount(parseFloat(coinValue.toFixed(6)));
    } else {
      setCoinAmount(0);
    }
  }, [amount, selectedCoin, exchangeRate, selectedCountry]);

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchCoin.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchCoin.toLowerCase())
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const formatCurrency = (value: number) => {
    if (!selectedCountry) return value.toString();
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCountry.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace(selectedCountry.currency, selectedCountry.currencySymbol);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!selectedCountry) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">No country data available</div>
      </div>
    );
  }

  return (
    <motion.div
      key="buy"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4"
    >
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Buy Crypto Instantly <br /> With Local Currency
        </h1>
        <p className="text-gray-600 text-base">
          Get the best rates in {selectedCountry.name} with instant delivery to your wallet.
        </p>
        
        {coins.length > 0 && (
          <div className="pt-4">
            <h4 className="font-medium text-gray-700">Current Prices:</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {coins.slice(0, 4).map(coin => (
                <div key={coin.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <Image 
                    src={coin.image} 
                    alt={coin.name} 
                    width={24} 
                    height={24} 
                    className="mr-2"
                  />
                  <div>
                    <p className="font-medium">{coin.symbol.toUpperCase()}</p>
                    <p className="text-sm">
                      {formatCurrency(coin.current_price * exchangeRate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-center font-semibold text-lg mb-4">Buy Crypto</h2>

        {/* Country Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Country</label>
          <div className="relative">
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="flex items-center justify-between w-full border px-4 py-3 rounded-lg text-sm"
            >
              <div className="flex items-center">
                <span className="mr-2">{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 ml-2" />
            </button>

            {showCountryDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowCountryDropdown(false);
                    }}
                  >
                    <span className="mr-2">{country.flag}</span>
                    {country.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coin Selector */}
        {selectedCoin && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Cryptocurrency</label>
            <div className="relative">
              <button
                onClick={() => setShowCoinDropdown(!showCoinDropdown)}
                className="flex items-center justify-between w-full border px-4 py-3 rounded-lg text-sm"
              >
                <div className="flex items-center">
                  <Image 
                    src={selectedCoin.image} 
                    alt={selectedCoin.name} 
                    width={24} 
                    height={24} 
                    className="mr-2"
                  />
                  <span>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</span>
                </div>
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button>

              {showCoinDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      placeholder="Search coins..."
                      className="w-full px-3 py-2 text-sm border rounded-md"
                      value={searchCoin}
                      onChange={(e) => setSearchCoin(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredCoins.map((coin) => (
                      <button
                        key={coin.id}
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          setSelectedCoin(coin);
                          setShowCoinDropdown(false);
                          setSearchCoin("");
                        }}
                      >
                        <Image 
                          src={coin.image} 
                          alt={coin.name} 
                          width={20} 
                          height={20} 
                          className="mr-2"
                        />
                        {coin.name} ({coin.symbol.toUpperCase()}) - 
                        <span className="ml-2 font-medium">
                          {formatCurrency(coin.current_price * exchangeRate)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Amount in {selectedCountry.currency} ({selectedCountry.currencySymbol})
          </label>
          <input
            type="text"
            placeholder="0.00"
            className="border px-4 py-3 rounded-lg w-full text-right text-lg font-medium"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>

        {/* Conversion Display */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Service Fee:</span>
            <span className="font-medium">
              {selectedCountry.currencySymbol}{serviceFee}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">You pay:</span>
            <span className="font-semibold">
              {selectedCountry.currencySymbol}{parseFloat(amount || "0").toLocaleString('en-US')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">You receive:</span>
            <span className="font-semibold">
              {coinAmount} {selectedCoin?.symbol.toUpperCase()}
            </span>
          </div>
          {selectedCoin && (
            <div className="pt-2 text-xs text-gray-500 border-t">
              Rate: {formatCurrency(selectedCoin.current_price * exchangeRate)} per {selectedCoin.symbol.toUpperCase()}
            </div>
          )}
        </div>

        <button 
          className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-4 hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!amount || parseFloat(amount) <= serviceFee || !selectedCoin}
        >
          Continue to Payment
        </button>

        <div className="text-xs text-gray-500 text-center">
          Includes {selectedCountry.currencySymbol}{serviceFee} service fee. Rates update in real-time.
        </div>
      </div>
    </motion.div>
  );
}