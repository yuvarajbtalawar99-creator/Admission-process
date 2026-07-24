import Grievance from '../models/Grievance';
import Student from '../models/Student';
import Department from '../models/Department';
import { NotFoundError, BadRequestError } from '../utils/error.util';
import logger from '../utils/logger.util';

class GrievanceService {
  /**
   * Submits a new student grievance.
   */
  async createGrievance(
    userId: string,
    rawCategory: string,
    title: string,
    description: string
  ) {
    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      throw new NotFoundError('Student profile not found.');
    }

    // Map frontend string category to database ENUM values
    const categoryMapping: Record<string, 'ACADEMICS' | 'INFRASTRUCTURE' | 'HOSTEL' | 'FINANCE' | 'OTHER'> = {
      'academics': 'ACADEMICS',
      'infrastructure': 'INFRASTRUCTURE',
      'hostel': 'HOSTEL',
      'hostel & mess': 'HOSTEL',
      'finance': 'FINANCE',
      'finance & scholarships': 'FINANCE',
      'other': 'OTHER'
    };

    const category = categoryMapping[rawCategory.toLowerCase()] || 'OTHER';

    // Fetch student department to assign the grievance HOD owner
    const departmentId = student.departmentId;

    const grievance = await Grievance.create({
      studentId: userId, // Grievance model uses studentId referencing User.id (UUID)
      departmentId,
      title,
      description,
      category,
      priority: 'MEDIUM',
      status: 'PENDING',
      workflowStage: 'HOD_REVIEW',
    });

    logger.info(`Grievance ticket created: ${grievance.id} for user ${userId}`);
    return grievance;
  }

  /**
   * Retrieves a paginated list of grievances submitted by the student.
   */
  async getStudentGrievances(userId: string, page: number = 1, limit: number = 5) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Grievance.findAndCountAll({
      where: { studentId: userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code'],
        }
      ]
    });

    return {
      grievances: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      }
    };
  }
}

export default new GrievanceService();
