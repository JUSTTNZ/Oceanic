"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Transaction {
  txid: string;
  amount: number;
  coin: string;
  type: string;
  status: string;
  walletAddressUsed: string;
  createdAt: string;
  userId?: {
    email: string;
    username: string;
    fullname: string;
  };
}

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await fetch("https://oceanic-servernz.vercel.app/api/v1/transaction/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setTransactions(data.data);
      } catch (err) {
        setError("Failed to fetch transactions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-grotesk pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          All Transactions
        </h2>

        {loading ? (
          <p className="text-blue-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-400">No transactions available.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <motion.div
                key={tx.txid}
                className="bg-gray-800/30 border border-gray-700/20 rounded-lg p-4 backdrop-blur-sm shadow hover:shadow-blue-500/10"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-semibold">{tx.txid}</h4>
                    <p className="text-gray-400 text-sm">{tx.createdAt}</p>
                    <p className="text-sm mt-1">{tx.userId?.email || "No user data"}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      tx.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-300"
                        : tx.status === "confirmed"
                        ? "bg-green-500/10 text-green-300"
                        : "bg-red-500/10 text-red-300"
                    }`}
                  >
                    {tx.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-white text-lg font-bold">
                    {tx.amount} {tx.coin.toUpperCase()}
                  </p>
                  <p className="text-gray-400 text-sm">Type: {tx.type}</p>
                  <p className="text-gray-400 text-sm">Wallet: {tx.walletAddressUsed}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
