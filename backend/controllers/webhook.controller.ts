import { Request, Response } from 'express';
import { fetchDeposits, getAccountInfo } from '../services/bitget.service.js';

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

// controller/bitget.controller.ts

export const confirmDeposit = async (req: Request, res: Response) => {
  const { coin, txid, size } = req.query;

  if (!coin || !txid || !size) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: coin, txid, or size'
    });
  }

  // Auto-calculate 90-day window
  const nowMs = Date.now();
  const startTime = nowMs - 90 * 24 * 60 * 60 * 1000; // 90 days ago
  const endTime = nowMs;

  try {
    const result = await fetchDeposits(coin as string, startTime, endTime, 100);

    const deposits = result?.data?.data || [];

    // Find match
    const match = deposits.find((deposit: any) =>
      deposit.tradeId === txid &&
      parseFloat(deposit.size) === parseFloat(size as string)
    );

    if (match) {
      return res.json({
        success: true,
        message: 'Transaction confirmed',
        data: match
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'No matching transaction found'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to query Bitget',
      details: error.message
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