import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';
import logger from '../utils/logger.util';
import { BadRequestError } from '../utils/error.util';

const IDEMPOTENCY_PREFIX = 'idempotency:';
const LOCK_TTL = 15; // 15 seconds lock while processing
const CACHE_TTL = 24 * 60 * 60; // Cache responses for 24 hours

export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const key = req.headers['x-idempotency-key'] as string;

  // Only apply idempotency to mutation requests (POST, PUT, PATCH, DELETE)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // If no key is provided, skip idempotency validation (or enforce it for specific endpoints)
  if (!key) {
    return next();
  }

  // Simple validation to ensure the idempotency key is structured (e.g. UUID-like or minimum length)
  if (key.length < 10) {
    return next(new BadRequestError('Invalid X-Idempotency-Key header length. Must be at least 10 characters.'));
  }

  const redisKey = `${IDEMPOTENCY_PREFIX}${key}`;

  try {
    const cached = await redisClient.get(redisKey);

    if (cached) {
      if (cached === 'PROCESSING') {
        // Another identical request is already running
        return res.status(409).json({
          error: 'Conflict. Request is already being processed. Please wait.',
        });
      }

      // Replay the cached response
      const parsed = JSON.parse(cached);
      logger.info(`Replaying cached response for idempotency key: ${key}`);
      return res.status(parsed.status).json(parsed.body);
    }

    // Set lock value to state that we are processing this request
    await redisClient.setex(redisKey, LOCK_TTL, 'PROCESSING');

    // Intercept response sending to cache the result
    const originalSend = res.send;
    res.send = function (body: any): Response {
      // Restore original send immediately to avoid recursion
      res.send = originalSend;

      // Only cache successful 2xx responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          let parsedBody = body;
          // body can be stringified JSON or a raw buffer
          if (typeof body === 'string') {
            try {
              parsedBody = JSON.parse(body);
            } catch (e) {
              // Not JSON, keep as string
            }
          }

          const responseToCache = JSON.stringify({
            status: res.statusCode,
            body: parsedBody,
          });

          // Cache final response with 24 hour TTL
          redisClient.setex(redisKey, CACHE_TTL, responseToCache).catch((err: any) => {
            logger.error(`Failed to cache idempotency response in Redis: ${err.message}`);
          });
        } catch (e: any) {
          logger.error(`Error parsing body for idempotency caching: ${e.message}`);
        }
      } else {
        // If request failed (4xx/5xx), delete the lock so the client can retry
        redisClient.del(redisKey).catch((err: any) => {
          logger.error(`Failed to release idempotency lock in Redis: ${err.message}`);
        });
      }

      return originalSend.call(this, body);
    };

    return next();
  } catch (error: any) {
    logger.error(`Idempotency middleware error: ${error.message}`);
    return next(error);
  }
};
