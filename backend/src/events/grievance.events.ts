import { emitEvent, subscribeEvent } from './eventEmitter';
import AuditLog from '../models/AuditLog';

export const GRIEVANCE_EVENTS = {
  SUBMITTED: 'STUDENT_GRIEVANCE_SUBMITTED',
  RESOLVED: 'GRIEVANCE_RESOLVED',
};

export const emitGrievanceSubmitted = (payload: { id: string; studentId: string; departmentId: string }) => {
  emitEvent(GRIEVANCE_EVENTS.SUBMITTED, payload);
};

export const emitGrievanceResolved = (payload: { id: string; studentId: string; departmentId: string; resolvedById: string }) => {
  emitEvent(GRIEVANCE_EVENTS.RESOLVED, payload);
};

subscribeEvent(GRIEVANCE_EVENTS.RESOLVED, async (payload) => {
  try {
    await AuditLog.create({
      userId: payload.resolvedById,
      action: 'EVENT_GRIEVANCE_RESOLVED',
      ipAddress: '127.0.0.1',
      userAgent: 'Event_System',
      details: { grievanceId: payload.id, studentId: payload.studentId },
    });
  } catch (err) {
    console.error('Failed to handle grievance resolution event:', err);
  }
});
