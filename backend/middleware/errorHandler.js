const errorHandler = (err, req, res, next) => {
    console.error("❌ Error no capturado:", err);

    const status = err.status || 500;
    const message = err.message || 'INTERNAL_SERVER_ERROR';

    res.status(status).json({
        success: false,
        error: message,
    });
};

module.exports = errorHandler;
