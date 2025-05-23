import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const response = await fetch(
        'https://v6.exchangerate-api.com/v6/6c726f2eef74105ff040df4b/latest/USD'
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching countries:', error);
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  }