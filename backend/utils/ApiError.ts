interface ApiErrorDetail {
  field: string;
  message: string;
}

class ApiError extends Error {
  statusCode: number;
  data: null;
  errors: ApiErrorDetail[];
  success: boolean;

  constructor({
    statusCode,
    message = 'Something went wrong',
    errors = [],
    stack
  }: {
    statusCode: number;
    message?: string;
    errors?: ApiErrorDetail[];
    stack?: string;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError};