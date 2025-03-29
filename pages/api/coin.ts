import type { NextApiRequest, NextApiResponse } from "next";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1 } = req.query; // Pagination

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${page}&sparkline=false`
    );
    const data: Coin[] = await response.json(); // Explicitly define the expected type

    // Keep only required fields
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
    res.status(500).json({ error: "Failed to fetch coins" });
  }
}

