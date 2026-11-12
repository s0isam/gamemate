const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const errorStatus = err.statusCode || err.status;
  const statusCode = errorStatus >= 400 && errorStatus < 500
    ? errorStatus
    : (res.statusCode !== 200 ? res.statusCode : 500);
  const message = statusCode >= 500 ? 'Something went wrong' : err.message;

  return res.status(statusCode).json({
    success: false,
    message: err.type === 'entity.parse.failed' ? 'Invalid JSON request body' : (message || 'Something went wrong'),
    ...(err.details ? { details: err.details } : {}),
  });
};

module.exports = { errorHandler };
