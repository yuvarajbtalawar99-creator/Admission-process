import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import admissionService from '../services/admission.service';
import securityEvents from '../services/securityEvents.service';
import AuditLog from '../models/AuditLog';
import AdmissionDocument from '../models/AdmissionDocument';
import Admission from '../models/Admission';
import SystemConfiguration from '../models/SystemConfiguration';
import { generateHandbookPDFBuffer } from '../utils/handbookGenerator.util';
import { validateDocument } from '../utils/documentValidation.util';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const DOCUMENT_FIELD_MAP: Record<string, keyof AdmissionDocument> = {
  photo: 'photoUrl',
  signature: 'signatureUrl',
  tenthMarksheet: 'tenthMarksheetUrl',
  twelfthMarksheet: 'twelfthMarksheetUrl',
  diplomaSemester5Marksheet: 'diplomaSemester5MarksheetUrl',
  diplomaSemester6Marksheet: 'diplomaSemester6MarksheetUrl',
  cetScoreCard: 'cetScoreCardUrl',
  aadhaar: 'aadhaarUrl',
  casteCertificate: 'casteCertificateUrl',
  domicileCertificate: 'domicileCertificateUrl',
  gapCertificate: 'gapCertificateUrl',
  feesPaidReceipt: 'feesPaidReceiptUrl',
  admissionFeeReceipt: 'admissionFeeReceiptUrl',
};

// ─── Student Endpoints ───────────────────────────────────────────────────────

/** POST /api/student/validate-document (Instant Single File Validation) */
export const validateSingleDocument = async (
  req: AuthRequest, res: Response, _next: NextFunction
): Promise<any> => {
  try {
    const file = req.file;
    const documentType = req.body.documentType || req.body.docType || (file ? file.fieldname : 'unknown');

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded for validation.' });
    }

    // Perform quality validation (Color + Blur)
    const result = await validateDocument(documentType, file.path, file.originalname);

    // Delete temp validation file immediately
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      // Ignore
    }

    if (!result.success) {
      return res.status(400).json({
        success: false,
        reason: result.reason,
        message: result.message,
      });
    }

    return res.json({ success: true, message: 'Document validation passed!' });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message || 'Validation failed.' });
  }
};

/** GET /api/student/my-admission */
export const getMyAdmission = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const data = await admissionService.getMyAdmission(req.user!.id);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/student/step-status */
export const getStepStatus = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const data = await admissionService.getStepStatus(req.user!.id);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/application/full-details */
export const getFullDetails = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const data = await admissionService.getFullDetails(req.user!.id);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/student/admission/step/:stepName */
export const getStepData = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const { stepName } = req.params;
    const data = await admissionService.getStepData(req.user!.id, stepName);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

/** POST /api/student/create  (Step 1) */
export const saveStep1 = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const existing = await Admission.findOne({ where: { userId: req.user!.id } });
    if (!existing) {
      const config = await SystemConfiguration.findOne();
      if (config && config.admissionOpen === false) {
        return res.status(403).json({ success: false, error: 'Admissions are currently closed. Please contact the college office for further information.' });
      }
    }
    const admissionId = await admissionService.saveStep1(req.user!.id, req.body);
    securityEvents.stepEdit(req, req.user!.id, admissionId, 1);
    return res.json({ success: true, message: 'Admission details saved.' });
  } catch (err) {
    return next(err);
  }
};

/** PUT /api/student/personal  (Step 2) */
export const saveStep2 = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const admissionId = await admissionService.saveStep2(req.user!.id, req.body);
    securityEvents.stepEdit(req, req.user!.id, admissionId, 2);
    return res.json({ success: true, message: 'Personal details saved.' });
  } catch (err) {
    return next(err);
  }
};

/** PUT /api/student/parent  (Step 3) */
export const saveStep3 = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const admissionId = await admissionService.saveStep3(req.user!.id, req.body);
    securityEvents.stepEdit(req, req.user!.id, admissionId, 3);
    return res.json({ success: true, message: 'Parent details saved.' });
  } catch (err) {
    return next(err);
  }
};

/** PUT /api/student/address  (Step 4) */
export const saveStep4 = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const admissionId = await admissionService.saveStep4(req.user!.id, req.body);
    securityEvents.stepEdit(req, req.user!.id, admissionId, 4);
    return res.json({ success: true, message: 'Address saved.' });
  } catch (err) {
    return next(err);
  }
};

/** PUT /api/student/academic  (Step 5) */
export const saveStep5 = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const admissionId = await admissionService.saveStep5(req.user!.id, req.body);
    securityEvents.stepEdit(req, req.user!.id, admissionId, 5);
    return res.json({ success: true, message: 'Academic details saved.' });
  } catch (err) {
    return next(err);
  }
};

/** POST /api/student/documents  (Step 6 — multipart/form-data) */
export const saveStep6 = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }

    // Build URL map: fieldname → /uploads/filename (served as static)
    const fileUrls: Record<string, string> = {};
    for (const field of Object.keys(files)) {
      const file = files[field][0];
      fileUrls[`${field}Url`] = `/uploads/${file.filename}`;
    }

    const admissionId = await admissionService.saveStep6(req.user!.id, fileUrls);
    securityEvents.documentUpload(req, req.user!.id, admissionId, Object.keys(fileUrls));
    return res.json({ success: true, message: 'Documents uploaded.', data: fileUrls });
  } catch (err) {
    return next(err);
  }
};

/** POST /api/student/submit  (Step 7 final submit) */
export const submitApplication = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const admissionId = await admissionService.submitApplication(req.user!.id);
    securityEvents.admissionSubmit(req, req.user!.id, admissionId);
    return res.json({ success: true, message: 'Application submitted successfully!' });
  } catch (err: any) {
    if (err.message?.includes('cannot be submitted')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return next(err);
  }
};

/** POST /api/student/check-aadhaar */
export const checkAadhaar = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const { aadhaar } = req.body;
    if (!aadhaar || aadhaar.length !== 12) {
      return res.json({ exists: false });
    }
    const exists = await admissionService.checkAadhaar(aadhaar, req.user?.id);
    return res.json({ exists });
  } catch (err) {
    return next(err);
  }
};

/** POST /api/student/check-cet */
export const checkCet = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const { cetNumber, type } = req.body;
    if (!cetNumber || !type) return res.json({ exists: false });
    const exists = await admissionService.checkCet(cetNumber, type, req.user?.id);
    return res.json({ exists });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/branches */
export const getBranches = async (
  _req: Request, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const branches = await admissionService.getBranches();
    return res.json({ success: true, data: branches });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/application/download-pdf */
export const downloadPDF = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const data = await admissionService.getFullDetails(req.user!.id);
    if (!data) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const appNum = data.applicationNumber || 'UNKNOWN';
    const user = data.user || {};
    const personal = data.studentpersonaldetails || {};
    const branch = data.branch || {};

    // Build a simple text-based PDF without external dependencies
    // (If pdfkit is available, use it; fallback to plain text download)
    const content = [
      '='.repeat(60),
      '        COLLEGE ERP - ADMISSION ACKNOWLEDGMENT',
      '='.repeat(60),
      '',
      `Application Number : ${appNum}`,
      `Applicant Name     : ${user.firstName || ''} ${user.lastName || ''}`,
      `Email              : ${user.email || ''}`,
      `Phone              : ${personal.phone || user.phone || ''}`,
      `Date of Birth      : ${personal.dateOfBirth || ''}`,
      `Gender             : ${personal.gender || ''}`,
      `Admission Type     : ${data.admissionType || ''}`,
      `Branch             : ${branch.name || ''} (${branch.code || ''})`,
      `Status             : ${data.applicationStatus || ''}`,
      '',
      '-'.repeat(60),
      'This is an auto-generated acknowledgment.',
      `Generated on: ${new Date().toLocaleDateString('en-IN')}`,
      '='.repeat(60),
    ].join('\n');

    const buffer = Buffer.from(content, 'utf-8');
    
    // Log audit event
    securityEvents.documentDownload(req, req.user!.id, data.id, 'Admission Acknowledgment');

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="Admission_${appNum}.txt"`,
      'Content-Length': buffer.length,
    });
    return res.send(buffer);
  } catch (err) {
    return next(err);
  }
};

/** GET /api/public/handbook - Download official Admission Handbook PDF (Public, No Auth Required) */
export const downloadHandbook = async (
  _req: Request, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const config = await SystemConfiguration.findOne();
    if (config?.handbookUrl) {
      const relativePath = config.handbookUrl.startsWith('/') ? config.handbookUrl.slice(1) : config.handbookUrl;
      const fullPath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(fullPath)) {
        return res.download(fullPath, 'Jain_College_Admission_Handbook.pdf');
      }
    }

    // Check if generated static file already exists on disk
    const staticHandbookPath = path.join(process.cwd(), 'uploads', 'Jain_College_Admission_Handbook.pdf');
    if (fs.existsSync(staticHandbookPath)) {
      return res.download(staticHandbookPath, 'Jain_College_Admission_Handbook.pdf');
    }

    // Generate handbook PDF buffer
    const pdfBuffer = generateHandbookPDFBuffer();

    // Persist file to uploads and public/static directories
    try {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      const publicStaticDir = path.join(process.cwd(), 'public', 'static');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      if (!fs.existsSync(publicStaticDir)) fs.mkdirSync(publicStaticDir, { recursive: true });

      fs.writeFileSync(staticHandbookPath, pdfBuffer);
      fs.writeFileSync(path.join(publicStaticDir, 'Jain_College_Admission_Handbook.pdf'), pdfBuffer);
    } catch (saveErr: any) {
      logger.warn(`Could not save static handbook PDF file: ${saveErr.message}`);
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Jain_College_Admission_Handbook.pdf"',
      'Content-Length': pdfBuffer.length,
    });
    return res.send(pdfBuffer);
  } catch (err) {
    return next(err);
  }
};

// ─── Admin Endpoints ─────────────────────────────────────────────────────────

/** GET /api/admin/admissions */
export const listAdmissions = async (
  req: AuthRequest, res: Response, _next: NextFunction
): Promise<any> => {
  try {
    const {
      status,
      branchId,
      admissionType,
      search,
      sortBy,
      sortOrder,
      page,
      limit,
      qualification,
      gender,
      category,
      district,
      academicYear,
      startDate,
      endDate
    } = req.query as any;
    const result = await admissionService.listApplications({
      status,
      branchId,
      admissionType,
      search,
      sortBy,
      sortOrder,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      qualification,
      gender,
      category,
      district,
      academicYear,
      startDate,
      endDate,
      includeFullDetails: req.query.includeFullDetails === 'true'
    });
    
    if (!result || result.total === 0) {
      return res.json({
        success: true,
        data: [],
        total: 0
      });
    }

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error in listAdmissions controller:", err);
    return res.json({
      success: true,
      data: [],
      total: 0
    });
  }
};

/** GET /api/admin/admissions/:id */
export const getAdmissionById = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const data = await admissionService.getApplicationById(id);
    if (!data) return res.status(404).json({ error: 'Application not found' });

    // Requirement 8 Logging before sending response
    const studentId = data.userId || data.user?.id || data.user?.student?.id || 'N/A';
    const docsObj = data.studentdocuments || data.documents || {};
    const docEntries = Object.entries(docsObj).filter(
      ([key, val]) => val !== null && val !== undefined && val !== '' && key !== 'id' && key !== 'admissionId' && key !== 'createdAt' && key !== 'updatedAt'
    );
    const docUrls = docEntries.map(([key, val]) => `${key}: ${val}`);

    console.log("==================== [BACKEND ADMISSION REVIEW] ====================");
    console.log("Application ID:", id);
    console.log("Student ID:", studentId);
    console.log("Number of documents found:", docEntries.length);
    console.log("Document URLs:", docUrls);
    console.log("====================================================================");

    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

/** GET /api/admin/admissions/:id/documents/:field */
export const viewAdmissionDocument = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const { id, field } = req.params;
    const documentColumn = DOCUMENT_FIELD_MAP[field];

    if (!documentColumn) {
      return res.status(400).json({ error: 'Invalid document field.' });
    }

    const documents = await AdmissionDocument.findOne({ where: { admissionId: id } });
    if (!documents) {
      return res.status(404).json({ error: 'No documents found for this application.' });
    }

    const fileUrl = documents.get(documentColumn as string) as string | null;
    if (!fileUrl) {
      return res.status(404).json({ error: 'Document not uploaded.' });
    }

    const relativePath = fileUrl.replace(/^\/+/, '');
    if (!relativePath.startsWith('uploads/')) {
      return res.status(400).json({ error: 'Invalid document path.' });
    }

    const uploadsRoot = path.resolve(process.cwd(), 'uploads');
    const absolutePath = path.resolve(process.cwd(), relativePath);
    const isInsideUploads =
      absolutePath === uploadsRoot || absolutePath.startsWith(`${uploadsRoot}${path.sep}`);

    if (!isInsideUploads || !fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'Document file not found.' });
    }

    securityEvents.documentDownload(req, req.user!.id, id, field);

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(absolutePath)}"`);
    return res.sendFile(absolutePath);
  } catch (err) {
    return next(err);
  }
};

/** PUT /api/admin/admissions/:id/status */
export const updateAdmissionStatus = async (
  req: AuthRequest, res: Response, _next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status, remarks, rejectionReason, rejectionReasonCode } = req.body;
    const validStatuses = ['UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ENROLLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be UNDER_REVIEW, APPROVED, REJECTED, or ENROLLED.' });
    }

    if (status === 'REJECTED') {
      if (!rejectionReasonCode) {
        return res.status(400).json({ error: 'rejectionReasonCode is required when status is REJECTED.' });
      }
      if (rejectionReasonCode === 'OTHER' && (!remarks || !remarks.trim())) {
        return res.status(400).json({ error: 'Remarks are mandatory when rejection reason is OTHER.' });
      }
    }

    const data = await admissionService.getApplicationById(id);
    const oldStatus = data ? data.applicationStatus : 'UNKNOWN';

    const enrollmentNumber = await admissionService.updateStatus(id, status, req.user!.id, remarks, rejectionReason, rejectionReasonCode);

    // Log audit status change
    if (status === 'ENROLLED' && enrollmentNumber) {
      await AuditLog.create({
        userId: req.user!.id,
        action: 'ADMIN_APPROVED_ADMISSION',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { admissionId: id, enrollmentNumber, oldStatus },
      });
    } else if (status === 'APPROVED') {
      await AuditLog.create({
        userId: req.user!.id,
        action: 'ADMIN_VERIFIED_DOCUMENTS',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { admissionId: id, oldStatus, newStatus: status },
      });
    } else if (status === 'REJECTED') {
      await AuditLog.create({
        userId: req.user!.id,
        action: 'ADMISSION_STATUS_CHANGE',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: {
          action: 'ADMISSION_REJECTED',
          reason: rejectionReasonCode,
          remarks: remarks || '',
          performedBy: req.user!.id,
        },
      });
    } else {
      await AuditLog.create({
        userId: req.user!.id,
        action: 'ADMISSION_STATUS_CHANGE',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { admissionId: id, oldStatus, newStatus: status },
      });
    }

    return res.json({ message: `Application ${status.toLowerCase()}`, enrollmentNumber });
  } catch (error: any) {
    console.error('Error updating status:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const verifyAdmissionChecklist = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    if (req.user!.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'SUPER_ADMIN cannot perform routine document verification. This is an ADMIN task.' });
    }

    const { id } = req.params;
    const payload = req.body;
    
    await admissionService.verifyChecklist(id, req.user!.id, payload);
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'ADMIN_VERIFIED_DOCUMENTS',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { admissionId: id, payload },
    });
    
    return res.json({ message: 'Validation checklist updated successfully' });
  } catch (error: any) {
    console.error('Error verifying checklist:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

/** GET /api/admin/stats */
export const getAdminStats = async (
  _req: AuthRequest, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const stats = await admissionService.getDashboardStats();
    return res.json({ success: true, data: stats });
  } catch (err) {
    return next(err);
  }
};

/** POST /api/student/cancellation-request */
export const requestAdmissionCancellation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { reason, remarks } = req.body;
    if (!reason) {
      return res.status(400).json({ error: 'Cancellation reason is required' });
    }

    const admission = await Admission.findOne({ where: { userId: req.user!.id } });
    if (!admission) {
      return res.status(404).json({ error: 'Admission application not found' });
    }

    if (admission.applicationStatus !== 'ENROLLED') {
      return res.status(403).json({ error: 'Only confirmed admissions can be cancelled' });
    }

    admission.applicationStatus = 'CANCELLATION_REQUESTED';
    admission.cancellationReason = reason;
    admission.cancellationRemarks = remarks || null;
    admission.cancellationRequestedAt = new Date();
    admission.cancellationRequestedById = req.user!.id;
    await admission.save();

    await AuditLog.create({
      userId: req.user!.id,
      action: 'ADMISSION_STATUS_CHANGE',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        admissionId: admission.id,
        action: 'ADMISSION_CANCELLATION_REQUESTED',
        reason,
        remarks: remarks || '',
        performedBy: req.user!.id,
      },
    });

    return res.json({ success: true, message: 'Cancellation request submitted successfully' });
  } catch (err) {
    return next(err);
  }
};

/** POST /api/admin/admissions/:id/cancellation-process */
export const processCancellationRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { action, remarks } = req.body; // action: 'APPROVE' | 'REJECT'

    if (!action || (action !== 'APPROVE' && action !== 'REJECT')) {
      return res.status(400).json({ error: 'Valid action (APPROVE or REJECT) is required' });
    }

    const admission = await Admission.findByPk(id);
    if (!admission) {
      return res.status(404).json({ error: 'Admission application not found' });
    }

    if (admission.applicationStatus !== 'CANCELLATION_REQUESTED') {
      return res.status(400).json({ error: 'Admission application is not in Cancellation Requested status' });
    }

    if (action === 'APPROVE') {
      admission.applicationStatus = 'CANCELLED';
      admission.cancellationApprovedAt = new Date();
      admission.cancellationApprovedById = req.user!.id;
      admission.cancellationAdminRemarks = remarks || null;
      await admission.save();

      await AuditLog.create({
        userId: req.user!.id,
        action: 'ADMISSION_STATUS_CHANGE',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: {
          admissionId: id,
          action: 'ADMISSION_CANCELLATION_APPROVED',
          remarks: remarks || '',
          performedBy: req.user!.id,
        },
      });

      return res.json({ success: true, message: 'Admission cancellation approved successfully' });
    } else {
      // Revert back to ENROLLED (Admission Confirmed)
      admission.applicationStatus = 'ENROLLED';
      admission.cancellationRejectedAt = new Date();
      admission.cancellationRejectedById = req.user!.id;
      admission.cancellationAdminRemarks = remarks || null;
      await admission.save();

      await AuditLog.create({
        userId: req.user!.id,
        action: 'ADMISSION_STATUS_CHANGE',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: {
          admissionId: id,
          action: 'ADMISSION_CANCELLATION_REJECTED',
          remarks: remarks || '',
          performedBy: req.user!.id,
        },
      });

      return res.json({ success: true, message: 'Admission cancellation request rejected' });
    }
  } catch (err) {
    return next(err);
  }
};

/** POST /api/admin/admissions/:id/cancellation-direct */
export const directCancelAdmission = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { reason, remarks } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Cancellation reason is required' });
    }

    const admission = await Admission.findByPk(id);
    if (!admission) {
      return res.status(404).json({ error: 'Admission application not found' });
    }

    if (admission.applicationStatus !== 'ENROLLED' && admission.applicationStatus !== 'APPROVED') {
      return res.status(400).json({ error: 'Only confirmed/approved admissions can be directly cancelled' });
    }

    admission.applicationStatus = 'CANCELLED';
    admission.cancellationReason = reason;
    admission.cancellationRemarks = remarks || null;
    admission.cancellationApprovedAt = new Date();
    admission.cancellationApprovedById = req.user!.id;
    admission.cancellationAdminRemarks = remarks || null;
    await admission.save();

    await AuditLog.create({
      userId: req.user!.id,
      action: 'ADMISSION_STATUS_CHANGE',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        admissionId: id,
        action: 'ADMISSION_CANCELLED_DIRECT',
        reason,
        remarks: remarks || '',
        performedBy: req.user!.id,
      },
    });

    return res.json({ success: true, message: 'Admission cancelled directly by administrator' });
  } catch (err) {
    return next(err);
  }
};

/** POST /api/student/upload-fee-receipt */
export const uploadFeeReceipt = async (
  req: AuthRequest, res: Response, _next: NextFunction
): Promise<any> => {
  try {
    const file = req.file;
    let receiptUrl = req.body.receiptUrl;
    if (file) {
      receiptUrl = `/uploads/${file.filename}`;
    }
    if (!receiptUrl) {
      return res.status(400).json({ success: false, message: 'Fee receipt file is required.' });
    }

    const result = await admissionService.uploadFeeReceipt(req.user!.id, receiptUrl);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

/** POST /api/admin/admissions/:id/fee-verify */
export const verifyFeeReceipt = async (
  req: AuthRequest, res: Response, _next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { approve, remarks, rejectionReason } = req.body;
    if (typeof approve !== 'boolean') {
      return res.status(400).json({ error: 'approve parameter (boolean) is required.' });
    }

    const result = await admissionService.verifyFeeReceipt(id, req.user!.id, { approve, remarks, rejectionReason });
    
    await AuditLog.create({
      userId: req.user!.id,
      action: approve ? 'ADMIN_VERIFIED_FEE_RECEIPT' : 'ADMIN_REJECTED_FEE_RECEIPT',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { admissionId: id, approve, remarks, rejectionReason },
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
