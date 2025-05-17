"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchPendingTransactions = async () => {
      try {
        const res = await fetch("https://oceanic-servernz.vercel.app/api/v1/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        type Transaction = { status: string; [key: string]: unknown };
        const pending = data.data.filter((tx: Transaction) => tx.status === "pending");
        setPendingCount(pending.length);
      } catch {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20 px-6 font-grotesk">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/pending" className="bg-gray-800/30 hover:border-blue-500 border border-gray-700/20 rounded-xl p-6 transition-all backdrop-blur-sm shadow hover:shadow-blue-500/10">
            <h2 className="text-xl font-semibold mb-2 text-white">Pending Approvals</h2>
            <p className="text-gray-400 text-sm">Review and confirm new buy/sell transactions.</p>
          </Link>

          <Link href="/admin/all" className="bg-gray-800/30 hover:border-blue-500 border border-gray-700/20 rounded-xl p-6 transition-all backdrop-blur-sm shadow hover:shadow-blue-500/10">
            <h2 className="text-xl font-semibold mb-2 text-white">All Transactions</h2>
            <p className="text-gray-400 text-sm">Browse full history of crypto trades made on Oceanic Charts.</p>
          </Link>
        </div>

        {loading && <p className="mt-6 text-gray-400">Loading data...</p>}
        {error && <p className="mt-6 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
