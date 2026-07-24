import { Request, Response, NextFunction } from 'express';
import studentService from '../services/student.service';
import Student from '../models/Student';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const getStudentDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const dashboardData = await studentService.getStudentDashboard(userId);

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    return next(error);
  }
};

export const getStudentProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profileData = await studentService.getStudentProfile(userId);

    return res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error: any) {
    if (error.message === 'Student not found') {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    return next(error);
  }
};

export const getStudentAttendanceOverall = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const attendanceData = await studentService.getStudentAttendanceDetailed(student.id);

    return res.status(200).json({
      success: true,
      data: attendanceData,
    });
  } catch (error) {
    return next(error);
  }
};

export const getStudentMarksOverall = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const semesterQuery = req.query.semester;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const semester = semesterQuery ? parseInt(semesterQuery as string, 10) : undefined;
    const marksData = await studentService.getStudentMarksDetailed(student.id, semester);

    return res.status(200).json({
      success: true,
      data: marksData,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSubjectAttendance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { subjectId } = req.params;

    if (!userId || !subjectId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const attendance = await studentService.getSubjectAttendance(
      student.id,
      subjectId
    );

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    return next(error);
  }
};

export const getMarksHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { subjectId } = req.params;

    if (!userId || !subjectId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const history = await studentService.getMarksHistory(student.id, subjectId);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { phone, address } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ phone });

    const student = await Student.findOne({ where: { userId } });
    if (student) {
      await student.update({ address });
      await studentService.invalidateCache(userId);
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export const downloadHallTicket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { examId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const ticketData = await studentService.generateHallTicket(student.id, examId);

    return res.status(200).json({
      success: true,
      data: ticketData,
    });
  } catch (error) {
    return next(error);
  }
};