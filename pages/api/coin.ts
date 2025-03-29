import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1 } = req.query; // Pagination

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${page}&sparkline=false`
    );
    let data = await response.json();

    // Keep only required fields
    data = data.map(({ id, name, symbol, image, current_price }) => ({
      id,
      name,
      symbol,
      image,
      current_price,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching coins:", error);
    res.status(500).json({ error: "Failed to fetch coins" });
  }
}
