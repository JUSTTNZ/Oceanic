import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model.js';
import { sendUserNotification } from '../utils/notification.js';
import { sendAdminEmail } from '../utils/mailer.js';
import { io } from '../config/socket.js';
import crypto from 'crypto';

export const handleBitgetWebhook = async (req: Request, res: Response) => {
  const secret = process.env.BITGET_SECRET_KEY;
  if (!secret) {
    throw new Error("WEBHOOK_SECRET is not defined");
  }
  const signature = req.headers['x-signature'];
  if (!signature || typeof signature !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid signature' });
  }

  const expectedSignature = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
  if (signature !== expectedSignature) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  const { txid, status, type, coin, country, amount } = req.body;
  try {
    const transaction = await Transaction.findOne({ txid });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.status = status;
    await transaction.save();

    await sendUserNotification(transaction.userId.toString(), `Your ${type} transaction is now ${status}`);

    await sendAdminEmail({
      subject: `Transaction ${type.toUpperCase()} Update: ${status.toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #0055cc;">🔔 Transaction ${status.toUpperCase()}</h2>
          <p>A <strong>${type}</strong> transaction was made with the following details:</p>
          <ul>
            <li><strong>Transaction ID (TXID):</strong> ${txid}</li>
            <li><strong>Coin:</strong> ${transaction.coin}</li>
            <li><strong>Amount:</strong> $${transaction.amount}</li>
            <li><strong>Country:</strong> ${transaction.country}</li>
            ${transaction.walletAddressUsed ? `<li><strong>User Wallet Address:</strong> ${transaction.walletAddressUsed}</li>` : ""}
            ${transaction.walletAddressSentTo ? `<li><strong>Wallet Sent To:</strong> ${transaction.walletAddressSentTo}</li>` : ""}
            <li><strong>Status:</strong> ${transaction.status}</li>
          </ul>
          <p style="margin-top: 20px;">Please log in to the admin dashboard for more details.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">Oceanic Charts - Crypto Transaction Management</p>
        </div>
      `
    });
    

    io.emit('transaction_updated', {
      user: transaction.userId,
      txid,
      status,
      type,
      coin,
      amount,
      country
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};