/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CountryDropdown from "../components/buy/country";
import CoinDropdown from "../components/buy/coin";
import AmountInput from "../components/buy/amout";
import ConversionDisplay from "../components/buy/conversion";
import FirstSide from "../components/buy/firstside";
import WalletAddressBuy from "../components/buy/walletaddress";
// import { PaystackButton } from "react-paystack";
const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { 
    ssr: false,
    loading: () => <div className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-4 text-center">Loading payment...</div>
  }
);

// Dynamically import the wrapper to avoid SSR crash
// const PaystackButton = dynamic(() => import("./PaystackButtonWrapper"), {
//   ssr: false,
// });

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
interface PaystackButtonProps {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
  currency?: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  // Other Paystack button props...
}


export default function BuyCrypto() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const serviceFee = 50;

  const onSuccess = (ref: string) => {
    alert("Payment successful!");
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  function generateUniqueTxid() {
    return "tx_" + Math.random().toString(36).substr(2, 9);
  }

  const createTransaction = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch("https://oceanic-servernz.vercel.app/api/v1/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        coin: selectedCoin?.symbol,
        amount: parseFloat(amount),
        txid: generateUniqueTxid(),
        type: "buy",
        country: selectedCountry?.name,
        walletAddressUsed: walletAddress,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to create transaction.");
      return;
    }

    if (!data?.data?.txid) {
      alert("Invalid transaction response.");
      return;
    }

    setReference(data.data.txid);
  };

  useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (!token) return;

  const fetchUser = async () => {
    try {
      const res = await fetch("https://oceanic-servernz.vercel.app/api/v1/users/getCurrentUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUserEmail(data.data.email);
      } else {
        console.error("Failed to fetch user email:", data.message);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  fetchUser();
}, []);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch("/api/coin");
        if (!response.ok) 
          setError("Failed to fetch coins");
        const data = await response.json();
        setCoins(data);
        setSelectedCoin(data[0]);
      } catch (err) {
        setError("Failed to fetch cryptocurrencies");
        console.log(err);
        
      }
    };
    fetchCoins();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/country");
        if (!response.ok) 
          setError("Failed to fetch countries");
        const data = await response.json();

        const formatted = data
          .filter((c: ApiCountry) => c.currencies && Object.keys(c.currencies).length > 0)
          .map((c: ApiCountry) => {
            const code = Object.keys(c.currencies)[0];
            return {
              code: c.cca2,
              name: c.name.common,
              flag: c.flags?.png || c.flags?.svg,
              currency: code,
              currencySymbol: c.currencies[code]?.symbol || code,
            };
          });

        setCountries(formatted);
        setSelectedCountry(formatted.find((c: Country) => c.code === "NG") || formatted[0]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch countries");
        console.log(err);
        
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (!selectedCountry) return;

      try {
        const response = await fetch("/api/rate");
        if (!response.ok) 
          setError("Failed to fetch rate");
        const data = await response.json();
        setExchangeRate(data.conversion_rates[selectedCountry.currency] || 1);
      } catch {
        setExchangeRate(1);
      }
    };
    fetchExchangeRate();
  }, [selectedCountry]);

  useEffect(() => {
    if (amount && selectedCoin && exchangeRate > 0 && selectedCountry) {
      const localVal = parseFloat(amount) || 0;
      const netAmount = localVal - serviceFee;
      const coinVal = netAmount > 0 ? netAmount / (selectedCoin.current_price * exchangeRate) : 0;
      setCoinAmount(parseFloat(coinVal.toFixed(6)));
    } else {
      setCoinAmount(0);
    }
  }, [amount, selectedCoin, exchangeRate, selectedCountry]);

  const formatCurrency = (value: number) => {
    if (!selectedCountry) return value.toString();
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCountry.currency,
      minimumFractionDigits: 2,
    }).format(value).replace(selectedCountry.currency, selectedCountry.currencySymbol);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
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
  // const paystackConfig: PaystackConfig = {
  //   reference,
  //   email: "user@example.com",
  //   amount: (parseFloat(amount) - serviceFee) * 100,
  //   publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
  // };
  
  return (
    <motion.div
      key="buy"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4 font-grotesk"
    >
      <FirstSide coins={coins} selectedCountry={selectedCountry} exchangeRate={exchangeRate} />

      <div className="w-full max-w-sm mx-auto   p-6 md:shadow-xl shadow-2xl space-y-4 bg-gray-800/30 border border-gray-700/20 rounded-xl hover:border-blue-500/30 transition-all backdrop-blur-sm hover:shadow-blue-500/10">
        <h2 className="text-center font-semibold text-lg mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Buy Crypto</h2>

        <CountryDropdown
          countries={countries}
          selectedCountry={selectedCountry}
          onSelect={setSelectedCountry}
        />

        <CoinDropdown
          coins={coins}
          selectedCoin={selectedCoin}
          onSelect={setSelectedCoin}
          exchangeRate={exchangeRate}
          formatCurrency={formatCurrency}
        />
    <WalletAddressBuy
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
         
         />
        <AmountInput
         
          value={amount}
          onChange={setAmount}
        />
      
        <ConversionDisplay
          selectedCountry={selectedCountry}
          selectedCoin={selectedCoin}
          serviceFee={serviceFee}
          amount={amount}
          coinAmount={coinAmount}
          exchangeRate={exchangeRate}
          
        />

    

        {reference ? (
          <PaystackButton
          reference={reference}
    email={"user@example.com"}
    amount={(parseFloat(amount) - serviceFee) * 100}
    publicKey={process.env.NEXT_PUBLIC_PAYSTACK_KEY!}
    onSuccess={(reference) => {
      onSuccess(reference);
    }}
    onClose={() => {
      onClose();
     
    }}

           
          />
        ) : (
          <button
            onClick={createTransaction}
            className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-4 hover:bg-blue-700 transition-colors disabled:opacity-50
              bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4  transition-all hover:shadow-lg hover:shadow-blue-500/20
            "
            disabled={!amount || parseFloat(amount) <= serviceFee || !selectedCoin || !walletAddress}
          >
            Continue to Payment
          </button>
        )}

      
      </div>
    </motion.div>
  );
}
