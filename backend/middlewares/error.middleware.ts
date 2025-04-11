import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error caught:", err)
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || (error instanceof mongoose.Error ? 400 : 500);

        const message = error.message || "Something went wrong";
        error = new ApiError({ statusCode, message });
    }

    const response = {
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    return res.status(500).json({
        message: err.message || "Something went wrong"
    });
};

export {errorHandler}