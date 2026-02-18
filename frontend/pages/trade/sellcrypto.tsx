"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { useToast } from "@/hooks/toast";
import ErrorDisplay from "@/ui/errorbuy";
import { BYBIT_WALLET_ADDRESSES } from "@/utils/bybitaddress";
import { apiClients } from "@/lib/apiClient";
import TradeModal, { TradeModalStep } from "./trademodal";
import FirstSide from "../components/sell/firstside";

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
  currency: string;
  currencySymbol: string;
}

interface BankDetails {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
}

const SUPPORTED_COINS = Object.keys(BYBIT_WALLET_ADDRESSES);

interface SellCryptoProps {
  activeTab: "buy" | "sell";
  setActiveTab: (tab: "buy" | "sell") => void;
}

const SellCrypto = ({ activeTab, setActiveTab }: SellCryptoProps) => {
  const [status, setStatus] = useState<'pending' | 'sent' | 'received' | 'confirmed' | 'failed' | 'txid-exists'>('pending');
  const [txid, setTxid] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showToast, ToastComponent } = useToast();

  const [selectedCountry] = useState<Country>({
    code: "NG",
    name: "Nigeria",
    currency: "NGN",
    currencySymbol: "₦",
  });

  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: "",
    accountName: "",
    bankName: "",
    bankCode: "",
  });

  const [banksList, setBanksList] = useState<{ name: string; code: string }[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdowns
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [searchCoin, setSearchCoin] = useState("");
  const coinDropdownRef = useRef<HTMLDivElement>(null);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [searchBank, setSearchBank] = useState("");
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  // Wallet address display
  const [selectedNetwork, setSelectedNetwork] = useState(0);
  const [copied, setCopied] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<TradeModalStep>("confirm");
  const [modalError, setModalError] = useState("");

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (coinDropdownRef.current && !coinDropdownRef.current.contains(e.target as Node)) {
        setShowCoinDropdown(false);
      }
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(e.target as Node)) {
        setShowBankDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch data
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
        const supported = dataCoin.data.filter((coin: Coin) =>
          SUPPORTED_COINS.includes(coin.symbol.toUpperCase())
        );
        setCoins(supported);
        if (supported.length > 0) setSelectedCoin(supported[0]);

        const banksResponse = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/banks?country=${selectedCountry.name.toLowerCase()}`,
          { method: "GET", credentials: "include" }
        );
        if (!banksResponse.ok) throw new Error("Failed to fetch banks");
        const banksData = await banksResponse.json();
        if (Array.isArray(banksData.data.banks)) {
          setBanksList(banksData.data.banks);
        } else {
          setBanksList([]);
        }

        const responseRate = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/exchange-rates`,
          { method: "GET", credentials: "include" }
        );
        if (!responseRate.ok) throw new Error("Failed to fetch rates");
        const rateData = await responseRate.json();
        const initialRate = rateData.data?.conversion_rates?.[selectedCountry.currency] || 1;
        setExchangeRate(initialRate);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data: " + (err as Error).message);
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry.name, selectedCountry.currency]);

  const walletAddresses = selectedCoin
    ? BYBIT_WALLET_ADDRESSES[selectedCoin.symbol.toUpperCase()] || []
    : [];

  const adjustedExchangeRate = exchangeRate - 40;
  const cryptoAmount = parseFloat(amount || "0");
  const fiatAmount = selectedCoin ? cryptoAmount * selectedCoin.current_price : 0;
  const fiatInLocal = fiatAmount * adjustedExchangeRate;

  const filteredCoins = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(searchCoin.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchCoin.toLowerCase())
  );

  const filteredBanks = banksList.filter((b) =>
    b.name.toLowerCase().includes(searchBank.toLowerCase())
  );

  const copyAddress = () => {
    if (walletAddresses[selectedNetwork]) {
      navigator.clipboard.writeText(walletAddresses[selectedNetwork].address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setTxid("");
    setAmount("");
    setBankDetails({ accountNumber: "", accountName: "", bankName: "", bankCode: "" });
  };

  const handleSellClick = () => {
    if (!txid || !selectedCoin || cryptoAmount <= 0) {
      showToast("Please fill in all fields correctly", "error");
      return;
    }
    if (!bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankName) {
      showToast("Please provide your bank account details", "error");
      return;
    }
    setModalStep("confirm");
    setShowModal(true);
  };

  const handleConfirmSell = async () => {
    try {
      setIsSubmitting(true);
      setModalStep("loading");

      // Step 1: Confirm with Bitget
      const confirmRes = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/bitget/confirm-deposit?coin=${selectedCoin!.symbol}&txid=${txid}&size=${cryptoAmount}`,
        { method: "GET", credentials: "include" }
      );
      const confirmData = await confirmRes.json();

      if (!confirmData.success || !confirmData.confirmed) {
        setStatus("failed");
        setModalStep("error");
        setModalError("Deposit not found or does not match. Check your txid and amount.");
        return;
      }

      // Step 2: Create transaction
      const createRes = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            coin: selectedCoin!.symbol,
            amount: fiatAmount,
            coinAmount: cryptoAmount,
            txid,
            coinPriceUsd: selectedCoin!.current_price,
            type: "sell",
            country: selectedCountry.code,
            bankName: bankDetails.bankName,
            accountName: bankDetails.accountName,
            accountNumber: bankDetails.accountNumber,
          }),
        }
      );

      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.message || "Transaction creation failed");

      setStatus("confirmed");
      setModalStep("success");
      resetForm();
    } catch (err) {
      console.error("Transaction error:", err);
      setModalStep("error");
      setModalError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4">
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-3/4 bg-gray-700/40 rounded-lg" />
          <div className="h-5 w-1/2 bg-gray-700/30 rounded-lg" />
          <div className="space-y-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-700/40 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-3/4 bg-gray-700/30 rounded" />
                  <div className="h-3 w-1/2 bg-gray-700/20 rounded" />
                </div>
              </div>
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

  if (error) return <ErrorDisplay message={error} />;

  return (
    <motion.div
      key="sell"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4 font-grotesk"
    >
      {/* Left side - info */}
      <FirstSide
        status={status}
        SUPPORTED_COINS={coins}
        exchangeRate={exchangeRate}
        selectedCountry={selectedCountry}
      />

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
          <ChevronDownIcon
            className={`w-4 h-4 text-gray-400 transition-transform ${showCoinDropdown ? "rotate-180" : ""}`}
          />
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
                    setSelectedNetwork(0);
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

      {/* You Send section */}
      <div className="bg-gray-700/20 border border-gray-600/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-medium">You Send</span>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="bg-transparent text-white text-2xl font-semibold outline-none w-full placeholder-gray-500"
          />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-600/30 rounded-lg shrink-0">
            {selectedCoin && (
              <img src={selectedCoin.image} alt="" className="w-5 h-5 rounded-full" />
            )}
            <span className="text-white text-sm font-medium">
              {selectedCoin?.symbol.toUpperCase() || "BTC"}
            </span>
          </div>
        </div>
        {selectedCoin && cryptoAmount > 0 && (
          <p className="text-gray-400 text-xs mt-2">
            ≈ ${formatCurrency(fiatAmount)} USD
          </p>
        )}
      </div>

      {/* Swap icon */}
      <div className="flex justify-center -my-1">
        <div className="w-10 h-10 rounded-full bg-gray-700/40 border border-gray-600/30 flex items-center justify-center">
          <ArrowsUpDownIcon className="w-5 h-5 text-blue-400" />
        </div>
      </div>

      {/* You Receive section */}
      <div className="bg-gray-700/20 border border-gray-600/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-medium">You Receive</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white text-2xl font-semibold">
            {fiatInLocal > 0
              ? `${selectedCountry.currencySymbol}${formatCurrency(fiatInLocal)}`
              : "0.00"}
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-600/30 rounded-lg shrink-0">
            <span className="text-white text-sm font-medium">{selectedCountry.currency}</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-2">
          Rate: $1 = {selectedCountry.currencySymbol}{adjustedExchangeRate.toLocaleString()}
        </p>
      </div>

      {/* Wallet address to send to */}
      {walletAddresses.length > 0 && (
        <div className="bg-gray-700/20 border border-gray-600/30 rounded-xl p-4 space-y-3">
          <p className="text-gray-400 text-xs font-medium">
            Send {selectedCoin?.symbol.toUpperCase()} to this address
          </p>

          {/* Network tabs */}
          {walletAddresses.length > 1 && (
            <div className="flex gap-1.5 flex-wrap">
              {walletAddresses.map((w, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedNetwork(i)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedNetwork === i
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-gray-600/20 text-gray-400 border border-gray-600/20 hover:border-gray-500/30"
                  }`}
                >
                  {w.network}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2.5">
            <p className="text-white text-xs font-mono break-all flex-1">
              {walletAddresses[selectedNetwork]?.address}
            </p>
            <button
              type="button"
              onClick={copyAddress}
              className="shrink-0 p-1.5 rounded-lg hover:bg-gray-600/30 transition-colors"
              title="Copy address"
            >
              <ClipboardDocumentIcon className={`w-4 h-4 ${copied ? "text-green-400" : "text-gray-400"}`} />
            </button>
          </div>

          {walletAddresses[selectedNetwork]?.memo && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5">
              <p className="text-yellow-400 text-xs font-medium">
                Memo/Tag: {walletAddresses[selectedNetwork].memo}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bank details */}
      <div className="space-y-3">
        <p className="text-gray-400 text-xs font-medium">Bank Details</p>

        {/* Bank selector */}
        <div className="relative" ref={bankDropdownRef}>
          <button
            type="button"
            onClick={() => setShowBankDropdown(!showBankDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/20 border border-gray-600/30 rounded-xl text-sm hover:border-blue-500/30 transition-colors"
          >
            <span className={bankDetails.bankName ? "text-white" : "text-gray-500"}>
              {bankDetails.bankName || "Select bank"}
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-400 transition-transform ${showBankDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showBankDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700/50 rounded-xl shadow-2xl z-20 overflow-hidden">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search bank..."
                  value={searchBank}
                  onChange={(e) => setSearchBank(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm placeholder-gray-400 outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="max-h-40 overflow-y-auto">
                {filteredBanks.map((bank) => (
                  <button
                    key={bank.code}
                    type="button"
                    onClick={() => {
                      setBankDetails((prev) => ({ ...prev, bankName: bank.name, bankCode: bank.code }));
                      setShowBankDropdown(false);
                      setSearchBank("");
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-700/50 transition-colors ${
                      bankDetails.bankName === bank.name ? "bg-blue-500/10 text-blue-400" : "text-gray-200"
                    }`}
                  >
                    {bank.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account number */}
        <input
          type="text"
          value={bankDetails.accountNumber}
          onChange={(e) => setBankDetails((prev) => ({ ...prev, accountNumber: e.target.value }))}
          placeholder="Account number"
          className="w-full px-4 py-3 bg-gray-700/20 border border-gray-600/30 rounded-xl text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500/40 transition-colors"
        />

        {/* Account name */}
        <input
          type="text"
          value={bankDetails.accountName}
          onChange={(e) => setBankDetails((prev) => ({ ...prev, accountName: e.target.value }))}
          placeholder="Account name"
          className="w-full px-4 py-3 bg-gray-700/20 border border-gray-600/30 rounded-xl text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500/40 transition-colors"
        />
      </div>

      {/* Transaction ID */}
      <div>
        <label className="text-gray-400 text-xs font-medium mb-1.5 block">Transaction ID (TXID)</label>
        <input
          type="text"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          placeholder="Enter your transaction hash/ID"
          className="w-full px-4 py-3 bg-gray-700/20 border border-gray-600/30 rounded-xl text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500/40 transition-colors"
        />
      </div>

      {/* Info bar */}
      <div className="bg-gray-700/20 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Exchange Rate</span>
          <span className="text-gray-200">$1 = {selectedCountry.currencySymbol}{adjustedExchangeRate.toLocaleString()}</span>
        </div>
        {selectedCoin && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Coin Price</span>
            <span className="text-gray-200">1 {selectedCoin.symbol.toUpperCase()} = ${selectedCoin.current_price.toLocaleString()}</span>
          </div>
        )}
        {fiatInLocal > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">You will receive</span>
            <span className="text-blue-400 font-medium">{selectedCountry.currencySymbol}{formatCurrency(fiatInLocal)}</span>
          </div>
        )}
      </div>

      {/* Sell button */}
      <button
        type="button"
        onClick={handleSellClick}
        disabled={
          !txid ||
          !selectedCoin ||
          cryptoAmount <= 0 ||
          !bankDetails.accountNumber ||
          !bankDetails.accountName ||
          !bankDetails.bankName ||
          isSubmitting
        }
        className={`w-full py-3.5 rounded-xl font-semibold transition-all text-sm ${
          !txid || !selectedCoin || cryptoAmount <= 0 || !bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankName
            ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/20"
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          `Sell ${selectedCoin?.symbol.toUpperCase() || "Crypto"}`
        )}
      </button>

      {/* Network warning */}
      {selectedCoin && walletAddresses.length > 0 && (
        <p className="text-yellow-400/80 text-xs text-center">
          Make sure to send {selectedCoin.symbol.toUpperCase()} on the correct network ({walletAddresses[selectedNetwork]?.network})
        </p>
      )}

      {/* Trade Modal */}
      {showModal && selectedCoin && (
        <TradeModal
          step={modalStep}
          details={{
            coinName: selectedCoin.name,
            coinSymbol: selectedCoin.symbol,
            coinImage: selectedCoin.image,
            coinPrice: selectedCoin.current_price,
            purchaseAmount: fiatAmount,
            receiveAmount: fiatInLocal,
            fee: 0,
            totalPay: fiatAmount,
            currency: selectedCountry.currency,
            currencySymbol: selectedCountry.currencySymbol,
            type: "sell",
          }}
          errorMessage={modalError}
          onConfirm={handleConfirmSell}
          onClose={() => {
            setShowModal(false);
            setIsSubmitting(false);
          }}
          onRetry={() => setModalStep("confirm")}
        />
      )}

      {ToastComponent}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SellCrypto;
