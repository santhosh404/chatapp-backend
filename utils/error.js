export const customError = (statusCode, message, data) => {
    return {
        status: statusCode,
        message: message,
        success: false,
        data: data ? data : null
    }
}