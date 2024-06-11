class ApiResponse {
    statusCode: number;
    message: string;
    data: any;
    success: boolean; 

    constructor(statusCode: number, data: any, message: string = "success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
