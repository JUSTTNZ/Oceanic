"use client";

import { useEffect, useRef, useState } from "react";
import { FaSort, FaSortUp, FaSortDown, FaCopy, FaCheck, FaFilter } from "react-icons/fa";
import { useToast } from "../../hooks/toast";
import { apiClients } from "@/lib/apiClient";

interface Transaction {
  txid: string;
  amount: number;
  coinAmount: number;
  coin: string;
  type: "buy" | "sell";
  status: string;
  walletAddressUsed: string;
  createdAt: string;
  coinPriceUsd?: number;
  userId?: { email?: string; username?: string; fullname?: string };
  userEmail?: string;
  userFullname?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  country?: string;
  walletAddressSentTo?: string;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Transaction>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const { ToastComponent, showToast } = useToast();
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent multiple fetches in strict mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch transactions
        const res = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transaction/admin`,
          { method: "GET", credentials: "include" }
        );

        if (!res.ok) {
          showToast("Failed to load transactions", "error");
          setTransactions([]);
          return;
        }

        const json = await res.json();
        const txs: Transaction[] = Array.isArray(json.data) ? json.data : [];

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
        }

        setTransactions(txs);
        setExchangeRate(baseRate);

      } catch (err) {
        console.error("Error fetching transactions:", err);
        showToast("Failed to fetch data", "error");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only fetch once on mount

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast("Copied to clipboard!", "success");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const calculateAmounts = (tx: Transaction) => {
    const coinPriceUsd = tx.coinPriceUsd ?? 0;
    const dollarAmount = tx.type === "buy" ? tx.amount : tx.coinAmount * coinPriceUsd;
    const adjustedRate = tx.type === "sell" ? exchangeRate - 70 : exchangeRate + 70;
    const nairaAmount = dollarAmount * adjustedRate;
    return { dollarAmount, nairaAmount };
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filterStatus !== "all" && tx.status !== filterStatus) return false;
    if (filterType !== "all" && tx.type !== filterType) return false;
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const order = sortDirection === "asc" ? 1 : -1;
    const valA = a[sortField];
    const valB = b[sortField];

    if (sortField === "createdAt") {
      return (new Date(valA as string).getTime() - new Date(valB as string).getTime()) * order;
    }

    if (typeof valA === "number" && typeof valB === "number") {
      return (valA - valB) * order;
    }

    return String(valA).localeCompare(String(valB)) * order;
  });

  const toggleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: keyof Transaction) => {
    if (field !== sortField) return <FaSort className="ml-1 text-gray-500" />;
    return sortDirection === "asc" ? <FaSortUp className="ml-1 text-blue-400" /> : <FaSortDown className="ml-1 text-blue-400" />;
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="ml-2 p-1 hover:bg-gray-700/50 rounded transition-colors inline-flex items-center"
      title="Copy to clipboard"
    >
      {copiedField === field ? (
        <FaCheck className="text-green-400 text-xs" />
      ) : (
        <FaCopy className="text-gray-400 hover:text-blue-400 text-xs" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100 font-grotesk pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              All Transactions
            </h2>
            <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50">
              <span className="text-sm text-gray-400">Total: </span>
              <span className="text-lg font-bold text-blue-400">{filteredTransactions.length}</span>
              <span className="text-sm text-gray-500 ml-1">transactions</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50">
              <FaFilter className="text-gray-400 text-sm" />
              <span className="text-sm text-gray-400">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-sm text-gray-200 border-none outline-none cursor-pointer"
              >
                <option value="all" className="bg-gray-800">All</option>
                <option value="confirmed" className="bg-gray-800">Confirmed</option>
                <option value="pending" className="bg-gray-800">Pending</option>
                <option value="rejected" className="bg-gray-800">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50">
              <FaFilter className="text-gray-400 text-sm" />
              <span className="text-sm text-gray-400">Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-sm text-gray-200 border-none outline-none cursor-pointer"
              >
                <option value="all" className="bg-gray-800">All</option>
                <option value="buy" className="bg-gray-800">Buy</option>
                <option value="sell" className="bg-gray-800">Sell</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-400 text-lg">Loading transactions...</p>
          </div>
        ) : sortedTransactions.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/20 rounded-xl border border-gray-700/30">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No transactions found</h3>
            <p className="text-gray-500">Transactions will appear here once they are created.</p>
          </div>
        ) : (
          <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700/50">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-700/30 transition-colors"
                      onClick={() => toggleSort("createdAt")}
                    >
                      <div className="flex items-center text-gray-300">
                        Date & Time {renderSortIcon("createdAt")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-700/30 transition-colors"
                      onClick={() => toggleSort("type")}
                    >
                      <div className="flex items-center text-gray-300">
                        Type {renderSortIcon("type")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-700/30 transition-colors"
                      onClick={() => toggleSort("status")}
                    >
                      <div className="flex items-center text-gray-300">
                        Status {renderSortIcon("status")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                      User Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Coin
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-300">
                      USD Amount
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-300">
                      NGN Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Wallet / Bank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Transaction ID
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700/30">
                  {sortedTransactions.map((tx, index) => {
                    const { dollarAmount, nairaAmount } = calculateAmounts(tx);
                    const userDisplay = tx.userFullname || tx.userId?.fullname || tx.userId?.username || "Unknown";
                    const emailDisplay = tx.userEmail || tx.userId?.email || "No email";

                    return (
                      <tr
                        key={tx.txid}
                        className="hover:bg-gray-700/20 transition-colors"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Date & Time */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-200 font-medium">
                            {new Date(tx.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(tx.createdAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.type === "buy" 
                              ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                              : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          }`}>
                            {tx.type === "buy" ? "🔼" : "🔽"} {tx.type.toUpperCase()}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                            statusColors[tx.status] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}>
                            {tx.status.toUpperCase()}
                          </span>
                        </td>

                        {/* User Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-200 flex items-center">
                                {userDisplay}
                                <CopyButton text={userDisplay} field={`name-${tx.txid}`} />
                              </div>
                              <div className="text-xs text-gray-400 flex items-center mt-0.5">
                                {emailDisplay}
                                <CopyButton text={emailDisplay} field={`email-${tx.txid}`} />
                              </div>
                              {tx.country && (
                                <div className="text-xs text-gray-500 mt-0.5">📍 {tx.country}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Coin */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-blue-400">{tx.coin.toUpperCase()}</div>
                          <div className="text-xs text-gray-400">{tx.coinAmount.toFixed(6)}</div>
                        </td>

                        {/* USD Amount */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-400">
                            ${dollarAmount.toFixed(2)}
                          </div>
                        </td>

                        {/* NGN Amount */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="text-sm font-semibold text-blue-300">
                            {new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(nairaAmount)}
                          </div>
                        </td>

                        {/* Wallet / Bank */}
                        <td className="px-6 py-4">
                          {tx.type === "buy" ? (
                            <div className="max-w-[200px]">
                              <div className="text-xs text-gray-500 mb-1">User Wallet:</div>
                              <div className="flex items-center">
                                <code className="text-xs text-gray-300 bg-gray-900/50 px-2 py-1 rounded truncate block">
                                  {tx.walletAddressUsed?.slice(0, 12)}...{tx.walletAddressUsed?.slice(-8)}
                                </code>
                                <CopyButton text={tx.walletAddressUsed || ""} field={`wallet-${tx.txid}`} />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center text-gray-300">
                                🏦 {tx.bankName || "-"}
                              </div>
                              <div className="flex items-center text-gray-300">
                                👤 {tx.accountName || "-"}
                                {tx.accountName && <CopyButton text={tx.accountName} field={`acc-name-${tx.txid}`} />}
                              </div>
                              <div className="flex items-center">
                                <code className="text-blue-400 bg-gray-900/50 px-2 py-1 rounded text-xs">
                                  {tx.accountNumber || "-"}
                                </code>
                                {tx.accountNumber && <CopyButton text={tx.accountNumber} field={`acc-num-${tx.txid}`} />}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Transaction ID */}
                        <td className="px-6 py-4">
                          <div className="flex items-center max-w-[180px]">
                            <code className="text-xs text-blue-300 bg-gray-900/50 px-2 py-1 rounded truncate block font-mono">
                              {tx.txid.slice(0, 10)}...{tx.txid.slice(-8)}
                            </code>
                            <CopyButton text={tx.txid} field={`txid-${tx.txid}`} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {ToastComponent}
    </div>
  );
}