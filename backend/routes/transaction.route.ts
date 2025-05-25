import { Router } from 'express';
import { verifyJWT, superAdminAuth, adminOrSuperadminAuth } from '../middlewares/auth.middleware.js';
import { createTransaction, getUserTransactions, getAllTransactions, updateTransactionStatus } from '../controllers/transaction.controller.js';
// import { pollTxidStatus } from '../controllers/poll.controller.js';
const router = Router();

router.route("/").post(verifyJWT, createTransaction)
router.route("/user").get(verifyJWT, getUserTransactions);
// router.get('/poll', pollTxidStatus)
router.route("/admin").get(verifyJWT,adminOrSuperadminAuth, getAllTransactions)
router.route("/status/:txid").patch(verifyJWT, superAdminAuth, updateTransactionStatus)

export default router;