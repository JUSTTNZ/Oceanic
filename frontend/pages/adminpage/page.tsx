"use client";
interface Transaction {
  txid: string; // Transaction ID (format: alphanumeric with optional hyphens)
  amount: number;
  coin: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'pending' | 'confirmed' | 'failed';
  walletAddressUsed: string;
  createdAt: string; // ISO 8601 date string
  userId?: {
    email: string;
    username: string;
    fullname: string;
  };
}

import Link from "next/link";
import { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import AllTransaction from '../admin/alltransaction'
import PendingTransaction from '../admin/pendingtransaction'
import { authFetch } from "@/utils/api";


export default function AdminDashboard() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");



  useEffect(() => {
    
    const fetchPendingTransactions = async () => {
      try {
        const res = await authFetch("https://oceanic-servernz.vercel.app/api/v1/transaction/admin", {
            method: 'GET',
          credentials: "include"
        });

        const data = await res.json();
        console.log("API response:", data);

        if (!res.ok || !Array.isArray(data.data)) {
          setError(data.message || "Failed to load transactions");
          setLoading(false);
          return;
        }
        const pending = data.data.filter((txid: Transaction) => txid.status === "pending");
        setPendingCount(pending.length);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load transactions";
        setError(errorMessage);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTransactions();
  }, []);

     if(loading){
return(



          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
           <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
          </div>
          )
        }
      if(error){
return(



          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-red-600 text-white rounded-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-2">Error</h2>
              <p>{error}</p>
           
            </div>
          </div>
          )
        }
  return (
    
    <div className="min-h-screen bg-gray-900 text-white py-20  font-grotesk w-full">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="relative">
            <BellIcon className="h-7 w-7 text-blue-500" />
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center space-x-4 py-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 border-2 ${
              activeTab === "pending"
                ? "bg-[rgba(0,71,171,0.2)] text-[#0047AB] border-[#0047AB]"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 border-2 ${
              activeTab === "all"
                ? "bg-[rgba(0,71,171,0.2)] text-[#0047AB] border-[#0047AB]"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-300"
            }`}
          >
            All
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "pending" ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="#" className="block bg-gray-800/30 hover:border-blue-500 border border-gray-700/20 rounded-xl p-6 transition-all backdrop-blur-sm shadow hover:shadow-blue-500/10">
                <h2 className="text-xl font-semibold mb-2 text-white">Pending Approvals</h2>
                <p className="text-gray-400 text-sm">Review and confirm new buy/sell transactions.</p>
              </Link>
              <PendingTransaction />
            </motion.div>
          ) : (
            <motion.div
              key="all"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="#" className="block bg-gray-800/30 hover:border-blue-500 border border-gray-700/20 rounded-xl p-6 transition-all backdrop-blur-sm shadow hover:shadow-blue-500/10">
                <h2 className="text-xl font-semibold mb-2 text-white">All Transactions</h2>
                <p className="text-gray-400 text-sm">Browse full history of crypto trades made on Oceanic Charts.</p>
              </Link>
              <AllTransaction />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
   
  );
}
