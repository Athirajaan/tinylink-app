// src/middleware/errorHandler.js
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Custom Application Error
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || ERROR_MESSAGES.DATABASE_ERROR;

  // Log error details in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      message: err.message,
      statusCode,
      stack: err.stack,
      path: req.path
    });
  }

  // Handle specific error types
  if (err.code === '23505') {
    // PostgreSQL unique violation
    statusCode = HTTP_STATUS.CONFLICT;
    message = ERROR_MESSAGES.CODE_EXISTS;
  } else if (err.code === '23514') {
    // PostgreSQL check constraint violation
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = ERROR_MESSAGES.INVALID_CODE;
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

/**
 * Async error wrapper
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  AppError,
  errorHandler,
  asyncHandler
};