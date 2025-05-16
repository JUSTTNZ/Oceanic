"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowPathIcon, } from "@heroicons/react/24/outline";
import CoinSelection from "../components/sell/coinselection";
import TxidInput from "../components/sell/txidinput";
import StatusMessage from "../components/sell/statusmessage";
import NetworkWarning from "../components/sell/network";
import WalletAddressDisplay from "../components/sell/walletaddres";
import FirstSide from "../components/sell/firstside";
import TransactionStatusModal from "./transactionmodal";
import AmountInputSell from "../components/sell/amout";
import Banks from "../components/sell/bank";

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
  currency:string;
  currencySymbol: string;
}

interface TransactionDetails {
  id: string;
  coin: string;
  amount: number;
  status: string;
}
interface WalletAddress {
  address: string;
  network: string;
  note?: string;
}
const BYBIT_WALLET_ADDRESSES: Record<string, WalletAddress[]> = {
  USDT: [
    {
      address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      network: "TRC20",
      note: "Tron Network (Recommended - Low Fees)"
    },
    {
      address: "0x8e5b5a4c4fc1e6fbdcb2aa3eec0381c1344f85cf",
      network: "ERC20",
      note: "Ethereum Network (Higher Fees)"
    },
    {
      address: "TYgG3S22bqxfKF2Q5ZhWpQvDq5W4dXbm1D",
      network: "TRC20 (Legacy)",
      note: "Old Tron address"
    }
  ],
  BTC: [
    {
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      network: "BTC",
      note: "Native SegWit (Recommended)"
    },
    {
      address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
      network: "BTC (Legacy)",
      note: "Bitcoin Legacy Address"
    }
  ],
  ETH: [
    {
      address: "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
      network: "ETH"
    }
  ],
  BNB: [
    {
      address: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2",
      network: "BEP2",
      note: "Binance Chain"
    },
    {
      address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      network: "BEP20",
      note: "Binance Smart Chain"
    }
  ],
  SOL: [
    {
      address: "8e1YyRzFKR5nJ1Rw1ErGfP9Y7EXW8B7jvN5QvL6oUpvN",
      network: "SOL"
    }
  ],
  XRP: [
    {
      address: "rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh",
      network: "XRP",
      note: "Include Destination Tag: 12345678"
    }
  ],
  ADA: [
    {
      address: "addr1q9d6t0sx9ywhcwn04n4z8s6guxle5z5hf6a0kxdygnh6z0d0xgk8dcvxsp2k2vm0l2c4xptqx9a9n5",
      network: "ADA"
    }
  ],
  DOGE: [
    {
      address: "D7Y55qnMaQKUyUxuSHM3wZjaeU5iW6HXRL",
      network: "DOGE"
    }
  ],
  DOT: [
    {
      address: "14ErftuTiyBi2LqCHNfX1LpbMfW6Y2VtKMRuhV2zNHff5D2W",
      network: "DOT"
    }
  ],
  MATIC: [
    {
      address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      network: "MATIC"
    }
  ]
};
interface BankDetails {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
}
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
const [selectedCountry] = useState<Country>({ 
  code: "NG", 
  name: "Nigeria", 
  currency: "NGN",  
  currencySymbol: "₦"  
});
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: "",
    accountName: "",
    bankName: "",
    bankCode: ""
  });
  const [banksList, setBanksList] = useState<{name: string, code: string}[]>([]);

// rate
  const [exchangeRate, setExchangeRate] = useState<number>(0);
 console.log(transactionDetails)
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/coin");
        if (!res.ok) setErrorMessage("Failed to fetch cryptocurrencies");
        const data = await res.json();
        const supported = data.filter((coin: Coin) => SUPPORTED_COINS.includes(coin.symbol.toUpperCase()));
        setCoins(supported);
        if (supported.length > 0) setSelectedCoin(supported[0]);
      } catch (error) {
        console.error("Failed to fetch coins:", error);
      }
    };
    fetchCoins();


const fetchBanks = async () => {
  try {
    const response = await fetch(`/api/banks?country=${selectedCountry.name.toLowerCase()}`);
    const data = await response.json();

    if (Array.isArray(data.banks)) {
      setBanksList(data.banks); // Set your dropdown list
    } else {
      console.error("Unexpected response format:", data);
      setBanksList([]);
    }
  } catch (error) {
    console.error("Failed to fetch banks:", error);
  }
};

    fetchBanks();
  }, [selectedCountry.code, selectedCountry.name]);
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (!selectedCountry.name) return;

      try {
        const response = await fetch("/api/rate");
        if (!response.ok) 
          setErrorMessage("Failed to fetch rate");
        const data = await response.json();
        setExchangeRate(data.conversion_rates[selectedCountry.currency] || 1);
      } catch {
        setExchangeRate(1);
      }
    };
    fetchExchangeRate();
  }, [selectedCountry.name]);

const walletAddresses = selectedCoin
  ? BYBIT_WALLET_ADDRESSES[selectedCoin.symbol.toUpperCase()] || []
  : null;

  const handleSubmit = async () => {
    if (!txid || !selectedCoin || amount <= 0) {
      setErrorMessage("Please fill in all fields correctly.");
      setStatus('failed');
      setModalType("error");
      setShowModal(true);
      return;
    }
 if (!bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankName) {
      setErrorMessage("Please provide your bank account details.");
      setStatus('failed');
      setModalType("error");
      setShowModal(true);
      return;
    }
    try {
      setStatus('sent');
      setIsChecking(true);

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) setErrorMessage("Please login first");

      const response = await fetch('https://oceanic-servernz.vercel.app/api/v1/transaction', {
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
      }

      const data = await response.json();
      setTransactionDetails(data.data);

      let tries = 0;
      const maxTries = 20;
      const pollStatus = setInterval(async () => {
        tries++;
        const pollRes = await fetch(`https://oceanic-servernz.vercel.app/api/v1/transaction/poll?txid=${txid}&coin=${selectedCoin.symbol}`);
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
    <div className="min-h-screen">
      <motion.div 
        key="sell" 
        initial={{ opacity: 0, x: 30 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: -30 }} 
        transition={{ duration: 0.3 }} 
        className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4"
      >
        <FirstSide status={status}
           SUPPORTED_COINS={coins.filter(coin => SUPPORTED_COINS.includes(coin.symbol.toUpperCase()))} 
         exchangeRate={exchangeRate} selectedCountry={selectedCountry} />
      <div className="w-full max-w-sm mx-auto   p-6 md:shadow-xl shadow-2xl space-y-4 bg-gray-800/30 border border-gray-700/20 rounded-xl hover:border-blue-500/30 transition-all backdrop-blur-sm hover:shadow-blue-500/10">
          <h2 className="text-center font-semibold text-lg mb-4  bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Sell Crypto</h2>
          
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <CoinSelection 
            {...{ 
              setShowCoinDropdown, 
              showCoinDropdown, 
              selectedCoin, 
              searchCoin, 
              setSearchCoin, 
              setSelectedCoin, 
              filteredCoins: coins, 
              status 
            }} 
          />

       <WalletAddressDisplay
  selectedCoin={selectedCoin}
  selectedCountry={selectedCountry}
   walletAddresses={walletAddresses || []}
  status={status}
/>

          
        <AmountInputSell 
          amount={amount}
          setAmount={setAmount}
          status={status}
        />
        
          <TxidInput {...{ txid, setTxid, status }} />
      
          <Banks 
          bankDetails={bankDetails}
          banksList={banksList}
          setBankDetails={setBankDetails}
          status={status}


          />
          <StatusMessage 
            {...{ 
              status, 
              isChecking, 
              onReset: () => { 
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
            disabled={!txid || !selectedCoin || status !== 'pending' || amount <= 0 || !bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankName } 
            className={`
              w-full py-3 rounded-full font-semibold transition-colors 
              
              ${
              !txid || !selectedCoin || status !== 'pending' || amount <= 0 || !bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankName
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : '              bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4  transition-all hover:shadow-lg hover:shadow-blue-500/20'
            }`}
          >
            {isChecking ? (
              <span className="flex items-center justify-center">
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              'Submit Transaction'
            )}
          </button>

          <NetworkWarning selectedCoin={selectedCoin} />
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