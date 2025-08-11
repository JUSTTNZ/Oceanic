// src/routes/transaction.route.ts
import { Router } from 'express'
import { requireSupabaseUser, superAdminAuth } from '../middlewares/supabaseAuth.js'
import { createTransaction, getUserTransactions, getAllTransactions, updateTransactionStatus } from '../controllers/transaction.controller.js'

const router = Router()

router.post('/', requireSupabaseUser, createTransaction)
router.get('/user', requireSupabaseUser, getUserTransactions)
router.get('/admin', requireSupabaseUser, superAdminAuth, getAllTransactions)
router.patch('/status/:txid', requireSupabaseUser, superAdminAuth, updateTransactionStatus)

export default router
         