const errorHandler = (err, req, res, next) => {
    console.error(err.message); // Log the error for debugging

    const statusCode = err.statusCode || 400; // Default to 500 if no statusCode is set
    res.status(statusCode).json({
        status: 'error',
        message: err.message,
    });
};

module.exports = errorHandler;

