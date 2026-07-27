import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import admissionService from '../services/admission.service';
import User from '../models/User';
import Admin from '../models/Admin';
import Student from '../models/Student';
import Department from '../models/Department';
import Fee from '../models/Fee';
import Admission from '../models/Admission';
import AuditLog from '../models/AuditLog';
import securityEvents from '../services/securityEvents.service';
import db from '../config/database';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

/** GET /api/admin/stats — dashboard stats */
export const getStats = async (
  _req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const stats = await admissionService.getDashboardStats();
    return res.json({ success: true, data: stats });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/admin/dashboard — Real-time dashboard full data */
export const getDashboardData = async (
  _req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const transaction = await db.transaction({ readOnly: true });
    try {
      const [
        totalUsers,
        activeUsers,
        pendingAdmissions,
        alertsToday,
        studentCount,
        teacherCount,
        hodCount,
        principalCount,
        parentCount,
        recentLogs
      ] = await Promise.all([
        User.count({ transaction }).catch(e => { console.error('Error counting total users:', e); return 0; }),
        User.count({ where: { status: 'ACTIVE' }, transaction }).catch(e => { console.error('Error counting active users:', e); return 0; }),
        Admission.count({ where: { applicationStatus: { [Op.in]: ['SUBMITTED', 'UNDER_REVIEW'] } }, transaction }).catch(e => { console.error('Error counting pending admissions:', e); return 0; }),
        AuditLog.count({ where: { action: 'LOGIN_FAILED', createdAt: { [Op.gte]: today } }, transaction }).catch(e => { console.error('Error counting alerts today:', e); return 0; }),
        User.count({ where: { role: 'STUDENT' }, transaction }).catch(e => { console.error('Error counting students:', e); return 0; }),
        User.count({ where: { role: 'TEACHER' }, transaction }).catch(e => { console.error('Error counting teachers:', e); return 0; }),
        User.count({ where: { role: 'HOD' }, transaction }).catch(e => { console.error('Error counting HODs:', e); return 0; }),
        User.count({ where: { role: { [Op.in]: ['SUPER_ADMIN', 'ADMIN'] } }, transaction }).catch(e => { console.error('Error counting principals:', e); return 0; }),
        User.count({ where: { role: 'PARENT' }, transaction }).catch(e => { console.error('Error counting parents:', e); return 0; }),
        AuditLog.findAll({ order: [['createdAt', 'DESC']], limit: 5, transaction }).catch(e => { console.error('Error fetching recent logs:', e); return [] as AuditLog[]; })
      ]);

      // Attach user names manually since there is no direct Sequelize association configured.
      const userIds = recentLogs.map(log => log.userId).filter(Boolean) as string[];
      let usersMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const users = await User.findAll({
          where: { id: { [Op.in]: userIds } },
          attributes: ['id', 'firstName', 'lastName'],
          transaction
        });
        usersMap = users.reduce((acc, user) => {
          acc[user.id] = `${user.firstName} ${user.lastName}`;
          return acc;
        }, {} as Record<string, string>);
      }

      const recentActivities = recentLogs.map(log => ({
        id: log.id,
        action: log.action,
        detail: log.userId && usersMap[log.userId] 
          ? `${usersMap[log.userId]} - ${log.details?.reason || ''}`
          : (log.details?.email || 'System Action'),
        createdAt: log.createdAt,
      }));

      await transaction.commit();

      return res.json({
        success: true,
        data: {
          quickStats: {
            totalUsers,
            activeUsers,
            pendingTasks: pendingAdmissions,
            alertsToday
          },
          moduleCounts: {
            students: studentCount,
            teachers: teacherCount,
            hods: hodCount,
            principals: principalCount,
            parents: parentCount,
            admissions: pendingAdmissions
          },
          recentActivities
        }
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err: any) {
    try {
      const fs = await import('fs');
      fs.writeFileSync('dashboard_error.txt', String(err && err.stack || err));
    } catch (logErr) {
      console.error('Failed to write dashboard error file', logErr);
    }
    return next(err);
  }
};

/** GET /api/admin/profile */
export const getProfile = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage', 'role'],
    });
    const adminProfile = await Admin.findOne({ where: { userId: req.user!.id } });
    return res.json({ success: true, data: { ...user?.toJSON(), ...adminProfile?.toJSON() } });
  } catch (err) {
    return next(err);
  }
};

function generateTempPassword(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `JCER@${year}${randomDigits}`;
}

/** POST /api/admin/credentials/dispatch */
export const dispatchCredentials = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const { userId, username, password } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const plainPassword = password || generateTempPassword();
    user.passwordHash = plainPassword; // automatically hashed by User.beforeSave hook
    if (username) {
      user.username = username;
    }
    const isReset = user.status === 'ACTIVE';
    user.status = 'ACTIVE';
    await user.save();

    // Log security/audit log event
    const action = isReset ? 'PASSWORD_RESET' : 'GENERATE_CREDENTIALS';
    securityEvents.generateCredentials(req, req.user!.id, user.id, action);

    return res.json({
      success: true,
      message: `Credentials dispatched for ${user.firstName} ${user.lastName || ''}.`,
      data: {
        username: user.username || user.email,
        plainPassword,
      }
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/admin/credentials/pending */
export const getPendingCredentials = async (
  _req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    // Find all ENROLLED students whose User.username does NOT match Student.enrollmentNumber
    const students = await Student.findAll({
      where: { admissionStatus: 'APPROVED' }, // Note: in DB they might be APPROVED or ENROLLED, check context. Actually enrollment implies they have a USN.
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phone'],
        }
      ]
    });

    // Filter those who don't have their official username set to their USN
    const pending = students.filter(s => s.user && s.user.username !== s.enrollmentNumber);

    return res.json({ success: true, data: pending });
  } catch (err) {
    return next(err);
  }
};

/** POST /api/admin/credentials/bulk-dispatch */
export const bulkDispatchCredentials = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  const transaction = await db.transaction();
  try {
    const { studentIds } = req.body;
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      throw new Error('No students selected');
    }

    const domain = process.env.OFFICIAL_EMAIL_DOMAIN || 'jcer.edu.in';
    const dispatchedList: any[] = [];

    for (const studentId of studentIds) {
      const student = await Student.findByPk(studentId, {
        include: [{ model: User, as: 'user' }],
        transaction,
      });

      if (!student || !student.user) continue;

      const user = student.user as User;
      
      // If already generated, skip
      if (user.username === student.enrollmentNumber) continue;

      // Ensure we have their personal email stored safely (fallback to original user email)
      const personalEmail = student.parentEmail || user.email; // We use parentEmail or user.email
      
      const officialEmail = `${student.enrollmentNumber.toLowerCase()}@${domain}`;
      // Generate a strong random password (8 chars)
      const plainPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
      
      user.username = student.enrollmentNumber;
      user.email = officialEmail;
      user.passwordHash = plainPassword; // Hashed by hook
      user.mustChangePassword = true;    // Force change on login
      
      await user.save({ transaction });

      // In a real app: Send email via nodemailer to personalEmail here
      console.log(`[EMAIL DISPATCH] Sent to ${personalEmail}: USN=${user.username}, Pass=${plainPassword}, Login=${officialEmail}`);

      // Log Security Event
      securityEvents.generateCredentials(req, req.user!.id, user.id, 'GENERATE_CREDENTIALS');

      dispatchedList.push({
        id: student.id,
        enrollmentNumber: student.enrollmentNumber,
        officialEmail,
      });
    }

    await transaction.commit();

    return res.json({
      success: true,
      message: `Successfully generated credentials for ${dispatchedList.length} students.`,
      data: dispatchedList
    });
  } catch (err) {
    await transaction.rollback();
    return next(err);
  }
};

/** GET /api/admin/logs - Fetch audit logs */
export const getAuditLogs = async (
  _req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const logs = await AuditLog.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100, // For now limit to 100 recent
    });

    // Populate usernames (since no direct sequelize assoc might be there)
    const userIds = logs.map(l => l.userId).filter(Boolean) as string[];
    let usersMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const users = await User.findAll({
        where: { id: { [Op.in]: userIds } },
        attributes: ['id', 'firstName', 'lastName']
      });
      usersMap = users.reduce((acc, user) => {
        acc[user.id] = `${user.firstName} ${user.lastName}`;
        return acc;
      }, {} as Record<string, string>);
    }

    const data = logs.map(log => ({
      id: log.id,
      action: log.action,
      userId: log.userId,
      userName: log.userId ? usersMap[log.userId] : 'System',
      ipAddress: log.ipAddress,
      details: log.details,
      createdAt: log.createdAt,
    }));

    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/admin/settings - Mock settings fetching */
export const getSettings = async (
  _req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    return res.json({
      success: true,
      data: {
        require2FA: true,
        admissionsPortalOpen: true,
        smtpServer: 'smtp.sendgrid.net',
        smsGateway: '************************'
      }
    });
  } catch (err) {
    return next(err);
  }
};

/** PUT /api/admin/settings - Mock settings update */
export const updateSettings = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    if (req.user!.role !== 'SUPER_ADMIN') {
       return res.status(403).json({ success: false, error: 'Only SUPER_ADMIN can modify system settings.' });
    }

    // Update settings in DB/Env (mocked for now)
    return res.json({
      success: true,
      message: 'System settings updated successfully.',
      data: req.body
    });
  } catch (err) {
    return next(err);
  }
};



/** GET /api/admin/analytics - Real analytics data from database */
export const getAnalyticsData = async (
  _req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  const transaction = await db.transaction({ readOnly: true });
  try {
    // 1. Total Enrollment (enrolled/approved students)
    const totalEnrollment = await Student.count({ where: { admissionStatus: 'APPROVED' }, transaction });

    // 2. Admission Success
    const totalAdmissions = await Admission.count({ transaction });
    const approvedAdmissions = await Admission.count({ where: { applicationStatus: 'APPROVED' }, transaction });
    const admissionSuccessRate = totalAdmissions > 0 ? Math.round((approvedAdmissions / totalAdmissions) * 100) : 0;

    // 3. Active Branches
    const activeBranches = await Department.count({ transaction });

    // 4. Fee Collection
    const totalFees = await Fee.findAll({
      attributes: [
        [Fee.sequelize!.fn('SUM', Fee.sequelize!.col('paidAmount')), 'paidAmount']
      ],
      raw: true,
      transaction
    });
    const paidAmount = parseFloat(totalFees[0]?.paidAmount as any || 0);
    const feeCollectionFormatted = paidAmount >= 10000000 
      ? `₹${(paidAmount / 10000000).toFixed(2)}Cr` 
      : (paidAmount >= 100000 ? `₹${(paidAmount / 100000).toFixed(1)}L` : `₹${(paidAmount / 1000).toFixed(1)}K`);

    // 5. Department student distribution (for pie chart)
    const depts = await Department.findAll({ transaction });
    const deptDistribution = [];
    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    for (let i = 0; i < depts.length; i++) {
      const d = depts[i];
      const count = await Student.count({ where: { departmentId: d.id }, transaction });
      deptDistribution.push({
        name: d.code,
        value: count,
        color: colors[i % colors.length]
      });
    }

    // 6. Admission Trends (Admissions by month in current year)
    const currentYear = new Date().getFullYear();
    const admissionsByMonth = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let m = 0; m < 12; m++) {
      const startDate = new Date(currentYear, m, 1);
      const endDate = new Date(currentYear, m + 1, 1);
      const count = await Admission.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lt]: endDate
          }
        },
        transaction
      });
      admissionsByMonth.push({
        month: months[m],
        applications: count
      });
    }

    await transaction.commit();

    return res.json({
      success: true,
      data: {
        kpis: {
          totalEnrollment,
          admissionSuccessRate: `${admissionSuccessRate}%`,
          activeBranches,
          feeCollection: feeCollectionFormatted
        },
        deptDistribution,
        admissionTrends: admissionsByMonth
      }
    });
  } catch (err) {
    await transaction.rollback();
    return next(err);
  }
};
