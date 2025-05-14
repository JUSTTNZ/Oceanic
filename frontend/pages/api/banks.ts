// pages/api/banks.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { country } = req.query;

  if (!country) {
    return res.status(400).json({ error: "Country code is required" });
  }

  try {
    // Using a hypothetical API endpoint to fetch banks
    const response = await fetch(`https://api.openbankproject.com/v2/banks?country=${country}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Assuming the API returns an array of banks
    if (!Array.isArray(data.banks)) {
      return res.status(500).json({ error: "Invalid API response format" });
    }

    res.status(200).json({ banks: data.banks });
  } catch (error) {
    console.error("Error fetching banks:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch banks",
    });
  }
}
