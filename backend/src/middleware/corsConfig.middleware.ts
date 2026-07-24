import cors from 'cors';

const IS_PROD = process.env.NODE_ENV === 'production';

// Retrieve allowed origins from environment
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

export const corsConfig = cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      origin.endsWith('.trycloudflare.com') ||
      origin.endsWith('.loca.lt') ||
      origin.endsWith('.ngrok-free.app') ||
      origin.includes('localhost') ||
      !IS_PROD
    ) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'x-correlation-id',
    'x-idempotency-key',
  ],
  exposedHeaders: ['x-correlation-id'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});
