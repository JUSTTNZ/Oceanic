import { User } from '../models/user.model.js'
import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError }  from '../utils/ApiError.js'
import jwt from "jsonwebtoken"
import { Request } from "express"

// Extend the Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const verifyJWT = asyncHandler(async(req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log(token);

    if(!token) {
        throw new ApiError({ statusCode: 401, message: "Unauthorized" })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload;

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user) {
            throw new ApiError({ statusCode: 401, message: "Unauthorized" })
        }

        req.user = user

        next()
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Invalid access token";
        throw new ApiError({ statusCode: 401, message: errorMessage })
    }
})

export const adminOrSuperadminAuth = asyncHandler(async (req, res, next) => {
    try{
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      throw new ApiError({ statusCode: 401, message: 'Access denied, no token provided' });
    }
  
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    req.user = decoded;
  
    const user = await User.findById(req.user._id);
  
    if (!user) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }
  
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      throw new ApiError({ statusCode: 403, message: 'Access denied. Admins or Superadmins only.' });
    }
  
    next();
    }catch (error: unknown) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    }

  });

export const superAdminAuth = asyncHandler(async (req, res, next) => {
    try{
    const token =
      req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      throw new ApiError({ statusCode: 401, message: 'Access denied, no token provided' });
    }
  
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    req.user = decoded;
  
    const user = await User.findById(req.user._id);
  
    if (!user) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }
  
    if (user.role !== 'superadmin') {
      throw new ApiError({ statusCode: 403, message: 'Access denied. Superadmins only.' });
    }
  
    next();

    }catch (error: unknown) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    }
  });
export const adminAuth = asyncHandler(async(req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log(token);
        // console.log("Cookies:", req.cookies);
        // console.log("Authorization Header:", req.header("Authorization"));


        if(!token) {
            throw new ApiError({ statusCode: 401, message: "Access denied, no token provided" })
        }

        const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user =  decodedUser

        const user = await User.findById(req.user._id);
        if (!user) {
            throw new ApiError({ statusCode: 404, message: "User not found" });
        }

        // Check if user is an admin
        if (user.role !== "admin") {
            throw new ApiError({ statusCode: 403, message: "Access denied. Admins only." });
        }
        next(); 
    } catch (error: unknown) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    }
})