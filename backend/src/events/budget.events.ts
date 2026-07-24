import { emitEvent, subscribeEvent } from './eventEmitter';
import AuditLog from '../models/AuditLog';

export const BUDGET_EVENTS = {
  RECOMMENDED: 'HOD_BUDGET_RECOMMENDED',
  APPROVED: 'PRINCIPAL_BUDGET_APPROVED',
  REJECTED: 'PRINCIPAL_BUDGET_REJECTED',
};

// Dispatch helpers
export const emitBudgetRecommended = (payload: { id: string; departmentId: string; amount: number; title: string; hodUserId: string }) => {
  emitEvent(BUDGET_EVENTS.RECOMMENDED, payload);
};

export const emitBudgetApproved = (payload: { id: string; departmentId: string; principalUserId: string }) => {
  emitEvent(BUDGET_EVENTS.APPROVED, payload);
};

// Listeners / Handlers
subscribeEvent(BUDGET_EVENTS.RECOMMENDED, async (payload) => {
  try {
    // Automatically create AuditLog for real-time propagation trace
    await AuditLog.create({
      userId: payload.hodUserId,
      action: 'EVENT_BUDGET_RECOMMENDED',
      ipAddress: '127.0.0.1',
      userAgent: 'Event_System',
      details: { budgetId: payload.id, status: 'PENDING_PRINCIPAL_APPROVAL', amount: payload.amount, title: payload.title },
    });
  } catch (err) {
    console.error('Failed to handle budget recommendation event:', err);
  }
});
