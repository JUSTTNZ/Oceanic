"use client";

import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useToast } from "../../hooks/toast";
import { apiClients } from "@/lib/apiClient";

type UserRef = {
  email?: string;
  username?: string;
  fullname?: string;
} | null;

interface Transaction {
  txid: string;
  userId: UserRef;
  coin: string;
  amount: number;      // For buy: USD amount | For sell: already in crypto (coinAmount)
  coinAmount: number;  // Coin amount (for both buy & sell)
  walletAddressUsed: string;
  status: string;
  type: "buy" | "sell";
  createdAt: string;
  exchangeRateAdjusted?: number; // Adjusted exchange rate (+70 for buy, -70 for sell)
}

export default function AdminPendingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingConfirm, setLoadingConfirm] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [loadingRates, setLoadingRates] = useState(true);

  const { ToastComponent, showToast } = useToast();
  const hasFetched = useRef(false);

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;

  const fetchData = async () => {
    setLoading(true);
    setLoadingRates(true);

    try {
      console.log("Fetching transactions...");

      // 1️⃣ Fetch transactions
      const res = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction/admin`,
        { method: "GET", credentials: "include" }
      );

      if (!res.ok) {
        console.warn("Failed to fetch transactions", res.status);
        if (res.status === 401 || res.status === 403) {
          showToast("Authentication required. Please login again.", "error");
          setTimeout(() => (window.location.href = "/login"), 2000);
        } else {
          showToast("Failed to load transactions", "error");
        }
        setTransactions([]);
        return;
      }

      const json = await res.json();
      console.log("Raw transactions fetched:", json.data);

      const pending: Transaction[] = Array.isArray(json.data)
        ? json.data.filter((tx: Transaction) => tx.status === "pending")
        : [];

      console.log("Pending transactions before adjustment:", pending);

      // 2️⃣ Fetch NGN exchange rate
      let baseRate = 1;
      try {
        console.log("Fetching NGN exchange rate...");
        const rateRes = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/exchange-rates`,
          { method: "GET", credentials: "include" }
        );

        if (rateRes.ok) {
          const rateJson = await rateRes.json();
          baseRate = rateJson?.data?.conversion_rates?.NGN ?? 1;
          console.log("Base NGN exchange rate:", baseRate);
        }
      } catch (err) {
        console.error("Failed to fetch exchange rate, defaulting to 1", err);
        baseRate = 1;
      }

      // Apply +70 for buy, -70 for sell
      const adjustedTransactions = pending.map(tx => {
        const adjustedRate = tx.type === "buy" ? baseRate + 70 : baseRate - 70;
        console.log(`Transaction ${tx.txid}: type=${tx.type}, original baseRate=${baseRate}, adjustedRate=${adjustedRate}`);
        return {
          ...tx,
          exchangeRateAdjusted: adjustedRate,
        };
      });

      console.log("Transactions after adjustment:", adjustedTransactions);

      setTransactions(adjustedTransactions);
      setExchangeRate(baseRate);

    } catch (err) {
      console.error("Error during fetchData:", err);
      showToast("Failed to load data", "error");
      setTransactions([]);
    } finally {
      setLoading(false);
      setLoadingRates(false);
    }
  };

  fetchData();
}, [showToast]);


  const handleUpdateStatus = async (txid: string, status: string) => {
    setLoadingConfirm(txid);
    try {
      const res = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction/status/${txid}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        showToast("Failed to update transaction status", "error");
        return;
      }

      setTransactions(prev => prev.filter(tx => tx.txid !== txid));
      showToast("Confirmed transaction", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update transaction status", "error");
    } finally {
      setLoadingConfirm(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-grotesk pt-20">
      <main className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Pending Approvals
          </h2>
          <span className="text-xs bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full">
            {transactions.length} requests
          </span>
        </div>

        {loading ? (
          <p className="text-center py-12">Loading...</p>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-1 text-white">All clear!</h3>
            <p className="text-gray-400">No pending transactions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactions.map(tx => {
              const dollarAmount =
                tx.type === "buy"
                  ? tx.amount
                  : tx.coinAmount * (tx.exchangeRateAdjusted ?? exchangeRate);

              const nairaAmount = dollarAmount * (tx.exchangeRateAdjusted ?? exchangeRate);

              return (
                <div
                  key={tx.txid}
                  className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-5 hover:border-blue-500/30 transition-all shadow-lg"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-blue-300">
                        {tx.userId?.username ?? "(unknown user)"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {tx.walletAddressUsed || "no wallet"}
                      </p>
                    </div>
                    <span className="text-xs bg-gray-800/50 px-2 py-1 rounded">
                      {new Date(tx.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="text-2xl font-bold text-white">
                      {tx.type === "buy"
                        ? `$${tx.amount}`
                        : `${tx.coinAmount} ${tx.coin.toUpperCase()}`}
                    </p>

                    <p className="text-sm text-gray-300 mt-1">
                      Dollar Amount: ${dollarAmount.toFixed(2)}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Naira Amount:{" "}
                      {loadingRates
                        ? "Loading..."
                        : new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          }).format(nairaAmount)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1 truncate">
                      Transaction ID: {tx.txid}
                    </p>

                    {/* <p className="text-xs text-gray-400 mt-1 truncate">
                      Exchange Rate Applied: {tx.exchangeRateAdjusted?.toFixed(2)}
                    </p> */}
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(tx.txid, "confirmed")}
                    disabled={loadingConfirm === tx.txid}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3 rounded-lg"
                  >
                    {loadingConfirm === tx.txid ? (
                      <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <FaCheck />
                        <span>Confirm</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {ToastComponent}
    </div>
  );
}
