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

    // If response is NOT OK, return error
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Ensure data is an array before mapping
    if (!Array.isArray(data)) {
      console.error("Invalid API response:", data);
      return res.status(500).json({ error: "Invalid API response format" });
    }

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
