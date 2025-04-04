// controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/AsyncHandler';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model';
import userService from '../sevices/user.service';

// Generate Access and Refresh Tokens
const generateAccessAndRefreshToken = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// Register User
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.register(req.body);

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    return res.status(201).json(new ApiResponse(201, "User created successfully", {
      _id: user._id,
      email: user.email,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
      tokens: { accessToken, refreshToken }
    }));
  } catch (error: any) {
    console.error("Error registering user:", error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Login User
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if ([email || '', username || '', password || ''].some(field => field.trim() === '')) {
    throw new ApiError(400, "Please provide required fields");
  }

  let user = null;
  if (email) {
    user = await User.findOne({ email });
  } else if (username) {
    user = await User.findOne({ username });
  }

  if (!user) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');
  if (!loggedInUser) {
    throw new ApiError(401, "Something went wrong while user was logging in");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully", { accessToken, refreshToken }));
});


export {
    registerUser,
    loginUser,
    // logOutUser,
    //refreshAccessToken,
    // changeUserCurrentPassword,
    // updateUserDetails
}