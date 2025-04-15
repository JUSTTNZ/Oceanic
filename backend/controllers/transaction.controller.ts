import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.model.js";
import { getIO } from '../config/socket.js';

// Create Transaction (Buy or Sell)
const createTransaction = asyncHandler(async (req, res) => {
  try {
    const transactionData = new Transaction({
      ...req.body,
      user: req.user._id,
    });
    await transactionData.save();

    const io = getIO();
    io.emit('transaction_created', {
      user: req.user._id,
      transaction: transactionData
    });

    return res.status(201).json(new ApiResponse(201, 'Transaction created successfully', transactionData));
  } catch (error) {
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
      .populate('user', 'email username')
      .sort({ createdAt: sortOrder });

    res.json(new ApiResponse(200, 'All transactions', transactions));
  } catch (error) {
    throw new ApiError({ statusCode: 500, message: 'Something went wrong in the process' });
  }
});

// Get Authenticated User's Transactions
const getUserTransactions = asyncHandler(async (req, res) => {
  try {
    const { sort = 'desc', coin, type } = req.query;
    const filter: { user: any; coin?: string; type?: string } = { user: req.user._id };

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
