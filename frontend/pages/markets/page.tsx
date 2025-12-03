import { useState, useEffect, useMemo } from "react";
import { FiArrowUp, FiArrowDown, FiStar, FiSearch, FiFilter } from "react-icons/fi";
import Footer from "../login/footer";
import Header from "../login/header";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

interface RootState {
  user: { uid: number; email: string; username: string; roles: string } | null;
}

export default function Markets() {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: keyof Coin; dir: "asc" | "desc" }>({
    key: "market_cap",
    dir: "desc",
  });
  const [search, setSearch] = useState("");
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d">("24h");
  const [showAll, setShowAll] = useState(false);

  const handleTradeClick = () => router.push(user ? "/trade" : "/login");

  useEffect(() => {
    let abort = false;
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/markets?per_page=200&page=1");
        if (!res.ok) throw new Error(`API failed: ${res.status}`);
        const data = await res.json();
        if (!abort) {
          setCoins(data);
          if (data?.[0]) setSelectedId(data[0].id);
        }
      } catch (e: unknown) {
        if (!abort) {
          setError(e instanceof Error ? e.message : "Failed to fetch market data");
        }
      } finally {
        if (!abort) setLoading(false);
      }
    };
    fetchCoins();
    const i = setInterval(fetchCoins, 60_000);
    return () => {
      abort = true;
      clearInterval(i);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? coins.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      : coins.slice();
    list.sort((a, b) => {
      const vA = (a[sort.key] as number) ?? 0;
      const vB = (b[sort.key] as number) ?? 0;
      return sort.dir === "asc" ? vA - vB : vB - vA;
    });
    return list;
  }, [coins, search, sort]);

  const visible = showAll ? filtered : filtered.slice(0, 10);

  const getDelta = (c: Coin) =>
    timeRange === "1h"
      ? c.price_change_percentage_1h_in_currency ?? 0
      : timeRange === "7d"
      ? c.price_change_percentage_7d_in_currency ?? 0
      : c.price_change_percentage_24h_in_currency ?? 0;

  const formatMoney = (n: number) =>
    n >= 1e12
      ? `$${(n / 1e12).toFixed(2)}T`
      : n >= 1e9
      ? `$${(n / 1e9).toFixed(2)}B`
      : n >= 1e6
      ? `$${(n / 1e6).toFixed(2)}M`
      : n >= 1e3
      ? `$${(n / 1e3).toFixed(2)}K`
      : `$${n.toFixed(2)}`;

  const headerCell =
    "px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400";
  const cell = "px-3 py-2 whitespace-nowrap text-sm";

  return (
    <section className="bg-[#0a0f1a] text-gray-100 w-full overflow-x-hidden">
      <Header />
      <div className="min-h-screen w-full px-3 sm:px-6 lg:px-8 pt-24 pb-16 font-grotesk overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-6 w-full">

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3">
              {error}
            </div>
          )}

          {/* Topbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Markets
              </span>
            </h1>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search coins…"
                  className="w-full sm:w-64 rounded-lg bg-[#0d1526] border border-white/5 pl-9 pr-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#0d1526] border border-white/5 p-1">
                {(["1h", "24h", "7d"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-2.5 py-1 rounded-md text-xs transition ${
                      timeRange === t
                        ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/40"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition">
                <FiFilter /> Filters
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/5 bg-gradient-to-br from-[#0d1526] to-[#0b1220] p-3">
              <p className="text-xs text-gray-400">Global Market Cap</p>
              <p className="text-sm font-semibold mt-1">
                {formatMoney(coins.reduce((s, c) => s + (c.market_cap || 0), 0))}
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-gradient-to-br from-[#0d1526] to-[#0b1220] p-3">
              <p className="text-xs text-gray-400">24h Volume</p>
              <p className="text-sm font-semibold mt-1">
                {formatMoney(coins.reduce((s, c) => s + (c.total_volume || 0), 0))}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] w-full overflow-x-auto">
            <div className="w-full min-w-[600px]">
              <table className="min-w-full">
                <thead className="sticky top-0 z-10 bg-[#0b1220]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0b1220]/80">
                  <tr className="border-b border-white/5">
                    <th className={headerCell}>Asset</th>
                    <th
                      className={`${headerCell} text-right cursor-pointer`}
                      onClick={() =>
                        setSort((s) => ({
                          key: "current_price",
                          dir: s.key === "current_price" && s.dir === "desc" ? "asc" : "desc",
                        }))
                      }
                    >
                      <div className="flex items-center justify-end gap-1">
                        Price
                        {sort.key === "current_price" &&
                          (sort.dir === "asc" ? <FiArrowUp /> : <FiArrowDown />)}
                      </div>
                    </th>
                    <th
                      className={`${headerCell} text-right cursor-pointer`}
                      onClick={() =>
                        setSort((s) => ({
                          key:
                            timeRange === "1h"
                              ? "price_change_percentage_1h_in_currency"
                              : timeRange === "7d"
                              ? "price_change_percentage_7d_in_currency"
                              : "price_change_percentage_24h_in_currency",
                          dir:
                            s.key.includes("price_change_percentage") && s.dir === "desc"
                              ? "asc"
                              : "desc",
                        }))
                      }
                    >
                      <div className="flex items-center justify-end gap-1">
                        {timeRange}
                        {`${sort.key}`.includes("price_change_percentage") &&
                          (sort.dir === "asc" ? <FiArrowUp /> : <FiArrowDown />)}
                      </div>
                    </th>
                    <th className={`${headerCell} text-right`}>Mkt Cap</th>
                    <th className={`${headerCell} text-right`}>24h Vol</th>
                    <th className={`${headerCell} text-right`}>★</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        Loading…
                      </td>
                    </tr>
                  )}

                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No coins found
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    visible.map((c) => {
                      const delta = getDelta(c);
                      const positive = delta >= 0;

                      return (
                        <motion.tr
                          key={c.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => router.push(`/markets/${c.id}`)}
                          className={`cursor-pointer border-b border-white/5 hover:bg-white/5 group ${
                            selectedId === c.id
                              ? "bg-blue-500/10 ring-1 ring-inset ring-blue-400/40"
                              : ""
                          }`}
                          onMouseEnter={() => setSelectedId(c.id)}
                        >
                          <td className={`${cell}`}>
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Image
                                  src={c.image}
                                  alt={c.name}
                                  width={28}
                                  height={28}
                                  className="rounded-full"
                                />
                                <span className="pointer-events-none absolute inset-0 rounded-full ring-0 group-hover:ring-4 ring-blue-500/10 transition" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{c.name}</span>
                                <span className="text-xs text-gray-400">{c.symbol.toUpperCase()}</span>
                              </div>
                            </div>
                          </td>

                          <td className={`${cell} text-right tabular-nums`}>
                            ${c.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                          </td>

                          <td className={`${cell} text-right`}>
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                                positive
                                  ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                                  : "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30"
                              }`}
                            >
                              {positive ? <FiArrowUp /> : <FiArrowDown />}
                              {Math.abs(delta).toFixed(2)}%
                            </span>
                          </td>

                          <td className={`${cell} text-right`}>{formatMoney(c.market_cap)}</td>
                          <td className={`${cell} text-right`}>{formatMoney(c.total_volume)}</td>

                          <td className={`${cell} text-right text-yellow-400/60`}>
                            <FiStar className="inline-block opacity-0 group-hover:opacity-100 transition" />
                          </td>
                        </motion.tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {!loading && filtered.length > 10 && (
            <div className="p-3 flex justify-center">
              <button
                onClick={() => setShowAll((s) => !s)}
                className="rounded-lg bg-blue-600/90 hover:bg-blue-600 active:scale-[0.99] text-white text-sm px-4 py-2 transition"
              >
                {showAll ? "Show 10" : `Show All (${filtered.length})`}
              </button>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2" />
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#0d1526] to-[#0b1220] p-5">
              <h3 className="text-lg font-semibold mb-2">Coin Details</h3>
              <p className="text-sm text-gray-400 mb-4">
                Click any coin in the table to open a full chart with tools, indicators, and intervals.
              </p>
              <button
                onClick={handleTradeClick}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-2.5 font-medium transition shadow-md"
              >
                Go to Trade
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
