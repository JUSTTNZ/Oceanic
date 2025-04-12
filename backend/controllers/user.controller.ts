import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
// import userService from "../services/user.service.js";
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";
import { IUserRegister } from '../types/user.types.js';

const generateAccessAndRefreshToken = async (userId: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError({ statusCode: 404, message: "User not found" })
        }

        const accessToken = await (user as any).generateAccessToken();
        const refreshToken = await (user as any).generateRefreshToken();

        (user as any).refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError({ statusCode: 403, message: "Something went wrong while generating access and refresh token" })
    }
}


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

const registerUser = asyncHandler( async (req, res, next) => {
    
    const {fullname, email, username, password, phoneNumber} = req.body

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

    const userCount = await User.countDocuments();
    let role: 'user' | 'admin' | 'superadmin' = 'user';
  
    if (userCount === 0) {
      role = 'superadmin';
    } else if (userCount === 1) {
      role = 'admin';
    }
  


        const user = await User.create({
            fullname,
            email,
            password,
            username: username.toLowerCase(),
            phoneNumber
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
    
})

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, username, password } = req.body

    if (
        [email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError({ statusCode: 400, message: "Please provide required fields" })
    }

    let user;

    if (email) {
        user = await User.findOne({ email })
    }
   
    else if (username) {
        user = await User.findOne({ username })
    }

    if (!user) {
        throw new ApiError({ statusCode: 401, message: "Invalid user credentials" })
    }

    try {
        const validatePassword = await user.comparePassword(password)
        console.log("validatePassword", validatePassword);

        if (!validatePassword) {
            throw new ApiError({ statusCode: 401, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log("Error validating password", error);
        throw new ApiError({ statusCode: 401, message: "Wrong password, password does not match" })
    }

    try {
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id.toString())

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        if (!loggedInUser) {
            throw new ApiError({ statusCode: 401, message: "Something went wrong while user was logging in" })
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, "User logged in successfully", { user: loggedInUser, accessToken, refreshToken }))
    }
    catch (error) {
        console.log("User login failed", error);
        next(error); // Forward the error to Express error handler
    }
});

const logOutUser = asyncHandler(async (req, res) => {

})

const refreshAccessToken = asyncHandler(async (req, res) => {

})

const changeUserCurrentPassword = asyncHandler(async(req,res) => {
    
})

const updateUserDetails = asyncHandler(async(req, res) => {
    
})


export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeUserCurrentPassword,
    updateUserDetails
}