import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { uploadDocuments } from '../middleware/upload.middleware';
import * as admissionController from '../controllers/admission.controller';

const router = express.Router();

// ─── Public ──────────────────────────────────────────────────────────────────
// Branches list (used by Step 1 dropdown — accessible to logged-in students)
router.get('/branches', authMiddleware, admissionController.getBranches);

// ─── Student Routes ───────────────────────────────────────────────────────────
const studentRouter = express.Router();
studentRouter.use(authMiddleware);
studentRouter.use(authorizeRoles('STUDENT'));

studentRouter.get('/my-admission', admissionController.getMyAdmission);
studentRouter.get('/step-status', admissionController.getStepStatus);

// Form steps
studentRouter.post('/create', admissionController.saveStep1);         // Step 1
studentRouter.put('/personal', admissionController.saveStep2);        // Step 2
studentRouter.put('/parent', admissionController.saveStep3);           // Step 3
studentRouter.put('/address', admissionController.saveStep4);          // Step 4
studentRouter.put('/academic', admissionController.saveStep5);         // Step 5
studentRouter.post('/documents', uploadDocuments, admissionController.saveStep6); // Step 6
studentRouter.post('/submit', admissionController.submitApplication);  // Step 7

// Uniqueness checks
studentRouter.post('/check-aadhaar', admissionController.checkAadhaar);
studentRouter.post('/check-cet', admissionController.checkCet);

// ─── Application routes (student) ─────────────────────────────────────────────
const applicationRouter = express.Router();
applicationRouter.use(authMiddleware);
applicationRouter.use(authorizeRoles('STUDENT'));

applicationRouter.get('/full-details', admissionController.getFullDetails);
applicationRouter.get('/download-pdf', admissionController.downloadPDF);

// ─── Admin Routes ─────────────────────────────────────────────────────────────
const adminAdmissionRouter = express.Router();
adminAdmissionRouter.use(authMiddleware);
adminAdmissionRouter.use(authorizeRoles('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'));

adminAdmissionRouter.get('/admissions', admissionController.listAdmissions);
adminAdmissionRouter.get('/admissions/:id/documents/:field', admissionController.viewAdmissionDocument);
adminAdmissionRouter.get('/admissions/:id', admissionController.getAdmissionById);
adminAdmissionRouter.put('/admissions/:id/status', admissionController.updateAdmissionStatus);
adminAdmissionRouter.put('/admissions/:id/verify', admissionController.verifyAdmissionChecklist);
adminAdmissionRouter.get('/stats', admissionController.getAdminStats);

export { studentRouter, applicationRouter, adminAdmissionRouter };
export default router;
