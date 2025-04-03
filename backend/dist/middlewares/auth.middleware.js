var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/AsyncHandler';
import { ApiError } from '../utils/ApiError';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
// 3️⃣ Middleware to verify any logged-in user
export const verifyJWT = asyncHandler((req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.header('Authorization')) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', ''));
    if (!token) {
        throw new ApiError(401, 'Unauthorized: No token provided');
    }
    try {
        const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
        const user = yield User.findById(decoded._id).select('-password -refreshToken');
        if (!user) {
            throw new ApiError(401, 'Unauthorized: User not found');
        }
        req.user = user; // ✅ Now TypeScript understands req.user
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            throw new ApiError(401, error.message || 'Invalid token');
        }
        throw new ApiError(401, 'Invalid token');
    }
}));
// 4️⃣ Middleware for admin-only routes
export const adminAuth = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.header('Authorization')) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', ''));
    if (!token) {
        throw new ApiError(401, 'Access denied: No token provided');
    }
    try {
        const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
        const user = yield User.findById(decoded._id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        if (user.role !== 'admin') {
            throw new ApiError(403, 'Access denied: Admins only');
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            throw new ApiError(401, error.message || 'Invalid token');
        }
        throw new ApiError(401, 'Invalid token');
    }
}));
