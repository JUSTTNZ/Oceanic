"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// generateSignature.ts
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var crypto_1 = require("crypto");
var payload = JSON.stringify({
    "coin": "ETH",
    "amount": 150,
    "txid": "1239",
    "type": "sell",
    "country": "Nigeria",
    "status": "confirmed"
});
var secret = process.env.BITGET_SECRET_KEY; // Replace with your real secret or load from .env
if (!secret) {
    throw new Error("Environment variable BITGET_SECRET_KEY is not defined");
}
var signature = crypto_1.default.createHmac('sha256', secret).update(payload).digest('hex');
console.log("📬 Signature:", signature);
