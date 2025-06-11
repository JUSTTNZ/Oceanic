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
import LoadingDisplay from "@/ui/loading";
import ErrorDisplay from "@/ui/errorbuy";
import { BYBIT_WALLET_ADDRESSES } from "@/utils/bybitaddress";
import { apiClient } from "@/utils/apiclient";


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



interface Transaction {
  coin: string;
  status: string;
}


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
const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | "pending">("pending");
  const { showToast, ToastComponent } = useToast();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  console.log(transaction)
  console.log("coin", selectedCoin?.symbol, )
console.log("t", txid)
console.log("a", amount)
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

  const [confirmedTransaction, setConfirmedTransaction] = useState<{
  coin?: string;
  amount?: number;
  status?: string;
  txid?: string;
} | null>(null);

  const [banksList, setBanksList] = useState<{name: string, code: string}[]>([]);
  const [bankErrors, setBankErrors] = useState<{ accountNumber?: string; accountName?: string }>({});

// rate
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Fetch coins data
        const responseCoins = await apiClient.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/crypto-markets`,{
              method: 'GET',
          credentials: "include"
          }
        );
        if (!responseCoins.ok) throw new Error("Failed to fetch coins");
        const dataCoin = await responseCoins.json();
             const supported = dataCoin.data.filter((coin: Coin) => SUPPORTED_COINS.includes(coin.symbol.toUpperCase()));
        setCoins(supported);
        if (supported.length > 0) setSelectedCoin(supported[0]);


     // 3. Fetch banks for the default country
      const banksResponse = await apiClient.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/banks?country=${selectedCountry.name.toLowerCase()}`,{
            method: 'GET',
          credentials: "include"
        }
        
      );
      if (!banksResponse.ok) throw new Error("Failed to fetch banks");
      const banksData = await banksResponse.json();
   if (Array.isArray(banksData.data.banks)) {
      setBanksList(banksData.data.banks); // Set your dropdown list
    } else {
      console.log("Unexpected response format:",);
      setBanksList([]);
    }
  

        
  
        // Fetch exchange rates
        const responseRate = await apiClient.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/exchange-rates`,{
              method: 'GET',
          credentials: "include"
          }
        );
        if (!responseRate.ok) throw new Error("Failed to fetch rates");
        const rateData = await responseRate.json();
        
        // Use the default country's currency to set initial exchange rate
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
  }, [selectedCountry]);


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
  // Validate inputs
  if (!txid || !selectedCoin || amount <= 0) {
    showToast("Please fill in all fields correctly", "error");
    setStatus("failed");
    setModalType("error");
    setShowModal(true);
    return;
  }

  if (!bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankName) {
    showToast("Please provide your bank account details", "error");
    setStatus("failed");
    setModalType("error");
    setShowModal(true);
    return;
  }

  try {
    setIsSubmitting(true);
    setStatus("sent");

 

    // Step 1: Create transaction
    const createRes = await apiClient.request(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        coin: selectedCoin.symbol,
        amount,
        txid,
        type: "sell",
        country: selectedCountry.code,
        bankName: bankDetails.bankName,
        accountName: bankDetails.accountName,
        accountNumber: bankDetails.accountNumber,
      }),
    });
    
    const createData = await createRes.json();
console.log("cre", createData)
    if (!createRes.ok) {
      throw new Error(createData.message || "Transaction creation failed");
    }

    setTransaction(createData.data);
console.log("coin", selectedCoin.symbol, coins)
console.log("t", txid)
console.log("a", amount)
    // Step 2: Confirm transaction using Bitget
    const confirmRes = await apiClient.request(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/bitget/confirm-deposit?coin=${selectedCoin.symbol}&txid=${txid}&size=${amount}`,
      {
     method: 'GET',
    credentials: "include"
      }
    );
    console.log("res", confirmRes)

    const confirmData = await confirmRes.json();
  console.log("con", confirmData)
    if (confirmData.success && confirmData.confirmed) {
    setStatus("confirmed");
    showToast("Transaction confirmed successfully!", "success");

    setConfirmedTransaction({
      coin: selectedCoin?.symbol.toUpperCase(),
      amount,
      status: "confirmed",
      txid,
    });

    setModalType("success");
    setShowModal(true);
    resetForm();
    }
    else {
      // Bitget did not confirm it yet
      setStatus("pending");
      showToast(
        "Transaction submitted but not yet confirmed. Please wait."
      );
      setConfirmedTransaction({
        coin: selectedCoin?.symbol.toUpperCase(),
        amount,
        status: "pending",
        txid,
      });
      setModalType("pending");
      setShowModal(true);
    }
  } catch (error) {
    console.log("Transaction error:", error);
    // showToast(
    //   error instanceof Error ? error.message : "Transaction failed",
    //   "error"
    // );
    setStatus("failed");
    setModalType("error");
    setShowModal(true);
  } finally {
    setIsSubmitting(false);
  }
};

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
      <LoadingDisplay />
     );
   }
 if (error){
   return(
  <ErrorDisplay />
   )
 }




  return (
    <div className="min-h-screen">
      <motion.div 
        key="sell" 
       initial={{ opacity: 0, y: 30 }} // Start from below
  animate={{ opacity: 1, y: 0 }} // Animate to original position
  exit={{ opacity: 0, y: -30 }} // Exit upwards
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
          title={
            modalType === "success"
              ? "Transaction Successful"
              : modalType === "pending"
              ? "Transaction Pending"
              : "Transaction Failed"
          }
          message={
            modalType === "success"
              ? "Your transaction was completed successfully. Your account will be credited after confirmation by our team. This usually takes 5-10 minutes."
              : `${amount} ${selectedCoin?.symbol.toUpperCase()} is pending. We are yet to confirm your transaction.`
          }
          details={confirmedTransaction || {}}
          onClose={() => setShowModal(false)}
        />

      )}
         {ToastComponent}
    </div>
  );
};

export default SellCrypto;