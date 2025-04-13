import { Router } from 'express';
import { verifyJWT, adminAuth } from '../middlewares/auth.middleware.js';
import { createTransaction } from '../controllers/transaction.controller.js';

const router = Router();

router.route("/").post(verifyJWT, createTransaction)

export default router;