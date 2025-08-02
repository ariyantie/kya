const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: 'Access denied. Invalid token format.',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user and check if account is active
      const user = await User.findById(decoded.id).select('-auth.password -security.refreshTokens');
      
      if (!user) {
        return res.status(401).json({
          error: 'Invalid token. User not found.',
          code: 'USER_NOT_FOUND'
        });
      }

      // Check if user account is active
      if (user.status !== 'active') {
        return res.status(403).json({
          error: 'Account is not active. Please contact support.',
          code: 'ACCOUNT_INACTIVE',
          status: user.status
        });
      }

      // Check if user is blacklisted
      if (user.riskProfile.blacklisted) {
        logger.warn(`Blacklisted user attempted access: ${user._id}`);
        return res.status(403).json({
          error: 'Account has been restricted. Please contact support.',
          code: 'ACCOUNT_BLACKLISTED'
        });
      }

      // Update last activity
      user.appInfo.lastActiveDate = new Date();
      user.security.lastLogin = new Date();
      user.security.lastLoginIP = req.ip;
      await user.save();

      // Add user to request object
      req.user = user;
      req.userId = user._id;
      req.userRole = decoded.role || 'user';
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token has expired. Please login again.',
          code: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token.',
          code: 'INVALID_TOKEN'
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal server error during authentication.',
      code: 'AUTH_ERROR'
    });
  }
};

// Admin role middleware
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      error: 'Access denied. Admin privileges required.',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};

// Manager role middleware
const managerMiddleware = (req, res, next) => {
  if (!['admin', 'manager'].includes(req.userRole)) {
    return res.status(403).json({
      error: 'Access denied. Manager privileges required.',
      code: 'MANAGER_REQUIRED'
    });
  }
  next();
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-auth.password -security.refreshTokens');
      
      if (user && user.status === 'active' && !user.riskProfile.blacklisted) {
        req.user = user;
        req.userId = user._id;
        req.userRole = decoded.role || 'user';
      }
    } catch (jwtError) {
      // Ignore JWT errors in optional auth
    }
    
    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};

// Verification level middleware
const requireVerificationLevel = (minLevel = 1) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    const userKycLevel = req.user.verification.kycLevel || 0;
    
    if (userKycLevel < minLevel) {
      return res.status(403).json({
        error: `KYC level ${minLevel} or higher required. Current level: ${userKycLevel}`,
        code: 'INSUFFICIENT_KYC_LEVEL',
        currentLevel: userKycLevel,
        requiredLevel: minLevel
      });
    }

    next();
  };
};

// Device tracking middleware
const deviceTrackingMiddleware = async (req, res, next) => {
  try {
    if (req.user) {
      const deviceInfo = {
        deviceId: req.header('X-Device-ID'),
        userAgent: req.header('User-Agent'),
        platform: req.header('X-Platform'),
        appVersion: req.header('X-App-Version')
      };

      // Update user's device info if provided
      let shouldSave = false;
      
      if (deviceInfo.deviceId && req.user.appInfo.deviceId !== deviceInfo.deviceId) {
        req.user.appInfo.deviceId = deviceInfo.deviceId;
        shouldSave = true;
      }
      
      if (deviceInfo.platform && req.user.appInfo.platform !== deviceInfo.platform) {
        req.user.appInfo.platform = deviceInfo.platform;
        shouldSave = true;
      }
      
      if (deviceInfo.appVersion && req.user.appInfo.appVersion !== deviceInfo.appVersion) {
        req.user.appInfo.appVersion = deviceInfo.appVersion;
        shouldSave = true;
      }

      if (shouldSave) {
        await req.user.save();
      }

      // Add device info to request
      req.deviceInfo = deviceInfo;
    }
    
    next();
  } catch (error) {
    logger.error('Device tracking middleware error:', error);
    next(); // Continue even if there's an error
  }
};

// Rate limiting by user
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();
  
  return (req, res, next) => {
    if (!req.userId) {
      return next();
    }

    const userId = req.userId.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }

    const requests = userRequests.get(userId);
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        code: 'USER_RATE_LIMIT_EXCEEDED'
      });
    }

    recentRequests.push(now);
    userRequests.set(userId, recentRequests);
    
    next();
  };
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  managerMiddleware,
  optionalAuth,
  requireVerificationLevel,
  deviceTrackingMiddleware,
  userRateLimit
};