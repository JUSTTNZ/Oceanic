import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
// import userService from "../services/user.service.js";
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


// interface UserObject {
//     name: string;
//     email: string;
//     password: string;
//     [key: string]: any; // Allow additional properties if needed
// }

// const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const userData: IUserRegister = {
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password,
//             fullname: req.body.fullname,
//             phoneNumber: req.body.phoneNumber,
//             bankDetails: req.body.bankDetails
//         };

//         const user = await userService.register(userData);
//         res.status(201).json(new ApiResponse(201, "User created successfully", user));
//     } catch (error) {
//         next(error);
//     }
// };

const registerUser = asyncHandler( async (req, res) => {
    const {fullname, email, username, password} = req.body

    //validation
    if(
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError({
            statusCode: 400,
            message: "All fields required",
          });
    }

    const exitingUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(exitingUser) {
        throw new ApiError({
            statusCode: 404,
            message: "Resource not found",
          });
    }


    try {
        const user = await User.create({
            fullname,
            email,
            password,
            username: username.toLowerCase(),
            subscribers: [], 
            subscribedTo: []  
        });
        
    
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
    
        if(!createdUser) {
            throw new ApiError({
                statusCode:500,
                message: "Something went wrong while registering the user",
              });
        }
    
        return res
        .status(201)
        .json(new ApiResponse(200, "User registered successfully", createdUser));
    } catch (error) {
        console.log("User creation failed");
        
    }
})
export {
    registerUser,
}