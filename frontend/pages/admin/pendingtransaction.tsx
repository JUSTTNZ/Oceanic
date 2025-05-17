"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

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

  const fetchPendingTransactions = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch("https://oceanic-servernz.vercel.app/api/v1/transaction/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const pending = data.data.filter((tx: Transaction) => tx.status === "pending");
      setTransactions(pending);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (txid: string, status: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      await fetch(`https://oceanic-servernz.vercel.app/api/v1/transaction/status/${txid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      setTransactions(transactions.filter(tx => tx.txid !== txid));
    } catch (err) {
      console.error("Failed to update transaction status", err);
    }
  };

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-grotesk pt-20">
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Pending Approvals
          </h2>
          <span className="text-xs bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm">
            {transactions.length} requests
          </span>
        </div>

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
                  <div>
                    <h3 className="font-medium text-blue-300">{tx.userId.username}</h3>
                    <p className="text-xs text-gray-400 mt-1">{tx.walletAddressUsed}</p>
                  </div>
                  <span className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full backdrop-blur-sm">
                    {new Date(tx.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="mb-6">
                  <p className="text-2xl font-bold text-white">
                    {tx.amount} {tx.coin.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Transaction ID: {tx.txid}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpdateStatus(tx.txid, "confirmed")}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <FaCheck />
                    <span>Confirm</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(tx.txid, "rejected")}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-3 px-4 rounded-lg transition-all hover:shadow-lg hover:shadow-red-500/20"
                  >
                    <FaTimes />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
