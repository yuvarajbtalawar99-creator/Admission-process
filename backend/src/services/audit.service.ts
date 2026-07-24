import AuditLog from '../models/AuditLog';

interface AuditEvent {
  userId?: string | null;
  action: AuditLog['action'];
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

class AuditService {
  /**
   * Logs a security event to the database asynchronously.
   * Catches internal errors so it never blocks the main auth flow.
   */
  public logEvent(event: AuditEvent): void {
    // Fire and forget asynchronous log
    AuditLog.create({
      userId: event.userId || null,
      action: event.action,
      ipAddress: event.ipAddress || null,
      userAgent: event.userAgent || null,
      details: event.details || null,
    }).catch((error) => {
      console.error('Failed to write audit log:', error.message || error);
    });
  }
}

export default new AuditService();
