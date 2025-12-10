// src/routes/email.route.ts
import { Router } from "express";
import { verifyEmailWithBrevo } from "../controllers/emailVerification.controller.js";

const router = Router();
router.post("/verify-email", verifyEmailWithBrevo);
export default router;
