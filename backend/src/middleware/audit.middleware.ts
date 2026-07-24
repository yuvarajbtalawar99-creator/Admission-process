import { Request, Response, NextFunction } from 'express';
import auditService from '../services/audit.service';
import logger from '../utils/logger.util';
import AuditLog from '../models/AuditLog';

export interface AuditedRequest extends Request {
  auditBefore?: any;
  auditAfter?: any;
  user?: { id: string; role: string };
}

/**
 * Audit Middleware to automatically record critical actions to the `audit_logs` database table.
 * It intercepts successful HTTP responses (2xx) and logs metadata.
 * Controllers can attach `req.auditBefore` and `req.auditAfter` to capture snapshots of changed entities.
 * 
 * @param action The specific audit log action enum.
 */
export const auditMiddleware = (action: AuditLog['action']) => {
  return (req: AuditedRequest, res: Response, next: NextFunction): void => {
    // Listen to the response finishing
    res.on('finish', () => {
      // Only write to the audit log if the request was successful
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const userId = req.user?.id || null;
          const ipAddress = req.ip || '';
          const userAgent = req.headers['user-agent'] || '';

          auditService.logEvent({
            userId,
            action,
            ipAddress,
            userAgent,
            details: {
              path: req.originalUrl,
              method: req.method,
              params: req.params,
              query: req.query,
              before: req.auditBefore || null,
              after: req.auditAfter || null,
            },
          });
        } catch (error: any) {
          logger.error(`Failed to log audit event in middleware: ${error.message}`, {
            action,
            path: req.originalUrl,
          });
        }
      }
    });

    return next();
  };
};
