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

export const confirmDeposit = async (req: Request, res: Response) => {
  const { coin, size, txid } = req.query;
  
  // Validate required parameters
  if (!coin || !size || !txid) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: coin, size, and txid'
    });
  }
  
  try {
    // Convert size to number for comparison
    const expectedSize = parseFloat(size as string);
    if (isNaN(expectedSize)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid size parameter - must be a valid number'
      });
    }
    
    // Set time range for search (last 90 days - Bitget's maximum allowed range)
    const endTime = 1744873600000
    const startTime = 1744560000000
    
    console.log(`Confirming deposit: ${coin} ${size} ${txid}`);
    console.log(`Search time range: ${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()}`);
    
    // Fetch deposits from Bitget
    const depositsResponse = await fetchDeposits(
      coin as string,
      startTime,
      endTime,
      100 // Increase limit to search more records
    );
    
    // Debug the raw response
    console.log('Bitget API Response:', JSON.stringify(depositsResponse, null, 2));
    
    // Extract deposit array from response
    const deposits = depositsResponse?.data;

if (!Array.isArray(deposits)) {
  return res.status(500).json({
    success: false,
    error: 'Invalid response format from Bitget API'
  });
}

console.log(`Found ${deposits.length} deposits in response`);

    
    // Debug each deposit for matching
    console.log('Searching for:', {
      coin: (coin as string).toUpperCase(),
      size: expectedSize,
      txid: txid as string
    });
    
    deposits.forEach((deposit, index) => {
      console.log(`Deposit ${index}:`, {
        coin: deposit.coin,
        size: deposit.size,
        sizeAsNumber: parseFloat(deposit.size),
        tradeId: deposit.tradeId,
        orderId: deposit.orderId,
        status: deposit.status
      });
    });
    
    // Search for matching deposit
    const matchingDeposit = deposits.find(deposit => {
      // Compare coin (both should be uppercase, but normalize just in case)
      const coinMatch = deposit.coin === (coin as string).toUpperCase();
      
      // Compare size (allow small floating point differences)
      const depositSize = parseFloat(deposit.size);
      const sizeMatch = Math.abs(depositSize - expectedSize) < 0.000001;
      
      // Compare transaction ID (could be in tradeId field)
      const txidMatch = deposit.tradeId === txid || deposit.orderId === txid;
      
      // Only consider successful deposits
      const isSuccessful = deposit.status === 'success';
      
      console.log(`Checking deposit:`, {
        coinMatch: `${deposit.coin} === ${(coin as string).toUpperCase()}: ${coinMatch}`,
        sizeMatch: `${depositSize} vs ${expectedSize}: ${sizeMatch}`,
        txidMatch: `${deposit.tradeId} === ${txid} || ${deposit.orderId} === ${txid}: ${txidMatch}`,
        isSuccessful: `${deposit.status} === 'success': ${isSuccessful}`,
        overallMatch: coinMatch && sizeMatch && txidMatch && isSuccessful
      });
      
      return coinMatch && sizeMatch && txidMatch && isSuccessful;
    });
    
    if (matchingDeposit) {
      return res.json({
        success: true,
        confirmed: true,
        message: 'Deposit confirmed successfully',
        data: {
          deposit: matchingDeposit,
          verificationDetails: {
            coin: matchingDeposit.coin,
            size: matchingDeposit.size,
            txid: matchingDeposit.tradeId,
            status: matchingDeposit.status,
            timestamp: matchingDeposit.cTime,
            chain: matchingDeposit.chain,
            toAddress: matchingDeposit.toAddress,
            fromAddress: matchingDeposit.fromAddress
          }
        }
      });
    } else {
      // Provide detailed information about why no match was found
      const coinMatches = deposits.filter(d => 
        d.coin === (coin as string).toUpperCase()
      );
      
      const sizeMatches = deposits.filter(d => 
        Math.abs(parseFloat(d.size) - expectedSize) < 0.000001
      );
      
      const txidMatches = deposits.filter(d => 
        d.tradeId === txid || d.orderId === txid
      );
      
      return res.json({
        success: true,
        confirmed: false,
        message: 'Deposit not found or does not match the provided criteria',
        data: {
          searchCriteria: {
            coin: coin as string,
            size: expectedSize,
            txid: txid as string,
            timeRange: {
              startTime,
              endTime,
              daysSearched: 90
            }
          },
          searchResults: {
            totalDepositsFound: deposits.length,
            coinMatches: coinMatches.length,
            sizeMatches: sizeMatches.length,
            txidMatches: txidMatches.length,
            successfulDeposits: deposits.filter(d => d.status === 'success').length
          },
          // Include recent deposits for debugging (limit to 5)
          recentDeposits: deposits.slice(0, 5).map(d => ({
            coin: d.coin,
            size: d.size,
            txid: d.tradeId,
            status: d.status,
            timestamp: d.cTime
          }))
        }
      });
    }
    
  } catch (error: any) {
    console.error('Error confirming deposit:', error);
    
    return res.status(500).json({
      success: false,
      confirmed: false,
      error: 'Failed to confirm deposit',
      details: error.message
    });
  }
};
// Alternative version with more flexible time range
export const confirmDepositWithTimeRange = async (req: Request, res: Response) => {
  const { coin, size, txid, startTime, endTime } = req.query;
  
  // Validate required parameters
  if (!coin || !size || !txid) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: coin, size, and txid'
    });
  }
  
  try {
    const expectedSize = parseFloat(size as string);
    if (isNaN(expectedSize)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid size parameter - must be a valid number'
      });
    }
    
    // Use provided time range or default to last 7 days
    const searchEndTime = endTime ? parseInt(endTime as string) : Date.now();
    const searchStartTime = startTime ? 
      parseInt(startTime as string) : 
      searchEndTime - (7 * 24 * 60 * 60 * 1000);
    
    console.log(`Confirming deposit with time range: ${coin} ${size} ${txid}`);
    console.log(`Time range: ${new Date(searchStartTime).toISOString()} to ${new Date(searchEndTime).toISOString()}`);
    
    // Fetch deposits from Bitget
    const depositsResponse = await fetchDeposits(
      coin as string,
      searchStartTime,
      searchEndTime,
      100
    );
    
    const deposits = depositsResponse?.data?.data || [];
    
    // Find matching deposit with the same logic as above
    interface Deposit {
      coin: string;
      size: string;
      tradeId?: string;
      orderId?: string;
      status: string;
      cTime?: number;
      chain?: string;
      toAddress?: string;
      fromAddress?: string;
    }

    const matchingDeposit = (deposits as Deposit[]).find((deposit: Deposit) => {
      const coinMatch = deposit.coin === (coin as string).toUpperCase();
      const depositSize = parseFloat(deposit.size);
      const sizeMatch = Math.abs(depositSize - expectedSize) < 0.000001;
      const txidMatch = deposit.tradeId === txid || deposit.orderId === txid;
      const isSuccessful = deposit.status === 'success';
      
      return coinMatch && sizeMatch && txidMatch && isSuccessful;
    });
    
    return res.json({
      success: true,
      confirmed: !!matchingDeposit,
      message: matchingDeposit ? 
        'Deposit confirmed successfully' : 
        'Deposit not found or does not match criteria',
      data: matchingDeposit ? {
        deposit: matchingDeposit,
        verificationDetails: {
          coin: matchingDeposit.coin,
          size: matchingDeposit.size,
          txid: matchingDeposit.tradeId,
          status: matchingDeposit.status,
          timestamp: matchingDeposit.cTime
        }
      } : {
        searchCriteria: { coin, size: expectedSize, txid },
        totalDepositsSearched: deposits.length
      }
    });
    
  } catch (error: any) {
    console.error('Error confirming deposit:', error);
    
    return res.status(500).json({
      success: false,
      confirmed: false,
      error: 'Failed to confirm deposit',
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