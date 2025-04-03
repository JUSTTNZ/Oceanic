import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Convert error to ApiError if it isn't already
  if (!(error instanceof ApiError)) {
    const isMongooseError = error instanceof mongoose.Error;
    const statusCode = isMongooseError ? 400 : 500;

    const message = error instanceof Error ? error.message : 'Something went wrong';

    error = new ApiError(
      statusCode,
      message,
      isMongooseError ? (error as any)?.errors : [],
      error instanceof Error ? error.stack : undefined
    );
  }

  const apiError = error as ApiError;

  const response = {
    message: apiError.message,
    statusCode: apiError.statusCode,
    errors: apiError.errors || [],
    ...(process.env.NODE_ENV === 'development' ? { stack: apiError.stack } : {}),
  };

  return res.status(apiError.statusCode).json(response);
};

export { errorHandler };
