import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model.js';
import { sendUserNotification } from '../utils/notification.js';
import { sendAdminEmail } from '../utils/mailer.js';
import { io } from '../config/socket.js';
import crypto from 'crypto';

export const handleBitgetWebhook = async (req: Request, res: Response) => {
  const secret = process.env.BITGET_WEBHOOK_SECRET;
  const signature = req.headers['x-signature'] as string;

  const expectedSignature = crypto.createHmac('sha256', secret!).update(JSON.stringify(req.body)).digest('hex');
  if (signature !== expectedSignature) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  const { txid, status, type } = req.body;
  try {
    const transaction = await Transaction.findOne({ txid });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.status = status;
    await transaction.save();

    await sendUserNotification(transaction.userId.toString(), `Your ${type} transaction is now ${status}`);

    await sendAdminEmail({
      subject: 'Transaction Update',
      text: `Transaction ${txid} for ${type.toUpperCase()} was marked as ${status}`
    });

    io.emit('transaction_updated', {
      user: transaction.userId,
      txid,
      status,
      type
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};