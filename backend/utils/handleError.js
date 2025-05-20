const handleHttpError = (res, message = 'INTERNAL_SERVER_ERROR', statusCode = 500) => {
  res.status(statusCode).json({
    error: true,
    message,
    status: statusCode,
  });
};

module.exports = { handleHttpError };
