import axios from 'axios';
import crypto from 'crypto';

const API_KEY = process.env.BITGET_API_KEY!;
const API_SECRET = process.env.BITGET_SECRET_KEY!;
const PASSPHRASE = process.env.BITGET_PASSPHRASE!;
const BASE_URL = 'https://api.bitget.com';

// Cache for server time to avoid multiple requests
let lastServerTime = {
  timestamp: 0,
  value: 0
};

// Enhanced time synchronization with retries
async function getBitgetServerTime(retries = 3): Promise<number> {
  // Return cached time if still valid (within 5 seconds)
  if (Date.now() - lastServerTime.timestamp < 5000 && lastServerTime.value !== 0) {
    return lastServerTime.value;
  }

  try {
    const res = await axios.get(`${BASE_URL}/api/v2/public/time`, {
      timeout: 3000
    });
    const serverTime = res.data.data;
    lastServerTime = {
      timestamp: Date.now(),
      value: serverTime
    };
    return serverTime;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getBitgetServerTime(retries - 1);
    }
    throw new Error('Failed to fetch Bitget server time');
  }
}

// Enhanced signature generator with local time fallback
function generateSignature(timestamp: string, method: string, requestPath: string, body = '') {
  const preHash = timestamp + method + requestPath + body;
  return crypto.createHmac('sha256', API_SECRET).update(preHash).digest('base64');
}

// Main fetch function with timestamp handling
export async function fetchRecentDeposits() {
  const method = 'GET';
  const requestPath = '/api/v2/spot/wallet/deposit-records';

  try {
    // Get server time in milliseconds and convert to seconds with 3 decimal places
    const serverTimeMs = await getBitgetServerTime();
    const timestamp = (serverTimeMs / 1000).toFixed(3);

    const signature = generateSignature(timestamp, method, requestPath);

    const headers = {
      'ACCESS-KEY': API_KEY,
      'ACCESS-SIGN': signature,
      'ACCESS-TIMESTAMP': timestamp,
      'ACCESS-PASSPHRASE': PASSPHRASE,
      'Content-Type': 'application/json'
    };

    const res = await axios.get(`${BASE_URL}${requestPath}`, {
      headers,
      timeout: 10000
    });

    return res.data.data;
  } catch (error: any) {
    console.error('Bitget API Error:', {
      code: error.response?.data?.code,
      msg: error.response?.data?.msg,
      requestTime: error.response?.data?.requestTime
    });
    throw new Error(`Failed to fetch deposit records: ${error.response?.data?.msg || error.message}`);
  }
}