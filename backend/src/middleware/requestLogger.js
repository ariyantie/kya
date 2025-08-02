const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { auditLogger } = require('../utils/logger');

const requestLogger = (req, res, next) => {
  // Generate correlation ID for request tracking
  req.correlationId = uuidv4();
  
  // Add correlation ID to response headers
  res.set('X-Correlation-ID', req.correlationId);
  
  // Start time for performance tracking
  req.startTime = Date.now();
  
  // Log incoming request
  const requestInfo = {
    correlationId: req.correlationId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    referer: req.get('Referer'),
    timestamp: new Date().toISOString()
  };
  
  // Add user info if authenticated
  if (req.userId) {
    requestInfo.userId = req.userId;
  }
  
  // Add device info if available
  const deviceId = req.get('X-Device-ID');
  const platform = req.get('X-Platform');
  const appVersion = req.get('X-App-Version');
  
  if (deviceId || platform || appVersion) {
    requestInfo.device = {
      deviceId,
      platform,
      appVersion
    };
  }
  
  logger.info('Incoming Request:', requestInfo);
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const responseTime = Date.now() - req.startTime;
    
    const responseInfo = {
      correlationId: req.correlationId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: JSON.stringify(body).length,
      userId: req.userId || null,
      timestamp: new Date().toISOString()
    };
    
    // Log response (with different levels based on status code)
    if (res.statusCode >= 500) {
      logger.error('Response Error:', responseInfo);
    } else if (res.statusCode >= 400) {
      logger.warn('Response Warning:', responseInfo);
    } else {
      logger.info('Response:', responseInfo);
    }
    
    // Log sensitive operations for audit
    if (shouldAuditLog(req, res)) {
      auditLogger.info('Audit Log:', {
        ...responseInfo,
        operation: getOperationType(req),
        requestBody: sanitizeRequestBody(req.body),
        responseBody: sanitizeResponseBody(body)
      });
    }
    
    return originalJson.call(this, body);
  };
  
  // Override res.send for non-JSON responses
  const originalSend = res.send;
  res.send = function(body) {
    const responseTime = Date.now() - req.startTime;
    
    const responseInfo = {
      correlationId: req.correlationId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: typeof body === 'string' ? body.length : 0,
      userId: req.userId || null,
      timestamp: new Date().toISOString()
    };
    
    if (res.statusCode >= 500) {
      logger.error('Response Error:', responseInfo);
    } else if (res.statusCode >= 400) {
      logger.warn('Response Warning:', responseInfo);
    } else {
      logger.info('Response:', responseInfo);
    }
    
    return originalSend.call(this, body);
  };
  
  next();
};

// Determine if request should be audit logged
const shouldAuditLog = (req, res) => {
  const sensitiveOperations = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/loans',
    '/api/payments',
    '/api/users/profile',
    '/api/admin'
  ];
  
  const sensitiveActions = ['POST', 'PUT', 'DELETE', 'PATCH'];
  
  // Log all authentication operations
  if (req.originalUrl.includes('/api/auth/')) {
    return true;
  }
  
  // Log all admin operations
  if (req.originalUrl.includes('/api/admin/')) {
    return true;
  }
  
  // Log sensitive operations
  if (sensitiveActions.includes(req.method)) {
    return sensitiveOperations.some(path => req.originalUrl.includes(path));
  }
  
  // Log failed requests
  if (res.statusCode >= 400) {
    return true;
  }
  
  return false;
};

// Get operation type for audit logging
const getOperationType = (req) => {
  const url = req.originalUrl;
  const method = req.method;
  
  // Authentication operations
  if (url.includes('/api/auth/login')) return 'USER_LOGIN';
  if (url.includes('/api/auth/register')) return 'USER_REGISTER';
  if (url.includes('/api/auth/logout')) return 'USER_LOGOUT';
  if (url.includes('/api/auth/refresh')) return 'TOKEN_REFRESH';
  if (url.includes('/api/auth/forgot-password')) return 'PASSWORD_RESET_REQUEST';
  if (url.includes('/api/auth/reset-password')) return 'PASSWORD_RESET';
  
  // User operations
  if (url.includes('/api/users/profile') && method === 'PUT') return 'PROFILE_UPDATE';
  if (url.includes('/api/users/verification')) return 'VERIFICATION_UPDATE';
  if (url.includes('/api/users/documents')) return 'DOCUMENT_UPLOAD';
  
  // Loan operations
  if (url.includes('/api/loans') && method === 'POST') return 'LOAN_APPLICATION';
  if (url.includes('/api/loans') && method === 'PUT') return 'LOAN_UPDATE';
  if (url.includes('/api/loans') && url.includes('/approve')) return 'LOAN_APPROVAL';
  if (url.includes('/api/loans') && url.includes('/reject')) return 'LOAN_REJECTION';
  if (url.includes('/api/loans') && url.includes('/disburse')) return 'LOAN_DISBURSEMENT';
  
  // Payment operations
  if (url.includes('/api/payments') && method === 'POST') return 'PAYMENT_INITIATION';
  if (url.includes('/api/payments') && url.includes('/confirm')) return 'PAYMENT_CONFIRMATION';
  if (url.includes('/api/payments') && url.includes('/refund')) return 'PAYMENT_REFUND';
  
  // Admin operations
  if (url.includes('/api/admin/users') && method === 'PUT') return 'ADMIN_USER_UPDATE';
  if (url.includes('/api/admin/loans')) return 'ADMIN_LOAN_MANAGEMENT';
  if (url.includes('/api/admin/settings')) return 'ADMIN_SETTINGS_UPDATE';
  
  return 'GENERAL_OPERATION';
};

// Sanitize request body for logging (remove sensitive fields)
const sanitizeRequestBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  
  const sensitiveFields = [
    'password', 'pin', 'auth.password', 'auth.pin',
    'cardNumber', 'cvv', 'expiryDate',
    'accountNumber', 'routingNumber',
    'ssn', 'socialSecurityNumber', 'taxId'
  ];
  
  const sanitized = { ...body };
  
  sensitiveFields.forEach(field => {
    if (field.includes('.')) {
      const parts = field.split('.');
      let obj = sanitized;
      for (let i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]]) {
          obj = obj[parts[i]];
        } else {
          break;
        }
      }
      if (obj && obj[parts[parts.length - 1]]) {
        obj[parts[parts.length - 1]] = '[REDACTED]';
      }
    } else if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

// Sanitize response body for logging
const sanitizeResponseBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  
  const sensitiveFields = [
    'password', 'pin', 'token', 'refreshToken',
    'cardNumber', 'cvv', 'accountNumber',
    'ssn', 'socialSecurityNumber', 'taxId'
  ];
  
  const sanitized = { ...body };
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  // Sanitize nested user objects
  if (sanitized.user && typeof sanitized.user === 'object') {
    sensitized.user = sanitizeRequestBody(sanitized.user);
  }
  
  return sanitized;
};

module.exports = requestLogger;