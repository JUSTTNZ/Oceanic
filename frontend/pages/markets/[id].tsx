// /pages/markets/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useRef, useState, useMemo } from "react";
import Header from "../login/header";
import Footer from "../login/footer";
import Image from "next/image";
import {
  createChart,
  ColorType,
  ISeriesApi,
  Time,
  CandlestickData,
  HistogramData,
} from "lightweight-charts";

type ChartPoint = CandlestickData; 
type VolumePoint = HistogramData;  

type CoinMeta = {
  name?: string;
  symbol?: string;
  image?: { small?: string };
  market_data?: { current_price?: { usd?: number } };
};

type MarketChartResp = {
  prices: [number, number][];
  total_volumes: [number, number][];
};

export default function CoinDetails() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [meta, setMeta] = useState<CoinMeta | null>(null);
  const [interval, setInterval] = useState<"1" | "7" | "30" | "90" | "365">("30");
  const [loading, setLoading] = useState(true);
  const [candles, setCandles] = useState<ChartPoint[]>([]);
  const [vol, setVol] = useState<VolumePoint[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  // Fetch meta
useEffect(() => {
  if (!id) return;
  let abort = false;

  (async () => {
    try {
      const res = await fetch(`/api/coin/${id}/market_chart?days=${interval}`);

      if (!res.ok) throw new Error("meta fetch failed");
      const data: CoinMeta = await res.json();
      if (!abort) setMeta(data);
    } catch {
      // ignore for now
    }
  })();

  return () => {
    abort = true;
  };
}, [id, interval]);


  // Fetch chart data
  useEffect(() => {
    if (!id) return;
    let abort = false;
    setLoading(true);

    (async () => {
      try {
        const days = interval; // coingecko supports 1,7,30,90,365
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
        );
        if (!res.ok) throw new Error("chart fetch failed");
        const data: MarketChartResp = await res.json();

        // Build candles by bucketing to ~<=200 points
        const prices = data.prices;
        const volumes = data.total_volumes;
        const bucket = Math.max(1, Math.floor(prices.length / 200));

        const c: ChartPoint[] = [];
        for (let idx = 0; idx < prices.length; idx += bucket) {
          const slice = prices.slice(idx, idx + bucket);
          const open = slice[0][1];
          const close = slice[slice.length - 1][1];
          const highs = slice.map((s) => s[1]);
          const high = Math.max(...highs);
          const low = Math.min(...highs);
          const t = Math.floor(slice[0][0] / 1000) as Time;
          c.push({ time: t, open, high, low, close });
        }

        const v: VolumePoint[] = volumes.map(([ts, val]) => ({
          time: Math.floor(ts / 1000) as Time,
          value: val,
        }));

        if (!abort) {
          setCandles(c);
          setVol(v);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!abort) setLoading(false);
      }
    })();

    return () => {
      abort = true;
    };
  }, [id, interval]);

  // Init chart once & update data when candles/vol change
  useEffect(() => {
    if (!containerRef.current) return;

    if (!chartRef.current) {
      chartRef.current = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "#0b1220" },
          textColor: "#cbd5e1",
        },
        grid: {
          vertLines: { color: "rgba(255,255,255,0.04)" },
          horzLines: { color: "rgba(255,255,255,0.04)" },
        },
        rightPriceScale: { borderColor: "rgba(255,255,255,0.10)" },
        timeScale: { borderColor: "rgba(255,255,255,0.10)" },
        autoSize: true,
      });

      seriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderVisible: false,
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      });

      volumeRef.current = chartRef.current.addHistogramSeries({
        priceFormat: { type: "volume" },
        priceScaleId: "",
        base: 0,
      });

      chartRef.current.priceScale("").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });

      // keep chart fit on container resize
      const ro = new ResizeObserver(() => {
        chartRef.current?.timeScale().fitContent();
      });
      ro.observe(containerRef.current);

      // optional: cleanup observer on unmount
      return () => {
        ro.disconnect();
      };
    }

    // apply data to series
    seriesRef.current?.setData(candles);
    volumeRef.current?.setData(
      vol.map((p, idx) => ({
        ...p,
        color:
          idx > 0 && candles[idx]
            ? candles[idx].close >= candles[idx - 1]!.close
              ? "rgba(34,197,94,0.4)"
              : "rgba(239,68,68,0.4)"
            : "rgba(148,163,184,0.3)",
      }))
    );

    chartRef.current?.timeScale().fitContent();
  }, [candles, vol]);

  const title = useMemo(() => {
    const name = meta?.name ?? id;
    const sym = meta?.symbol?.toUpperCase?.() ?? "";
    return `${name} ${sym ? `(${sym})` : ""}`;
  }, [meta, id]);

  return (
    <section className="bg-[#0a0f1a] text-gray-100 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Sticky coin header */}
        <div className="sticky top-20 z-20 mb-4 rounded-2xl border border-white/5 bg-[#0b1220]/80 backdrop-blur p-4 flex items-center gap-3">
          {meta?.image?.small && (
            <Image
              src={meta.image.small}
              alt={title}
              width={28}
              height={28}
              className="rounded-full"
            />
          )}
          <div className="flex-1">
            <div className="text-lg font-semibold">{title}</div>
            <div className="text-sm text-gray-400">
              {meta?.market_data?.current_price?.usd
                ? `$${meta.market_data.current_price.usd.toLocaleString()}`
                : ""}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(["1", "7", "30", "90", "365"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setInterval(d)}
                className={`px-2.5 py-1 text-xs rounded-md transition ${
                  interval === d
                    ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/40"
                    : "hover:bg-white/5 text-gray-300"
                }`}
              >
                {d === "1" ? "1D" : d === "7" ? "7D" : d === "30" ? "1M" : d === "90" ? "3M" : "1Y"}
              </button>
            ))}
            <button className="rounded-md px-3 py-1.5 text-xs bg-blue-600/90 hover:bg-blue-600 transition">
              Add to Watchlist
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-3">
          <div ref={containerRef} className="h-[520px] w-full" />
          {loading && <div className="p-4 text-sm text-gray-400">Loading chart…</div>}
        </div>

        {/* Extras */}
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="rounded-xl border border-white/5 bg-[#0d1526] p-4">
            <div className="text-sm font-semibold mb-2">Indicators</div>
            <p className="text-xs text-gray-400">
              SMA, EMA, VWAP, Bollinger Bands (coming soon).
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#0d1526] p-4">
            <div className="text-sm font-semibold mb-2">Tools</div>
            <p className="text-xs text-gray-400">
              Crosshair, fullscreen, export PNG, theme toggle.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
