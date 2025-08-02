const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error Handler:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.userId || 'unauthenticated'
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      code: 'INVALID_ID',
      statusCode: 404
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    error = {
      message,
      code: 'DUPLICATE_FIELD',
      statusCode: 400,
      field: field,
      value: value
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message,
      value: val.value
    }));
    
    error = {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      errors: errors
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      code: 'TOKEN_EXPIRED',
      statusCode: 401
    };
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      message: 'File too large',
      code: 'FILE_TOO_LARGE',
      statusCode: 400,
      limit: err.limit
    };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = {
      message: 'Too many files',
      code: 'TOO_MANY_FILES',
      statusCode: 400,
      limit: err.limit
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      message: 'Unexpected file field',
      code: 'UNEXPECTED_FILE',
      statusCode: 400,
      field: err.field
    };
  }

  // Payment gateway errors
  if (err.type === 'StripeCardError') {
    error = {
      message: err.message,
      code: 'PAYMENT_CARD_ERROR',
      statusCode: 400,
      stripeCode: err.code
    };
  }

  if (err.type === 'StripeInvalidRequestError') {
    error = {
      message: 'Payment request invalid',
      code: 'PAYMENT_INVALID_REQUEST',
      statusCode: 400
    };
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError') {
    error = {
      message: 'Database connection error',
      code: 'DATABASE_CONNECTION_ERROR',
      statusCode: 503
    };
  }

  if (err.name === 'MongoTimeoutError') {
    error = {
      message: 'Database timeout',
      code: 'DATABASE_TIMEOUT',
      statusCode: 503
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    error = {
      message: err.message || 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      statusCode: 429,
      retryAfter: err.retryAfter
    };
  }

  // File system errors
  if (err.code === 'ENOENT') {
    error = {
      message: 'File not found',
      code: 'FILE_NOT_FOUND',
      statusCode: 404
    };
  }

  if (err.code === 'EACCES' || err.code === 'EPERM') {
    error = {
      message: 'File permission error',
      code: 'FILE_PERMISSION_ERROR',
      statusCode: 500
    };
  }

  // Custom application errors
  if (err.isOperational) {
    error = {
      message: err.message,
      code: err.code || 'APPLICATION_ERROR',
      statusCode: err.statusCode || 500,
      ...err.details
    };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Prepare response
  const response = {
    error: message,
    code: error.code || 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Add additional error details in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = error.errors || error.details;
  }

  // Add correlation ID if available
  if (req.correlationId) {
    response.correlationId = req.correlationId;
  }

  // Special handling for specific status codes
  if (statusCode === 500) {
    // Log 500 errors as critical
    logger.error('Critical Error:', {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: req.userId || 'unauthenticated'
    });

    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'production') {
      response.error = 'Internal Server Error';
      response.code = 'INTERNAL_SERVER_ERROR';
      delete response.stack;
      delete response.details;
    }
  }

  res.status(statusCode).json(response);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, code, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

class PaymentError extends AppError {
  constructor(message, details) {
    super(message, 400, 'PAYMENT_ERROR', details);
  }
}

class KYCError extends AppError {
  constructor(message, level) {
    super(message, 403, 'KYC_ERROR', { requiredLevel: level });
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  PaymentError,
  KYCError
};