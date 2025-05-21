/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "../../hooks/toast";
import CountryDropdown from "../components/buy/country";
import CoinDropdown from "../components/buy/coin";
import AmountInput from "../components/buy/amout";
import ConversionDisplay from "../components/buy/conversion";
import FirstSide from "../components/buy/firstside";
import WalletAddressBuy from "../components/buy/walletaddress";

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
  const [walletAddress, setWalletAddress] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const { ToastComponent, showToast } = useToast();

  const serviceFee = 50;

  const onSuccess = (ref: string) => {
   showToast("Payment successful!", "success");
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  const payWithPaystack = (ref: string) => {
    interface PaystackPopType {
      setup: (options: {
        key: string | undefined;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    }

    const paystackPop = (window as { PaystackPop?: PaystackPopType }).PaystackPop;
    const handler = paystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: userEmail || "user@example.com",
      amount: Math.round(calculatedLocalCurrencyAmount * 100),
      currency: "NGN",
      ref,
      callback: function (response: { reference: string }) {
        onSuccess(response.reference);
      },
      onClose: function () {
        onClose();
      },
    });

    if (handler) {
      handler.openIframe();
    } else {
      showToast("Paystack SDK failed to load. Please refresh and try again.", "error");
    }
  };

  function generateUniqueTxid() {
    return "tx_" + Math.random().toString(36).substr(2, 9);
  }

  const handleCreateTransaction = async () => {
    setLoadingPayment(true);
    const token = localStorage.getItem("accessToken");

    try {
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

      if (!res.ok || !data?.data?.txid) {
        showToast("Failed to create transaction.", "error");
        setLoadingPayment(false);
        return;
      }

      setReference(data.data.txid);
      payWithPaystack(data.data.txid);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong.", "error");
    } finally {
      setLoadingPayment(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
        if (!response.ok) setError("Failed to fetch coins");
        const data = await response.json();
        setCoins(data);
        setSelectedCoin(data[0]);
        setLoading(false);
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
        if (!response.ok) setError("Failed to fetch countries");
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
        console.log("ress", response)
        if (!response.ok) setError("Failed to fetch rate");
        const data = await response.json();
        console.log(data)
        setExchangeRate(data.conversion_rates[selectedCountry.currency] || 1);
        setLoading(false);
      } catch (err){
        setError("Failed to fetch countries");
        console.log(err);
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

  const adjustedExchangeRate = exchangeRate + 50;
  const usdAmount = parseFloat(amount || "0");
  const calculatedLocalCurrencyAmount = usdAmount * adjustedExchangeRate;

   if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

if (error){
  return(
 <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
    
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Network error</h3>
          <p className="text-gray-600 mb-4">Make you are connected to the internet</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

  return (
    <motion.div
      key="buy"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4 font-grotesk"
    >

      <FirstSide coins={coins} selectedCountry={selectedCountry ?? countries[0]} exchangeRate={exchangeRate} />

      <div className="w-full max-w-sm mx-auto p-6 md:shadow-xl shadow-2xl space-y-4 bg-gray-800/30 border border-gray-700/20 rounded-xl hover:border-blue-500/30 transition-all backdrop-blur-sm hover:shadow-blue-500/10">
        <h2 className="text-center font-semibold text-lg mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Buy Crypto</h2>

        <CountryDropdown countries={countries} selectedCountry={selectedCountry ?? countries[0]} onSelect={setSelectedCountry} />
        <CoinDropdown coins={coins} selectedCoin={selectedCoin} onSelect={setSelectedCoin} exchangeRate={exchangeRate} formatCurrency={(val) => val.toString()} />
        <WalletAddressBuy walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
        <AmountInput value={amount} onChange={setAmount} />
        <ConversionDisplay selectedCountry={selectedCountry ?? countries[0]} selectedCoin={selectedCoin} serviceFee={serviceFee} amount={amount} localCurrencyAmount={calculatedLocalCurrencyAmount.toString()} coinAmount={coinAmount} exchangeRate={exchangeRate} />

    
          <button
            onClick={handleCreateTransaction}
            className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-4 hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!amount || parseFloat(amount) <= serviceFee || !selectedCoin || !walletAddress || loadingPayment}

          >
            {
              loadingPayment ?(
                  <div className="flex items-center justify-center gap-2 text-white font-medium">
            <span className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></span>
            Checking payment....
          </div>
              ): (
              "  Continue to Payment"
              )
            }
          
          </button>
      
        {ToastComponent}
      </div>
    </motion.div>
  );
}
