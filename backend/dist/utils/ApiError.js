import { logger } from "./logger.js";
class ApiError extends Error {
    statusCode;
    data = null;
    errors;
    success = false;
    constructor({ statusCode, message = "Something went wrong", errors = [], stack }) {
        super(message);
        // Ensure proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, ApiError.prototype);
        // Set error name
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
        // Log the error when it's constructed (optional - can be removed if too verbose)
        if (process.env.NODE_ENV === 'development') {
            logger.error("ApiError created", {
                statusCode: this.statusCode,
                message: this.message,
                errors: this.errors,
                stack: this.stack
            });
        }
    }
    // Static helper methods for common error types
    static badRequest(message, errors) {
        return new ApiError({ statusCode: 400, message, errors });
    }
    static unauthorized(message = "Unauthorized access") {
        return new ApiError({ statusCode: 401, message });
    }
    static forbidden(message = "Forbidden") {
        return new ApiError({ statusCode: 403, message });
    }
    static notFound(message = "Resource not found") {
        return new ApiError({ statusCode: 404, message });
    }
    static conflict(message = "Conflict") {
        return new ApiError({ statusCode: 409, message });
    }
    static unprocessableEntity(message = "Unprocessable Entity", errors) {
        return new ApiError({ statusCode: 422, message, errors });
    }
    static tooManyRequests(message = "Too Many Requests") {
        return new ApiError({ statusCode: 429, message });
    }
    static internal(message = "Internal Server Error", stack) {
        return new ApiError({ statusCode: 500, message, stack });
    }
    static notImplemented(message = "Not Implemented") {
        return new ApiError({ statusCode: 501, message });
    }
    static serviceUnavailable(message = "Service Unavailable") {
        return new ApiError({ statusCode: 503, message });
    }
}
export { ApiError };
//# sourceMappingURL=ApiError.js.map