import { Request, Response } from 'express';
import crypto from 'crypto';
import { Transaction } from '../models/transaction.model.js';
import { sendAdminEmail } from '../utils/mailer.js';
import { sendUserNotification } from '../utils/notification.js';
import { io } from '../config/socket.js';

export const handlePaystackWebhook = async (req: Request, res: Response) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ message: 'PAYSTACK_SECRET_KEY not defined' });
  }

  const signature = req.headers['x-paystack-signature'];
  if (!signature || typeof signature !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid signature' });
  }

  const expectedSignature = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  if (signature !== expectedSignature) {
    console.log('Invalid signature:', signature, 'Expected:', expectedSignature);
    return res.status(401).json({ message: 'Invalid signature' });
  }

  const event = req.body;
  if (event.event !== 'charge.success') {
    return res.status(200).send('Unhandled event');
  }

  const reference = event.data.reference;
  const amount = event.data.amount / 100;
  const walletAddressUsed = event.data.metadata?.walletAddressUsed;

  try {
    const transaction = await Transaction.findOne({ txid: reference });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = 'paid';
    await transaction.save();

    await sendUserNotification(
      transaction.userId.toString(),
      `Your BUY transaction is now PAID`
    );

    await sendAdminEmail({
      subject: `Transaction BUY Update: PAID`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #28a745;">💰 BUY Transaction Paid</h2>
          <p>A <strong>buy</strong> transaction was successfully paid with the following details:</p>
          <ul>
            <li><strong>Transaction ID (TXID):</strong> ${transaction.txid}</li>
            <li><strong>Coin:</strong> ${transaction.coin}</li>
            <li><strong>Amount:</strong> $${amount}</li>
            <li><strong>Country:</strong> ${transaction.country}</li>
            <li><strong>User Wallet Address:</strong> ${transaction.walletAddressUsed}</li>
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
      txid: transaction.txid,
      status: transaction.status,
      type: transaction.type,
      coin: transaction.coin,
      amount: transaction.amount,
      country: transaction.country
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
