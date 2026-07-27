import express from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authLimiter, refreshLimiter } from '../middleware/rateLimit.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { changePasswordSchema } from '../validators/auth.validator';
import { loginSchema, registerSchema } from '../validators/auth.zod';

const router = express.Router();

router.post('/login', authLimiter, validateRequest(loginSchema), authController.login);
router.post('/register', authLimiter, validateRequest(registerSchema), authController.register);
router.post('/check-phone', authController.checkPhone);
router.post('/refresh-token', refreshLimiter, authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);
router.get('/status', authMiddleware, authController.status);
router.post('/change-password', authMiddleware, validateRequest(changePasswordSchema), authController.changePassword);

export default router;
