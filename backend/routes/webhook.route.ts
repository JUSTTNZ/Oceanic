import express from 'express';
const router = express.Router();

import { handleBitgetWebhook } from '../controllers/webhook.controller.js';

router.route("/webhook").post(handleBitgetWebhook);

export default router;