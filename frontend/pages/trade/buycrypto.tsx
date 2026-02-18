"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useToast } from "../../hooks/toast";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { apiClients } from "@/lib/apiClient";
import TradeModal, { TradeModalStep } from "./trademodal";
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
  name: { common: string };
  flags: { png?: string; svg?: string };
  currencies: Currency;
}

interface Transaction {
  txid: string;
  status: "pending" | "confirmed" | "paid";
}

interface BuyCryptoProps {
  activeTab: "buy" | "sell";
  setActiveTab: (tab: "buy" | "sell") => void;
}

export default function BuyCrypto({ activeTab, setActiveTab }: BuyCryptoProps) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const { ToastComponent, showToast } = useToast();
  const pollingRef = useRef<number | null>(null);

  // Coin dropdown
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [searchCoin, setSearchCoin] = useState("");
  const coinDropdownRef = useRef<HTMLDivElement>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<TradeModalStep>("confirm");
  const [modalError, setModalError] = useState("");

  const serviceFee = 50;

  // Close coin dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (coinDropdownRef.current && !coinDropdownRef.current.contains(e.target as Node)) {
        setShowCoinDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const onSuccess = async (ref: string) => {
    try {
      setModalStep("loading");

      const txid = generateUniqueTxid();
      const usdAmount = parseFloat(amount || "0");
      const calculatedLocalCurrencyAmount = usdAmount * (exchangeRate + 50);

      const res = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            coin: selectedCoin?.symbol,
            amount: usdAmount,
            coinAmount: coinAmount,
            txid: txid,
            type: "buy",
            country: selectedCountry?.name,
            walletAddressUsed: walletAddress,
            status: "paid",
            localCurrencyAmount: calculatedLocalCurrencyAmount,
            localCurrency: selectedCountry?.currency || "NGN",
            paymentReference: ref,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.data?.txid) {
        setModalStep("error");
        setModalError("Payment successful but failed to save transaction. Please contact support.");
        return;
      }

      setModalStep("success");

      // Start polling for admin confirmation
      if (pollingRef.current) window.clearInterval(pollingRef.current);
      pollingRef.current = window.setInterval(async () => {
        try {
          const resp = await apiClients.request(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction/user`,
            { method: "GET", credentials: "include" }
          );
          if (!resp.ok) return;
          const j = await resp.json();
          const txs = Array.isArray(j.data) ? j.data : [];
          const found = txs.find((t: Transaction) => t.txid === txid);
          if (found && found.status === "confirmed") {
            if (pollingRef.current) {
              window.clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            showToast("Your transaction has been confirmed by admin.", "success");
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 8000);
    } catch (err) {
      console.error("Transaction creation error after payment:", err);
      setModalStep("error");
      setModalError("Payment successful but failed to save transaction details.");
    } finally {
      setLoadingPayment(false);
    }
  };

  const onClose = () => {
    showToast("Payment was cancelled.", "info");
    setShowModal(false);
    setLoadingPayment(false);
  };

  const payWithPaystack = (email: string, amountInNaira: number) => {
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

    const paystackRef = "ps_" + Math.random().toString(36).substr(2, 9);
    const paystackPop = (window as { PaystackPop?: PaystackPopType }).PaystackPop;
    const handler = paystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: email,
      amount: Math.round(amountInNaira * 100),
      currency: "NGN",
      ref: paystackRef,
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
      setLoadingPayment(false);
      setShowModal(false);
    }
  };

  function generateUniqueTxid() {
    return "tx_" + Math.random().toString(36).substr(2, 9);
  }

  const handleBuyClick = () => {
    // Validate inputs
    const usdAmount = parseFloat(amount || "0");
    if (!amount || usdAmount <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }
    if (!selectedCoin) {
      showToast("Please select a coin", "error");
      return;
    }
    if (!walletAddress) {
      showToast("Please enter your wallet address", "error");
      return;
    }
    if (!userEmail) {
      showToast("User email not found", "error");
      return;
    }

    // Show confirmation modal
    setModalStep("confirm");
    setShowModal(true);
  };

  const handleConfirmBuy = () => {
    setLoadingPayment(true);
    const usdAmount = parseFloat(amount || "0");
    const calculatedLocalCurrencyAmount = usdAmount * (exchangeRate + 50);
    setModalStep("loading");
    payWithPaystack(userEmail, calculatedLocalCurrencyAmount);
  };

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch user email
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/me`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) setUserEmail(data.data.email);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch coins, countries, exchange rates
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const responseCoins = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/crypto-markets`,
          { method: "GET", credentials: "include" }
        );
        if (!responseCoins.ok) throw new Error("Failed to fetch coins");
        const dataCoin = await responseCoins.json();
        setCoins(dataCoin.data);
        setSelectedCoin(dataCoin.data[0]);

        const responseCountry = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/countries`,
          { method: "GET", credentials: "include" }
        );
        if (!responseCountry.ok) throw new Error("Failed to fetch countries");
        const dataCountry = await responseCountry.json();

        const formattedCountries = dataCountry.data
          .filter((c: ApiCountry) => c.name.common === "Nigeria")
          .filter((c: ApiCountry) => c.currencies && Object.keys(c.currencies).length > 0)
          .map((c: ApiCountry) => {
            const currencyCode = Object.keys(c.currencies)[0];
            const currencyInfo = c.currencies[currencyCode];
            return {
              code: c.cca2,
              name: c.name.common,
              flag: c.flags?.png || c.flags?.svg || "",
              currency: currencyCode,
              currencySymbol: currencyInfo?.symbol || currencyCode,
            };
          });

        setCountries(formattedCountries);
        const defaultCountry = formattedCountries.find((c: Country) => c.code === "NG") || formattedCountries[0];
        setSelectedCountry(defaultCountry);

        const responseRate = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/exchange-rates`,
          { method: "GET", credentials: "include" }
        );
        if (!responseRate.ok) throw new Error("Failed to fetch rates");
        const rateData = await responseRate.json();
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

  // Update exchange rate on country change
  useEffect(() => {
    if (!selectedCountry) return;
    const updateExchangeRate = async () => {
      try {
        const response = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/exchange-rates`,
          { method: "GET", credentials: "include" }
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

  // Calculate coin amount
  useEffect(() => {
    if (amount && selectedCoin && selectedCoin.current_price > 0) {
      const usdVal = parseFloat(amount) || 0;
      const coinVal = usdVal / selectedCoin.current_price;
      if (isNaN(coinVal) || !isFinite(coinVal)) {
        setCoinAmount(0);
      } else {
        setCoinAmount(parseFloat(coinVal.toFixed(8)));
      }
    } else {
      setCoinAmount(0);
    }
  }, [amount, selectedCoin]);

  const adjustedExchangeRate = exchangeRate + 50;
  const usdAmount = parseFloat(amount || "0");
  const calculatedLocalCurrencyAmount = usdAmount * adjustedExchangeRate;
  const feeInLocal = serviceFee * adjustedExchangeRate;

  const filteredCoins = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(searchCoin.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchCoin.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4">
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-3/4 bg-gray-700/40 rounded-lg" />
          <div className="h-5 w-1/2 bg-gray-700/30 rounded-lg" />
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700/30 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="w-full max-w-md mx-auto animate-pulse">
          <div className="bg-gray-800/40 border border-gray-700/30 rounded-2xl p-5 space-y-4">
            <div className="h-10 bg-gray-700/30 rounded-lg" />
            <div className="h-24 bg-gray-700/20 rounded-xl" />
            <div className="flex justify-center"><div className="w-10 h-10 bg-gray-700/30 rounded-full" /></div>
            <div className="h-24 bg-gray-700/20 rounded-xl" />
            <div className="h-12 bg-gray-700/20 rounded-xl" />
            <div className="h-12 bg-blue-500/20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="text-red-400 text-xl">!</span>
          </div>
          <p className="text-red-400 text-sm">{error}</p>
          <button type="button" onClick={() => window.location.reload()} className="text-blue-400 text-xs hover:underline">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key="buy"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4 font-grotesk"
    >
      {/* Left side - info */}
      <FirstSide coins={coins} selectedCountry={selectedCountry ?? countries[0]} exchangeRate={exchangeRate} />

      {/* Right side - card */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800/40 border border-gray-700/30 rounded-2xl backdrop-blur-sm shadow-xl overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-700/30">
            <button
              type="button"
              onClick={() => setActiveTab("buy")}
              className={`flex-1 py-4 text-center font-semibold text-sm transition-all duration-300 relative ${
                activeTab === "buy" ? "text-blue-400" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Buy
              {activeTab === "buy" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sell")}
              className={`flex-1 py-4 text-center font-semibold text-sm transition-all duration-300 relative ${
                activeTab === "sell" ? "text-blue-400" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Sell
              {activeTab === "sell" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600" />
              )}
            </button>
          </div>

          <div className="p-5 space-y-4">
      {/* Coin selector */}
      <div className="relative" ref={coinDropdownRef}>
        <button
          type="button"
          onClick={() => setShowCoinDropdown(!showCoinDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-700/30 border border-gray-600/30 hover:border-blue-500/30 transition-colors"
        >
          {selectedCoin && (
            <img src={selectedCoin.image} alt={selectedCoin.name} className="w-6 h-6 rounded-full" />
          )}
          <span className="text-white font-medium text-sm">
            {selectedCoin ? `${selectedCoin.symbol.toUpperCase()}/USD` : "Select coin"}
          </span>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showCoinDropdown ? "rotate-180" : ""}`} />
        </button>

        {showCoinDropdown && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700/50 rounded-xl shadow-2xl z-20 overflow-hidden">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search coins..."
                value={searchCoin}
                onChange={(e) => setSearchCoin(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm placeholder-gray-400 outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredCoins.map((coin) => (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => {
                    setSelectedCoin(coin);
                    setShowCoinDropdown(false);
                    setSearchCoin("");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-700/50 transition-colors ${
                    selectedCoin?.id === coin.id ? "bg-blue-500/10" : ""
                  }`}
                >
                  <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{coin.symbol.toUpperCase()}</p>
                    <p className="text-gray-400 text-xs">{coin.name}</p>
                  </div>
                  <span className="ml-auto text-gray-300 text-xs">${coin.current_price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* You Pay section */}
      <div className="bg-gray-700/20 border border-gray-600/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-medium">You Pay</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <span className="text-gray-400 text-2xl font-semibold mr-1">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-white text-2xl font-semibold outline-none w-full placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-600/30 rounded-lg shrink-0">
            {selectedCountry?.flag && (
              <img src={selectedCountry.flag} alt="" className="w-5 h-3.5 rounded-sm object-cover" />
            )}
            <span className="text-gray-300 text-sm">USD</span>
          </div>
        </div>
        {amount && (
          <p className="text-gray-400 text-xs mt-2">
            {selectedCountry?.currencySymbol}
            {calculatedLocalCurrencyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedCountry?.currency}
          </p>
        )}
      </div>

      {/* Swap icon */}
      <div className="flex justify-center -my-1">
        <div className="w-10 h-10 rounded-full bg-gray-700/40 border border-gray-600/30 flex items-center justify-center">
          <ArrowsUpDownIcon className="w-5 h-5 text-blue-400" />
        </div>
      </div>

      {/* You Get section */}
      <div className="bg-gray-700/20 border border-gray-600/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-medium">You Get</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white text-2xl font-semibold">
            {coinAmount > 0 ? coinAmount.toFixed(8) : "0.00"}
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-600/30 rounded-lg shrink-0">
            {selectedCoin && (
              <img src={selectedCoin.image} alt="" className="w-5 h-5 rounded-full" />
            )}
            <span className="text-white text-sm font-medium">
              {selectedCoin?.symbol.toUpperCase() || "BTC"}
            </span>
          </div>
        </div>
        {selectedCoin && (
          <p className="text-gray-400 text-xs mt-2">
            1 {selectedCoin.symbol.toUpperCase()} = ${selectedCoin.current_price.toLocaleString()}
          </p>
        )}
      </div>

      {/* Wallet address */}
      <div>
        <label className="text-gray-400 text-xs font-medium mb-1.5 block">Wallet Address</label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter your wallet address"
          className="w-full px-4 py-3 bg-gray-700/20 border border-gray-600/30 rounded-xl text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500/40 transition-colors"
        />
      </div>

      {/* Info bar */}
      <div className="bg-gray-700/20 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Exchange Rate</span>
          <span className="text-gray-200">$1 = {selectedCountry?.currencySymbol}{adjustedExchangeRate.toLocaleString()}</span>
        </div>
        {coinAmount > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">You will receive</span>
            <span className="text-blue-400 font-medium">{coinAmount.toFixed(8)} {selectedCoin?.symbol.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Buy button */}
      <button
        type="button"
        onClick={handleBuyClick}
        disabled={!amount || parseFloat(amount) <= 0 || !selectedCoin || !walletAddress || loadingPayment}
        className={`w-full py-3.5 rounded-xl font-semibold transition-all text-sm ${
          !amount || parseFloat(amount) <= 0 || !selectedCoin || !walletAddress
            ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/20"
        }`}
      >
        {loadingPayment ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          `Buy ${selectedCoin?.symbol.toUpperCase() || "Crypto"}`
        )}
      </button>

      {/* Trade Modal */}
      {showModal && selectedCoin && selectedCountry && (
        <TradeModal
          step={modalStep}
          details={{
            coinName: selectedCoin.name,
            coinSymbol: selectedCoin.symbol,
            coinImage: selectedCoin.image,
            coinPrice: selectedCoin.current_price,
            purchaseAmount: calculatedLocalCurrencyAmount,
            receiveAmount: coinAmount,
            fee: feeInLocal,
            totalPay: calculatedLocalCurrencyAmount,
            currency: selectedCountry.currency,
            currencySymbol: selectedCountry.currencySymbol,
            type: "buy",
          }}
          errorMessage={modalError}
          onConfirm={handleConfirmBuy}
          onClose={() => {
            setShowModal(false);
            setLoadingPayment(false);
          }}
          onRetry={() => {
            setModalStep("confirm");
          }}
        />
      )}

      {ToastComponent}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
