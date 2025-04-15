// utils/bitget.ts
import axios from 'axios';
import crypto from 'crypto';

const API_KEY = process.env.BITGET_API_KEY!;
const SECRET_KEY = process.env.BITGET_SECRET_KEY!;
const BASE_URL = 'https://api.bitget.com/api';

const signRequest = (timestamp: string, method: string, requestPath: string, body = '') => {
  const prehash = timestamp + method.toUpperCase() + requestPath + body;
  return crypto.createHmac('sha256', SECRET_KEY).update(prehash).digest('hex');
};

export const bitgetClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const authenticatedRequest = async (
  method: 'GET' | 'POST',
  endpoint: string,
  body: object = {}
) => {
  const timestamp = Date.now().toString();
  const bodyString = method === 'POST' ? JSON.stringify(body) : '';
  const signature = signRequest(timestamp, method, endpoint, bodyString);

  const headers = {
    'ACCESS-KEY': API_KEY,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
  };

  const config = {
    method,
    url: endpoint,
    headers,
    data: method === 'POST' ? body : undefined,
  };

  return bitgetClient(config);
};
