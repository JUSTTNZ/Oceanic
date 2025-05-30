"use client";

import { useEffect, useState, useCallback } from "react";
import { FaCheck,  } from "react-icons/fa";
import { useToast } from "../../hooks/toast";
import { authFetch } from "@/utils/api";
interface Transaction {
  txid: string;
  userId: {
    email: string;
    username: string;
    fullname?: string;
  };
  coin: string;
  amount: number;
  walletAddressUsed: string;
  status: string;
  type: string;
  createdAt: string;
}

export default function AdminPendingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
    const [loadingConfirm, setLoadingConfrim] = useState<string | null>(null)
  const { ToastComponent, showToast } = useToast();

  const fetchPendingTransactions = useCallback(async () => {
    try {
      const res = await authFetch("https://oceanic-servernz.vercel.app/api/v1/transaction/admin", {
       method: 'GET',
          credentials: "include"
      });
      if (!res.ok) {
        setTransactions([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      const pending = Array.isArray(data.data) ? data.data.filter((tx: Transaction) => tx.status === "pending") : [];
      setTransactions(pending);
    } catch (err) {
      showToast("Failed to load transactions", "error");
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleUpdateStatus = async (txid: string, status: string) => {
    setLoadingConfrim(txid)
    try {
      await authFetch(`https://oceanic-servernz.vercel.app/api/v1/transaction/status/${txid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
          credentials: "include"
      });
     
      setTransactions(transactions.filter(tx => tx.txid !== txid));
       showToast("confirmed transaction", "success");
    } catch (err) {
      showToast("Failed to update transaction status", "error");
      console.error("Failed to update transaction status", err);
    } finally{
      setLoadingConfrim(null)
    }
  };

  useEffect(() => {
    fetchPendingTransactions();
  }, [fetchPendingTransactions]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-grotesk pt-20 ">
      <main className="container mx-auto   py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Pending Approvals
          </h2>
          <span className="text-xs bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm">
            {transactions.length} requests
          </span>
        </div>
<div className="overflow-hidden">


        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-1 text-white">All clear!</h3>
            <p className="text-gray-400">No pending transactions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {transactions.map((tx) => (
              <div
                key={tx.txid}
                className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-5 hover:border-blue-500/30 transition-all backdrop-blur-sm shadow-lg hover:shadow-blue-500/10"
              >
                 <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-medium text-blue-300">{tx.userId.username}</h3>
          <p className="text-xs text-gray-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {tx.walletAddressUsed}
          </p>
        </div>
        <span className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full backdrop-blur-sm">
          {new Date(tx.createdAt).toLocaleTimeString()}
        </span>
      </div>


                <div className="mb-6 ">
                  <p className="text-2xl font-bold text-white">
                    {tx.amount} {tx.coin.toUpperCase()}
                  </p>
<p className="text-xs text-gray-400 mt-1  overflow-hidden text-ellipsis ">
  Transaction ID: {tx.txid}
</p>

                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpdateStatus(tx.txid, "confirmed")}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
                    disabled={loadingConfirm === tx.txid}
                  >
                    {loadingConfirm === tx.txid ? (
    <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-white rounded-full"></div>
  ) : (
    <>
      <FaCheck />
      <span>Confirm</span>
    </>
  )}
                  </button>
                 
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>
      {ToastComponent}
    </div>
  );
}
