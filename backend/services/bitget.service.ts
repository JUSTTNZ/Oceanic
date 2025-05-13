// utils/bitget.ts
// 1. bitget.service.ts
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.BITGET_API_KEY!;
const API_SECRET = process.env.BITGET_SECRET_KEY!;
const PASSPHRASE = process.env.BITGET_PASSPHRASE!;
const BASE_URL = 'https://api.bitget.com';

function generateSignature(timestamp: string, method: string, requestPath: string, body = '') {
  const preHash = timestamp + method + requestPath + body;
  return crypto.createHmac('sha256', API_SECRET).update(preHash).digest('base64');
}

export async function fetchRecentDeposits() {
  const timestamp = Date.now().toString();
  const method = 'GET';
  const requestPath = '/api/v2/spot/wallet/deposit-records';
  const signature = generateSignature(timestamp, method, requestPath);

  const headers = {
    'ACCESS-KEY': API_KEY,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': PASSPHRASE,
    'Content-Type': 'application/json'
  };

  const res = await axios.get(`${BASE_URL}${requestPath}`, { headers });
  return res.data.data;
}
