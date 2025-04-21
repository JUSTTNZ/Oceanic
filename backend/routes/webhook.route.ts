import express from 'express';
const router = express.Router();

import { handleBitgetWebhook } from '../controllers/webhook.controller.js';

router.route("/").post(handleBitgetWebhook);

export default router;