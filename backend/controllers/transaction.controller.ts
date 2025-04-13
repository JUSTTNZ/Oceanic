import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.model.js";

const createTransaction = asyncHandler(async (req, res) => {
    try {
        const transactionData = new Transaction({
            ...req.body,
            userId: req.user._id
        });

        await transactionData.save();
        return res.status(201).json(new ApiResponse(201, "Transaction created successfully", transactionData));


    } catch (error) {
        throw new ApiError({ statusCode: 500, message: "Something went wrong while creating transaction" })
    }
})

const getAllTransactions = asyncHandler(async (req, res) => {

})

const getUserTransactions = asyncHandler(async (req, res) => {

})

const updateTransactionStatus = asyncHandler(async (req, res) => {

})
export {
    createTransaction,
    getAllTransactions,
    getUserTransactions,
    updateTransactionStatus

}