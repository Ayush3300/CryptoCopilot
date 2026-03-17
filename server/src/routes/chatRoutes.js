import { Router } from 'express';
import { chatHistory, sendChat } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/auth.js';
import { chatRateLimiter } from '../middleware/rateLimit.js';

const router = Router();
router.post('/', authMiddleware, chatRateLimiter, sendChat);
router.get('/history', authMiddleware, chatHistory);

export default router;
