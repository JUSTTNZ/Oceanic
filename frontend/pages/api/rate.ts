import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'ngn',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false
        }
      }
    );

    interface Coin {
      name: string;
      symbol: string;
      image: string;
      current_price: number;
    }

    const data = response.data.map((coin: Coin) => {
      const buyRate = coin.current_price;
      const sellRate = coin.current_price;
      const margin = 50;

      return {
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        image: coin.image,
        market_price: buyRate,
        buy_rate: buyRate - margin,
        sell_rate: sellRate - margin
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to fetch CoinGecko rates:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch crypto rates' });
    } else {
      console.error('An unknown error occurred');
      res.status(500).json({ success: false, message: 'An unknown error occurred' });
    }
  }
}