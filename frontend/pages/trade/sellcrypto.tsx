"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
//import { useToast } from "../../hooks/toast";
import { ArrowPathIcon, } from "@heroicons/react/24/outline";
import CoinSelection from "../components/sell/coinselection";
import TxidInput from "../components/sell/txidinput";
import NetworkWarning from "../components/sell/network";
import WalletAddressDisplay from "../components/sell/walletaddres";
import FirstSide from "../components/sell/firstside";
import TransactionStatusModal from "./transactionmodal";
import AmountInputSell from "../components/sell/amout";
import Banks from "../components/sell/bank";
import { useToast } from "@/hooks/toast";

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


interface WalletAddress {
  address: string;
  network: string;
  note?: string;
}
interface Transaction {
  coin: string;
  status: string;
}
const BYBIT_WALLET_ADDRESSES: Record<string, WalletAddress[]> = {
  USDT: [
    {
      address: "TGNsXRxzAXs7xh4fBs7sQVjhej9JnKcvfU",
      network: "TRC20",
      note: "USDT TRC20 wallet address"
    }
  ],
  BTC: [
    {
      address: "1QBbNxYLTAUPNHeQeU6aeEivz6mbVBdiT7",
      network: "BTC",
      note: "Bybit BTC wallet address"
    }
  ],
  ETH: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "Ethereum Mainnet",
      note: "Ethereum Mainnet wallet address"
    },
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "Base",
      note: "Ethereum Base wallet address"
    }
  ],
  BNB: [
    {
      address: "CNPyBk7Zqvn52qRg1w9CcnbwpkBr8LQ9KLwYUhWMBbQU",
      network: "BEP20",
      note: "BNB BEP20 wallet address"
    }
  ],
  SOL: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "SOL",
      note: "Solana wallet address"
    }
  ],
  XRP: [
    {
      address: "rGDreBvnHrX1get7na3J4oowN19ny4GzFn",
      network: "XRP",
      note: "XRP wallet address, Tag/memo: 451786069"
    }
  ],
  ADA: [
    {
      address: "2a60aae0aedffc89d5b0ef571af7b7937e58d494251c5a0da535a91dcb0d23f9",
      network: "ADA",
      note: "Cardano wallet address"
    }
  ],
  DOGE: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "DOGE",
      note: "Doge wallet address"
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
  ],
  USDC: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "BEP20",
      note: "USDC BEP20 wallet address"
    },
    {
      address: "D8ZR94qAgK4Hgj75Zhs352ztCr1QEtX98P",
      network: "ERC20",
      note: "USDC ERC20 wallet address"
    }
  ],
  AVAX: [
    {
      address: "X-avax1deqsna9u4jy38squh65twvy68d7rcjpnntvcua",
      network: "C-Chain",
      note: "AVAX C-Chain wallet address"
    },
    {
      address: "Ae2tdPwUPEZ9nvdiZoMJEPXx5Lmwfy1AQrUBmtofAhPSYRgmtm6rAb4WNuR",
      network: "X-Chain",
      note: "AVAX X-Chain wallet address"
    }
  ],
  NEAR: [
    {
      address: "2a60aae0aedffc89d5b0ef571af7b7937e58d494251c5a0da535a91dcb0d23f9",
      network: "Near (Near protocol) wallet address"
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
  const [txid, setTxid] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [searchCoin, setSearchCoin] = useState("");
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const { showToast, ToastComponent } = useToast();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
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
  const [bankErrors, setBankErrors] = useState<{ accountNumber?: string; accountName?: string }>({});

// rate
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/coin");
        if (!res.ok) setError("Failed to fetch cryptocurrencies");
        const data = await res.json();
        const supported = data.filter((coin: Coin) => SUPPORTED_COINS.includes(coin.symbol.toUpperCase()));
        setCoins(supported);
        if (supported.length > 0) setSelectedCoin(supported[0]);
         setLoading(false);
      } catch (error) {
          console.log("Failed to fetch coins:", error);
        setError("Failed to fetch coins:",);
      }
    };
    fetchCoins();


const fetchBanks = async () => {
  try {
    const response = await fetch(`/api/banks?country=${selectedCountry.name.toLowerCase()}`);
    const data = await response.json();

    if (Array.isArray(data.banks)) {
      setBanksList(data.banks); // Set your dropdown list
       setLoading(false);
    } else {
      console.log("Unexpected response format:",);
      setBanksList([]);
    }
  } catch (error) {
      console.log("Failed to fetch banks:", error);
    setError("Failed to fetch banks:",);
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
          setError("Failed to fetch rate");
        const data = await response.json();
        setExchangeRate(data.conversion_rates[selectedCountry.currency] || 1);
         setLoading(false);
      } catch {
        setExchangeRate(1);
           setError("Failed to fetch rate");
      }
    };
    fetchExchangeRate();
  }, [selectedCountry.name, selectedCountry.currency]);

const walletAddresses = selectedCoin
  ? BYBIT_WALLET_ADDRESSES[selectedCoin.symbol.toUpperCase()] || []
  : null;

  const resetForm = () => {
  setTxid("");
  setAmount(0);
  setBankDetails({
    accountNumber: "",
    accountName: "",
    bankName: "",
    bankCode: ""
  });
 
};

const handleSubmit = async () => {
  if (!txid || !selectedCoin || amount <= 0) {
    showToast("Please fill in all fields correctly", "error");
    setStatus('failed');
    setModalType("error");
    setShowModal(true);
    return;
  }

  if (!bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankName) {
    showToast("Please provide your bank account details", "error");
    setStatus('failed');
    setModalType("error");
    setShowModal(true);
    return;
  }

  try {
    setIsSubmitting(true); // Start loading
    setStatus('sent');

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      showToast("Please login first", "error");
      setStatus('failed');
      setIsSubmitting(false); // Stop loading on error
      return;
    }

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
        country: selectedCountry.code,
        bankName: bankDetails.bankName,
        accountName: bankDetails.accountName,
        accountNumber: bankDetails.accountNumber,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      showToast(errorData.message || "Transaction failed", "error");
      setStatus('failed');
      setIsSubmitting(false); // Stop loading on error
      return;
    }

    const data = await response.json();
    setTransaction(data.data);
    
    setStatus('confirmed');
    showToast("Transaction submitted successfully", "success");
    setModalType("success");
    setShowModal(true);
      // Clear form after successful submission
    resetForm();
  

<<<<<<< HEAD
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'Transaction error', "error");
    setStatus('failed');
    setModalType("error");
    setShowModal(true);
  } finally {
    setIsSubmitting(false); // Always stop loading
  }
};
=======
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
          country: selectedCountry.code,
          bankName: bankDetails.bankName,
          accountName: bankDetails.accountName,
          accountNumber: bankDetails.accountNumber,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Transaction failed, user must be logged in');
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
>>>>>>> 00aa18458838794d286faf0191bbf5b2960a2930
    const safeCountry = selectedCountry || { currency: "USD", currencySymbol: "$" };
  
    const formatCurrency = (value: number, currency: string = safeCountry.currency || 'USD'): string => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (currency === safeCountry.currency && safeCountry.currencySymbol) {
      return formatter.format(value).replace(currency, safeCountry.currencySymbol);
    }
    return formatter.format(value);
  };
 const adjustedExchangeRate = exchangeRate - 50;
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
       
      
          <Banks 
          bankDetails={bankDetails}
          banksList={banksList}
          setBankDetails={setBankDetails}
          status={
            status === "pending" || status === "confirmed" || status === "failed"
              ? status
              : "pending"
          }
          setBankErrors={setBankErrors}
          bankErrors={bankErrors}
          />
          <TxidInput 
            txid={txid} 
            setTxid={setTxid} 
            status={status} 
          />              
          <div className="pt-4 pb-2 px-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-300">Oceanic Rate:</span>
    <span className="font-medium text-blue-400">
      $1 = {formatCurrency(adjustedExchangeRate)}
    </span>
  </div>
 
</div>
        

        <button 
  onClick={handleSubmit} 
  disabled={!txid || !selectedCoin  || amount <= 0 || !bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankName || isSubmitting} 
  className={`
    w-full py-3 rounded-full font-semibold transition-colors 
    ${
      !txid || !selectedCoin  || amount <= 0 || !bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankName
        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 transition-all hover:shadow-lg hover:shadow-blue-500/20'
    }`}
>
  {isSubmitting ? (
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
              ? `Your transaction was completed successfully.Your account will be credited after being confirm by our team.
      This usually takes 5-10 minutes`
              : `${amount} ${selectedCoin?.symbol.toUpperCase()} is pending. We are yet to confirm your transaction.`
          }
          details={{
            coin: transaction?.coin || "",
            amount,
            status: transaction?.status || "failed",
            txid
          }}
          onClose={() => setShowModal(false)}
        />
      )}
         {ToastComponent}
    </div>
  );
};

export default SellCrypto;