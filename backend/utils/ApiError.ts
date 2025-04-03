interface ApiErrorDetail {
  field: string;
  message: string;
}

interface ApiErrorProps {
  statusCode: number;
  message?: string;
  errors?: ApiErrorDetail[];
  stack?: string;
}

class ApiError extends Error {
  statusCode: number;
  data: null;
  errors: ApiErrorDetail[];
  success: boolean;

  constructor(
    statusCode: number,
    message: string = 'Something went wrong',
    errors: ApiErrorDetail[] = [],
    stack?: string
  ) {
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

export { ApiError, ApiErrorDetail, ApiErrorProps };
