import { Router } from 'express';
import { 
  testConnection, 
  getDeposits, 
  getRecentDeposits 
} from '../controllers/webhook.controller.js';

const router = Router();

// Test Bitget API connection
router.get('/test', testConnection);

// Get deposit records with time range
router.get('/deposits', getDeposits);

// Get recent deposits (last 24 hours)
router.get('/deposits/recent', getRecentDeposits);

export default router;