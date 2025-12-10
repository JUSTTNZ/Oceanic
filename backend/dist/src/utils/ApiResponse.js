class ApiResponse {
    success;
    message;
    data;
    statusCode;
    constructor(statusCode, message = "Success", data) {
        this.statusCode = statusCode;
        this.success = statusCode >= 200 && statusCode < 400;
        this.message = message;
        this.data = data;
    }
}
export { ApiResponse };
//# sourceMappingURL=ApiResponse.js.map