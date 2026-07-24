import express from 'express';
import * as feeController from '../controllers/fee.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { payFeeSchema } from '../validators/fee.validator';
import { sensitiveOpLimiter } from '../middleware/rateLimit.middleware';

const router = express.Router();

// Protect all fee endpoints
router.use(authMiddleware);

router.get('/', feeController.getStudentFees);
router.post('/:feeId/pay', sensitiveOpLimiter, validateRequest(payFeeSchema), feeController.makeFeePayment);

export default router;
