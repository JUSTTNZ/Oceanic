import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/AsyncHandler';
import { ApiError } from '../utils/ApiError';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

// 1️⃣ Define the type for your decoded token
interface DecodedToken {
  _id: string;
  iat?: number;
  exp?: number;
}

// 2️⃣ Augment Express Request type using module augmentation
declare module 'express-serve-static-core' {
  interface Request {
    user?: typeof User.prototype;
  }
}

// 3️⃣ Middleware to verify any logged-in user
export const verifyJWT = asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }

  try {
    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as DecodedToken;

    const user = await User.findById(decoded._id).select('-password -refreshToken');

    if (!user) {
      throw new ApiError(401, 'Unauthorized: User not found');
    }

    req.user = user; // ✅ Now TypeScript understands req.user
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new ApiError(401, error.message || 'Invalid token');
    }
    throw new ApiError(401, 'Invalid token');
  }
  
});

// 4️⃣ Middleware for admin-only routes
export const adminAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Access denied: No token provided');
  }

  try {
    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as DecodedToken;

    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.role !== 'admin') {
      throw new ApiError(403, 'Access denied: Admins only');
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new ApiError(401, error.message || 'Invalid token');
    }
    throw new ApiError(401, 'Invalid token');
  }
  
});
