import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=20'
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching coins:', error);
      res.status(500).json({ error: "Failed to fetch crypto data" });
    }
  }