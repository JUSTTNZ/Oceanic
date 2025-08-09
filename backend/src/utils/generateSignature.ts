// generateSignature.ts
const crypto = require('crypto');

const timestamp = "1718906400"; // Current time in seconds
const method = "GET";
const requestPath = "/api/v2/spot/wallet/deposit-records";
const queryString = "coin=USDT&startTime=1718902800&endTime=1718906400&limit=20";
const body = ""; // Empty for GET requests

const preHash = timestamp + method + requestPath + queryString + body;
const secret = "YOUR_API_SECRET";

const signature = crypto
  .createHmac('sha256', secret)
  .update(preHash)
  .digest('base64');