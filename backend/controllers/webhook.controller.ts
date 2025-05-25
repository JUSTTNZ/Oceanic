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