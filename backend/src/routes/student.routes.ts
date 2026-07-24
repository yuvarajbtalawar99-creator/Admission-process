import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import * as studentController from '../controllers/student.controller';

const router = express.Router();

// All routes are protected and restricted to STUDENT role
router.use(authMiddleware);
router.use(authorizeRoles('STUDENT'));

router.get('/dashboard', studentController.getStudentDashboard);
router.get('/profile', studentController.getStudentProfile);
router.put('/profile', studentController.updateProfile);
router.get('/attendance', studentController.getStudentAttendanceOverall);
router.get('/attendance/:subjectId', studentController.getSubjectAttendance);
router.get('/marks', studentController.getStudentMarksOverall);
router.get('/marks/:subjectId', studentController.getMarksHistory);
router.get('/exam/hallticket/:examId', studentController.downloadHallTicket);

export default router;