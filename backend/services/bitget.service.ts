import axios from 'axios';
import crypto from 'crypto';

const API_KEY = process.env.BITGET_API_KEY!;
const API_SECRET = process.env.BITGET_SECRET_KEY!;
const PASSPHRASE = process.env.BITGET_PASSPHRASE!;

export async function fetchDeposits(coin: string, startTime: number, endTime: number) {
  const method = 'GET';
  const requestPath = '/api/v2/spot/wallet/deposit-records';
  const params = new URLSearchParams({
    coin,
    startTime: Math.floor(startTime / 1000).toString(),
    endTime: Math.floor(endTime / 1000).toString(),
    limit: '20'
  });

  const timestamp = Math.floor(Date.now() / 1000);
  const preHash = timestamp + method + requestPath + params.toString();
  const signature = crypto.createHmac('sha256', API_SECRET).update(preHash).digest('base64');

  try {
    const response = await axios.get(`https://api.bitget.com${requestPath}?${params}`, {
      headers: {
        'ACCESS-KEY': API_KEY,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp.toString(),
        'ACCESS-PASSPHRASE': PASSPHRASE,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      // AxiosError type guard
      const axiosError = error as any;
      console.error('Bitget API Error:', axiosError.response?.data || error.message);
    } else {
      console.error('Bitget API Error:', error);
    }
    throw error;
  }
}