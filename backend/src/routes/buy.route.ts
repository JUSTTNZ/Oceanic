// routes/webhook.routes.ts
import express from 'express';
import { handlePaystackWebhook } from '../controllers/paystackwebhook.controller.js';
const router = express.Router();

router.route('/webhook').post(handlePaystackWebhook);

export default router;
