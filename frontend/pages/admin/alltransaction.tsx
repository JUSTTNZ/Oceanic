"use client";

import { useEffect, useRef, useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useToast } from "../../hooks/toast";
import { apiClients } from "@/lib/apiClient";

interface Transaction {
  txid: string;
  amount: number;       // Buy: USD amount | Sell: coinAmount in USD (no extra fetch)
  coinAmount: number;
  coin: string;
  type: "buy" | "sell";
  status: string;
  walletAddressUsed: string;
  createdAt: string;
  userId?: { email?: string; username?: string; fullname?: string };
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  exchangeRateAdjusted?: number; // Adjusted NGN exchange rate (+70/-70)
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
};

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Transaction>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
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
        console.log("Fetching all transactions...");
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
        let txs: Transaction[] = Array.isArray(json.data) ? json.data : [];
        console.log("Raw transactions fetched:", txs);

        // Fetch NGN exchange rate
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

        // Apply adjusted exchange rate (+70 for buy, -70 for sell)
        txs = txs.map(tx => {
          const adjustedRate = tx.type === "buy" ? baseRate + 70 : baseRate - 70;
          console.log(
            `Transaction ${tx.txid}: type=${tx.type}, baseRate=${baseRate}, adjustedRate=${adjustedRate}`
          );
          return {
            ...tx,
            exchangeRateAdjusted: adjustedRate,
          };
        });

        console.log("Transactions after adjustment:", txs);
        setTransactions(txs);
        setExchangeRate(baseRate);

      } catch (err) {
        console.error("Error fetching transactions:", err);
        showToast("Failed to fetch data", "error");
        setTransactions([]);
      } finally {
        setLoading(false);
        setLoadingRates(false);
      }
    };

    fetchData();
  }, [showToast]);

  const sortedTransactions = [...transactions].sort((a, b) => {
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
        ) : transactions.length === 0 ? (
          <p className="text-gray-400">No transactions available.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  {["txid", "createdAt", "type", "status", "amount"].map((key, i) => (
                    <th
                      key={i}
                      className="px-4 py-2 text-left text-sm font-semibold cursor-pointer"
                      onClick={() => toggleSort(key as keyof Transaction)}
                    >
                      {key.toUpperCase()} {renderSortIcon(key as keyof Transaction)}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-right text-sm font-semibold">Naira Amount</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold">Coin Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Wallet</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">User</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Bank</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {sortedTransactions.map(tx => {
    const dollarAmount =
                tx.type === "buy"
                  ? tx.amount
                  : tx.coinAmount * (tx.exchangeRateAdjusted ?? exchangeRate);

              const nairaAmount = dollarAmount * (tx.exchangeRateAdjusted ?? exchangeRate);

                  return (
                    <tr key={tx.txid} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-blue-300 font-mono truncate max-w-xs">{tx.txid}</td>
                      <td className="px-4 py-3 text-gray-300">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-blue-500 capitalize">{tx.type}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[tx.status] ?? "bg-gray-200 text-gray-700"}`}>
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{tx.type === "buy" ? `$${tx.amount}` : `${tx.coinAmount} ${tx.coin.toUpperCase()}`}</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {loadingRates ? "Loading..." : new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(nairaAmount)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{tx.coinAmount} {tx.coin.toUpperCase()}</td>
                      <td className="px-4 py-3 font-mono truncate max-w-xs">{tx.walletAddressUsed}</td>
                      <td className="px-4 py-3">{tx.userId?.email ?? "N/A"}</td>
                      <td className="px-4 py-3">
                        {tx.type === "sell" ? (
                          <>
                            <div>{tx.bankName || "-"}</div>
                            <div>{tx.accountName || "-"}</div>
                            <div className="cursor-pointer hover:text-blue-400" onClick={() => navigator.clipboard.writeText(tx.accountNumber ?? "")}>
                              {tx.accountNumber || "-"}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {ToastComponent}
    </div>
  );
}
