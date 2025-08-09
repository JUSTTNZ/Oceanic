// src/routes/transaction.route.ts
import { Router } from 'express';
import { requireSupabaseUser, adminOrSuperadminAuth, superAdminAuth } from '../middlewares/supabaseAuth.js';
import { createTransaction, getUserTransactions, getAllTransactions, updateTransactionStatus } from '../controllers/transaction.controller.js';
const router = Router();
router.post('/', requireSupabaseUser, createTransaction);
router.get('/user', requireSupabaseUser, getUserTransactions);
router.get('/admin', requireSupabaseUser, adminOrSuperadminAuth, getAllTransactions);
router.patch('/status/:txid', requireSupabaseUser, superAdminAuth, updateTransactionStatus);
export default router;
//# sourceMappingURL=transaction.route.js.map