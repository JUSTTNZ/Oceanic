import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.model.js";
import { getIO } from '../config/socket.js';
import { CoinWallet } from "../models/coinWallet.model.js";

// Create Transaction (Buy or Sell)
  const createTransaction = asyncHandler(async (req, res) => {
    try{
    const { coin, amount, txid, type, walletAddressUsed, country } = req.body;
  
    // Validate common required fields
    if (!coin || !amount || !txid || !type || !country) {
      throw new ApiError({ statusCode: 400, message: "Missing required fields" });
    }
  
    // Check transaction type
    if (type !== "buy" && type !== "sell") {
      throw new ApiError({ statusCode: 400, message: "Transaction type must be 'buy' or 'sell'" });
    }
  
    // Prevent duplicate txid
    const existing = await Transaction.findOne({ txid });
    if (existing) {
      throw new ApiError({ statusCode: 400, message: "Transaction with this TXID already exists" });
    }
  
    const data: any = {
      userId: req.user._id,
      userFullname: req.user.fullname, // Add fullname
      userUsername: req.user.username, // Add username
      userEmail: req.user.email, // Add email
      coin,
      amount,
      txid,
      type,
      country,
    };
  
    // If it's a buy, require user's wallet address
    if (type === "buy") {
      if (!walletAddressUsed) {
        throw new ApiError({ statusCode: 400, message: "User wallet address is required for buy transactions" });
      }
      data.walletAddressUsed = walletAddressUsed;
    }
  
    // If it's a sell, add walletAddressSentTo from admin’s CoinWallet model
    if (type === "sell") {
      const coinWallet = await CoinWallet.findOne({ coin });
      if (!coinWallet) {
        throw new ApiError({ statusCode: 404, message: "No wallet address found for this coin" });
      }
      data.walletAddressSentTo = coinWallet.walletAddress;
    }
  
    // Save transaction
    const transaction = await Transaction.create(data);
  
    const io = getIO();
    io.emit("transaction_created", {
      user: req.user._id,
      transaction,
    });
  
    res.status(201).json(new ApiResponse(201, "Transaction created successfully", transaction));
    console.log("Transaction created:", transaction);
    
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw new ApiError({ statusCode: 500, message: 'Something went wrong while creating transaction' });
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
    const filter: { userId: any; coin?: string; type?: string } = { userId: req.user._id };

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

  const io = getIO();
  io.emit('transaction_updated', {
    user: transaction.userId,
    txid,
    status
  });

  return res.status(200).json(new ApiResponse(200, 'Transaction status updated', transaction));
});

export {
  createTransaction,
  getAllTransactions,
  getUserTransactions,
  updateTransactionStatus,
};
