class ApiError extends Error{
    
    statusCode: number;
    errors: any[];
    data: any;
    success: boolean;

    constructor(statusCode: number, message="Something went wrong", errors:any[] = [], stack=""){
        super(message)
        this.message=message
        this.statusCode=statusCode
        this.errors=errors
        this.data=null
        this.success=false

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

module.exports={ApiError}