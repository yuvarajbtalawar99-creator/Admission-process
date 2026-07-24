import express from 'express';
import * as grievanceController from '../controllers/grievance.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { submitGrievanceSchema } from '../validators/grievance.validator';

const router = express.Router();

// Apply authMiddleware to all grievance routes
router.use(authMiddleware);

router.get('/', grievanceController.getStudentGrievances);
router.post('/lodge', validateRequest(submitGrievanceSchema), grievanceController.submitGrievance);

export default router;
