import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const API_KEY = process.env.BITGET_API_KEY;
const API_SECRET = process.env.BITGET_SECRET_KEY;
if (!API_SECRET) {
    throw new Error("Missing BITGET_SECRET_KEY in environment variables");
}
const PASSPHRASE = process.env.BITGET_PASSPHRASE;
const BASE_URL = 'https://api.bitget.com';
// Generate signature according to Bitget API specs
function generateSignature(timestamp, method, requestPath, queryParams) {
    const preHash = timestamp + method + requestPath + (queryParams ? `?${queryParams}` : '');
    return crypto
        .createHmac('sha256', API_SECRET)
        .update(preHash)
        .digest('base64');
}
// Fetch deposit records
export async function fetchDeposits(coin, startTime, endTime, limit = 20) {
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
    }
    catch (error) {
        console.error('Bitget API Error:', {
            url,
            status: error.response?.status,
            errorData: error.response?.data, // Bitget's error message
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
    }
    catch (error) {
        console.error('Account Info Error:', error.response?.data || error.message);
        throw error;
    }
}
//# sourceMappingURL=bitget.service.js.map