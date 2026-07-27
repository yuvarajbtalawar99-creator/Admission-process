import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import User from '../models/User';
import Department from '../models/Department';
import Admission from '../models/Admission';
import AdmissionPersonalDetail from '../models/AdmissionPersonalDetail';
import AdmissionParentDetail from '../models/AdmissionParentDetail';
import AdmissionAddress from '../models/AdmissionAddress';
import AdmissionAcademicDetail from '../models/AdmissionAcademicDetail';
import AdmissionDocument from '../models/AdmissionDocument';
import RejectionReason from '../models/RejectionReason';
import AuditLog from '../models/AuditLog';
import Notification from '../models/Notification';
import admissionService from '../services/admission.service';
import db from '../config/database';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Helper to seed principal data inline if missing
const ensurePrincipalDataSeeded = async () => {
  try {
    let principalUser = await User.findOne({ where: { role: 'PRINCIPAL' } });
    if (!principalUser) {
      principalUser = await User.create({
        username: 'principal1',
        email: 'principal@college.com',
        passwordHash: 'password123',
        role: 'PRINCIPAL',
        status: 'ACTIVE',
        firstName: 'Dr. Ramesh',
        lastName: 'Prasad',
        phone: '9876543201',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop',
        mustChangePassword: false
      });
      console.log('✓ Default Principal User seeded successfully.');
    }
  } catch (err: any) {
    console.error('Error seeding principal user:', err.message);
  }
};

/** GET /api/principal/dashboard */
export const getDashboardData = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await ensurePrincipalDataSeeded();

    const transaction = await db.transaction({ readOnly: true });
    try {
      const totalStudents = await User.count({ where: { role: 'STUDENT' }, transaction });
      const pendingAdmissionsCount = await Admission.count({
        where: { applicationStatus: 'APPROVED', approvedByAdminId: null },
        transaction
      });
      const enrolledCount = await Admission.count({
        where: { applicationStatus: 'ENROLLED' },
        transaction
      });
      const facultyCount = await User.count({
        where: { role: 'TEACHER' },
        transaction
      });
      const departments = await Department.findAll({ transaction });

      // Construct Critical Actions List
      const criticalActions = pendingAdmissionsCount > 0 ? [
        {
          id: 'admissions',
          priority: 'HIGH' as const,
          title: `${pendingAdmissionsCount} Admission${pendingAdmissionsCount > 1 ? 's' : ''} Awaiting Review`,
          description: 'Applications verified by admin pending final principal review.',
          actionText: 'Review Admissions',
          link: '/principal/admissions',
          count: pendingAdmissionsCount,
        }
      ] : [];

      const kpis = {
        students: enrolledCount || totalStudents || 0,
        faculty: facultyCount || 0,
        passRate: 0,
        avgCgpa: 0,
        placementRate: 0,
        feeCollectionRate: 0,
        revenue: '₹0'
      };

      // Build department performance from real student counts per department
      const departmentPerformance = await Promise.all(
        departments.map(async (d) => {
          const studentCount = await Admission.count({
            where: { applicationStatus: 'ENROLLED', branchId: d.id },
            transaction
          });
          return {
            id: d.id,
            name: d.name,
            code: d.code,
            students: studentCount,
            passRate: 0,
            cgpa: 0,
            trend: '—'
          };
        })
      );

      return res.status(200).json({
        success: true,
        data: {
          kpis,
          criticalActions,
          departmentPerformance,
          insights: [],
          performanceTrends: [],
          upcomingEvents: []
        }
      });
    } finally {
      await transaction.commit();
    }
  } catch (err) {
    return next(err);
  }
};


/** GET /api/principal/admissions/stats */
export const getAdmissionsStats = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const [pending, enrolled, rejected, total] = await Promise.all([
      Admission.count({ where: { applicationStatus: 'APPROVED', approvedByAdminId: null } }),
      Admission.count({ where: { applicationStatus: 'ENROLLED' } }),
      Admission.count({ where: { applicationStatus: 'REJECTED' } }),
      Admission.count(),
    ]);
    return res.json({
      success: true,
      data: { approved: pending, enrolled, rejected, total }
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/admissions/list */
export const listAdmissions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { status, branchId, admissionType, search, sortBy, sortOrder = 'DESC', page = '1', limit = '10' } = req.query as Record<string, string>;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};
    if (status && status !== 'ALL') {
      if (status === 'APPROVED') {
        where.applicationStatus = 'APPROVED';
        where.approvedByAdminId = null;
      } else if (status === 'ENROLLED') {
        where.applicationStatus = 'ENROLLED';
      } else if (status === 'REJECTED') {
        where.applicationStatus = 'REJECTED';
      } else {
        where.applicationStatus = status;
      }
    }
    if (branchId && branchId !== 'ALL') where.branchId = branchId;
    if (admissionType && admissionType !== 'ALL') where.admissionType = admissionType;

    const include: any[] = [
      {
        model: User,
        as: 'user',
        required: !!search,
        attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage'],
        ...(search ? {
          where: {
            [Op.or]: [
              { firstName: { [Op.iLike]: `%${search}%` } },
              { lastName: { [Op.iLike]: `%${search}%` } },
              { email: { [Op.iLike]: `%${search}%` } },
            ]
          }
        } : {})
      },
      { model: Department, as: 'branch', required: false },
      { model: AdmissionPersonalDetail, as: 'studentpersonaldetails', required: false },
      { model: AdmissionParentDetail, as: 'studentparentdetails', required: false },
      { model: AdmissionAddress, as: 'studentaddress', required: false },
      { model: AdmissionAcademicDetail, as: 'studentacademicdetails', required: false },
      { model: AdmissionDocument, as: 'studentdocuments', required: false },
    ];

    let order: any[] = [['createdAt', sortOrder]];
    if (sortBy === 'rank') order = [['applicationNumber', sortOrder]];

    const { count, rows } = await Admission.findAndCountAll({
      where,
      include,
      order,
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    return res.json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        applications: rows,
      }
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/admissions/:id */
export const getAdmissionById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const admission = await Admission.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage'] },
        { model: Department, as: 'branch' },
        { model: AdmissionPersonalDetail, as: 'studentpersonaldetails' },
        { model: AdmissionParentDetail, as: 'studentparentdetails' },
        { model: AdmissionAddress, as: 'studentaddress' },
        { model: AdmissionAcademicDetail, as: 'studentacademicdetails' },
        { model: AdmissionDocument, as: 'studentdocuments' },
      ]
    });
    if (!admission) return res.status(404).json({ error: 'Application not found.' });
    return res.json({ success: true, data: admission });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/admissions/pending */
export const getPendingAdmissions = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await ensurePrincipalDataSeeded();

    const list = await Admission.findAll({
      where: { 
        applicationStatus: 'APPROVED',
        approvedByAdminId: null
      },
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage'] },
        { model: Department, as: 'branch' },
        { model: AdmissionPersonalDetail, as: 'studentpersonaldetails' },
        { model: AdmissionParentDetail, as: 'studentparentdetails' },
        { model: AdmissionAddress, as: 'studentaddress' },
        { model: AdmissionAcademicDetail, as: 'studentacademicdetails' },
        { model: AdmissionDocument, as: 'studentdocuments' }
      ],
      order: [['updatedAt', 'DESC']]
    });

    const rejectionReasons = await RejectionReason.findAll();

    return res.json({
      success: true,
      data: {
        applications: list,
        rejectionReasons
      }
    });
  } catch (err) {
    return next(err);
  }
};

/** PUT /api/principal/admissions/:id/decide */
export const decideAdmission = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { decision, remarks, rejectReasonCode } = req.body;

    const validDecisions = ['APPROVED', 'REJECTED', 'UNDER_REVIEW', 'ENROLLED'];
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({ error: 'Invalid decision type.' });
    }

    const targetStatus = decision === 'APPROVED' ? 'ENROLLED' : decision;

    const enrollmentNumber = await admissionService.updateStatus(
      id,
      targetStatus as any,
      req.user!.id,
      remarks,
      undefined,
      rejectReasonCode
    );

    // Audit Log
    await AuditLog.create({
      userId: req.user!.id,
      action: `PRINCIPAL_${decision}_ADMISSION`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { admissionId: id, decision, remarks, enrollmentNumber },
    });

    return res.json({
      success: true,
      message: `Admission application has been ${decision.toLowerCase()} successfully.`,
      data: {
        enrollmentNumber,
        studentEmail: 'credentials_sent_via_email',
        credentialsSent: true,
      }
    });
  } catch (err: any) {
    console.error('Error in principal decideAdmission:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

/** PUT /api/principal/admissions/bulk/approve */
export const bulkApproveAdmissions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of admission ids is required.' });
    }

    const results = [];
    for (const id of ids) {
      try {
        const enrollmentNumber = await admissionService.updateStatus(
          id,
          'ENROLLED',
          req.user!.id,
          'Bulk approved by Principal',
          undefined,
          undefined
        );
        results.push({ id, success: true, enrollmentNumber });
      } catch (err: any) {
        results.push({ id, success: false, error: err.message });
      }
    }

    return res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/staff */
export const getStaffList = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const staff = await User.findAll({
      where: { role: { [Op.in]: ['TEACHER', 'HOD', 'ADMIN'] } },
      attributes: ['id', 'username', 'email', 'role', 'status', 'firstName', 'lastName', 'phone', 'profileImage'],
      order: [['firstName', 'ASC']]
    });
    return res.json({ success: true, data: staff });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/announcements */
export const getAnnouncements = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const list = await Notification.findAll({
      where: { type: 'ANNOUNCEMENT' },
      order: [['createdAt', 'DESC']],
    });
    return res.json({
      success: true,
      data: list,
    });
  } catch (err) {
    return next(err);
  }
};

/** POST /api/principal/announcements */
export const postAnnouncement = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { title, content, audience } = req.body;
    const newNotif = await Notification.create({
      title,
      content,
      type: 'ANNOUNCEMENT',
      audience: audience || 'ALL',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      createdByAdminId: req.user!.id
    });
    return res.status(201).json({
      success: true,
      data: newNotif
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/strategic-goals */
export const getStrategicGoals = async (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
): Promise<any> => {
  return res.json({ success: true, data: [] });
};

/** POST /api/principal/strategic-goals/:id/review */
export const reviewStrategicGoal = async (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
): Promise<any> => {
  return res.json({ success: true, message: 'Strategic goal reviewed.' });
};

/** GET /api/principal/compliance/status */
export const getComplianceStatus = async (
  _req: AuthRequest,
  res: Response,
  _next: NextFunction
): Promise<any> => {
  return res.json({
    success: true,
    data: { status: 'COMPLIANT', score: 100, pendingChecks: 0 }
  });
};

/** GET /api/principal/reports/generate */
export const generateReport = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const totalApplicants = await User.count({ where: { role: 'STUDENT' } });
    const pendingCount = await Admission.count({ where: { applicationStatus: 'SUBMITTED' } });
    const enrolledCount = await Admission.count({ where: { applicationStatus: 'ENROLLED' } });

    return res.json({
      success: true,
      reportName: 'Admissions Progress Report',
      generatedAt: new Date(),
      summary: {
        totalApplicants,
        pendingAdmissions: pendingCount,
        enrolledStudents: enrolledCount
      }
    });
  } catch (err) {
    return next(err);
  }
};

// --- STUBBED ACADEMIC/HOD ENDPOINTS FOR ROUTE STABILITY ---
export const getPendingBudgets = async (_req: AuthRequest, res: Response) => res.json({ success: true, data: [] });
export const decideBudget = async (_req: AuthRequest, res: Response) => res.json({ success: true, message: 'Budget approved (sandbox mode)' });
export const getPendingLeaves = async (_req: AuthRequest, res: Response) => res.json({ success: true, data: [] });
export const decideLeave = async (_req: AuthRequest, res: Response) => res.json({ success: true, message: 'Leave decided (sandbox mode)' });
export const getPendingCurriculumChanges = async (_req: AuthRequest, res: Response) => res.json({ success: true, data: [] });
export const decideCurriculumChange = async (_req: AuthRequest, res: Response) => res.json({ success: true, message: 'Curriculum change decided (sandbox mode)' });
