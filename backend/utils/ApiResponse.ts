class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;

  constructor(statusCode: number, message: string = "Success", data: T) {
    this.success = statusCode >= 200 && statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
