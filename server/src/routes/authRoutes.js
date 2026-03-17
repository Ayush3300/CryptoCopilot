import { Router } from 'express';
import { login, metamaskLogin, signup } from '../controllers/authController.js';

const router = Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/metamask', metamaskLogin);

export default router;
