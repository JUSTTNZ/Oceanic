import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.model.js";
import { CoinWallet } from "../models/coinWallet.model.js";
import { Notification } from "../models/notification.model.js";
import { sendAdminEmail } from "../utils/mailer.js";
import { Request, Response } from "express";
import coins from "../coindata/coin.json" with { type: "json" };
import { fetchDeposits, matchesDeposit, BitgetDeposit } from "../services/bitget.service.js";
interface CoinData {
  coin: string;
  network: string;
  walletAddress: string;
}

const coinsData: CoinData[] = coins as CoinData[];

// Create Transaction (Buy or Sell)
const createTransaction = asyncHandler(async (req: Request, res: Response)  => {
  try {
    const {
      coin,
      amount,
      coinAmount,
      txid,
      coinPriceUsd,
      type,
      walletAddressUsed,
      country,
      bankName,
      accountName,
      accountNumber
    } = req.body;

    // 1️⃣ Validate required fields
    if (!coin || amount == null || coinAmount == null || !txid || !type || !country) {
      throw new ApiError({ statusCode: 400, message: "Missing required fields" });
    }

    if (type !== "buy" && type !== "sell") {
      throw new ApiError({ statusCode: 400, message: "Transaction type must be 'buy' or 'sell'" });
    }

    // 2️⃣ Check with Bitget before saving
    const endTime = Date.now();
    const startTime = endTime - 7 * 24 * 60 * 60 * 1000; // last 7 days
const depositsResponse = (await fetchDeposits(coin, startTime, endTime, 100)) as BitgetDeposit[];

const depositMatch = depositsResponse.find(dep =>
  matchesDeposit(dep, coin, coinAmount, txid).matches
);

    if (!depositMatch) {
      throw new ApiError({ statusCode: 400, message: "Deposit not found on Bitget or does not match criteria" });
    }

    // 3️⃣ Check DB for duplicates (coin + txid)
    const existing = await Transaction.findOne({ txid, coin });
    if (existing) {
      throw new ApiError({ statusCode: 400, message: "Transaction already exists in DB" });
    }

    // 4️⃣ Prepare transaction data
    const data: any = {
      userId: req.profile?._id,
      userFullname: req.profile?.fullname,
      userUsername: req.profile?.username,
      userEmail: req.profile?.email,
      coin,
      amount,
      coinAmount,
      txid,
      coinPriceUsd,
      type,
      country,
    };

    if (type === "buy") {
      if (!walletAddressUsed) throw new ApiError({ statusCode: 400, message: "Wallet address required for buy" });
      data.walletAddressUsed = walletAddressUsed;
    }

    if (type === "sell") {
      if (!bankName || !accountName || !accountNumber) {
        throw new ApiError({ statusCode: 400, message: "Bank details required for sell" });
      }
      if (!/^\d{10}$/.test(accountNumber)) throw new ApiError({ statusCode: 400, message: "Account number must be 10 digits" });
      if (!/^[a-zA-Z]+ [a-zA-Z]+$/.test(accountName.trim())) throw new ApiError({ statusCode: 400, message: "Account name must be two words" });
      data.bankName = bankName;
      data.accountName = accountName;
      data.accountNumber = accountNumber;
    }

    // 5️⃣ Determine wallet to send to
    const walletInfo = await CoinWallet.findOne({ coin });
    if (!walletInfo) {
      const fallback = coinsData.find(c => c.coin.toUpperCase() === coin.toUpperCase());
      if (!fallback) throw new ApiError({ statusCode: 404, message: "No wallet address found for this coin" });
      data.walletAddressSentTo = fallback.walletAddress;
    } else {
      data.walletAddressSentTo = walletInfo.walletAddress;
    }

    // 6️⃣ Save transaction
    const transaction = await Transaction.create(data);
console.log("New transaction created:", transaction);
    res.status(201).json(new ApiResponse(201, "Transaction created successfully", transaction));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({ statusCode: 500, message: error instanceof Error ? error.message : "Failed to create transaction" });
  }
});
  

// Get All Transactions with optional sorting and filtering
const getAllTransactions = asyncHandler(async (req, res) => {
  try {
    const { sort = 'desc', coin, type } = req.query;
    const filter: { coin?: string; type?: string; user?: string } = {};

    if (coin && typeof coin === 'string') filter.coin = coin;
    if (type && typeof type === 'string') filter.type = type;

    const sortOrder = sort === 'asc' ? 1 : -1;

    const transactions = await Transaction.find(filter)
      .populate('userId', 'email username fullname')
      .sort({ createdAt: sortOrder });

    // Ensure coinAmount is always present in the response
    const processedTransactions = transactions.map(tx => ({
      ...tx.toObject(),
      coinAmount: tx.coinAmount || 0
    }));

    res.json(new ApiResponse(200, 'All transactions', processedTransactions));
    // console.log('All transactions:', transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new ApiError({ statusCode: 500, message: 'Something went wrong in the process' });
  }
});

// Get Authenticated User's Transactions
const getUserTransactions = asyncHandler(async (req, res) => {
  try {
    const { sort = 'desc', coin, type } = req.query;
    const filter: { userId: any; coin?: string; type?: string } = { userId: req.profile?._id };

    if (coin && typeof coin === 'string') filter.coin = coin;
    if (type && typeof type === 'string') filter.type = type;

    const sortOrder = sort === 'asc' ? 1 : -1;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: sortOrder });

    res.json(new ApiResponse(200, 'User transactions fetched', transactions));
  } catch (error) {
    throw new ApiError({ statusCode: 500, message: 'Something went wrong in the process' });
  }
});

// Update Transaction Status (Admin Only)
const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { txid } = req.params;
  const { status } = req.body;

  if (!txid || !status) {
    throw new ApiError({ statusCode: 400, message: 'TXID and status are required' });
  }

  const transaction = await Transaction.findOne({ txid });
  if (!transaction) {
    throw new ApiError({ statusCode: 404, message: 'Transaction not found' });
  }

  transaction.status = status;
  await transaction.save();

  // If status is confirmed, create notification and send email
  if (status === 'confirmed') {
    let notificationAmount: number;
    let notificationCoin: string;
    let notificationMessage: string;
    let emailAmountDisplay: string;

          if (transaction.type === 'buy') {
            // For buy: primary amount is fiat (USD), secondary is crypto
            notificationAmount = transaction.amount; // Store fiat amount for notification
            notificationCoin = 'USD'; // Explicitly USD for buy transactions
            notificationMessage = `Your buy transaction of $${transaction.amount} (${transaction.coinAmount || 0} ${transaction.coin.toUpperCase()}) has been confirmed. Payment has been processed.`;
            emailAmountDisplay = `$${transaction.amount} USD`;
          } else {
            // For sell: primary amount is crypto, secondary is fiat (USD equivalent)
            notificationAmount = transaction.coinAmount; // Store crypto amount for notification
            notificationCoin = transaction.coin.toUpperCase(); // Store crypto symbol
            // The message should reflect crypto sold and fiat received
            notificationMessage = `Your sell transaction of ${transaction.coinAmount || 0} ${transaction.coin.toUpperCase()} ($${transaction.amount}) has been confirmed. Payment has been processed.`;
            emailAmountDisplay = `${transaction.coinAmount || 0} ${transaction.coin.toUpperCase()}`;
          }
    // Create notification
    await Notification.create({
      userId: transaction.userId,
      type: 'transaction_confirmed',
      message: notificationMessage,
      transactionId: transaction._id,
      txid: transaction.txid,
      amount: notificationAmount,
      coin: notificationCoin,
    });

    // Send email
    const emailSubject = `Transaction Confirmed - ${transaction.txid}`;
    const emailBody = `
      <h2>Transaction Confirmed</h2>
      <p>Dear ${transaction.userFullname},</p>
      <p>Your ${transaction.type} transaction has been successfully confirmed.</p>
      <p><strong>Transaction Details:</strong></p>
      <ul>
        <li>Transaction ID: ${transaction.txid}</li>
        <li>Amount: ${emailAmountDisplay}</li>
        <li>Type: ${transaction.type}</li>
        <li>Status: Confirmed</li>
      </ul>
      <p>Your payment has been processed and credited to your account.</p>
      <p>Thank you for using Oceanic Charts!</p>
      <p>Best regards,<br>The Oceanic Charts Team</p>
    `;

    try {
      await sendAdminEmail({
        to: transaction.userEmail,
        subject: emailSubject,
        html: emailBody
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't throw error, just log it
    }
  }

  // const io = getIO();
  // io.emit('transaction_updated', {
  //   user: transaction.userId,
  //   txid,
  //   status
  // });

  return res.status(200).json(new ApiResponse(200, 'Transaction status updated', transaction));
});

export {
  createTransaction,
  getAllTransactions,
  getUserTransactions,
  updateTransactionStatus,
};
