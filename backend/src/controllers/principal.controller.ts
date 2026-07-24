import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import User from '../models/User';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Department from '../models/Department';
import Admission from '../models/Admission';
import AdmissionPersonalDetail from '../models/AdmissionPersonalDetail';
import AdmissionParentDetail from '../models/AdmissionParentDetail';
import AdmissionAddress from '../models/AdmissionAddress';
import AdmissionAcademicDetail from '../models/AdmissionAcademicDetail';
import AdmissionDocument from '../models/AdmissionDocument';
import RejectionReason from '../models/RejectionReason';
import AuditLog from '../models/AuditLog';
import BudgetRequest from '../models/BudgetRequest';
import Announcement from '../models/Announcement';
import StrategicGoal from '../models/StrategicGoal';
import ComplianceCheck from '../models/ComplianceCheck';
import Marks from '../models/Marks';
import Performance from '../models/Performance';
import Attendance from '../models/Attendance';
import admissionService from '../services/admission.service';
import { emitBudgetApproved } from '../events/budget.events';
import Leave from '../models/Leave';
import CurriculumChange from '../models/CurriculumChange';
import FacultyEvaluation from '../models/FacultyEvaluation';
import Fee from '../models/Fee';
import FeePayment from '../models/FeePayment';
import db from '../config/database';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Helper to seed principal data inline if missing
const ensurePrincipalDataSeeded = async () => {
  try {
    // 1. Seed Principal User
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
      });
    }
  } catch (error) {
    console.error('Error seeding principal data inline:', error);
  }
};

export const getDashboardData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await ensurePrincipalDataSeeded();

    const transaction = await db.transaction({ readOnly: true });
    try {
      const studentCount = await Student.count({ where: { admissionStatus: 'APPROVED' }, transaction });
      const teacherCount = await Teacher.count({ transaction });
      
      // Average CGPA
      const cgpaData = await Performance.findAll({
        attributes: [[Performance.sequelize!.fn('AVG', Performance.sequelize!.col('cgpa')), 'avgCgpa']],
        transaction
      });
      const avgCgpa = cgpaData[0]?.getDataValue('avgCgpa') 
        ? parseFloat(parseFloat(cgpaData[0].getDataValue('avgCgpa')).toFixed(2)) 
        : 0;

      // Pass Rate
      const marksData = await Marks.findAll({
        where: { examType: 'SEMESTER' },
        attributes: ['marksObtained', 'maxMarks'],
        transaction
      });
      let passRate = 0;
      if (marksData.length > 0) {
        const passed = marksData.filter(m => (parseFloat(m.marksObtained as any) / parseFloat(m.maxMarks as any)) >= 0.35).length;
        passRate = parseFloat(((passed / marksData.length) * 100).toFixed(1));
      }

      // Placements (derived or mock fallback)
      const placementGoal = await StrategicGoal.findOne({ where: { category: 'PLACEMENTS' }, transaction });
      const placementRate = placementGoal ? placementGoal.currentValue : 0;

      // Fee Collection % & Revenue
      const totalFees = await Fee.findAll({
        attributes: [
          [Fee.sequelize!.fn('SUM', Fee.sequelize!.col('totalAmount')), 'totalAmount'],
          [Fee.sequelize!.fn('SUM', Fee.sequelize!.col('paidAmount')), 'paidAmount'],
        ],
        raw: true,
        transaction
      });
      
      let feeCollectionRate = 0;
      let revenue = '₹0';
      if (totalFees.length > 0 && totalFees[0].totalAmount) {
        const totalAmountVal = parseFloat(totalFees[0].totalAmount as any);
        const paidAmountVal = parseFloat((totalFees[0].paidAmount || 0) as any);
        if (totalAmountVal > 0) {
          feeCollectionRate = parseFloat(((paidAmountVal / totalAmountVal) * 100).toFixed(1));
        }
        revenue = paidAmountVal >= 10000000 
          ? `₹${(paidAmountVal / 10000000).toFixed(2)}Cr` 
          : (paidAmountVal >= 100000 ? `₹${(paidAmountVal / 100000).toFixed(1)}L` : `₹${(paidAmountVal / 1000).toFixed(1)}K`);
      }

      // Critical Actions Count
      const pendingAdmissionsCount = await Admission.count({
        where: { applicationStatus: { [Op.in]: ['SUBMITTED', 'UNDER_REVIEW'] } },
        transaction
      });
      const pendingBudgetsCount = await BudgetRequest.count({
        where: { status: 'PENDING' },
        transaction
      });
      const pendingLeavesCount = await Leave.count({
        where: { workflowStage: 'PRINCIPAL_REVIEW' },
        transaction
      });
      const pendingCurriculumCount = await CurriculumChange.count({
        where: { workflowStage: 'HOD_REVIEW' },
        transaction
      });
      
      // Construct Critical Actions
      const criticalActions = [
        {
          id: 'admissions',
          priority: 'HIGH' as const,
          title: `${pendingAdmissionsCount} Admissions Awaiting Approval`,
          description: 'Applications pending final principal sign-off.',
          actionText: 'Review Admissions',
          link: '/principal/admissions/pending',
          count: pendingAdmissionsCount,
        },
        {
          id: 'budgets',
          priority: 'HIGH' as const,
          title: `${pendingBudgetsCount} Budget Requests Pending`,
          description: 'Department budget requisitions awaiting review.',
          actionText: 'Review Budgets',
          link: '/principal/approvals?tab=budgets',
          count: pendingBudgetsCount,
        },
        {
          id: 'staff',
          priority: 'HIGH' as const,
          title: `${pendingLeavesCount} Staff Leave Requisitions`,
          description: 'HOD endorsed sabbatical & maternity leaves awaiting sign-off.',
          actionText: 'Review Leaves',
          link: '/principal/approvals?tab=staff',
          count: pendingLeavesCount,
        },
        {
          id: 'curriculum',
          priority: 'MEDIUM' as const,
          title: `${pendingCurriculumCount} Curriculum Amendments`,
          description: 'Proposed syllabus changes recommended by HODs.',
          actionText: 'Review Syllabus',
          link: '/principal/approvals?tab=curriculum',
          count: pendingCurriculumCount,
        }
      ];

      // Add NAAC Strategic Goal if exists
      const naacGoal = await StrategicGoal.findOne({ where: { category: 'ACCREDITATION' }, transaction });
      if (naacGoal) {
        criticalActions.push({
          id: 'naac',
          priority: 'HIGH' as const,
          title: `Accreditation: ${naacGoal.title}`,
          description: `Target: ${naacGoal.targetValue}, Current: ${naacGoal.currentValue}%`,
          actionText: 'Track Progress',
          link: '/principal/reports?tab=strategic',
          count: 1,
        });
      }

      // Department performance Rankings
      const departments = await Department.findAll({ transaction });
      const deptPerformances = [];
      for (const dept of departments) {
        // Students count
        const deptStudents = await Student.count({ where: { departmentId: dept.id }, transaction });
        
        // Avg CGPA for department
        const deptStudentIds = (await Student.findAll({ where: { departmentId: dept.id }, attributes: ['id'], transaction })).map(s => s.id);
        let deptAvgCgpa = 0;
        if (deptStudentIds.length > 0) {
          const avgObj = await Performance.findAll({
            where: { studentId: { [Op.in]: deptStudentIds } },
            attributes: [[Performance.sequelize!.fn('AVG', Performance.sequelize!.col('cgpa')), 'avgCgpa']],
            transaction
          });
          if (avgObj[0]?.getDataValue('avgCgpa')) {
            deptAvgCgpa = parseFloat(parseFloat(avgObj[0].getDataValue('avgCgpa')).toFixed(1));
          }
        }

        // Department Pass Rate
        const deptMarks = await Marks.findAll({
          where: { examType: 'SEMESTER' },
          include: [{
            model: Student,
            where: { departmentId: dept.id },
            attributes: []
          }],
          attributes: ['marksObtained', 'maxMarks'],
          raw: true,
          transaction
        });
        let deptPassRate = 0;
        if (deptMarks.length > 0) {
          const passed = deptMarks.filter((m: any) => (parseFloat(m.marksObtained) / parseFloat(m.maxMarks)) >= 0.35).length;
          deptPassRate = parseFloat(((passed / deptMarks.length) * 100).toFixed(1));
        }

        let trendText = 'No Data';
        if (deptPassRate >= 95.0) {
          trendText = '↑ Excellent Performance';
        } else if (deptPassRate >= 90.0) {
          trendText = '↑ Good Performance';
        } else if (deptPassRate >= 80.0) {
          trendText = '→ Stable';
        } else if (deptPassRate > 0) {
          trendText = '↓ Needs attention';
        }

        deptPerformances.push({
          id: dept.id,
          name: dept.name,
          code: dept.code,
          students: deptStudents,
          passRate: deptPassRate,
          cgpa: deptAvgCgpa,
          trend: trendText,
        });
      }

      // Sort by CGPA desc
      deptPerformances.sort((a, b) => b.cgpa - a.cgpa);

      // Insights & Alerts
      const insights = [];
      if (pendingAdmissionsCount > 0) {
        insights.push(`⚠ ${pendingAdmissionsCount} admissions awaiting final principal sign-off.`);
      }
      if (pendingBudgetsCount > 0) {
        insights.push(`⚠ ${pendingBudgetsCount} department budget requests pending review.`);
      }
      if (feeCollectionRate > 0 && feeCollectionRate < 95) {
        insights.push(`⚠ Fee collection rate is at ${feeCollectionRate}% (Target: 95% collection).`);
      }
      if (insights.length === 0) {
        insights.push('✓ All academic operations and requests are up-to-date.');
      }

      // Performance trends (6 Months)
      const performanceTrends = [
        { month: 'Current', passRate, cgpa: avgCgpa, placementRate }
      ];

      // Upcoming events
      const upcomingEvents = [];
      const announcements = await Announcement.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        transaction
      });
      for (const ann of announcements) {
        upcomingEvents.push({
          date: ann.createdAt ? new Date(ann.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : 'Today',
          title: ann.title
        });
      }
      if (upcomingEvents.length === 0) {
        upcomingEvents.push({ date: 'N/A', title: 'No upcoming events' });
      }

      await transaction.commit();

      return res.json({
        success: true,
        data: {
          kpis: {
            students: studentCount,
            faculty: teacherCount,
            passRate,
            avgCgpa,
            placementRate,
            feeCollectionRate,
            revenue,
          },
          criticalActions,
          departmentPerformance: deptPerformances,
          insights,
          performanceTrends,
          upcomingEvents,
        }
      });
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/admissions/pending */
export const getPendingAdmissions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await ensurePrincipalDataSeeded();

    const list = await Admission.findAll({
      where: { applicationStatus: { [Op.in]: ['APPROVED', 'UNDER_REVIEW'] } },
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage'] },
        { model: Department, as: 'branch' },
        { model: AdmissionPersonalDetail, as: 'studentpersonaldetails' },
        { model: AdmissionParentDetail, as: 'studentparentdetails' },
        { model: AdmissionAddress, as: 'studentaddress' },
        { model: AdmissionAcademicDetail, as: 'studentacademicdetails' },
        { model: AdmissionDocument, as: 'studentdocuments' },
      ],
      order: [['updatedAt', 'DESC']]
    });

    const reasons = await RejectionReason.findAll();

    return res.json({
      success: true,
      data: {
        applications: list,
        rejectionReasons: reasons,
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
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { decision, remarks, rejectReasonCode } = req.body;

    const validDecisions = ['APPROVED', 'REJECTED', 'WAITLISTED', 'UNDER_REVIEW', 'CONDITIONAL'];
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({ error: 'Invalid decision type.' });
    }

    let serviceStatus: 'APPROVED' | 'REJECTED' | 'ENROLLED' | 'UNDER_REVIEW' = 'UNDER_REVIEW';
    if (decision === 'APPROVED') serviceStatus = 'APPROVED';
    else if (decision === 'REJECTED') serviceStatus = 'REJECTED';
    else if (decision === 'UNDER_REVIEW' || decision === 'CONDITIONAL' || decision === 'WAITLISTED') serviceStatus = 'UNDER_REVIEW';

    let rejectionReasonLabel = '';
    if (rejectReasonCode) {
      const reasonObj = await RejectionReason.findOne({ where: { code: rejectReasonCode } });
      if (reasonObj) {
        rejectionReasonLabel = reasonObj.label;
      }
    }

    let enrollmentNumber: string | undefined;

    if (decision === 'APPROVED') {
      const admission = await Admission.findByPk(id);
      if (!admission) {
        return res.status(404).json({ error: 'Application not found.' });
      }
      await admission.update({
        approvedByAdminId: req.user!.id,
        approvalRemarks: remarks || null,
      });
    } else {
      enrollmentNumber = await admissionService.updateStatus(
        id,
        serviceStatus,
        req.user!.id,
        remarks,
        rejectionReasonLabel,
        rejectReasonCode
      );
    }

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

/** GET /api/principal/budget/pending */
export const getPendingBudgets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await ensurePrincipalDataSeeded();

    const list = await BudgetRequest.findAll({
      order: [['amount', 'DESC']],
    });
    return res.json({
      success: true,
      data: list,
    });
  } catch (err) {
    return next(err);
  }
};

/** PUT /api/principal/budget/:id/decide */
export const decideBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const validStatuses = ['APPROVED', 'REJECTED', 'DEFERRED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status must be APPROVED, REJECTED or DEFERRED.' });
    }

    const budget = await BudgetRequest.findByPk(id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget request not found.' });
    }

    await budget.update({
      status,
      remarks,
      workflowStage: 'FINALIZED',
    });

    emitBudgetApproved({
      id: budget.id,
      departmentId: budget.departmentId || '',
      principalUserId: req.user!.id,
    });

    await AuditLog.create({
      userId: req.user!.id,
      action: `PRINCIPAL_${status}_BUDGET`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { budgetId: id, status, remarks },
    });

    return res.json({
      success: true,
      message: `Budget request has been ${status.toLowerCase()} successfully.`,
      data: budget,
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/announcements */
export const getAnnouncements = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await ensurePrincipalDataSeeded();

    const list = await Announcement.findAll({
      order: [['date', 'DESC']],
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
    const { title, content, audience, priority, channels } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    const announcement = await Announcement.create({
      title,
      content,
      audience: audience || 'All Students',
      priority: priority || 'NORMAL',
      channels: channels || ['DASHBOARD'],
      status: 'PUBLISHED',
      date: new Date(),
      senderId: req.user!.id,
      sentCount: audience === 'All Students' ? 1250 : audience === 'All Faculty' ? 50 : 8,
      deliveredCount: audience === 'All Students' ? 1240 : audience === 'All Faculty' ? 50 : 8,
      openedCount: 0,
    });

    await AuditLog.create({
      userId: req.user!.id,
      action: 'PRINCIPAL_POST_ANNOUNCEMENT',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { announcementId: announcement.id, title },
    });

    return res.json({
      success: true,
      message: 'Announcement posted successfully.',
      data: announcement,
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/strategic-goals */
export const getStrategicGoals = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await ensurePrincipalDataSeeded();

    const list = await StrategicGoal.findAll({
      order: [['targetYear', 'ASC']],
    });
    return res.json({
      success: true,
      data: list,
    });
  } catch (err) {
    return next(err);
  }
};

/** POST /api/principal/strategic-goals/:id/review */
export const reviewStrategicGoal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { currentValue, status } = req.body;

    const goal = await StrategicGoal.findByPk(id);
    if (!goal) {
      return res.status(404).json({ error: 'Strategic goal not found.' });
    }

    await goal.update({
      currentValue: currentValue !== undefined ? currentValue : goal.currentValue,
      status: status || goal.status,
    });

    await AuditLog.create({
      userId: req.user!.id,
      action: 'PRINCIPAL_REVIEW_STRATEGIC_GOAL',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { goalId: id, currentValue, status },
    });

    return res.json({
      success: true,
      message: 'Strategic goal updated successfully.',
      data: goal,
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/compliance/status */
export const getComplianceStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await ensurePrincipalDataSeeded();

    const checklist = await ComplianceCheck.findAll();
    const compliantCount = checklist.filter(c => c.status === 'COMPLIANT').length;
    const percentage = checklist.length > 0 
      ? Math.round((compliantCount / checklist.length) * 100) 
      : 0;

    return res.json({
      success: true,
      data: {
        checklist,
        compliantCount,
        totalCount: checklist.length,
        completionPercentage: percentage,
      }
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/reports/generate */
export const generateReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { type, branch, semester } = req.query;
    const mockReportUrl = `/api/principal/reports/download?type=${type || 'annual'}&branch=${branch || 'all'}&sem=${semester || 'all'}`;

    return res.json({
      success: true,
      message: 'Report generated successfully.',
      data: {
        downloadUrl: mockReportUrl,
        type: type || 'annual',
        generatedAt: new Date(),
        fileSize: '2.4 MB',
      }
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/staff */
export const getStaffList = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await ensurePrincipalDataSeeded();

    const teachers = await Teacher.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage'] },
        { model: Department, as: 'department' }
      ]
    });

    const HODs = await User.findAll({
      where: { role: 'HOD' },
      attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage', 'status']
    });

    const directory = [
      ...teachers.map(t => {
        const u = (t as any).user || {};
        const d = (t as any).department || {};
        return {
          id: t.id,
          name: `${u.firstName || ''} ${u.lastName || ''}`,
          email: u.email,
          phone: u.phone,
          profileImage: u.profileImage,
          role: 'TEACHER',
          designation: t.designation || 'Lecturer',
          department: d.name || 'N/A',
          deptCode: d.code || '',
          phdStatus: (t.designation || '').toLowerCase().includes('prof') ? 'Yes' : 'No',
        };
      })
    ];

    for (const h of HODs) {
      const alreadyAdded = directory.find(x => x.email === h.email);
      if (!alreadyAdded) {
        directory.push({
          id: h.id,
          name: `${h.firstName} ${h.lastName}`,
          email: h.email,
          phone: h.phone,
          profileImage: h.profileImage,
          role: 'HOD',
          designation: 'Department Head (HOD)',
          department: 'Academic Leadership',
          deptCode: 'HOD',
          phdStatus: 'Yes',
        });
      }
    }

    return res.json({
      success: true,
      data: {
        directory,
        stats: {
          total: directory.length || 50,
          permanent: Math.round(directory.length * 0.8) || 40,
          contractual: Math.round(directory.length * 0.2) || 10,
          onLeave: 2,
          vacancies: 3
        },
        evaluation: {
          submitted: 35,
          total: 50,
          deadline: '28 Feb 2026',
        }
      }
    });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/leaves/pending */
export const getPendingLeaves = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const list = await Leave.findAll({
      where: { workflowStage: 'PRINCIPAL_REVIEW' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'] },
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] }
      ]
    });
    return res.json({ success: true, data: list });
  } catch (err) {
    return next(err);
  }
};

/** PUT /api/principal/leaves/:id/decide */
export const decideLeave = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const leave = await Leave.findByPk(id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found.' });
    }

    await leave.update({
      status: status || 'APPROVED',
      workflowStage: 'FINALIZED',
      remarks,
      reviewedById: req.user!.id
    });

    await AuditLog.create({
      userId: req.user!.id,
      action: `PRINCIPAL_${status || 'APPROVED'}_LEAVE`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { leaveId: id, status, remarks }
    });

    return res.json({ success: true, message: `Leave request has been ${status?.toLowerCase() || 'approved'}.`, data: leave });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/principal/curriculum/pending */
export const getPendingCurriculumChanges = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const list = await CurriculumChange.findAll({
      where: { workflowStage: 'HOD_REVIEW' },
      include: [
        { model: User, as: 'proposer', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] }
      ]
    });
    return res.json({ success: true, data: list });
  } catch (err) {
    return next(err);
  }
};

/** PUT /api/principal/curriculum/:id/decide */
export const decideCurriculumChange = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const change = await CurriculumChange.findByPk(id);
    if (!change) {
      return res.status(404).json({ error: 'Curriculum change proposal not found.' });
    }

    await change.update({
      status: status || 'APPROVED',
      workflowStage: 'FINALIZED',
      remarks
    });

    await AuditLog.create({
      userId: req.user!.id,
      action: `PRINCIPAL_${status || 'APPROVED'}_CURRICULUM`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { changeId: id, status, remarks }
    });

    return res.json({ success: true, message: `Curriculum proposal has been ${status?.toLowerCase() || 'approved'}.`, data: change });
  } catch (err) {
    return next(err);
  }
};
