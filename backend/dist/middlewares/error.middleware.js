import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
const errorHandler = (err, req, res, next) => {
    let error = err;
    // Convert error to ApiError if it isn't already
    if (!(error instanceof ApiError)) {
        const isMongooseError = error instanceof mongoose.Error;
        const statusCode = isMongooseError ? 400 : 500;
        const message = error instanceof Error ? error.message : 'Something went wrong';
        error = new ApiError(statusCode, message, isMongooseError ? error === null || error === void 0 ? void 0 : error.errors : [], error instanceof Error ? error.stack : undefined);
    }
    const apiError = error;
    const response = Object.assign({ message: apiError.message, statusCode: apiError.statusCode, errors: apiError.errors || [] }, (process.env.NODE_ENV === 'development' ? { stack: apiError.stack } : {}));
    return res.status(apiError.statusCode).json(response);
};
export { errorHandler };
