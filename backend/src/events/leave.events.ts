import { emitEvent, subscribeEvent } from './eventEmitter';
import AuditLog from '../models/AuditLog';

export const LEAVE_EVENTS = {
  SUBMITTED: 'FACULTY_LEAVE_SUBMITTED',
  RECOMMENDED: 'HOD_LEAVE_RECOMMENDED',
  APPROVED: 'LEAVE_APPROVED_FINAL',
  REJECTED: 'LEAVE_REJECTED_FINAL',
};

export const emitLeaveSubmitted = (payload: { id: string; userId: string; departmentId: string }) => {
  emitEvent(LEAVE_EVENTS.SUBMITTED, payload);
};

export const emitLeaveRecommended = (payload: { id: string; userId: string; departmentId: string; hodUserId: string }) => {
  emitEvent(LEAVE_EVENTS.RECOMMENDED, payload);
};

export const emitLeaveApproved = (payload: { id: string; userId: string; departmentId: string; reviewerId: string }) => {
  emitEvent(LEAVE_EVENTS.APPROVED, payload);
};

subscribeEvent(LEAVE_EVENTS.RECOMMENDED, async (payload) => {
  try {
    await AuditLog.create({
      userId: payload.hodUserId,
      action: 'EVENT_LEAVE_RECOMMENDED_BY_HOD',
      ipAddress: '127.0.0.1',
      userAgent: 'Event_System',
      details: { leaveId: payload.id, targetUserId: payload.userId },
    });
  } catch (err) {
    console.error('Failed to handle leave recommendation event:', err);
  }
});
