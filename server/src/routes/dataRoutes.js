import { Router } from 'express';
import { news, profile, rates, traderStream, traders } from '../controllers/dataController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.get('/news', news);
router.get('/traders', traders);
router.get('/traders/stream', traderStream);
router.get('/exchange/rates', rates);
router.get('/profile', authMiddleware, profile);

export default router;
