import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';

import { corsConfig } from './middleware/corsConfig.middleware';
import { globalLimiter } from './middleware/rateLimit.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { idempotencyMiddleware } from './middleware/idempotency.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';

import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import adminRoutes from './routes/admin.routes';
import adminOfficeRouter from './routes/admin-office.routes';
import { getBranches } from './controllers/admission.controller';
import { studentRouter, applicationRouter, adminAdmissionRouter } from './routes/admission.routes';
import principalRoutes from './routes/principal.routes';
import hodRoutes from './routes/hod.routes';
import feeRoutes from './routes/fee.routes';
import grievanceRoutes from './routes/grievance.routes';
const app: Application = express();

// Trust first proxy hop (e.g. Nginx, Load Balancer)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 1. CORS Configuration (Perimeter Defense)
app.use(corsConfig);

// 2. Rate Limiting (Perimeter Defense)
app.use('/api', globalLimiter);

// 3. Structured Request Logging (Correlation ID & Latency tracking)
app.use(loggingMiddleware);

// 4. Body & Cookie Parsers (Must run before idempotency and routing)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Idempotency Guard (Mutation double-submit protection)
app.use('/api', idempotencyMiddleware);

// ── Serve uploaded files as static ────────────────────────────────────────────
// Files are stored at <project_root>/uploads/ and served at /uploads/:filename
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'College ERP API Server is running',
    timestamp: new Date()
  });
});
// ── API Routes ────────────────────────────────────────────────────────────────

// Auth
app.use('/api/auth', authRoutes);

// Branches list (public-ish, used by admission Step 1)
app.get('/api/branches', getBranches as any);

// Districts list (used by admission Step 4 dropdown)
app.get('/api/address/districts', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: [
      { id: '1', name: 'Bagalkot' },
      { id: '2', name: 'Ballari (Bellary)' },
      { id: '3', name: 'Belagavi (Belgaum)' },
      { id: '4', name: 'Bengaluru (Bangalore) Rural' },
      { id: '5', name: 'Bengaluru (Bangalore) Urban' },
      { id: '6', name: 'Bidar' },
      { id: '7', name: 'Chamarajanagar' },
      { id: '8', name: 'Chikkaballapur' },
      { id: '9', name: 'Chikkamagaluru (Chikmagalur)' },
      { id: '10', name: 'Chitradurga' },
      { id: '11', name: 'Dakshina Kannada' },
      { id: '12', name: 'Davanagere' },
      { id: '13', name: 'Dharwad' },
      { id: '14', name: 'Gadag' },
      { id: '15', name: 'Hassan' },
      { id: '16', name: 'Haveri' },
      { id: '17', name: 'Kalaburagi (Gulbarga)' },
      { id: '18', name: 'Kodagu (Coorg)' },
      { id: '19', name: 'Kolar' },
      { id: '20', name: 'Koppal' },
      { id: '21', name: 'Mandya' },
      { id: '22', name: 'Mysuru (Mysore)' },
      { id: '23', name: 'Raichur' },
      { id: '24', name: 'Ramanagara' },
      { id: '25', name: 'Shivamogga (Shimoga)' },
      { id: '26', name: 'Tumakuru (Tumkur)' },
      { id: '27', name: 'Udupi' },
      { id: '28', name: 'Uttara Kannada (Karwar)' },
      { id: '29', name: 'Vijayapura (Bijapur)' },
      { id: '30', name: 'Yadgir' }
    ]
  });
});

// Existing student ERP routes (attendance, marks, etc.)
app.use('/api/students', studentRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/grievances', grievanceRoutes);

// ─── Admission System ────────────────────────────────────────────────────────
// Student form steps:  /api/student/create  /api/student/personal  etc.
app.use('/api/student', studentRouter);

// Application endpoints: /api/application/full-details  /api/application/download-pdf
app.use('/api/application', applicationRouter);

// Admin admission management: /api/admin/admissions  /api/admin/admissions/:id
app.use('/api/admin', adminAdmissionRouter);

// Admin office (HODs, Parents, Notifications, Tickets)
app.use('/api/admin', adminOfficeRouter);

// Admin dashboard + profile: /api/admin/stats  /api/admin/profile
app.use('/api/admin', adminRoutes);

// Principal Dashboard routes
app.use('/api/principal', principalRoutes);

// HOD Dashboard routes
app.use('/api/hod', hodRoutes);

// ── Global 404 handler ────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
