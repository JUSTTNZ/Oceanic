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
  amount: number;      // For buy: USD amount | For sell: ignored
  coinAmount: number;  // Coin amount (for both buy & sell)
  walletAddressUsed: string;
  status: string;
  type: "buy" | "sell";
  createdAt: string;
  coinPriceUsd?: number;
}

interface Coin {
  id: string;
  symbol: string;
  current_price: number;
}

export default function AdminPendingPage() {
  const [transactions, setTransactions] = useState<(Transaction & { dollarAmount: number; nairaAmount: number })[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingConfirm, setLoadingConfirm] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const { ToastComponent, showToast } = useToast();
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent multiple fetches in strict mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchTransactionsAndCoins = async () => {
      setLoading(true);
      try {
        // Fetch transactions
        const txRes = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction/admin`,
          { method: "GET", credentials: "include" }
        );
        if (!txRes.ok) throw new Error("Failed to fetch transactions");
        const txJson = await txRes.json();
        console.log("All transactions fetched:", txJson);
        const pending: Transaction[] = Array.isArray(txJson.data)
          ? txJson.data.filter((tx: Transaction) => tx.status === "pending")
          : [];
        console.log("Pending transactions fetched:", pending);

        // Fetch NGN exchange rate (now cached on backend!)
        let baseRate = 1;
        try {
          const rateRes = await apiClients.request(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/exchange-rates`,
            { method: "GET", credentials: "include" }
          );
          if (rateRes.ok) {
            const rateJson = await rateRes.json();
            baseRate = rateJson?.data?.conversion_rates?.NGN ?? 1;
          }
        } catch (err) {
          console.error("Failed to fetch exchange rate:", err);
          baseRate = 1;
        }
        setExchangeRate(baseRate);

        // Calculate USD and NGN amounts
        const adjustedTransactions = pending.map(tx => {
          const coinPriceUsd = tx.coinPriceUsd ?? 0;
          const dollarAmount = tx.type === "sell" ? tx.coinAmount * coinPriceUsd : tx.amount;
          const adjustedRate = tx.type === "sell" ? baseRate - 70 : baseRate + 70;
          const nairaAmount = dollarAmount * adjustedRate;
          
          console.log(
            `Transaction ${tx.txid} (${tx.type.toUpperCase()}):`,
            `coin=${tx.coin.toUpperCase()}, coinAmount=${tx.coinAmount},`,
            `coinPriceUsd=${coinPriceUsd} => dollarAmount=${dollarAmount.toFixed(2)},`,
            `dollarAmount * baseRate(${baseRate}) => nairaAmount=${nairaAmount.toFixed(2)}`
          );
          
          return {
            ...tx,
            dollarAmount,
            nairaAmount,
          };
        });

        setTransactions(adjustedTransactions);
      } catch (err) {
        console.error(err);
        showToast("Failed to load transactions", "error");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionsAndCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only fetch once on mount

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
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-400 text-lg">Loading pending transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/20 rounded-xl border border-gray-700/30">
            <FaCheck className="text-6xl mb-4 text-green-400" />
            <h3 className="text-xl font-medium mb-1 text-white">All clear!</h3>
            <p className="text-gray-400">No pending transactions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactions.map(tx => (
              <div
                key={tx.txid}
                className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-5 hover:border-blue-500/30 transition-all shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-blue-300">{tx.userId?.username ?? "(unknown user)"}</h3>
                    <p className="text-xs text-gray-400 mt-1 truncate">{tx.walletAddressUsed || "no wallet"}</p>
                  </div>
                  <span className="text-xs bg-gray-800/50 px-2 py-1 rounded">
                    {new Date(tx.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="mb-6">
                  <p className="text-2xl font-bold text-white">
                    {tx.type === "buy" ? `$${tx.amount}` : `${tx.coinAmount} ${tx.coin.toUpperCase()}`}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">Dollar Amount: ${tx.dollarAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Naira Amount: {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(tx.nairaAmount)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 truncate">Transaction ID: {tx.txid}</p>
                </div>

                <button
                  onClick={() => handleUpdateStatus(tx.txid, "confirmed")}
                  disabled={loadingConfirm === tx.txid}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
            ))}
          </div>
        )}
      </main>
      {ToastComponent}
    </div>
  );
}