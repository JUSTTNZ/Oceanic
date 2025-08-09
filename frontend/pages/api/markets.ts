import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { per_page = "200", page = "1" } = req.query;

    const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("order", "market_cap_desc");
    url.searchParams.set("per_page", String(per_page));
    url.searchParams.set("page", String(page));
    url.searchParams.set("sparkline", "false");
    url.searchParams.set("price_change_percentage", "1h,24h,7d");

    const cg = await fetch(url.toString(), {
      headers: { "User-Agent": "YourApp/1.0" },
      cache: "no-store",
    });

    if (!cg.ok) {
      return res.status(cg.status).json({ error: `CoinGecko error ${cg.status}` });
    }

    const data = await cg.json();

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");

    return res.status(200).json(data);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(500).json({ error: e.message });
    }
    return res.status(500).json({ error: "Proxy failed" });
  }
}

