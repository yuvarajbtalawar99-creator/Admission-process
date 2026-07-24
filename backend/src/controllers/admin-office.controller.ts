import { Request, Response } from 'express';
import HOD from '../models/HOD';
import Parent from '../models/Parent';
import Notification from '../models/Notification';
import Message from '../models/Message';
import User from '../models/User';
import AuditLog from '../models/AuditLog';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// ==========================================
// Notifications
// ==========================================

export const createDraftNotification = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only ADMIN can draft notifications.' });
    }
    const { title, content, type, audience } = req.body;
    const notification = await Notification.create({
      title,
      content,
      type,
      audience,
      status: 'DRAFT',
      createdByAdminId: req.user!.id,
    });
    return res.json({ message: 'Notification drafted successfully', data: notification });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const publishNotification = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (req.user!.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Only SUPER_ADMIN can publish notifications.' });
    }
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    if (notification.status === 'PUBLISHED') return res.status(400).json({ error: 'Already published' });

    await notification.update({
      status: 'PUBLISHED',
      approvedByAdminId: req.user!.id,
      publishedAt: new Date(),
    });

    await AuditLog.create({
      userId: req.user!.id,
      action: 'SUPER_ADMIN_PUBLISHED_NOTICE',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { notificationId: id },
    });

    return res.json({ message: 'Notification published successfully', data: notification });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const listNotifications = async (req: Request, res: Response): Promise<any> => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'createdBy', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
      ]
    });
    return res.json({ data: notifications });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

// ==========================================
// HODs
// ==========================================

export const assignHOD = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (req.user!.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Only SUPER_ADMIN can assign HODs.' });
    }
    const { userId, departmentId, tenureStartDate, appointmentOrderNo, appointmentDate } = req.body;
    
    // Deactivate current HOD for department if exists
    await HOD.update({ isActive: false }, { where: { departmentId, isActive: true } });

    const hod = await HOD.create({
      userId,
      departmentId,
      tenureStartDate,
      appointmentOrderNo,
      appointmentDate,
      isActive: true,
      appointedByAdminId: req.user!.id,
    });

    // Elevate user role to HOD
    await User.update({ role: 'HOD' }, { where: { id: userId } });

    await AuditLog.create({
      userId: req.user!.id,
      action: 'HOD_APPOINTED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { hodId: hod.id, departmentId, userId },
    });

    return res.json({ message: 'HOD assigned successfully', data: hod });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const listHODs = async (req: Request, res: Response): Promise<any> => {
  try {
    const hods = await HOD.findAll({
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email', 'phone'] }]
    });
    return res.json({ data: hods });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

// ==========================================
// Messages (Official Communications)
// ==========================================

export const resolveTicket = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const message = await Message.findByPk(id);
    if (!message) return res.status(404).json({ error: 'Ticket not found' });

    // Enforce handledByAdminId on CLOSED status
    await message.update({
      status: 'CLOSED',
      handledByAdminId: req.user!.id
    });

    await AuditLog.create({
      userId: req.user!.id,
      action: 'TICKET_RESOLVED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { ticketId: id },
    });

    return res.json({ message: 'Ticket resolved successfully', data: message });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const listTickets = async (req: Request, res: Response): Promise<any> => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'sender', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'handledBy', attributes: ['firstName', 'lastName'] }
      ]
    });
    return res.json({ data: messages });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

// ==========================================
// Parents
// ==========================================
export const listParents = async (req: Request, res: Response): Promise<any> => {
  try {
    const parents = await Parent.findAll({
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email', 'phone'] }]
    });
    return res.json({ data: parents });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};
