"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import CountryDropdown from "../components/buy/country";
import CoinDropdown from "../components/buy/coin";
import AmountInput from "../components/buy/amout";
import ConversionDisplay from "../components/buy/conversion";
import FirstSide from "../components/buy/firstside";

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

  interface Currency {
    [code: string]: {
      name: string;
      symbol: string;
    };
  }
  
  interface ApiCountry {
    cca2: string;
    name: {
      common: string;
    };
    flags: {
      png?: string;
      svg?: string;
    };
    currencies: Currency;
  }
  
  
export default function BuyCrypto() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const serviceFee = 30; // Your ₦30 gain

  // Fetch coins from CoinGecko API
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch("/api/coin");
        if (!response.ok) {
          throw new Error("Failed to fetch cryptocurrencies");
        }
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
        const response = await fetch("/api/country");
        if (!response.ok) {
          throw new Error("Failed to fetch cryptocurrencies");
        }
        const data = await response.json();
        
        const formattedCountries = data
          .filter((country: ApiCountry) => 
            country.currencies && Object.keys(country.currencies).length > 0
          )
          .map((country: ApiCountry) => {
            const currencyCode = Object.keys(country.currencies)[0];
            return {
              code: country.cca2,
              name: country.name.common,
              flag: country.flags?.png || country.flags?.svg,
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
        const response = await fetch("/api/rate");
        if (!response.ok) {
          throw new Error("Failed to fetch cryptocurrencies");
        }
        const data = await response.json();
        setExchangeRate(data.conversion_rates[selectedCountry.currency] || 1);
        
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
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4  "
    >
    
 <FirstSide
        coins={coins || []}
        selectedCountry={selectedCountry}
        exchangeRate={exchangeRate}
      />
      <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-center font-semibold text-lg mb-4">Buy Crypto</h2>

        {/* Country Selector */}
        <CountryDropdown
  countries={countries}
  selectedCountry={selectedCountry}
  onSelect={(country) => setSelectedCountry(country)}
  className="mb-4"
/>

        {/* Coin Selector */}
        <CoinDropdown 
  coins={coins}
  selectedCoin={selectedCoin}
  onSelect={(coin) => setSelectedCoin(coin)}
  exchangeRate={exchangeRate}
  formatCurrency={formatCurrency}
/>
        {/* Amount Input */}
        <AmountInput
  selectedCountry={selectedCountry}
  value={amount}
  onChange={setAmount}
  className="mb-4"
/>

        {/* Conversion Display */}
        <ConversionDisplay
  selectedCountry={selectedCountry}
  selectedCoin={selectedCoin}
  serviceFee={30}
  amount={amount}
  coinAmount={coinAmount}
  exchangeRate={exchangeRate}
  formatCurrency={(amount) => `₦${amount.toFixed(2)}`}
/>

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