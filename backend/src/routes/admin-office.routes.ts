import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import * as officeController from '../controllers/admin-office.controller';

const router = express.Router();

// Apply auth and base admin role check
router.use(authMiddleware);
router.use(authorizeRoles('ADMIN', 'SUPER_ADMIN'));

// ─── Notifications (Announcements) ───────────────────────────────────────────
router.get('/notifications', officeController.listNotifications);
router.post('/notifications', officeController.createDraftNotification); // Enforced in controller: ADMIN
router.put('/notifications/:id/publish', officeController.publishNotification); // Enforced in controller: SUPER_ADMIN

// ─── HODs ──────────────────────────────────────────────────────────────────
router.get('/hods', officeController.listHODs);
router.post('/hods', officeController.assignHOD); // Enforced in controller: SUPER_ADMIN

// ─── Messages (Official Communications / Tickets) ───────────────────────────
router.get('/tickets', officeController.listTickets);
router.put('/tickets/:id/resolve', officeController.resolveTicket);

// ─── Parents ───────────────────────────────────────────────────────────────
router.get('/parents', officeController.listParents);

export default router;
