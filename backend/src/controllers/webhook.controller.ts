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

// Helper: extract all possible txid field variants
function extractTxidFields(deposit: BitgetDeposit): string[] {
  const txidCandidates = [
    deposit.tradeId,
    deposit.orderId,
    (deposit as any).txId,
    (deposit as any).txid,
    (deposit as any).txHash,
    (deposit as any).hash,
    (deposit as any).transactionId,
  ];
  return txidCandidates
    .filter((v) => v !== undefined && v !== null && v !== '')
    .map((v) => String(v).trim().toLowerCase());
}

// Helper: match coin with tolerance for chain suffixes
function coinMatches(depositCoin: string | undefined, expectedCoin: string): boolean {
  if (!depositCoin) return false;
  const dep = depositCoin.trim().toUpperCase();
  const exp = expectedCoin.trim().toUpperCase();
  // Exact match or contains (e.g., 'USDT-ERC20' contains 'USDT')
  return dep === exp || dep.includes(exp) || exp.includes(dep);
}

// Helper: match amount with tolerance for fees/rounding
function amountMatches(
  depositSize: string | undefined,
  expectedSize: number,
  tolerance: number = 0.01 // 1% tolerance
): boolean {
  if (!depositSize) return false;
  const parsed = parseFloat(depositSize);
  if (isNaN(parsed)) return false;
  
  const absDiff = Math.abs(parsed - expectedSize);
  const relDiff = absDiff / (expectedSize || 1);
  
  // Allow absolute difference < 0.0001 OR relative difference < tolerance
  return absDiff < 0.0001 || relDiff < tolerance;
}

// Helper: comprehensive deposit matching with detailed logging
function matchesDeposit(
  deposit: BitgetDeposit,
  expectedCoin: string,
  expectedSize: number,
  expectedTxid: string,
  debug: boolean = false
): { matches: boolean; reasons: string[] } {
  const reasons: string[] = [];
  
  // Check coin
  const coinMatched = coinMatches(deposit.coin, expectedCoin);
  if (!coinMatched) {
    reasons.push(`coin mismatch: deposit="${deposit.coin}" vs expected="${expectedCoin}"`);
  }
  
  // Check size
  const sizeMatched = amountMatches(deposit.size, expectedSize);
  if (!sizeMatched) {
    const depositSize = parseFloat(deposit.size || '0');
    reasons.push(`size mismatch: deposit="${depositSize}" vs expected="${expectedSize}" (diff=${Math.abs(depositSize - expectedSize)})`);
  }
  
  // Check txid
  const txidCandidates = extractTxidFields(deposit);
  const expectedTxidLower = String(expectedTxid).trim().toLowerCase();
  const txidMatched = txidCandidates.includes(expectedTxidLower) ||
    txidCandidates.some((t) => t.includes(expectedTxidLower) || expectedTxidLower.includes(t));
  
  if (!txidMatched) {
    reasons.push(`txid mismatch: candidates=[${txidCandidates.join(', ')}] vs expected="${expectedTxid}"`);
  }
  
  // Check status
  const statusOk = deposit.status === 'success';
  if (!statusOk) {
    reasons.push(`status not success: "${deposit.status}"`);
  }
  
  const matches = coinMatched && sizeMatched && txidMatched && statusOk;
  
  if (debug) {
    console.log(`[Match Debug] deposit fields:`, { coin: deposit.coin, size: deposit.size, tradeId: deposit.tradeId, orderId: deposit.orderId, status: deposit.status });
    console.log(`[Match Debug] results:`, { coinMatched, sizeMatched, txidMatched, statusOk, matches });
    if (reasons.length > 0) console.log(`[Match Debug] reasons:`, reasons);
  }
  
  return { matches, reasons };
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

    // Use dynamic time range: last 7 days (better than fixed timestamps)
    const endTime = Date.now();
    const startTime = endTime - 7 * 24 * 60 * 60 * 1000;

    console.log(
      `[ConfirmDeposit] Searching for: coin=${coin}, size=${expectedSize}, txid=${txid}\nTime range: ${new Date(
        startTime
      ).toISOString()} → ${new Date(endTime).toISOString()}`
    );

    // Fetch deposits
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

    console.log(`[ConfirmDeposit] Retrieved ${deposits.length} deposits from Bitget`);

    // Try to find matching deposit with detailed logging
    let matchingDeposit: BitgetDeposit | undefined;
    let bestMatch: { deposit: BitgetDeposit; reasons: string[] } | null = null;

    for (const deposit of deposits) {
      const result = matchesDeposit(deposit, coin as string, expectedSize, txid as string, true);
      
      if (result.matches) {
        matchingDeposit = deposit;
        console.log(`[ConfirmDeposit] ✅ MATCH FOUND!`);
        break;
      } else if (!bestMatch) {
        // Store first non-match for debugging purposes
        bestMatch = { deposit, reasons: result.reasons };
      }
    }

    // Log best attempt if no match found
    if (!matchingDeposit && bestMatch) {
      console.log(`[ConfirmDeposit] ❌ No match found. Best attempt:`, bestMatch.reasons);
    }

    return res.json({
      success: true,
      confirmed: !!matchingDeposit,
      message: matchingDeposit
        ? "Deposit confirmed successfully"
        : "Deposit not found or does not match criteria",
      data: matchingDeposit || {},
      debug: !matchingDeposit && bestMatch ? bestMatch.reasons : undefined,
    });
  } catch (error: any) {
    console.error("[ConfirmDeposit] Error:", error);
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
      `[ConfirmDepositRange] Searching for: coin=${coin}, size=${expectedSize}, txid=${txid}\nTime range: ${new Date(
        searchStartTime
      ).toISOString()} → ${new Date(searchEndTime).toISOString()}`
    );

    // Fetch deposits
    const depositsResponse = (await fetchDeposits(
      coin as string,
      searchStartTime,
      searchEndTime,
      100
    )) as BitgetDepositsResponse;

    const deposits = depositsResponse.data;

    console.log(`[ConfirmDepositRange] Retrieved ${deposits.length} deposits from Bitget`);

    // Try to find matching deposit with detailed logging
    let matchingDeposit: BitgetDeposit | undefined;
    let bestMatch: { deposit: BitgetDeposit; reasons: string[] } | null = null;

    for (const deposit of deposits) {
      const result = matchesDeposit(deposit, coin as string, expectedSize, txid as string, true);
      
      if (result.matches) {
        matchingDeposit = deposit;
        console.log(`[ConfirmDepositRange] ✅ MATCH FOUND!`);
        break;
      } else if (!bestMatch) {
        bestMatch = { deposit, reasons: result.reasons };
      }
    }

    // Log best attempt if no match found
    if (!matchingDeposit && bestMatch) {
      console.log(`[ConfirmDepositRange] ❌ No match found. Best attempt:`, bestMatch.reasons);
    }

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
            bestAttemptReasons: bestMatch?.reasons,
          },
      debug: !matchingDeposit && bestMatch ? bestMatch.reasons : undefined,
    });
  } catch (error: any) {
    console.error("[ConfirmDepositRange] Error:", error);
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