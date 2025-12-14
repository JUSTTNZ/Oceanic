import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.model.js";
import { CoinWallet } from "../models/coinWallet.model.js";
import { Notification } from "../models/notification.model.js";
import { sendAdminEmail } from "../utils/mailer.js";
import { Request, Response } from "express";
import coins from "../coindata/coin.json" with { type: "json" };
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
      type,
      walletAddressUsed,
      country,
      bankName,
      accountName,
      accountNumber
    } = req.body;

    if (!coin || amount == null || coinAmount == null || !txid || !type || !country) {
      throw new ApiError({ statusCode: 400, message: "Missing required fields" });
    }

    if (type !== "buy" && type !== "sell") {
      throw new ApiError({ statusCode: 400, message: "Transaction type must be 'buy' or 'sell'" });
    }

    const existing = await Transaction.findOne({ txid });
    if (existing) {
      throw new ApiError({ statusCode: 400, message: "Transaction with this TXID already exists" });
    }

    const data: any = {
      userId: req.profile?._id,
      userFullname: req.profile?.fullname,
      userUsername: req.profile?.username,
      userEmail: req.profile?.email,
      coin,
      amount,
      coinAmount,
      txid,
      type,
      country,
    };

    if (type === "buy") {
      if (!walletAddressUsed) {
        throw new ApiError({
          statusCode: 400,
          message: "User wallet address is required for buy transactions",
        });
      }
      data.walletAddressUsed = walletAddressUsed;
    }

    if (type === "sell") {
      if (!bankName || !accountName || !accountNumber) {
        throw new ApiError({
          statusCode: 400,
          message: "Bank name, account name, and account number are required for sell transactions",
        });
      }

      if (!/^\d{10}$/.test(accountNumber)) {
        throw new ApiError({
          statusCode: 400,
          message: "Account number must be exactly 10 digits",
        });
      }

      if (!/^[a-zA-Z]+ [a-zA-Z]+$/.test(accountName.trim())) {
        throw new ApiError({
          statusCode: 400,
          message: "Account name must be two words (e.g., John Doe)",
        });
      }

      data.bankName = bankName;
      data.accountName = accountName;
      data.accountNumber = accountNumber;
    }

    const walletInfo = await CoinWallet.findOne({ coin });

    if (!walletInfo) {
      const fallback = coinsData.find((c: CoinData) => c.coin.toUpperCase() === coin.toUpperCase());

      if (!fallback) {
        throw new ApiError({
          statusCode: 404,
          message: "No wallet address found for this coin",
        });
      }

      data.walletAddressSentTo = fallback.walletAddress;
    } else {
      data.walletAddressSentTo = walletInfo.walletAddress;
    }

    const transaction = await Transaction.create(data);

    res.status(201).json(new ApiResponse(201, "Transaction created successfully", transaction));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Something went wrong while creating transaction",
    });
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

    res.json(new ApiResponse(200, 'All transactions', transactions));
    console.log('All transactions:', transactions);
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
    // Create notification
    await Notification.create({
      userId: transaction.userId,
      type: 'transaction_confirmed',
      message: `Your ${transaction.type} transaction of $${transaction.amount} (${transaction.coinAmount} ${transaction.coin.toUpperCase()}) has been confirmed. Payment has been processed.`,
      transactionId: transaction._id,
      txid: transaction.txid,
      amount: transaction.amount,
      coin: transaction.coin,
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
        <li>Amount: ${transaction.amount} ${transaction.coin.toUpperCase()}</li>
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
