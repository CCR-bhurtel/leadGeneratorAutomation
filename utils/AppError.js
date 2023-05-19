class AppError extends Error {
    constructor(message, statusCode, redirectTo = '') {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.redirectTo = redirectTo;
    }
}

module.exports = AppError;
