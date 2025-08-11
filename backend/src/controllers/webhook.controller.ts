import { Request, Response } from 'express';
import { fetchDeposits, getAccountInfo } from '../services/bitget.service.js';

interface BitgetDeposit {
  coin: string;
  size: string;          // comes as string from API
  tradeId?: string;      // tx id variant 1
  orderId?: string;      // tx id variant 2
  status: "success" | string;
  cTime?: number;        // timestamp ms
  chain?: string;
  toAddress?: string;
  fromAddress?: string;
}

interface BitgetDepositsResponse {
  data: BitgetDeposit[]; // normalized: array of deposits
}

// Test API connection
export const testConnection = async (req: Request, res: Response) => {
  try {
    const accountInfo = await getAccountInfo();
    res.json({
      success: true,
      message: 'API connection successful',
      data: accountInfo
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'API connection failed',
      details: error.response?.data || error.message
    });
  }
};

export const confirmDeposit = async (req: Request, res: Response) => {
  const { coin, size, txid } = req.query;

  if (!coin || !size || !txid) {
    return res.status(400).json({
      success: false,
      error: "Missing required parameters: coin, size, and txid",
    });
  }

  try {
    const expectedSize = parseFloat(size as string);
    if (isNaN(expectedSize)) {
      return res.status(400).json({
        success: false,
        error: "Invalid size parameter - must be a valid number",
      });
    }

    // Example fixed window (replace with your actual 90d calc)
    const endTime = 1744873600000;
    const startTime = 1744560000000;

    console.log(
      `Confirming deposit: ${coin} ${size} ${txid}\nTime range: ${new Date(
        startTime
      ).toISOString()} → ${new Date(endTime).toISOString()}`
    );

    // Fetch + ensure typing
    const depositsResponse = (await fetchDeposits(
      coin as string,
      startTime,
      endTime,
      100
    )) as BitgetDepositsResponse;

    const deposits = depositsResponse.data;
    if (!Array.isArray(deposits)) {
      return res.status(500).json({
        success: false,
        error: "Invalid response format from Bitget API",
      });
    }

    const matchingDeposit = deposits.find((deposit) => {
      const coinMatch = deposit.coin === (coin as string).toUpperCase();
      const sizeMatch =
        Math.abs(parseFloat(deposit.size) - expectedSize) < 0.000001;
      const txidMatch =
        deposit.tradeId === txid || deposit.orderId === txid;
      return coinMatch && sizeMatch && txidMatch && deposit.status === "success";
    });

    return res.json({
      success: true,
      confirmed: !!matchingDeposit,
      message: matchingDeposit
        ? "Deposit confirmed successfully"
        : "Deposit not found or does not match criteria",
      data: matchingDeposit || {},
    });
  } catch (error: any) {
    console.error("Error confirming deposit:", error);
    return res.status(500).json({
      success: false,
      confirmed: false,
      error: error.message || "Failed to confirm deposit",
    });
  }
};
// Alternative version with more flexible time range
export const confirmDepositWithTimeRange = async (
  req: Request,
  res: Response
) => {
  const { coin, size, txid, startTime, endTime } = req.query;

  if (!coin || !size || !txid) {
    return res.status(400).json({
      success: false,
      error: "Missing required parameters: coin, size, and txid",
    });
  }

  try {
    const expectedSize = parseFloat(size as string);
    if (isNaN(expectedSize)) {
      return res.status(400).json({
        success: false,
        error: "Invalid size parameter - must be a valid number",
      });
    }

    const searchEndTime = endTime ? parseInt(endTime as string) : Date.now();
    const searchStartTime = startTime
      ? parseInt(startTime as string)
      : searchEndTime - 7 * 24 * 60 * 60 * 1000;

    console.log(
      `Confirming deposit (custom range): ${coin} ${size} ${txid}\nTime range: ${new Date(
        searchStartTime
      ).toISOString()} → ${new Date(searchEndTime).toISOString()}`
    );

    // Fetch + ensure typing
    const depositsResponse = (await fetchDeposits(
      coin as string,
      searchStartTime,
      searchEndTime,
      100
    )) as BitgetDepositsResponse;

    const deposits = depositsResponse.data;

    const matchingDeposit = deposits.find((deposit) => {
      const coinMatch = deposit.coin === (coin as string).toUpperCase();
      const sizeMatch =
        Math.abs(parseFloat(deposit.size) - expectedSize) < 0.000001;
      const txidMatch =
        deposit.tradeId === txid || deposit.orderId === txid;
      return coinMatch && sizeMatch && txidMatch && deposit.status === "success";
    });

    return res.json({
      success: true,
      confirmed: !!matchingDeposit,
      message: matchingDeposit
        ? "Deposit confirmed successfully"
        : "Deposit not found or does not match criteria",
      data: matchingDeposit
        ? {
            deposit: matchingDeposit,
            verificationDetails: {
              coin: matchingDeposit.coin,
              size: matchingDeposit.size,
              txid: matchingDeposit.tradeId || matchingDeposit.orderId,
              status: matchingDeposit.status,
              timestamp: matchingDeposit.cTime,
            },
          }
        : {
            searchCriteria: { coin, size: expectedSize, txid },
            totalDepositsSearched: deposits.length,
          },
    });
  } catch (error: any) {
    console.error("Error confirming deposit:", error);
    return res.status(500).json({
      success: false,
      confirmed: false,
      error: error.message || "Failed to confirm deposit",
    });
  }
};

// Get deposit records
export const getDeposits = async (req: Request, res: Response) => {
  const { coin, startTime, endTime, limit } = req.query;
  
  // Validate required parameters
  if (!coin) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameter: coin'
    });
  }
  
  if (!startTime || !endTime) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: startTime and endTime (in milliseconds)'
    });
  }
  
  try {
    const deposits = await fetchDeposits(
      coin as string,
      parseInt(startTime as string),
      parseInt(endTime as string),
      limit ? parseInt(limit as string) : 20
    );
    
    res.json({
      success: true,
      data: deposits
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch deposits',
      details: error.response?.data || error.message
    });
  }
};

// Get recent deposits (last 24 hours) - convenience endpoint
export const getRecentDeposits = async (req: Request, res: Response) => {
  const { coin, limit } = req.query;
  
  if (!coin) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameter: coin'
    });
  }
  
  try {
    const endTime = Date.now();
    const startTime = endTime - (24 * 60 * 60 * 1000); // Last 24 hours
    
    const deposits = await fetchDeposits(
      coin as string,
      startTime,
      endTime,
      limit ? parseInt(limit as string) : 20
    );
    
    res.json({
      success: true,
      timeRange: {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString()
      },
      data: deposits
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent deposits',
      details: error.response?.data || error.message
    });
  }
};