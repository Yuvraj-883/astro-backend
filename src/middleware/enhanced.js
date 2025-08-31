// Better API Architecture with Versioning and Rate Limiting

// Install dependencies:
// npm install express-rate-limit express-slow-down helmet compression

import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import compression from 'compression';

// Rate limiting configuration
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different endpoints
export const rateLimiters = {
  general: createRateLimiter(15 * 60 * 1000, 100), // 100 requests per 15 minutes
  horoscope: createRateLimiter(60 * 1000, 20), // 20 requests per minute
  reviews: createRateLimiter(60 * 1000, 5), // 5 requests per minute for creating reviews
  enhanced: createRateLimiter(60 * 1000, 10), // 10 requests per minute for personalized features
};

// Speed limiting for intensive operations
export const speedLimiter = slowDown({
  windowMs: 60 * 1000, // 1 minute
  delayAfter: 10, // allow 10 requests per minute at full speed
  delayMs: 500 // add 500ms delay per request after limit
});

// API versioning middleware
export const apiVersioning = (req, res, next) => {
  const version = req.headers['api-version'] || req.query.version || 'v1';
  req.apiVersion = version;
  res.set('API-Version', version);
  next();
};

// Enhanced error handling
export const enhancedErrorHandler = (err, req, res, next) => {
  const error = {
    success: false,
    error: err.message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  // Add request ID for tracking
  if (req.id) {
    error.requestId = req.id;
  }

  // Different error responses based on environment
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
    error.details = err;
  }

  // Log error for monitoring
  console.error(`[${error.timestamp}] ${error.method} ${error.path} - ${err.message}`);

  // Set appropriate status code
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json(error);
};

// Request/Response logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Generate unique request ID
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.set('X-Request-ID', req.id);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

// CORS configuration
export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'API-Version', 'X-Request-ID']
};

// Security headers
export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  }),
  compression()
];

// API response wrapper
export const responseWrapper = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    const response = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      version: req.apiVersion || 'v1',
      requestId: req.id
    };

    // Add pagination info if present
    if (data && typeof data === 'object' && data.pagination) {
      response.pagination = data.pagination;
      response.data = data.data;
    }

    return originalJson.call(this, response);
  };

  next();
};

// Usage in main app:
/*
import express from 'express';
import cors from 'cors';
import {
  rateLimiters,
  speedLimiter,
  apiVersioning,
  enhancedErrorHandler,
  requestLogger,
  corsOptions,
  securityMiddleware,
  responseWrapper
} from './middleware/enhanced.js';

const app = express();

// Apply security middleware
app.use(securityMiddleware);

// Apply CORS
app.use(cors(corsOptions));

// Request logging and ID generation
app.use(requestLogger);

// API versioning
app.use('/api', apiVersioning);

// Response wrapper
app.use('/api', responseWrapper);

// Apply rate limiting
app.use('/api/v1', rateLimiters.general);
app.use('/api/v1/horoscope', rateLimiters.horoscope);
app.use('/api/v1/reviews', rateLimiters.reviews);
app.use('/api/v1/enhanced', rateLimiters.enhanced);

// Apply speed limiting for intensive operations
app.use('/api/v1/enhanced', speedLimiter);

// Your routes here...
app.use('/api/v1/horoscope', horoscopeRoutes);
app.use('/api/v1/personas', personaRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// Enhanced error handling (must be last)
app.use(enhancedErrorHandler);
*/
