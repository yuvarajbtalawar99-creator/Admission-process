import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import User from '../models/User';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import HOD from '../models/HOD';
import Admin from '../models/Admin';
import Parent from '../models/Parent';
import Department from '../models/Department';

// ─── GET /api/admin/users/students ───────────────────────────────────────────
export const getStudents = async (
  req: Request, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const { search, departmentId, semester, status, page = '1', limit = '10' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: Record<string, unknown> = {};
    if (departmentId && departmentId !== 'ALL') whereClause.departmentId = departmentId;
    if (semester && semester !== 'ALL') whereClause.semester = semester;

    const userWhereClause: Record<string, unknown> = { role: 'STUDENT' };
    if (status && status !== 'ALL') userWhereClause.status = status;
    if (search) {
      userWhereClause[Op.or as any] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName:  { [Op.iLike]: `%${search}%` } },
        { email:     { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Student.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          where: userWhereClause,
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'status', 'profileImage', 'username'],
        },
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    const [activeCount, inactiveCount, totalCount] = await Promise.all([
      User.count({ where: { role: 'STUDENT', status: 'ACTIVE' } }),
      User.count({ where: { role: 'STUDENT', status: { [Op.ne]: 'ACTIVE' } } }),
      User.count({ where: { role: 'STUDENT' } }),
    ]);

    return res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: Number(page), limit: Number(limit), totalPages: Math.ceil(count / Number(limit)) },
      stats: { total: totalCount, active: activeCount, inactive: inactiveCount },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/users/teachers ───────────────────────────────────────────
export const getTeachers = async (
  req: Request, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const { search, departmentId, status, page = '1', limit = '10' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: Record<string, unknown> = {};
    if (departmentId && departmentId !== 'ALL') whereClause.departmentId = departmentId;

    const userWhereClause: Record<string, unknown> = { role: 'TEACHER' };
    if (status && status !== 'ALL') userWhereClause.status = status;
    if (search) {
      userWhereClause[Op.or as any] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName:  { [Op.iLike]: `%${search}%` } },
        { email:     { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Teacher.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          where: userWhereClause,
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'status', 'profileImage'],
        },
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    const [activeCount, inactiveCount, totalCount] = await Promise.all([
      User.count({ where: { role: 'TEACHER', status: 'ACTIVE' } }),
      User.count({ where: { role: 'TEACHER', status: { [Op.ne]: 'ACTIVE' } } }),
      User.count({ where: { role: 'TEACHER' } }),
    ]);

    return res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: Number(page), limit: Number(limit), totalPages: Math.ceil(count / Number(limit)) },
      stats: { total: totalCount, active: activeCount, inactive: inactiveCount },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/users/hods ────────────────────────────────────────────────
export const getHODs = async (
  _req: Request, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const hods = await HOD.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'status'] },
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
      ],
    });
    return res.json({ success: true, data: hods });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/users/principals ─────────────────────────────────────────
export const getPrincipals = async (
  _req: Request, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const principals = await Admin.findAll({
      include: [
        {
          model: User,
          as: 'user',
          where: { role: 'SUPER_ADMIN' },
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'status', 'createdAt'],
        },
      ],
    });
    return res.json({ success: true, data: principals });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/users/parents ────────────────────────────────────────────
export const getParents = async (
  req: Request, res: Response, next: NextFunction
): Promise<any> => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Parent.findAndCountAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'status'] },
        {
          model: Student,
          as: 'student',
          include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'username'] }],
        },
      ],
      limit: Number(limit),
      offset,
    });

    const totalCount = await User.count({ where: { role: 'PARENT' } });

    return res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: Number(page), limit: Number(limit), totalPages: Math.ceil(count / Number(limit)) },
      stats: { total: totalCount },
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/admin/users/students/:id ───────────────────────────────────────
export const updateStudent = async (
  req: Request, res: Response, next: NextFunction
): Promise<any> => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, status, semester, address } = req.body;

    const student = await Student.findByPk(id, {
      include: [{ model: User, as: 'user' }],
      transaction: t,
    });

    if (!student) {
      await t.rollback();
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const userUpdates: Record<string, unknown> = {};
    if (firstName !== undefined) userUpdates.firstName = firstName;
    if (lastName  !== undefined) userUpdates.lastName  = lastName;
    if (email     !== undefined) userUpdates.email     = email;
    if (phone     !== undefined) userUpdates.phone     = phone;
    if (status    !== undefined) userUpdates.status    = status;

    if (Object.keys(userUpdates).length > 0) {
      await User.update(userUpdates, { where: { id: (student as any).userId }, transaction: t });
    }

    const studentUpdates: Record<string, unknown> = {};
    if (semester !== undefined) studentUpdates.semester = semester;
    if (address  !== undefined) studentUpdates.address  = address;

    if (Object.keys(studentUpdates).length > 0) {
      await student.update(studentUpdates, { transaction: t });
    }

    await t.commit();

    const updated = await Student.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'status', 'profileImage', 'username'] },
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
      ],
    });

    return res.json({ success: true, message: 'Student updated successfully', data: updated });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

// ─── PUT /api/admin/users/teachers/:id ───────────────────────────────────────
export const updateTeacher = async (
  req: Request, res: Response, next: NextFunction
): Promise<any> => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, status, departmentId } = req.body;

    const teacher = await Teacher.findByPk(id, {
      include: [{ model: User, as: 'user' }],
      transaction: t,
    });

    if (!teacher) {
      await t.rollback();
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }

    const userUpdates: Record<string, unknown> = {};
    if (firstName !== undefined) userUpdates.firstName = firstName;
    if (lastName  !== undefined) userUpdates.lastName  = lastName;
    if (email     !== undefined) userUpdates.email     = email;
    if (phone     !== undefined) userUpdates.phone     = phone;
    if (status    !== undefined) userUpdates.status    = status;

    if (Object.keys(userUpdates).length > 0) {
      await User.update(userUpdates, { where: { id: (teacher as any).userId }, transaction: t });
    }

    if (departmentId !== undefined) {
      await teacher.update({ departmentId }, { transaction: t });
    }

    await t.commit();

    const updated = await Teacher.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'status', 'profileImage'] },
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
      ],
    });

    return res.json({ success: true, message: 'Teacher updated successfully', data: updated });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
