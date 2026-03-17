import rateLimit from 'express-rate-limit';

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { message: 'Too many chat requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
