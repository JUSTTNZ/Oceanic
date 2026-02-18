import { Router } from 'express';
import { 
  testConnection, 
  getDeposits, 
  getRecentDeposits,
  confirmDeposit,
  confirmDepositWithTimeRange,
  getAllTransactionIds,
  getAllRecentDeposits,
  getAllDeposits
} from '../controllers/webhook.controller.js';

const router = Router();

// Test Bitget API connection
router.get('/test', testConnection);

// Get deposit records with time range
router.get('/deposits', getDeposits);

// Get recent deposits (last 24 hours)
router.get('/deposits/recent', getRecentDeposits);

router.get('/confirm-deposit', confirmDeposit);

router.get('/confirm-range', confirmDepositWithTimeRange);

// NEW: Get ALL deposits across multiple coins (doesn't require coin)
router.get('/deposits/all', getAllDeposits);

// NEW: Get ALL recent deposits (last 24 hours) (doesn't require coin)
router.get('/deposits/recent/all', getAllRecentDeposits);

// NEW: Get ALL transaction IDs across all coins
router.get('/transactions/all', getAllTransactionIds);
export default router;