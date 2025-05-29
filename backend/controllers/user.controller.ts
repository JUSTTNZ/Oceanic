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

const registerUser = asyncHandler(async (req, res, next) => {
    console.log("Received registration data:", req.body);
    const { fullname, email, username, password, phoneNumber } = req.body;

    // Validation - now includes phoneNumber
    if ([fullname, email, username, password, phoneNumber].some(field => !field?.trim())) {
        throw new ApiError({
            statusCode: 400,
            message: "All fields are required",
        });
    }

    const existingUser = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
        throw new ApiError({
            statusCode: 409, // Changed from 404 to 409
            message: "User with this email or username already exists",
        });
    }

    const userCount = await User.countDocuments();
    let role = 'user';
    if (userCount === 0) role = 'superadmin';
    else if (userCount === 1) role = 'admin';

    const user = await User.create({
        fullname,
        email: email.toLowerCase(),
        password,
        username: username.toLowerCase(),
        phoneNumber,
        role // Added missing role
    });

    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", user)
    );
});

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
            sameSite: 'none' as 'none',
            domain: 'oceanic-servernz.vercel.app',
            
        }

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, "User logged in successfully", { user: loggedInUser, }))
    }
    catch (error) {
        console.log("User login failed", error);
        next(error); // Forward the error to Express error handler
    }
});

const logOutUser = asyncHandler(async (req, res,next) => {
    try{
    const userId = req.user._id
    //find logged in user
    const loggedInUser = await User.findById(userId)
    if(!loggedInUser){
        throw new ApiError({statusCode:401, message:"User not found"})
    }
   
    // clear token 
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0) // set to expire now now
    }
    return res 
    .status(200)
    // clear cookies here
    .clearCookie("refreshToken",  options)
    .clearCookie("accessToken",  options)
    .json(new ApiResponse(200, "User logged out Successfully", {}))
}
catch(error){
    console.log("User logout failed", error)
    next(error)
}
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies || req.body

    const incomingRefreshToken = refreshToken

    if(!incomingRefreshToken) {
        throw new ApiError({ statusCode: 401, message: "Refresh token is invalid" })
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET) 

        const userId = (decodedToken as jwt.JwtPayload)?._id;
        if (!userId) {
            throw new ApiError({ statusCode: 401, message: "Invalid token payload" });
        }
        const user = await User.findById(userId);

        if(!user) {
            throw new ApiError({ statusCode: 401, message: "Unauthorized" })
        }

        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError({ statusCode: 401, message: "Invalid refresh token" })
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id.toString());

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(200, "Access token refreshed successfully", {accessToken, refreshToken: newRefreshToken}))
    } catch (error) {
        throw new ApiError({ statusCode: 400, message: "Something happened while refreshing token" })
    }
})

const changeUserCurrentPassword = asyncHandler(async(req, res) => {
    const { email, currentPassword, newPassword } = req.body;
 console.log("current",currentPassword,)
  console.log("email",email, )
   console.log("new",newPassword)
    // Validate input
    if (!email || !currentPassword || !newPassword) {
        throw new ApiError({ statusCode: 400, message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
        throw new ApiError({ statusCode: 401, message: "Current password is incorrect" });
    }

    // Check if new password is same as old
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
        throw new ApiError({ statusCode: 400, message: "New password cannot be same as current password" });
    }

    // Update password
    user.password = newPassword;
    await user.save(); // Using save() to trigger pre-save hooks for password hashing

    return res.status(200).json(
        new ApiResponse(200, "Password changed successfully", {})
    );
});

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("email username fullname role createdAt phoneNumber");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      status: "success",
      data: {
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        role:user.role,
        createdAt:user.createdAt,
        phoneNumber:user.phoneNumber
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserDetails = asyncHandler(async(req, res) => {
    const {  fullname, phoneNumber } = req.body; // 
    const userId = req.user._id;

    
    if ( !fullname) {
        throw new ApiError({ statusCode: 400, message: " fullname is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
            fullname, 
            phoneNumber 
        },
        { new: true, }
    )

    if (!updatedUser) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    return res.status(200).json(
        new ApiResponse(200, "User details updated successfully", updatedUser)
    );
});

const deleteUser = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const user = await User.findById(userId)
    if(!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" })
    }
    const deletedUser = await User.findByIdAndDelete(userId)
    if(!deletedUser) {
        throw new ApiError({ statusCode: 404, message: "User not found" })
    }
    return res.status(200).json(new ApiResponse(200, "User deleted successfully", {}))
});

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeUserCurrentPassword,
    updateUserDetails,
    getCurrentUser,
    deleteUser
}