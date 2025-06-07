"use client";

import { useEffect, useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useToast } from "../../hooks/toast";
import { apiClient } from "@/utils/apiclient";
interface Transaction {
  txid: string;
  amount: number;
  coin: string;
  type: string;
  status: string;
  walletAddressUsed: string;
  createdAt: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  userId?: {
    email: string;
    username: string;
    fullname: string;
  };
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
};

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Transaction>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { ToastComponent, showToast } = useToast();


  useEffect(() => {
   const fetchTransactions = async () => {
  try {
    const { data } = await apiClient.request(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction/admin`,
      {
        method: 'GET',
        credentials: 'include'
      }
    ).then(res => res.json());

    setTransactions(Array.isArray(data) ? data : []);
  } catch (err) {
    showToast("Failed to fetch transactions", "error");
    console.error(err);
  } finally {
    setLoading(false);
  }
};
    fetchTransactions();
  }, [showToast]);

  const sortedTransactions = Array.isArray(transactions)
    ? [...transactions].sort((a, b) => {
        const order = sortDirection === "asc" ? 1 : -1;
        const valA = a[sortField]!;
        const valB = b[sortField]!;
        return valA > valB ? order : valA < valB ? -order : 0;
      })
    : [];

  const toggleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: keyof Transaction) => {
    if (field !== sortField) return <FaSort className="ml-1 text-gray-400" />;
    return sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

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
          <div className="overflow-x-auto rounded-lg shadow border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold cursor-pointer" onClick={() => toggleSort("txid")}>TxID {renderSortIcon("txid")}</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold cursor-pointer" onClick={() => toggleSort("createdAt")}>Date {renderSortIcon("createdAt")}</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold cursor-pointer" onClick={() => toggleSort("type")}>Type {renderSortIcon("type")}</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold cursor-pointer" onClick={() => toggleSort("status")}>Status {renderSortIcon("status")}</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold cursor-pointer" onClick={() => toggleSort("amount")}>Amount {renderSortIcon("amount")}</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Wallet</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">User</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Bank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedTransactions.map((tx) => (
                  <tr key={tx.txid} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-blue-300 font-mono truncate max-w-xs">{tx.txid}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{new Date(tx.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-blue-500 capitalize">{tx.type}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[tx.status] || "bg-gray-200 text-gray-700"}`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-white font-semibold">{tx.amount} {tx.coin.toUpperCase()}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 font-mono truncate max-w-xs">{tx.walletAddressUsed}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{tx.userId?.email || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {tx.type === 'sell' ? (
                        <>
                          <div>{tx.bankName || "-"}</div>
                          <div>{tx.accountName || "-"}</div>
                          <div title="Click to copy" onClick={() => navigator.clipboard.writeText(tx.accountNumber || '')} className="cursor-pointer hover:text-blue-400">
                            {tx.accountNumber || "-"}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500">N/A</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {ToastComponent}
    </div>
  );
}
