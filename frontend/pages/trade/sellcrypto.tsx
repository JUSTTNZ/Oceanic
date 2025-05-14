"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import CoinSelection from "../components/sell/coinselection";
import TxidInput from "../components/sell/txidinput";
import StatusMessage from "../components/sell/statusmessage";
import NetworkWarning from "../components/sell/network";
import WalletAddressDisplay from "../components/sell/walletaddres";
import FirstSide from "../components/sell/firstside";
import TransactionStatusModal from "./transactionmodal";

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

interface TransactionDetails {
    id: string;
    coin: string;
    amount: number;
    status: string;
    // Add additional fields as needed
}



const BYBIT_WALLET_ADDRESSES: Record<string, Record<string, string>> = {
  USDT: {
    NG: "0x8e5b5a4c4fc1e6fbdcb2aa3eec0381c1344f85cf",
    US: "0x456...def",
    EU: "0x789...ghi",
    UK: "0x101...jkl"
  },
  BTC: {
    NG: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    US: "bc1qzw...",
    EU: "bc1qab...",
    UK: "bc1qcd..."
  },
  ETH: {
    NG: "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
    US: "0x567...efg",
    EU: "0x890...hij",
    UK: "0x112...klm"
  },
  BNB: {
    NG: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2",
    US: "bnb1zw...",
    EU: "bnb1ab...",
    UK: "bnb1cd..."
  },
  SOL: {
    NG: "8e1YyRzFKR5nJ1Rw1ErGfP9Y7EXW8B7jvN5QvL6oUpvN",
    US: "SolanaAddress2",
    EU: "SolanaAddress3",
    UK: "SolanaAddress4"
  },
  XRP: {
    NG: "rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh",
    US: "rPw5...",
    EU: "rPw6...",
    UK: "rPw7..."
  },
  ADA: {
    NG: "addr1q9d6t0sx9ywhcwn04n4z8s6guxle5z5hf6a0kxdygnh6z0d0xgk8dcvxsp2k2vm0l2c4xptqx9a9n5",
    US: "addr1zw...",
    EU: "addr1ab...",
    UK: "addr1cd..."
  },
  DOGE: {
    NG: "D7Y55qnMaQKUyUxuSHM3wZjaeU5iW6HXRL",
    US: "D8zw...",
    EU: "D8ab...",
    UK: "D8cd..."
  },
  DOT: {
    NG: "14ErftuTiyBi2LqCHNfX1LpbMfW6Y2VtKMRuhV2zNHff5D2W",
    US: "1zw...",
    EU: "1ab...",
    UK: "1cd..."
  },
  MATIC: {
    NG: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    US: "0x678...fgh",
    EU: "0x901...ijk",
    UK: "0x113...lmn"
  }
};

const SUPPORTED_COINS = Object.keys(BYBIT_WALLET_ADDRESSES);
export type TransactionStatus = 'pending' | 'sent' | 'received' | 'confirmed' | 'failed';

const SellCrypto = () => {
  const [status, setStatus] = useState<TransactionStatus>('pending');
  const [isChecking, setIsChecking] = useState(false);
  const [txid, setTxid] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [searchCoin, setSearchCoin] = useState("");
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [selectedCountry] = useState<Country>({ code: "NG", name: "Nigeria" });

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/coin");
        if (!res.ok) throw new Error("Failed to fetch cryptocurrencies");
        const data = await res.json();
        const supported = data.filter((coin: Coin) => SUPPORTED_COINS.includes(coin.symbol.toUpperCase()));
        setCoins(supported);
        if (supported.length > 0) setSelectedCoin(supported[0]);
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

  const handleSubmit = async () => {
    if (!txid || !selectedCoin || amount <= 0) {
      setErrorMessage("Please fill in all fields correctly.");
      setStatus('failed');
      setModalType("error");
      setShowModal(true);
      return;
    }

    try {
      setStatus('sent');
      setIsChecking(true);

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error("Please login first");

      const response = await fetch('http://localhost:7001/api/v1/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          coin: selectedCoin.symbol,
          amount,
          txid,
          type: "sell",
          country: selectedCountry.code
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Transaction failed');
        throw new Error(errorData.message || 'Transaction failed');
      }


      const data = await response.json();
      setTransactionDetails(data.data);

      let tries = 0;
      const maxTries = 20;
      const pollStatus = setInterval(async () => {
        tries++;
        const pollRes = await fetch(`http://localhost:7001/api/v1/transaction/poll?txid=${txid}&coin=${selectedCoin.symbol}`);
        const pollData = await pollRes.json();

        if (pollData.status === 'confirmed') {
          clearInterval(pollStatus);
          setStatus('confirmed');
          setModalType("success");
          setShowModal(true);
          setIsChecking(false);
        }

        if (tries > maxTries) {
          clearInterval(pollStatus);
          setStatus("failed");
          setModalType("error");
          setErrorMessage(`${amount} ${selectedCoin.symbol.toUpperCase()} is pending. We are yet to confirm your transaction.`);
          setShowModal(true);
          setIsChecking(false);
        }
      }, 3000);

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Transaction error');
      setStatus('failed');
      setIsChecking(false);
      setModalType("error");
      setShowModal(true);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <motion.div key="sell" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4">
        <FirstSide status={status} SUPPORTED_COINS={SUPPORTED_COINS} />

        <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-center font-semibold text-lg mb-4">Sell Crypto</h2>
          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

          <CoinSelection 
            {...{ 
                  setShowCoinDropdown, 
                  showCoinDropdown, 
                  selectedCoin, 
                  searchCoin, 
                  setSearchCoin, 
                  setSelectedCoin, 
                  filteredCoins: coins, status }} />
          <WalletAddressDisplay 
            {...{ 
                  selectedCoin, 
                  selectedCountry, 
                  walletAddress, 
                  status }} />

          <input 
            type="number" 
            className="w-full border p-2 rounded" 
            placeholder="Enter amount" 
            value={amount} 
            onChange={(e) => 
            setAmount(parseFloat(e.target.value))} 
            disabled={status !== 'pending'} />

          <TxidInput {...{ txid, setTxid, status }} />

          <StatusMessage 
            {...{ 
              status, 
              isChecking, 
              onReset: () => 
              { 
                setStatus('pending'); 
                setTxid(""); 
                setAmount(0); 
                setIsChecking(false); 
                setErrorMessage(""); 
              } 
            }} 
          />

          <button 
            onClick={handleSubmit} 
            disabled={!txid || !selectedCoin || status !== 'pending' || amount <= 0} 
            className={`w-full py-3 rounded-full font-semibold transition-colors cursor-pointer ${!txid || !selectedCoin || status !== 'pending' || amount <= 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#0047AB] text-white hover:bg-blue-700'}`}>
            {isChecking ? (
              <span className="flex items-center justify-center">
                <ArrowPathIcon 
                  className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
              </span>
            ) : (
              'Submit TXID'
            )}
          </button>

          <NetworkWarning 
            selectedCoin={selectedCoin} 
          />
        </div>
      </motion.div>

      {showModal && (
        <TransactionStatusModal
          type={modalType}
          title={modalType === "success" ? "Transaction Successful" : "Transaction Failed"}
          message={
            modalType === "success"
              ? "Your transaction was completed successfully."
              : `${amount} ${selectedCoin?.symbol.toUpperCase()} is pending. We are yet to confirm your transaction.`
          }
          details={{
            coin: selectedCoin?.symbol || "",
            amount,
            status,
            txid
          }}
          onClose={() => setShowModal(false)}
        />

      )}
    </div>
  );
};

export default SellCrypto;
