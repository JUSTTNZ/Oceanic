import type { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1 } = req.query; // Pagination

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=${page}&sparkline=false`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return res.status(500).json({ error: "Invalid API response format" });
    }

    const filteredData = data.map(({ id, name, symbol, image, current_price }) => ({
      id,
      name,
      symbol,
      image,
      current_price,
    }));

    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error fetching coins:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch coins",
    });
  }
}
