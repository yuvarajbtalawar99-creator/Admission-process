import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import grievanceService from '../services/grievance.service';

export const getStudentGrievances = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 5;

    const data = await grievanceService.getStudentGrievances(userId, page, limit);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const submitGrievance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { category, subject, title, description } = req.body;

    const finalTitle = title || subject;
    if (!category || !finalTitle || !description) {
      return res.status(400).json({ error: 'Category, subject/title, and description are required.' });
    }

    const grievance = await grievanceService.createGrievance(
      userId,
      category,
      finalTitle,
      description
    );

    return res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully.',
      data: grievance,
    });
  } catch (error) {
    return next(error);
  }
};
