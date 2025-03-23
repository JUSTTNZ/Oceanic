import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1 } = req.query;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${page}&sparkline=true`
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching coins:', err);
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
}
