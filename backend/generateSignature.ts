// generateSignature.ts
import crypto from 'crypto';

const payload = JSON.stringify({
  txid: "TX123456ABC",
  status: "confirmed",
  type: "sell"
});

const secret = process.env.BITGET_SECRET_KEY; // Replace with your real secret or load from .env
if (!secret) {
  throw new Error("Environment variable BITGET_SECRET_KEY is not defined");
}

const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

console.log("📬 Signature:", signature);
