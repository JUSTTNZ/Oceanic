import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model.js';
import { sendUserNotification } from '../utils/notification.js';
import { sendAdminEmail } from '../utils/mailer.js';
import { io } from '../config/socket.js';
import crypto from 'crypto';

export const handleBitgetWebhook = async (req: Request, res: Response) => {
  // Debug logging
  console.log('Request headers:', req.headers);
  console.log('Request body type:', typeof req.body);
  console.log('Request body:', req.body);
  console.log('Raw body exists:', !!(req as any).rawBody);
  
  const secret = process.env.BITGET_SECRET_KEY;
  if (!secret) {
    console.error("Missing BITGET_SECRET_KEY environment variable");
    return res.status(500).json({ message: 'Server configuration error: BITGET_SECRET_KEY is not defined' });
  }

  // Check if req.body exists and is not empty
  if (!req.body || (typeof req.body === 'object' && Object.keys(req.body).length === 0)) {
    console.error('Request body is empty or undefined:', req.body);
    return res.status(400).json({ message: 'Request body is empty or undefined' });
  }

  const signature = req.headers['x-signature'];
  if (!signature || typeof signature !== 'string') {
    console.error('Missing or invalid signature header');
    return res.status(400).json({ message: 'Missing or invalid signature' });
  }

  let bodyData;
  // Handle different body formats
  if (Buffer.isBuffer(req.body)) {
    bodyData = req.body.toString('utf8');
  } else if (typeof req.body === 'string') {
    bodyData = req.body;
  } else {
    bodyData = JSON.stringify(req.body);
  }
  
  console.log('Body data used for signature:', bodyData);
  
  // Create the expected signature
  const expectedSignature = crypto.createHmac('sha256', secret).update(bodyData).digest('hex');
  console.log('Expected signature:', expectedSignature);
  console.log('Received signature:', signature);
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  // Parse body if it's a string
  const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { txid, status, type, coin, country, amount } = data;
  
  // Validate required fields
  if (!txid) {
    return res.status(400).json({ message: 'Missing required field: txid' });
  }

  try {
    console.log(`Processing transaction with TXID: ${txid}`);
    const transaction = await Transaction.findOne({ txid });
    
    if (!transaction) {
      console.error(`Transaction not found with TXID: ${txid}`);
      return res.status(404).json({ message: 'Transaction not found' });
    }

    console.log(`Updating transaction status from ${transaction.status} to ${status}`);
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