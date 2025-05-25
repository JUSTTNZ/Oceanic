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
function generateSignature(
  timestamp: string,
  method: string,
  requestPath: string,
  queryString: string = '',
  body: string = ''
): string {
  const preHash = timestamp + method + requestPath + queryString + body;
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
  
  // Build query parameters
  const params = new URLSearchParams({
    coin,
    startTime: startTime.toString(),
    endTime: endTime.toString(),
    limit: limit.toString()
  });
  
  const queryString = params.toString();
  const timestamp = Date.now().toString();
  
  // Generate signature with query string included
  const signature = generateSignature(timestamp, method, requestPath, queryString);
  
  console.log('API Request Details:', {
    url: `${BASE_URL}${requestPath}?${queryString}`,
    timestamp,
    signature: signature.substring(0, 10) + '...' // Log partial signature for debugging
  });
  
  try {
    const response = await axios.get(`${BASE_URL}${requestPath}?${queryString}`, {
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
    console.error('Bitget API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    throw error;
  }
}

// Get account info (for testing API connection)
export async function getAccountInfo() {
  const method = 'GET';
  const requestPath = '/api/v2/spot/account/info';
  const timestamp = Date.now().toString();
  const signature = generateSignature(timestamp, method, requestPath);
  
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
