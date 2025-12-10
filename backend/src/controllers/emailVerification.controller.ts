// src/controllers/emailVerification.controller.ts
import axios from "axios";
import { Request, Response } from "express";

export const verifyEmailWithBrevo = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ valid: false, message: "Email is required" });

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/emailTest",
      { email },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY!,
          "content-type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return res.json({ valid: true });
    } else {
      return res.status(400).json({ valid: false });
    }
  } catch (err: any) {
    console.error("❌ Brevo check failed:", err.response?.data || err.message);
    return res.status(400).json({ valid: false, message: "Invalid or unreachable email" });
  }
};
