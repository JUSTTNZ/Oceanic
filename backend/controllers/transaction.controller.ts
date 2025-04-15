import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.model.js";
import { getIO } from '../config/socket.js'; 

const createTransaction = asyncHandler(async (req, res) => {
    try {
        const transactionData = new Transaction({
            ...req.body,
            userId: req.user._id
        });
        await transactionData.save();
        
        const io = getIO();
        io.emit('transaction_created', {
            user: req.user._id,
            transactionData
        });
        
        return res.status(201).json(new ApiResponse(201, "Transaction created successfully", transactionData));
    } catch (error) {
        throw new ApiError({ statusCode: 500, message: "Something went wrong while creating transaction" })
    }
})

const getAllTransactions = asyncHandler(async (req, res) => {
    try {
        const transactions = await Transaction.find({}).populate('user', 'email username');
        res.json(new ApiResponse(200, 'All transactions', transactions));
    } catch (error) {
        throw new ApiError({ statusCode: 500, message: "Something went wrong in the process" })
    }
})

const getUserTransactions = asyncHandler(async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(new ApiResponse(200, 'Transactions fetched', transactions));
    } catch (error) {
        throw new ApiError({ statusCode: 500, message: "Something went wrong in the process" })
    }
})

const updateTransactionStatus = asyncHandler(async (req, res) => {

})
export {
    createTransaction,
    getAllTransactions,
    getUserTransactions,
    updateTransactionStatus

}