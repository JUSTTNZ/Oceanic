import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();


const API_KEY = process.env.BITGET_API_KEY!;
const API_SECRET = process.env.BITGET_SECRET_KEY!;
if (!API_SECRET) {
  throw new Error("Missing BITGET_SECRET_KEY in environment variables");
}

const PASSPHRASE = process.env.BITGET_PASSPHRASE!;
const BASE_URL = 'https://api.bitget.com';

// Generate signature according to Bitget API specs
function generateSignature(timestamp: string, method: string, requestPath: string, queryParams: string) {
  
  const preHash = timestamp + method + requestPath + (queryParams ? `?${queryParams}` : '');
  
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(preHash)
    .digest('base64');
}

// Fetch deposit records
export async function fetchDeposits(
  coin: string,
  startTime: number,
  endTime: number,
  limit: number = 20
) {
  const method = 'GET';
  const requestPath = '/api/v2/spot/wallet/deposit-records';
  const timestamp = Date.now().toString(); // Current time for signature

  // 1. Validate timestamps (must be recent, not future)
  if (startTime > Date.now() || endTime > Date.now()) {
    throw new Error("Timestamps cannot be in the future.");
  }

  // 2. Build query params in STRICT alphabetical order
  const queryParams = new URLSearchParams({
    coin: coin.toUpperCase(), // Enforce uppercase
    endTime: endTime.toString(),
    limit: limit.toString(),
    startTime: startTime.toString(),
  }).toString();

  // 3. Generate signature (critical: include '?' in preHash)
  const preHash = timestamp + method + requestPath + `?${queryParams}`;
  const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(preHash)
    .digest('base64');

  const url = `${BASE_URL}${requestPath}?${queryParams}`;
  console.log('URL:', url);
  

  console.log('Debugging:', {
    preHash, // Check this matches Bitget's expected format
    timestamp,
    signature: signature.substring(0, 10) + '...',
  });

  try {
    const response = await axios.get(url, {
      headers: {
        'ACCESS-KEY': API_KEY,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': PASSPHRASE,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Bitget API Error:', {
      url,
      status: error.response?.status,
      errorData: error.response?.data,
    });
    throw new Error(`Bitget API failed: ${error.response?.data?.msg || error.message}`);
  }
}
// Get account info (for testing API connection)
export async function getAccountInfo() {
  const method = 'GET';
  const requestPath = '/api/v2/spot/account/info';
  const timestamp = Date.now().toString();
  const signature = generateSignature(timestamp, method, requestPath, '');
  
  try {
    const response = await axios.get(`${BASE_URL}${requestPath}`, {
      headers: {
        'ACCESS-KEY': API_KEY,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': PASSPHRASE,
        'Content-Type': 'application/json',
        'locale': 'en-US'
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Account Info Error:', error.response?.data || error.message);
    throw error;
  }
}

export interface BitgetDeposit {
  coin: string;
  size: string;          // comes as string
  tradeId?: string;      // txid variant 1
  orderId?: string;      // txid variant 2
  status: "success" | string;
}

export function matchesDeposit(
  deposit: BitgetDeposit,
  expectedCoin: string,
  expectedSize: number,
  expectedTxid: string
): { matches: boolean; reasons?: string[] } {
  const reasons: string[] = [];

  // Coin match (ignore chain suffixes)
  const coinMatched = deposit.coin.toUpperCase().includes(expectedCoin.toUpperCase());
  if (!coinMatched) reasons.push(`Coin mismatch: ${deposit.coin} vs ${expectedCoin}`);

  // Amount match (with small tolerance)
  const amountMatched = Math.abs(parseFloat(deposit.size || '0') - expectedSize) < 0.01;
  if (!amountMatched) reasons.push(`Size mismatch: ${deposit.size} vs ${expectedSize}`);

  // Txid match
  const txidCandidates = [deposit.tradeId, deposit.orderId].filter(Boolean).map(String);
  const txidMatched = txidCandidates.some(t => t.toLowerCase() === expectedTxid.toLowerCase());
  if (!txidMatched) reasons.push(`Txid mismatch: ${txidCandidates.join(', ')} vs ${expectedTxid}`);

  // Status must be 'success'
  const statusMatched = deposit.status === 'success';
  if (!statusMatched) reasons.push(`Status not success: ${deposit.status}`);

  return { matches: coinMatched && amountMatched && txidMatched && statusMatched, reasons };
}
