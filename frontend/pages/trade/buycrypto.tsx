/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useToast } from "../../hooks/toast";
import CountryDropdown from "../components/buy/country";
import CoinDropdown from "../components/buy/coin";
import AmountInput from "../components/buy/amout";
import ConversionDisplay from "../components/buy/conversion";
import FirstSide from "../components/buy/firstside";
import WalletAddressBuy from "../components/buy/walletaddress";
//import ErrorDisplay from "../../ui/errorbuy"
import LoadingDisplay from '../../ui/loading'
import { apiClients } from "@/lib/apiClient";

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

interface Transaction {
  txid: string;
  status: 'pending' | 'confirmed' | 'paid';
  // Add other properties as needed
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
  const pollingRef = useRef<number | null>(null);

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
      email: userEmail ,
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
  

    try {
      const res = await apiClients.request(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        
        credentials: "include",
        body: JSON.stringify({
          coin: selectedCoin?.symbol,
          amount: parseFloat(amount),
          coinAmount: coinAmount,
          txid: generateUniqueTxid(),
          type: "buy",
          country: selectedCountry?.name,
          walletAddressUsed: walletAddress,
        }),
      });

      const data = await res.json();
  console.log(data)
      if (!res.ok || !data?.data?.txid) {
        showToast("Failed to create transaction.", "error");
        setLoadingPayment(false);
        return;
      }

      setReference(data.data.txid);
      // persist expiry for 10 minutes (use createdAt from backend if available)
      try {
        const expiry = new Date(data.data.createdAt).getTime() + 10 * 60 * 1000;
        localStorage.setItem(`tx_expiry_${data.data.txid}`, String(expiry));
      } catch (e) {
        localStorage.setItem(`tx_expiry_${data.data.txid}`, String(Date.now() + 10 * 60 * 1000));
      }

      // start polling for status updates
      if (pollingRef.current) window.clearInterval(pollingRef.current);
      pollingRef.current = window.setInterval(async () => {
        try {
          const resp = await apiClients.request(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction/user`, {
            method: 'GET',
            credentials: 'include'
          });
          if (!resp.ok) return;
          const j = await resp.json();
          const txs = Array.isArray(j.data) ? j.data : [];
          const found = txs.find((t: Transaction) => t.txid === data.data.txid);
          if (found && found.status === 'confirmed') {
            if (pollingRef.current) {
              window.clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            localStorage.removeItem(`tx_expiry_${data.data.txid}`);
            showToast('Your transaction has been confirmed by admin.', 'success');
          }
        } catch (err) {
          console.error('Polling error', err);
        }
      }, 8000);

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
    

    const fetchUser = async () => {
      try {
        const res = await apiClients.request(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/me`, {
       method: 'GET',
        credentials: "include"
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
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch coins data
      const responseCoins = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/crypto-markets`,{
          method: 'GET',
          credentials: "include"
        }
      );
      if (!responseCoins.ok) throw new Error("Failed to fetch coins");
      const dataCoin = await responseCoins.json();
      setCoins(dataCoin.data);
      setSelectedCoin(dataCoin.data[0]);

// Fetch countries data
const responseCountry = await apiClients.request(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/countries`,
  {
    method: 'GET',
    credentials: "include"
  }
);

if (!responseCountry.ok) throw new Error("Failed to fetch countries");

const dataCountry = await responseCountry.json();
const countriesData = dataCountry.data;

// Format countries data
const formattedCountries = countriesData
  // Keep only Nigeria
  .filter((c: ApiCountry) => c.name.common === "Nigeria")
  // Ensure it has currency info
  .filter((c: ApiCountry) => c.currencies && Object.keys(c.currencies).length > 0)
  .map((c: ApiCountry) => {
    const currencyCode = Object.keys(c.currencies)[0];
    const currencyInfo = c.currencies[currencyCode];

    return {
      code: c.cca2,
      name: c.name.common,
      flag: c.flags?.png || c.flags?.svg || '',
      currency: currencyCode,
      currencySymbol: currencyInfo?.symbol || currencyCode,
      currencyName: currencyInfo?.name || currencyCode
    };
  });

setCountries(formattedCountries);

// Set Nigeria as default (if found)
const defaultCountry = formattedCountries.find(
  (c: Country) => c.code === "NG"
) || formattedCountries[0];

setSelectedCountry(defaultCountry);


      // Fetch exchange rates
      const responseRate = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/exchange-rates`,{
            method: 'GET',
          credentials: "include"
        }
      );
      if (!responseRate.ok) throw new Error("Failed to fetch rates");
      const rateData = await responseRate.json();
      
      // Use the default country's currency to set initial exchange rate
      const initialRate = rateData.data?.conversion_rates?.[defaultCountry.currency] || 1;
      setExchangeRate(initialRate);

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data: " + (err as Error).message);
      console.error(err);
      setLoading(false);
    }
  };

  fetchData();
}, []);

// Add a separate effect to update exchange rate when selected country changes
useEffect(() => {
  if (!selectedCountry) return;

  const updateExchangeRate = async () => {
    try {
      const response = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/exchange-rates`,{
            method: 'GET',
          credentials: "include"
        }
      );
      if (!response.ok) throw new Error("Failed to fetch rates");
      const data = await response.json();
      
      const newRate = data.data?.conversion_rates?.[selectedCountry.currency] || 1;
      setExchangeRate(newRate);
    } catch (err) {
      console.error("Failed to update exchange rate:", err);
    }
  };

  updateExchangeRate();
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
     <LoadingDisplay />
    );
  }
/*if (error){
  return(
 <ErrorDisplay />
  )
}*/



  return (
    <motion.div
      key="buy"
  initial={{ opacity: 0, y: 30 }} // Start from below
  animate={{ opacity: 1, y: 0 }} // Animate to original position
  exit={{ opacity: 0, y: -30 }} // Exit upwards
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
            disabled={!amount || parseFloat(amount) <= 0 || !selectedCoin || !walletAddress || loadingPayment}

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
