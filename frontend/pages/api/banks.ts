// pages/api/banks.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { country } = req.query;

  if (!country || typeof country !== "string") {
    return res.status(400).json({ error: "Country code is required" });
  }

  try {
    const response = await fetch(`https://api.paystack.co/bank?country=${country}`, {
   
    });

    if (!response.ok) {
      console.log(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Ensure data.data is an array
    if (!Array.isArray(data.data)) {
      return res.status(500).json({ error: "Invalid API response format" });
    }

    res.status(200).json({ banks: data.data });
  } catch (error) {
    console.error("Error fetching banks:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch banks",
    });
  }
}
