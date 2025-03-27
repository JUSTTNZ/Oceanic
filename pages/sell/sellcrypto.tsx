"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ClipboardDocumentIcon, 
  CheckIcon, 
  ArrowPathIcon,
  ChevronDownIcon,
  ArrowLeftIcon
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

// Supported cryptocurrencies and their wallet addresses
const BYBIT_WALLET_ADDRESSES: Record<string, Record<string, string>> = {
  USDT: { 
    NG: "0x123...abc", US: "0x456...def",
    EU: "0x789...ghi", UK: "0x101...jkl"
  },
  BTC: { 
    NG: "bc1qxy...", US: "bc1qzw...",
    EU: "bc1qab...", UK: "bc1qcd..."
  },
  ETH: { 
    NG: "0x234...bcd", US: "0x567...efg",
    EU: "0x890...hij", UK: "0x112...klm"
  },
  BNB: { 
    NG: "bnb1xy...", US: "bnb1zw...",
    EU: "bnb1ab...", UK: "bnb1cd..."
  },
  SOL: { 
    NG: "SolanaAddress1", US: "SolanaAddress2",
    EU: "SolanaAddress3", UK: "SolanaAddress4"
  },
  XRP: { 
    NG: "rPw4...", US: "rPw5...",
    EU: "rPw6...", UK: "rPw7..."
  },
  ADA: { 
    NG: "addr1xy...", US: "addr1zw...",
    EU: "addr1ab...", UK: "addr1cd..."
  },
  DOGE: { 
    NG: "D8xy...", US: "D8zw...",
    EU: "D8ab...", UK: "D8cd..."
  },
  DOT: { 
    NG: "1xy...", US: "1zw...",
    EU: "1ab...", UK: "1cd..."
  },
  MATIC: { 
    NG: "0x345...cde", US: "0x678...fgh",
    EU: "0x901...ijk", UK: "0x113...lmn"
  }
};

const SUPPORTED_COINS = Object.keys(BYBIT_WALLET_ADDRESSES);

type TransactionStatus = 'pending' | 'sent' | 'received' | 'completed' | 'failed';

export default function SellCrypto() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<TransactionStatus>('pending');
  const [isChecking, setIsChecking] = useState(false);
  const [txid, setTxid] = useState("");
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [searchCoin, setSearchCoin] = useState("");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>({ 
    code: "NG", 
    name: "Nigeria" 
  });

  // Fetch coins from API
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100"
        );
        const data = await res.json();
        const supported = data.filter((coin: Coin) => 
          SUPPORTED_COINS.includes(coin.symbol.toUpperCase())
        );
        setCoins(supported);
        if (supported.length > 0) {
          setSelectedCoin(supported[0]);
        }
      } catch (error) {
        console.error("Failed to fetch coins:", error);
      }
    };

    fetchCoins();
  }, []);

  const walletAddress = selectedCoin
    ? BYBIT_WALLET_ADDRESSES[selectedCoin.symbol.toUpperCase()]?.[selectedCountry.code] || 
      "Wallet address not available for this country"
    : null;

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = () => {
    if (!txid || !selectedCoin) {
      setStatus('failed');
      return;
    }
    
    setStatus('sent');
    startCheckingTransaction();
  };

  const startCheckingTransaction = () => {
    setIsChecking(true);
    
    // Simulate API check (replace with actual API calls)
    const checkInterval = setInterval(() => {
      const isConfirmed = Math.random() > 0.7; // 70% success rate for demo
      
      if (isConfirmed) {
        setStatus('received');
        clearInterval(checkInterval);
        setIsChecking(false);
        
        // Simulate admin processing
        setTimeout(() => {
          setStatus('completed');
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(checkInterval);
  };

  const resetTransaction = () => {
    setStatus('pending');
    setTxid("");
    setIsChecking(false);
  };

  const statusMessages = {
    pending: "Please send your crypto and submit the TXID",
    sent: "Waiting for transaction confirmation...",
    received: "Transaction received! Processing your payment...",
    completed: "Payment completed! Funds have been sent to your bank account.",
    failed: "Transaction not found. Please verify your TXID and try again."
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchCoin.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchCoin.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Back Button */}

      <motion.div
        key="sell"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4"
      >
        {/* Left Side - Instructions */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Sell your crypto <br /> Instantly and securely.
          </h1>
          <p className="text-gray-600 text-base">
            Follow these steps to sell your cryptocurrency:
          </p>
          
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                status === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
              }`}>
                1
              </div>
              <div>
                <h3 className="font-medium">Select cryptocurrency and send to our wallet</h3>
                <p className="text-sm text-gray-500">
                  Choose from {SUPPORTED_COINS.length} supported coins
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                status === 'pending' || status === 'sent' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
              }`}>
                2
              </div>
              <div>
                <h3 className="font-medium">Submit your TXID</h3>
                <p className="text-sm text-gray-500">
                  Paste the transaction hash to confirm your transfer
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                3
              </div>
              <div>
                <h3 className="font-medium">Receive payment</h3>
                <p className="text-sm text-gray-500">
                  Funds will be sent to your bank account within 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Supported Coins List */}
          <div className="pt-4">
            <h4 className="font-medium text-gray-700">Supported Cryptocurrencies:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {SUPPORTED_COINS.map(symbol => (
                <span key={symbol} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {symbol}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Transaction Form */}
        <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-center font-semibold text-lg mb-4">Sell Crypto</h2>
          
          {/* Coin Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Cryptocurrency</label>
            <div className="relative">
              <button
                onClick={() => setShowCoinDropdown(!showCoinDropdown)}
                className="flex items-center justify-between w-full border px-4 py-3 rounded-lg text-sm"
                disabled={status !== 'pending'}
              >
                {selectedCoin ? (
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
                ) : (
                  <span>Select cryptocurrency</span>
                )}
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button>

              <AnimatePresence>
                {showCoinDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
                  >
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
                      {filteredCoins.length > 0 ? (
                        filteredCoins.map((coin) => (
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
                            {coin.name} ({coin.symbol.toUpperCase()})
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No coins found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Wallet Address */}
          {selectedCoin && walletAddress && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Our {selectedCoin.symbol.toUpperCase()} Address</label>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {selectedCountry.name}
                </span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <code className="text-xs truncate">{walletAddress}</code>
                <button 
                  onClick={copyToClipboard}
                  className="ml-2 p-1 rounded-md hover:bg-gray-100"
                  disabled={status !== 'pending'}
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Only send {selectedCoin.symbol.toUpperCase()} to this address. Sending other assets may result in permanent loss.
              </p>
            </div>
          )}

          {/* TXID Input */}
          <div className="space-y-2">
            <label htmlFor="txid" className="text-sm font-medium text-gray-700">
              Transaction ID (TXID)
            </label>
            <input
              id="txid"
              type="text"
              placeholder="Paste your transaction hash here"
              className="border px-4 py-3 rounded-lg w-full text-sm"
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
              disabled={status !== 'pending'}
            />
            <p className="text-xs text-gray-500">
              Find this in your wallet's transaction history after sending
            </p>
          </div>

          {/* Status Message */}
          <AnimatePresence mode="wait">
            {status !== 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-lg text-sm ${
                  status === 'completed' ? 'bg-green-50 text-green-700' :
                  status === 'failed' ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-blue-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isChecking && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
                  <p>{statusMessages[status]}</p>
                </div>
                {status === 'completed' || status === 'failed' ? (
                  <button
                    onClick={resetTransaction}
                    className="mt-2 text-sm underline hover:text-blue-600"
                  >
                    Start new transaction
                  </button>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!txid || !selectedCoin || status !== 'pending'}
            className={`w-full py-3 rounded-full font-semibold transition-colors ${
              !txid || !selectedCoin || status !== 'pending'
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#0047AB] text-white hover:bg-blue-700'
            }`}
          >
            {isChecking ? (
              <span className="flex items-center justify-center">
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              'Submit TXID'
            )}
          </button>

          {/* Network Warning */}
          {selectedCoin && (
            <div className="p-3 bg-yellow-50 rounded-lg text-yellow-700 text-xs">
              <p className="font-medium">Important:</p>
              <p>
                Ensure you're sending {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()}) on the correct network.
                Sending on wrong networks may result in permanent loss.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}