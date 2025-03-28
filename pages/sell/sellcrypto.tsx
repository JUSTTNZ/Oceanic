"use client";

import { motion,  } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import CoinSelection from "../components/sell/coinselection";
import TxidInput from "../components/sell/txidinput";
import StatusMessage from "../components/sell/statusmessage";
import NetworkWarning from "../components/sell/network";
import WalletAddressDisplay from "../components/sell/walletaddres";
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
  const [status, setStatus] = useState<TransactionStatus>('pending');
  const [isChecking, setIsChecking] = useState(false);
  const [txid, setTxid] = useState("");
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [searchCoin, setSearchCoin] = useState("");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [selectedCountry,] = useState<Country>({ 
    code: "NG", 
    name: "Nigeria" 
  });

  // Fetch coins from API
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/coin");
        if (!res.ok) {
          throw new Error("Failed to fetch cryptocurrencies");
        }
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
    
    // Simulate API check (we will call api to check is payment here)
    const checkInterval = setInterval(() => {
      const isConfirmed = Math.random() > 0.7; // 70% success rate for demo
      
      if (isConfirmed) {
        setStatus('received');
        clearInterval(checkInterval);
        setIsChecking(false);
        
        // Simulate admin processing(we will add admin logic here later)
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

 

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchCoin.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchCoin.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">

      <motion.div
        key="sell"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4"
      >
       
        <>
        <FirstSide
        status={status}
        SUPPORTED_COINS={SUPPORTED_COINS}
        />
        </>

        
        <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-center font-semibold text-lg mb-4">Sell Crypto</h2>
          
          {/* Coin Selection */}
          <>
          <CoinSelection
  setShowCoinDropdown={setShowCoinDropdown}
  showCoinDropdown={showCoinDropdown}
  selectedCoin={selectedCoin}
  searchCoin={searchCoin}
  setSearchCoin={setSearchCoin}
  setSelectedCoin={setSelectedCoin}
  filteredCoins={filteredCoins}
  status={status}
/>
          </>
          
  <>
          <WalletAddressDisplay
  selectedCoin={selectedCoin}
  selectedCountry={selectedCountry}
  walletAddress={walletAddress}
  
  status={status}
/>
          </>
          {/* TXID Input */}
          <>
          <TxidInput
  txid={txid} 
  setTxid={setTxid} 
  status={status} 
/>
          </>
          {/* Status Message */}
          <>
          <StatusMessage
  status={status} 
  isChecking={isChecking} 
  onReset={resetTransaction} 
/>
          </>
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
        <>
        <NetworkWarning 
        selectedCoin={selectedCoin} />
        </>
        </div>
      </motion.div>
    </div>
  );
}