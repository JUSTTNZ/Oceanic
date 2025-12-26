import { Request, Response } from 'express';
import crypto from 'crypto';
import { Transaction } from '../models/transaction.model.js';
import { sendAdminEmail } from '../utils/mailer.js';
import { sendUserNotification } from '../utils/notification.js';
//import { io } from '../config/socket.js';

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
    type: "buy",
    userFullname: transaction.userFullname ?? "Unknown User",
    userEmail: transaction.userEmail ?? "unknown@email.com",
    coin: transaction.coin,
    amount: amount,
    coinAmount: transaction.coinAmount,
    txid: transaction.txid,
    country: transaction.country,
    walletAddressUsed: transaction.walletAddressUsed,
  });



    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
