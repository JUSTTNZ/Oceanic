import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import userService from "../services/user.service.js";
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";
import { IUserRegister } from '../types/user.types.js';

// const generateAccessAndRefreshToken = async (userId) => {
//     try {
//         const user = await User.findById(userId)

//         if (!user) {
//             throw new ApiError(404, "User not found")
//         }

//         const accessToken = user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken();

//         user.refreshToken = refreshToken;
//         await user.save({ validateBeforeSave: false })
//         return { accessToken, refreshToken }
//     } catch (error) {
//         throw new ApiError(403, "Something went wrong while generating access and refresh token")
//     }
// }


interface UserObject {
    name: string;
    email: string;
    password: string;
    [key: string]: any; // Allow additional properties if needed
}

const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userData: IUserRegister = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            fullname: req.body.fullname,
            phoneNumber: req.body.phoneNumber,
            bankDetails: req.body.bankDetails
        };

        const user = await userService.register(userData);
        res.status(201).json(new ApiResponse(201, "User created successfully", user));
    } catch (error) {
        next(error);
    }
};
export {
    registerUser,
}