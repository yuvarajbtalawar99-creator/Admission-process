import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import * as hodController from '../controllers/hod.controller';

const router = express.Router();

// Apply authorization check for all HOD endpoints
router.use(authMiddleware);
router.use(authorizeRoles('HOD'));

// Dashboard
router.get('/dashboard', hodController.getDashboardData);
router.get('/pending-actions', hodController.getPendingActions);

// Faculty
router.get('/faculty', hodController.getFacultyList);
router.post('/faculty/:id/evaluation', hodController.submitFacultyEvaluation);

// Leave Management
router.get('/leaves/pending', hodController.getPendingActions); // mapped for leaves too
router.put('/leaves/:id/approve', hodController.approveFacultyLeave);
router.put('/faculty/:id/approve-leave', hodController.approveFacultyLeave); // fallback alias

// Students
router.get('/students', hodController.getStudentList);
router.get('/students/at-risk', hodController.getStudentList); // mapped/filtered in controller

// Courses & Curriculum
router.get('/courses', hodController.getSubjectList);
router.put('/courses/:id/approve-change', hodController.approveCurriculumChange);

// Budget & Finance
router.get('/budget', hodController.getBudgetDetails);
router.post('/budget/request', hodController.submitBudgetRequest);

// Grievances
router.get('/grievances', hodController.getGrievances);
router.put('/grievances/:id/resolve', hodController.resolveGrievance);

export default router;
