import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter applied to all `/api` routes.
 * Max 1000 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP. Please try again later.',
  },
});

/**
 * Strict rate limiter for authentication endpoints (login, register).
 * Max 10 attempts per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  skipSuccessfulRequests: false,
});

/**
 * Moderate rate limiter for token refresh endpoint.
 * Max 20 attempts per 15 minutes per IP.
 */
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many refresh attempts. Please try again shortly.',
  },
});

/**
 * Strict rate limiter for sensitive operations:
 * - Fee payments
 * - Marks updates
 * - Credential dispatch
 * Max 30 attempts per 15 minutes per IP.
 */
export const sensitiveOpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many sensitive operations requested from this IP. Please try again after 15 minutes.',
  },
});
