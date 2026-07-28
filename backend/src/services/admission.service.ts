import { Op } from 'sequelize';
import Admission from '../models/Admission';
import AdmissionPersonalDetail from '../models/AdmissionPersonalDetail';
import AdmissionParentDetail from '../models/AdmissionParentDetail';
import AdmissionAddress from '../models/AdmissionAddress';
import AdmissionAcademicDetail from '../models/AdmissionAcademicDetail';
import AdmissionDocument from '../models/AdmissionDocument';
import Department from '../models/Department';
import User from '../models/User';
import Student from '../models/Student';
import RejectionReason from '../models/RejectionReason';
import db from '../config/database';
import { ForbiddenException } from '../utils/error.util';
import redisService from './redis.service';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Generate a unique application number like APP-2024-00001 */
async function generateApplicationNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await Admission.count();
  const seq = String(count + 1).padStart(5, '0');
  return `APP-${year}-${seq}`;
}



// ─── Full detail loader ──────────────────────────────────────────────────────

async function loadFullAdmission(admission: Admission) {
  const [
    user,
    branch,
    personal,
    parent,
    address,
    academic,
    documents
  ] = await Promise.all([
    User.findByPk(admission.userId, { attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage'] }),
    admission.branchId ? Department.findByPk(admission.branchId) : Promise.resolve(null),
    AdmissionPersonalDetail.findOne({ where: { admissionId: admission.id } }),
    AdmissionParentDetail.findOne({ where: { admissionId: admission.id } }),
    AdmissionAddress.findOne({ where: { admissionId: admission.id } }),
    AdmissionAcademicDetail.findOne({ where: { admissionId: admission.id } }),
    AdmissionDocument.findOne({ where: { admissionId: admission.id } }),
  ]);

  const rawAdmission = admission.get({ plain: true });
  rawAdmission.user = user ? (user.toJSON ? user.toJSON() : user) : null;
  rawAdmission.branch = branch ? (branch.toJSON ? branch.toJSON() : branch) : null;
  rawAdmission.studentpersonaldetails = personal ? (personal.toJSON ? personal.toJSON() : personal) : null;
  rawAdmission.studentparentdetails = parent ? (parent.toJSON ? parent.toJSON() : parent) : null;
  rawAdmission.studentaddress = address ? (address.toJSON ? address.toJSON() : address) : null;
  rawAdmission.studentacademicdetails = academic ? (academic.toJSON ? academic.toJSON() : academic) : null;
  rawAdmission.studentdocuments = documents ? (documents.toJSON ? documents.toJSON() : documents) : null;

  return rawAdmission;
}

function serializeAdmission(admission: any): any {
  if (!admission) return null;
  const data = admission.toJSON ? admission.toJSON() : JSON.parse(JSON.stringify(admission));
  if (data.studentacademicdetails) {
    const acad = data.studentacademicdetails;
    // Map tenth to sslc
    acad.sslcSchool = acad.tenthSchool;
    acad.sslcBoard = acad.tenthBoard;
    acad.sslcYear = acad.tenthPassingYear;
    acad.sslcRegisterNumber = acad.tenthRegisterNumber;
    acad.sslcMarksObtained = acad.tenthMarksObtained;
    acad.sslcMaxMarks = acad.tenthMaxMarks;
    acad.sslcPercentage = acad.tenthPercentage;
    acad.sslcAttempts = acad.tenthAttempts;

    // Map twelfth to puc
    acad.pucSchool = acad.twelfthSchool;
    acad.pucBoard = acad.twelfthBoard;
    acad.pucYear = acad.twelfthPassingYear;
    acad.pucRegisterNumber = acad.twelfthRegisterNumber;
    acad.pucStream = acad.twelfthStream;
    acad.physicsMarks = acad.physicsMarks;
    acad.mathsMarks = acad.mathsMarks;
    acad.chemistryMarks = acad.chemistryMarks;
    acad.optionalSubject = acad.optionalSubject;
    acad.optionalMarks = acad.optionalMarks;
    acad.pucMaxMarks = acad.twelfthMaxMarks;
    acad.pucAggregate = acad.twelfthAggregate;
    acad.pucPercentage = acad.twelfthPercentage;
    acad.pucAttempts = acad.twelfthAttempts;
  }
  return data;
}

// ─── Step Status ─────────────────────────────────────────────────────────────

function computeStepStatus(admission: any) {
  const pd = admission?.studentpersonaldetails;
  const par = admission?.studentparentdetails;
  const addr = admission?.studentaddress;
  const acad = admission?.studentacademicdetails;
  const docs = admission?.studentdocuments;

  const isLateral = admission?.qualification === 'DIPLOMA' || (!admission?.qualification && admission?.admissionType === 'DCET');

  const steps = [
    { step: 1, completed: !!(admission?.admissionType && admission?.aadhaar && admission?.branchId && admission?.qualification) },
    { step: 2, completed: !!(pd?.firstName && pd?.dateOfBirth && pd?.gender) },
    { step: 3, completed: !!(par?.fatherName && par?.fatherPhone) },
    { step: 4, completed: !!(addr?.currentAddressLine1 && addr?.currentCity && addr?.currentPincode) },
    // Diploma students fill Diploma details, not PUC/12th
    { step: 5, completed: isLateral
        ? !!(acad?.tenthPercentage && acad?.diplomaPercentage)
        : !!(acad?.tenthPercentage && acad?.twelfthPercentage) },
    { step: 6, completed: !!(docs?.photoUrl && docs?.tenthMarksheetUrl && docs?.feesPaidReceiptUrl) },
    { step: 7, completed: admission?.applicationStatus === 'SUBMITTED' },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const activeStepIndex = steps.findIndex((s) => !s.completed) + 1 || 7;

  // Map each step to COMPLETED | ACTIVE | LOCKED
  const stepStatus: Record<number, string> = {};
  for (let i = 1; i <= 7; i++) {
    if (steps[i - 1].completed) {
      stepStatus[i] = 'COMPLETED';
    } else if (i === activeStepIndex) {
      stepStatus[i] = 'ACTIVE';
    } else {
      stepStatus[i] = 'LOCKED';
    }
  }

  const timeline: any = {};
  if (admission?.submittedAt) {
    timeline.submittedAt = admission.submittedAt;
  }
  if (admission?.resubmittedAt) {
    timeline.resubmittedAt = admission.resubmittedAt;
  }
  
  if (['UNDER_REVIEW', 'APPROVED', 'ENROLLED', 'REJECTED'].includes(admission?.applicationStatus)) {
    timeline.reviewStartedAt = admission?.reviewedAt || admission?.updatedAt;
  }
  if (['APPROVED', 'ENROLLED'].includes(admission?.applicationStatus)) {
    timeline.documentsVerifiedAt = admission?.reviewedAt || admission?.updatedAt;
    timeline.approvedAt = admission?.reviewedAt || admission?.updatedAt;
  }
  if (admission?.applicationStatus === 'ENROLLED') {
    timeline.usnAssignedAt = admission?.reviewedAt || admission?.updatedAt;
  }
  if (admission?.applicationStatus === 'REJECTED') {
    timeline.rejectedAt = admission?.reviewedAt || admission?.updatedAt;
  }
  if (admission?.cancellationRequestedAt) {
    timeline.cancellationRequestedAt = admission.cancellationRequestedAt;
  }
  if (admission?.cancellationApprovedAt) {
    timeline.cancellationApprovedAt = admission.cancellationApprovedAt;
  }

  return {
    applicationStatus: admission?.applicationStatus || 'DRAFT',
    applicationNumber: admission?.applicationNumber || null,
    studentId: admission?.id || null,
    steps,
    stepStatus,
    completedCount,
    totalSteps: 7,
    progressPercent: Math.round((completedCount / 7) * 100),
    activeStepIndex,
    adminRemarks: admission?.adminRemarks || null,
    rejectionReason: admission?.rejectionReason || null,
    rejectionReasonCode: admission?.rejectionReasonCode || null,
    cancellationReason: admission?.cancellationReason || null,
    cancellationRemarks: admission?.cancellationRemarks || null,
    cancellationRequestedAt: admission?.cancellationRequestedAt || null,
    cancellationApprovedAt: admission?.cancellationApprovedAt || null,
    cancellationApprovedById: admission?.cancellationApprovedById || null,
    cancellationAdminRemarks: admission?.cancellationAdminRemarks || null,
    timeline,
  };
}

// ─── Service Methods ─────────────────────────────────────────────────────────

class AdmissionService {
  public async invalidateCache(userId: string): Promise<void> {
    await Promise.all([
      redisService.deleteCache(`admission:status:${userId}`),
      redisService.deleteCache(`admission:full:${userId}`),
      redisService.deleteCache('admin:stats'),
    ]);
  }

  public async invalidateCacheByAdmissionId(admissionId: string): Promise<void> {
    const admission = await Admission.findByPk(admissionId, { attributes: ['userId'] });
    if (admission) {
      await this.invalidateCache(admission.userId);
    }
  }

  private checkEditable(admission: Admission): void {
    if (admission.status !== 'DRAFT') {
      throw new ForbiddenException('Admission already submitted');
    }
  }

  /**
   * Get-or-create an Admission record for a user.
   * Called on first dashboard visit after registration.
   */
  async getOrCreate(userId: string): Promise<Admission> {
    // Resolve active admission by userId + status=DRAFT (DRAFT/REJECTED)
    let admission = await Admission.findOne({
      where: {
        userId,
        applicationStatus: { [Op.in]: ['DRAFT', 'REJECTED'] }
      }
    });

    // If no draft admission exists, fall back to any existing admission (e.g. submitted)
    if (!admission) {
      admission = await Admission.findOne({ where: { userId } });
    }

    if (!admission) {
      const applicationNumber = await generateApplicationNumber();
      admission = await Admission.create({
        userId,
        applicationNumber,
        applicationStatus: 'DRAFT',
      });
    }
    return admission;
  }

  /** Returns the minimal admission data (my-admission endpoint) */
  async getMyAdmission(userId: string): Promise<any> {
    const admission = await this.getOrCreate(userId);
    const full = await loadFullAdmission(admission);
    return serializeAdmission(full);
  }

  /** Lazy-loads step-specific details for individual form step rendering */
  async getStepData(userId: string, stepName: string): Promise<any> {
    const admission = await this.getOrCreate(userId);
    
    switch (stepName) {
      case 'admission':
      case 'details': {
        const data = await Admission.findOne({
          where: { id: admission.id },
          attributes: ['id', 'userId', 'applicationNumber', 'admissionType', 'branchId', 'aadhaar', 'cetNumber', 'dcetNumber', 'applicationStatus', 'qualification']
        });
        return data;
      }
      case 'personal': {
        const personal = await AdmissionPersonalDetail.findOne({
          where: { admissionId: admission.id },
          attributes: ['id', 'admissionId', 'firstName', 'middleName', 'lastName', 'caste', 'dateOfBirth', 'gender', 'category', 'religion', 'nationality', 'studiedInKarnataka', 'areaType']
        });
        const docs = await AdmissionDocument.findOne({
          where: { admissionId: admission.id },
          attributes: ['photoUrl']
        });
        const result = personal ? (personal.toJSON ? personal.toJSON() : JSON.parse(JSON.stringify(personal))) : {};
        result.photoUrl = docs?.photoUrl || null;
        return result;
      }
      case 'parent': {
        const data = await AdmissionParentDetail.findOne({
          where: { admissionId: admission.id },
          attributes: ['id', 'admissionId', 'fatherName', 'fatherPhone', 'fatherEmail', 'fatherOccupation', 'motherName', 'motherPhone', 'motherOccupation', 'fatherAnnualIncome']
        });
        return data;
      }
      case 'address': {
        const data = await AdmissionAddress.findOne({
          where: { admissionId: admission.id },
          attributes: ['id', 'admissionId', 'currentAddressLine1', 'currentCity', 'currentState', 'currentPincode', 'permanentAddressLine1', 'permanentCity', 'permanentState', 'permanentPincode']
        });
        return data;
      }
      case 'academic': {
        const academic = await AdmissionAcademicDetail.findOne({
          where: { admissionId: admission.id },
          attributes: [
            'id', 'admissionId', 'tenthSchool', 'tenthBoard', 'tenthPassingYear', 'tenthRegisterNumber', 'tenthMarksObtained', 'tenthMaxMarks', 'tenthPercentage', 'tenthAttempts', 'tenthSubjectMarks',
            'twelfthSchool', 'twelfthBoard', 'twelfthPassingYear', 'twelfthRegisterNumber', 'twelfthStream', 'physicsMarks', 'mathsMarks', 'chemistryMarks', 'optionalSubject', 'optionalMarks', 'twelfthMaxMarks', 'twelfthAggregate', 'twelfthPercentage', 'twelfthAttempts',
            'diplomaUniversity', 'diplomaYear', 'diplomaRegisterNumber', 'diplomaFinalYearMaxMarks', 'diplomaFinalYearObtained', 'diplomaPercentage', 'diplomaAttempts',
            'cetScore', 'cetRank', 'cetYear', 'hasGap', 'gapReason'
          ]
        });
        if (academic) {
          const data = (academic.toJSON ? academic.toJSON() : JSON.parse(JSON.stringify(academic))) as any;
          // Apply legacy mappings for compatibility
          data.sslcSchool = data.tenthSchool;
          data.sslcBoard = data.tenthBoard;
          data.sslcYear = data.tenthPassingYear;
          data.sslcRegisterNumber = data.tenthRegisterNumber;
          data.sslcMarksObtained = data.tenthMarksObtained;
          data.sslcMaxMarks = data.tenthMaxMarks;
          data.sslcPercentage = data.tenthPercentage;
          data.sslcAttempts = data.tenthAttempts;

          data.pucSchool = data.twelfthSchool;
          data.pucBoard = data.twelfthBoard;
          data.pucYear = data.twelfthPassingYear;
          data.pucRegisterNumber = data.twelfthRegisterNumber;
          data.pucStream = data.twelfthStream;
          data.pucMaxMarks = data.twelfthMaxMarks;
          data.pucAggregate = data.twelfthAggregate;
          data.pucPercentage = data.twelfthPercentage;
          data.pucAttempts = data.twelfthAttempts;
          return data;
        }
        return null;
      }
      case 'documents': {
        const data = await AdmissionDocument.findOne({
          where: { admissionId: admission.id },
          attributes: ['id', 'admissionId', 'photoUrl', 'signatureUrl', 'tenthMarksheetUrl', 'twelfthMarksheetUrl', 'cetScoreCardUrl', 'aadhaarUrl', 'casteCertificateUrl', 'domicileCertificateUrl', 'gapCertificateUrl']
        });
        return data;
      }
      default:
        throw new Error('Invalid step name');
    }
  }

  /** Returns step completion status for the StepIndicator component */
  async getStepStatus(userId: string): Promise<any> {
    const cacheKey = `admission:status:${userId}`;
    const cached = await redisService.getCache(cacheKey);
    if (cached) return cached;

    const admission = await this.getOrCreate(userId);
    const full = await loadFullAdmission(admission);
    const result = computeStepStatus(full);

    await redisService.setCache(cacheKey, result, 300); // 5 mins TTL
    return result;
  }

  /** Returns full details for Step 7 review & SubmittedView */
  async getFullDetails(userId: string): Promise<any> {
    const cacheKey = `admission:full:${userId}`;
    const cached = await redisService.getCache(cacheKey);
    if (cached) return cached;

    const admission = await this.getOrCreate(userId);
    const full = await loadFullAdmission(admission);
    const result = serializeAdmission(full);

    await redisService.setCache(cacheKey, result, 300); // 5 mins TTL
    return result;
  }

  // ── Step 1: Admission Details ─────────────────────────────────────────────

  async saveStep1(userId: string, payload: {
    admissionType: string;
    branchId: string | number;
    aadhaar: string;
    cetNumber?: string;
    dcetNumber?: string;
    qualification?: 'PUC' | 'DIPLOMA';
  }): Promise<string> {
    const admission = await this.getOrCreate(userId);
    this.checkEditable(admission);
    await admission.update({
      admissionType: payload.admissionType,
      branchId: payload.branchId ? String(payload.branchId) : null,
      aadhaar: payload.aadhaar,
      cetNumber: payload.cetNumber || null,
      dcetNumber: payload.dcetNumber || null,
      qualification: payload.qualification || null,
    });
    await this.invalidateCache(userId);
    return admission.id;
  }

  // ── Step 2: Personal Details ──────────────────────────────────────────────

  async saveStep2(userId: string, payload: Record<string, any>): Promise<string> {
    const admission = await this.getOrCreate(userId);
    this.checkEditable(admission);
    const existing = await AdmissionPersonalDetail.findOne({ where: { admissionId: admission.id } });
    if (existing) {
      await existing.update(payload);
    } else {
      await AdmissionPersonalDetail.create({ admissionId: admission.id, ...payload });
    }
    await this.invalidateCache(userId);
    return admission.id;
  }

  // ── Step 3: Parent Details ────────────────────────────────────────────────

  async saveStep3(userId: string, payload: Record<string, any>): Promise<string> {
    const admission = await this.getOrCreate(userId);
    this.checkEditable(admission);
    const existing = await AdmissionParentDetail.findOne({ where: { admissionId: admission.id } });
    if (existing) {
      await existing.update(payload);
    } else {
      await AdmissionParentDetail.create({ admissionId: admission.id, ...payload });
    }
    await this.invalidateCache(userId);
    return admission.id;
  }

  // ── Step 4: Address ───────────────────────────────────────────────────────

  async saveStep4(userId: string, payload: Record<string, any>): Promise<string> {
    const admission = await this.getOrCreate(userId);
    this.checkEditable(admission);
    const existing = await AdmissionAddress.findOne({ where: { admissionId: admission.id } });
    if (existing) {
      await existing.update(payload);
    } else {
      await AdmissionAddress.create({ admissionId: admission.id, ...payload });
    }
    await this.invalidateCache(userId);
    return admission.id;
  }

  // ── Step 5: Academic Details ──────────────────────────────────────────────

  async saveStep5(userId: string, payload: Record<string, any>): Promise<string> {
    const admission = await this.getOrCreate(userId);
    this.checkEditable(admission);
    const existing = await AdmissionAcademicDetail.findOne({ where: { admissionId: admission.id } });
    
    const q = (admission.qualification || '').toUpperCase();
    const showPUC = q === 'PUC' || (!q && admission.admissionType === 'KCET');
    const showDiploma = q === 'DIPLOMA' || (!q && admission.admissionType === 'DCET');

    const dbPayload = {
      tenthSchool: payload.sslcSchool,
      tenthBoard: payload.sslcBoard,
      tenthPassingYear: payload.sslcYear,
      tenthRegisterNumber: payload.sslcRegisterNumber,
      tenthMarksObtained: payload.sslcMarksObtained,
      tenthMaxMarks: payload.sslcMaxMarks,
      tenthPercentage: payload.sslcPercentage,
      tenthAttempts: payload.sslcAttempts,
      tenthSubjectMarks: payload.sslcSubjectMarks || null,
      
      twelfthSchool: showPUC ? payload.pucSchool || null : null,
      twelfthBoard: showPUC ? payload.pucBoard || null : null,
      twelfthPassingYear: showPUC ? (payload.pucYear || null) : null,
      twelfthRegisterNumber: showPUC ? payload.pucRegisterNumber || null : null,
      twelfthStream: showPUC ? payload.pucStream || null : null,
      physicsMarks: showPUC ? payload.physicsMarks || null : null,
      mathsMarks: showPUC ? payload.mathsMarks || null : null,
      chemistryMarks: showPUC ? payload.chemistryMarks || null : null,
      optionalSubject: showPUC ? payload.optionalSubject || null : null,
      optionalMarks: showPUC ? payload.optionalMarks || null : null,
      twelfthMaxMarks: showPUC ? payload.pucMaxMarks || null : null,
      twelfthAggregate: showPUC ? payload.pucAggregate || null : null,
      twelfthPercentage: showPUC ? payload.pucPercentage || null : null,
      twelfthAttempts: showPUC ? payload.pucAttempts || null : null,
      
      diplomaUniversity: showDiploma ? payload.diplomaUniversity || null : null,
      diplomaYear: showDiploma ? (payload.diplomaYear || null) : null,
      diplomaRegisterNumber: showDiploma ? payload.diplomaRegisterNumber || null : null,
      diplomaFinalYearMaxMarks: showDiploma ? payload.diplomaFinalYearMaxMarks || null : null,
      diplomaFinalYearObtained: showDiploma ? payload.diplomaFinalYearObtained || null : null,
      diplomaPercentage: showDiploma ? payload.diplomaPercentage || null : null,
      diplomaAttempts: showDiploma ? payload.diplomaAttempts || null : null,
      
      cetScore: payload.cetScore,
      cetRank: payload.cetRank,
      cetYear: payload.cetYear,
      hasGap: payload.hasGap,
      gapReason: payload.gapReason,
    };

    if (existing) {
      await existing.update(dbPayload);
    } else {
      await AdmissionAcademicDetail.create({ admissionId: admission.id, ...dbPayload });
    }
    await this.invalidateCache(userId);
    return admission.id;
  }

  // ── Step 6: Documents ─────────────────────────────────────────────────────

  async saveStep6(userId: string, fileUrls: Record<string, string>): Promise<string> {
    const admission = await this.getOrCreate(userId);
    this.checkEditable(admission);
    const existing = await AdmissionDocument.findOne({ where: { admissionId: admission.id } });
    if (existing) {
      await existing.update(fileUrls);
    } else {
      await AdmissionDocument.create({ admissionId: admission.id, ...fileUrls });
    }
    await this.invalidateCache(userId);
    return admission.id;
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  async submitApplication(userId: string): Promise<string> {
    const transaction = await db.transaction();
    try {
      // Resolve active admission by userId + status=DRAFT (DRAFT/REJECTED)
      const admission = await Admission.findOne({
        where: {
          userId,
          applicationStatus: { [Op.in]: ['DRAFT', 'REJECTED'] }
        },
        lock: true,
        transaction,
      });
      if (!admission) {
        throw new Error('Application not found or already submitted.');
      }
      if (admission.status !== 'DRAFT') {
        throw new Error('Application cannot be submitted at this stage.');
      }
      const isResubmission = admission.applicationStatus === 'REJECTED';
      await admission.update({
        applicationStatus: 'SUBMITTED',
        submittedAt: isResubmission ? (admission.submittedAt || new Date()) : new Date(),
        resubmittedAt: isResubmission ? new Date() : (admission.resubmittedAt || null),
        adminRemarks: null,
        rejectionReason: null,
        rejectionReasonCode: null,
        documentsVerified: false,
        feesVerified: false,
        eligibilityVerified: false,
        verificationRemarks: null,
      }, { transaction });
      await transaction.commit();
      await this.invalidateCache(userId);
      return admission.id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ── Uniqueness Checks ─────────────────────────────────────────────────────

  async checkAadhaar(aadhaar: string, excludeUserId?: string): Promise<boolean> {
    const where: any = { aadhaar };
    if (excludeUserId) {
      const self = await Admission.findOne({ where: { userId: excludeUserId } });
      if (self) where.id = { [Op.ne]: self.id };
    }
    const count = await Admission.count({ where });
    return count > 0;
  }

  async checkCet(cetNumber: string, type: string, excludeUserId?: string): Promise<boolean> {
    const field = type === 'DCET' ? 'dcetNumber' : 'cetNumber';
    const where: any = { [field]: cetNumber };
    if (excludeUserId) {
      const self = await Admission.findOne({ where: { userId: excludeUserId } });
      if (self) where.id = { [Op.ne]: self.id };
    }
    const count = await Admission.count({ where });
    return count > 0;
  }

  // ── Branches / Departments ────────────────────────────────────────────────

  async getBranches(): Promise<Department[]> {
    return Department.findAll({ order: [['name', 'ASC']] });
  }

  // ── Admin: List all applications ──────────────────────────────────────────

  async listApplications(filters: {
    status?: string;
    branchId?: string;
    admissionType?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
    qualification?: string;
    gender?: string;
    category?: string;
    district?: string;
    academicYear?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const {
      status,
      branchId,
      admissionType,
      search,
      sortBy,
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
      qualification,
      gender,
      category,
      district,
      academicYear,
      startDate,
      endDate
    } = filters;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'ALL' && status !== 'HISTORY') {
      if (status === 'QUEUE') {
        where.applicationStatus = { [Op.in]: ['SUBMITTED', 'UNDER_REVIEW'] };
        where.resubmittedAt = null;
        where.rejectionReason = null;
        where.rejectionReasonCode = null;
      } else if (status === 'RESUBMITTED') {
        where.applicationStatus = 'SUBMITTED';
        where[Op.or] = [
          { resubmittedAt: { [Op.ne]: null } },
          { rejectionReason: { [Op.ne]: null } },
          { rejectionReasonCode: { [Op.ne]: null } }
        ];
      } else if (status === 'SUBMITTED') {
        where.applicationStatus = 'SUBMITTED';
        where.resubmittedAt = null;
        where.rejectionReason = null;
        where.rejectionReasonCode = null;
      } else if (status === 'APPROVED') {
        // Verified tab: verified by Admin, but not yet signed off by Principal
        where.applicationStatus = 'APPROVED';
        where.approvedByAdminId = null;
      } else if (status === 'ENROLLED') {
        // Approved tab: approved by Principal, awaiting final enrollment
        where.applicationStatus = 'APPROVED';
        where.approvedByAdminId = { [Op.ne]: null };
      } else {
        where.applicationStatus = status;
      }
    }
    if (branchId && branchId !== 'ALL') where.branchId = branchId;
    if (admissionType && admissionType !== 'ALL') where.admissionType = admissionType;
    if (qualification && qualification !== 'ALL') where.qualification = qualification;

    // Academic Year filter
    if (academicYear && academicYear !== 'ALL') {
      const startYearMatch = academicYear.match(/\d{4}/);
      if (startYearMatch) {
        const startYear = parseInt(startYearMatch[0]);
        const start = new Date(`${startYear}-06-01T00:00:00.000Z`);
        const end = new Date(`${startYear + 1}-05-31T23:59:59.999Z`);
        where.createdAt = { [Op.between]: [start, end] };
      }
    }

    // Date range filter
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date('2020-01-01');
      const end = endDate ? new Date(endDate) : new Date();
      if (where.createdAt) {
        where.createdAt = {
          [Op.and]: [
            where.createdAt,
            { [Op.between]: [start, end] }
          ]
        };
      } else {
        where.createdAt = { [Op.between]: [start, end] };
      }
    }

    // Universal Search filter
    if (search && search.trim() !== '') {
      const s = search.trim();
      where[Op.or] = [
        { applicationNumber: { [Op.iLike]: `%${s}%` } },
        { aadhaar: { [Op.iLike]: `%${s}%` } },
        { '$user.firstName$': { [Op.iLike]: `%${s}%` } },
        { '$user.lastName$': { [Op.iLike]: `%${s}%` } },
        { '$user.email$': { [Op.iLike]: `%${s}%` } },
        { '$user.phone$': { [Op.iLike]: `%${s}%` } },
        { '$user.student.enrollmentNumber$': { [Op.iLike]: `%${s}%` } }
      ];
    }

    // Filters for personal details
    const personalWhere: any = {};
    if (gender && gender !== 'ALL') personalWhere.gender = gender;
    if (category && category !== 'ALL') personalWhere.category = category;

    // Filters for address
    const addressWhere: any = {};
    if (district && district.trim() !== '') {
      addressWhere.currentCity = { [Op.iLike]: `%${district.trim()}%` };
    }

    const include: any[] = [
      {
        model: User,
        as: 'user',
        required: false,
        attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage'],
        include: [
          { model: Student, as: 'student', attributes: ['id', 'enrollmentNumber', 'rollNumber'], required: false }
        ]
      },
      { model: Department, as: 'branch', required: false },
      {
        model: AdmissionPersonalDetail,
        as: 'studentpersonaldetails',
        required: Object.keys(personalWhere).length > 0,
        where: Object.keys(personalWhere).length > 0 ? personalWhere : undefined
      },
      {
        model: AdmissionAddress,
        as: 'studentaddress',
        required: Object.keys(addressWhere).length > 0,
        where: Object.keys(addressWhere).length > 0 ? addressWhere : undefined
      }
    ];

    let order: any[] = [['createdAt', 'DESC']];
    if (sortBy === 'date') {
      order = [['createdAt', sortOrder]];
    } else if (sortBy === 'rank') {
      order = [['applicationNumber', sortOrder]];
    } else if (sortBy === 'updatedAt') {
      order = [['updatedAt', sortOrder]];
    } else if (sortBy === 'name') {
      order = [[{ model: User, as: 'user' }, 'firstName', sortOrder]];
    }

    const { count, rows } = await Admission.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset,
      distinct: true,
    });

    return {
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      applications: rows,
    };
  }

  /** Admin: get single full application */
  async getApplicationById(id: string): Promise<any> {
    const full = await Admission.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage'],
          include: [
            { model: Student, as: 'student', attributes: ['id', 'enrollmentNumber', 'rollNumber'] }
          ]
        },
        { model: Department, as: 'branch' },
        { model: AdmissionPersonalDetail, as: 'studentpersonaldetails' },
        { model: AdmissionParentDetail, as: 'studentparentdetails' },
        { model: AdmissionAddress, as: 'studentaddress' },
        { model: AdmissionAcademicDetail, as: 'studentacademicdetails' },
        { model: AdmissionDocument, as: 'studentdocuments' },
      ],
    });
    return serializeAdmission(full);
  }

  /** Admin: update application status */
  async updateStatus(
    id: string,
    status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ENROLLED',
    adminUserId: string,
    remarks?: string,
    rejectionReason?: string,
    rejectionReasonCode?: string
  ): Promise<string | void> {
    const transaction = await db.transaction();
    try {
      const adminUser = await User.findByPk(adminUserId, { transaction });
      if (!adminUser) throw new Error('Admin user not found');
      
      const admission = await Admission.findByPk(id, { transaction, lock: true });
      if (!admission) throw new Error('Application not found');

      // Rule: Only SUPER_ADMIN can override an already REJECTED application
      if (admission.applicationStatus === 'REJECTED' && status !== 'REJECTED' && adminUser.role !== 'SUPER_ADMIN') {
        throw new Error('Only a SUPER_ADMIN can override a rejected application.');
      }

      let generatedUsn: string | undefined;

      if (status === 'APPROVED') {
        if (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN' && adminUser.role !== 'PRINCIPAL') {
          throw new Error('Only an ADMIN, SUPER_ADMIN, or PRINCIPAL can verify applications.');
        }

        // ENFORCE CHECKLIST (Admin Validation)
        if (!admission.documentsVerified || !admission.feesVerified || !admission.eligibilityVerified) {
          throw new Error('All verification steps (Documents, Fees, Eligibility) must be completed before approval.');
        }

        await admission.update({
          applicationStatus: 'APPROVED',
          adminRemarks: remarks || null,
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
        }, { transaction });

      } else if (status === 'ENROLLED') {
        if (adminUser.role !== 'SUPER_ADMIN' && adminUser.role !== 'ADMIN' && adminUser.role !== 'PRINCIPAL') {
          throw new Error('Only an authorized Admin/Principal/SuperAdmin can finalize enrollment.');
        }

        const personal = await AdmissionPersonalDetail.findOne({ where: { admissionId: id }, transaction });
        const parent = await AdmissionParentDetail.findOne({ where: { admissionId: id }, transaction });
        const addr = await AdmissionAddress.findOne({ where: { admissionId: id }, transaction });

        let branchCode = 'CS';
        if (admission.branchId) {
          const branch = await Department.findByPk(admission.branchId, { transaction });
          if (branch && branch.code) {
            branchCode = branch.code.substring(0, 2).toUpperCase();
          }
        }
        const batchYear = new Date().getFullYear();
        const yearSuffix = String(batchYear).substring(2);

        // Count existing students in this department & batch to generate unique USN
        const studentCount = await Student.count({
          where: {
            departmentId: admission.branchId || '',
            batchYear,
          },
          transaction,
        });
        const seqStr = String(studentCount + 1).padStart(3, '0');
        const enrollmentNumber = `2JR${yearSuffix}${branchCode}${seqStr}`;
        const rollNumber = `${batchYear}${branchCode}${seqStr}`;
        generatedUsn = enrollmentNumber;

        let dobDate: Date | null = null;
        if (personal?.dateOfBirth) {
          if ((personal.dateOfBirth as unknown) instanceof Date) {
            dobDate = (personal.dateOfBirth as unknown) as Date;
          } else if (typeof personal.dateOfBirth === 'string') {
            const parts = personal.dateOfBirth.split('/');
            if (parts.length === 3) {
              dobDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            } else {
              dobDate = new Date(personal.dateOfBirth);
            }
          }
        }

        const existingStudent = await Student.findOne({ where: { userId: admission.userId }, transaction });
        if (!existingStudent) {
          await Student.create({
            userId: admission.userId,
            usn: enrollmentNumber,
            enrollmentNumber,
            rollNumber,
            batchYear,
            departmentId: admission.branchId!,
            semester: admission.admissionType === 'DCET' ? 3 : 1,
            dateOfBirth: dobDate,
            address: addr ? [addr.currentAddressLine1, addr.currentCity, addr.currentState, addr.currentPincode].filter(Boolean).join(', ') : '',
            fatherName: parent?.fatherName || '',
            motherName: parent?.motherName || '',
            parentPhone: parent?.fatherPhone || '',
            parentEmail: parent?.fatherEmail || '',
            admissionStatus: 'APPROVED',
          }, { transaction });
        } else {
          generatedUsn = existingStudent.enrollmentNumber;
        }

        // Elevate user role to STUDENT if they are not already
        const user = await User.findByPk(admission.userId, { transaction });
        if (user && user.role !== 'STUDENT') {
          await user.update({ role: 'STUDENT' }, { transaction });
        }

        await admission.update({
          applicationStatus: 'ENROLLED',
          approvalRemarks: remarks || null,
          approvedByAdminId: adminUserId,
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
        }, { transaction });

      } else {
        let finalRejectionReason = rejectionReason;
        if (status === 'REJECTED' && rejectionReasonCode) {
          const reasonObj = await RejectionReason.findOne({ where: { code: rejectionReasonCode }, transaction });
          if (reasonObj) {
            finalRejectionReason = reasonObj.label;
          }
        }

        await admission.update({
          applicationStatus: status,
          adminRemarks: remarks || null,
          rejectionReason: status === 'REJECTED' ? finalRejectionReason || remarks || null : null,
          rejectionReasonCode: status === 'REJECTED' ? rejectionReasonCode || null : null,
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
        }, { transaction });
      }

      await transaction.commit();
      await this.invalidateCacheByAdmissionId(id);
      return generatedUsn;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /** Admin: Verify Admission Checklist */
  async verifyChecklist(
    id: string,
    adminUserId: string,
    payload: {
      documentsVerified?: boolean;
      feesVerified?: boolean;
      eligibilityVerified?: boolean;
      verificationRemarks?: string;
    }
  ): Promise<void> {
    const transaction = await db.transaction();
    try {
      const admission = await Admission.findByPk(id, { transaction, lock: true });
      if (!admission) throw new Error('Application not found');
      
      await admission.update({
        documentsVerified: payload.documentsVerified ?? admission.documentsVerified,
        feesVerified: payload.feesVerified ?? admission.feesVerified,
        eligibilityVerified: payload.eligibilityVerified ?? admission.eligibilityVerified,
        verificationRemarks: payload.verificationRemarks !== undefined ? payload.verificationRemarks : admission.verificationRemarks,
        verifiedByAdminId: adminUserId,
        verifiedAt: new Date(),
      }, { transaction });

      await transaction.commit();
      await this.invalidateCacheByAdmissionId(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /** Admin: stats for dashboard */
  async getDashboardStats(): Promise<any> {
    const cacheKey = 'admin:stats';
    const cached = await redisService.getCache(cacheKey);
    if (cached) return cached;

    const [total, draftCount, submitted, resubmitted, underReview, approvedCount, _approvedByPrincipalCount, rejected, enrolled, cancellationRequests] = await Promise.all([
      Admission.count(),
      Admission.count({ where: { applicationStatus: 'DRAFT' } }),
      Admission.count({
        where: {
          applicationStatus: 'SUBMITTED',
          resubmittedAt: null,
          rejectionReason: null,
          rejectionReasonCode: null
        }
      }),
      Admission.count({
        where: {
          applicationStatus: 'SUBMITTED',
          [Op.or]: [
            { resubmittedAt: { [Op.ne]: null } },
            { rejectionReason: { [Op.ne]: null } },
            { rejectionReasonCode: { [Op.ne]: null } }
          ]
        }
      }),
      Admission.count({
        where: {
          applicationStatus: 'UNDER_REVIEW',
          resubmittedAt: null,
          rejectionReason: null,
          rejectionReasonCode: null
        }
      }),
      Admission.count({ where: { applicationStatus: 'APPROVED', approvedByAdminId: null } }),
      Admission.count({ where: { applicationStatus: 'APPROVED', approvedByAdminId: { [Op.ne]: null } } }),
      Admission.count({ where: { applicationStatus: 'REJECTED' } }),
      Admission.count({ where: { applicationStatus: 'ENROLLED' } }),
      Admission.count({ where: { applicationStatus: 'CANCELLATION_REQUESTED' } }),
    ]);

    const recent = await Admission.findAll({
      where: { applicationStatus: { [Op.in]: ['SUBMITTED', 'UNDER_REVIEW'] } },
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'profileImage'] },
        { model: Department, as: 'branch' },
      ],
      order: [['updatedAt', 'DESC']],
      limit: 5,
    });

    const result = { 
      total, 
      registered: draftCount, // compatibility fallback
      draft: draftCount, 
      submitted, 
      resubmitted,
      underReview, 
      approved: approvedCount, 
      rejected, 
      enrolled, 
      cancellationRequests,
      recent 
    };

    await redisService.setCache(cacheKey, result, 300); // 5 mins TTL
    return result;
  }
}

export default new AdmissionService();
