import { Request } from 'express';
import auditService from './audit.service';

/**
 * Centralized Security Events helper.
 * Provides clean, semantic methods for logging security events,
 * ensuring consistent structure and avoiding scattered auditService calls.
 *
 * Usage:
 *   securityEvents.loginSuccess(req, user);
 *   securityEvents.loginFailure(req, email, 'Invalid password');
 *   securityEvents.logout(req, userId);
 *   securityEvents.passwordChange(req, userId);
 *   securityEvents.roleChange(req, userId, 'STUDENT', 'HOD');
 */
const securityEvents = {
  loginSuccess(req: Request, user: { id: string; role: string; email: string }): void {
    auditService.logEvent({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { role: user.role, email: user.email },
    });
  },

  loginFailure(req: Request, email: string, reason: string, userId?: string): void {
    auditService.logEvent({
      userId: userId || null,
      action: 'LOGIN_FAILED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { emailAttempted: email, reason },
    });
  },

  logout(req: Request, userId: string): void {
    auditService.logEvent({
      userId,
      action: 'LOGOUT',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  },

  passwordChange(req: Request, userId: string): void {
    auditService.logEvent({
      userId,
      action: 'PASSWORD_CHANGE',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  },

  roleChange(req: Request, userId: string, oldRole: string, newRole: string): void {
    auditService.logEvent({
      userId,
      action: 'ROLE_CHANGE',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { oldRole, newRole },
    });
  },

  admissionView(req: Request, adminUserId: string, applicantId: string, applicantName: string): void {
    auditService.logEvent({
      userId: adminUserId,
      action: 'ADMISSION_VIEW',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { applicantId, applicantName },
    });
  },

  admissionStatusChange(
    req: Request,
    adminUserId: string,
    applicantId: string,
    oldStatus: string,
    newStatus: string,
    remarks?: string
  ): void {
    auditService.logEvent({
      userId: adminUserId,
      action: 'ADMISSION_STATUS_CHANGE',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { applicantId, oldStatus, newStatus, remarks },
    });
  },

  documentDownload(req: Request, userId: string, applicantId: string, docType: string): void {
    auditService.logEvent({
      userId,
      action: 'DOCUMENT_DOWNLOAD',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { applicantId, docType },
    });
  },

  stepEdit(req: Request, userId: string, admissionId: string, step: number): void {
    auditService.logEvent({
      userId,
      action: 'ADMISSION_STEP_EDIT',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { admissionId, step },
    });
  },

  documentUpload(req: Request, userId: string, admissionId: string, fields: string[]): void {
    auditService.logEvent({
      userId,
      action: 'DOCUMENT_UPLOAD',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { admissionId, fields },
    });
  },

  admissionSubmit(req: Request, userId: string, admissionId: string): void {
    auditService.logEvent({
      userId,
      action: 'ADMISSION_SUBMIT',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { admissionId },
    });
  },

  admissionEnroll(req: Request, adminUserId: string, applicantId: string, enrollmentNumber: string): void {
    auditService.logEvent({
      userId: adminUserId,
      action: 'ADMISSION_ENROLL',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { applicantId, enrollmentNumber },
    });
  },

  generateCredentials(req: Request, adminUserId: string, targetUserId: string, action: 'GENERATE_CREDENTIALS' | 'PASSWORD_RESET'): void {
    auditService.logEvent({
      userId: adminUserId,
      action,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { targetUserId },
    });
  },
};

export default securityEvents;
