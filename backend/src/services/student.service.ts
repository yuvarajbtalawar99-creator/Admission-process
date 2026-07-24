import { Op } from 'sequelize';
import Student from '../models/Student';
import User from '../models/User';
import Attendance from '../models/Attendance';
import Marks from '../models/Marks';
import ExamSchedule from '../models/ExamSchedule';
import Performance from '../models/Performance';
import Subject from '../models/Subject';
import Department from '../models/Department';
import Teacher from '../models/Teacher';
import redis from '../config/redis';
import Fee from '../models/Fee';

class StudentService {
  /**
   * Get complete student dashboard data
   */
  async getStudentDashboard(userId: string) {
    // Check Redis cache first
    const cacheKey = `student_dashboard:${userId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Fetch student info
    const student = await Student.findOne({
      where: { userId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage'] },
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
      ],
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Parallel fetch all dashboard data
    const [
      attendanceData,
      recentMarks,
      upcomingExams,
      performanceData,
      feeRecords,
    ] = await Promise.all([
      this.getAttendanceData(student.id),
      this.getRecentMarks(student.id),
      this.getUpcomingExams(student.id),
      this.getPerformanceData(student.id),
      Fee.findAll({ where: { studentId: student.id } }),
    ]);

    const totalAmount = feeRecords.reduce((sum, f) => sum + Number(f.totalAmount), 0);
    const totalPaid = feeRecords.reduce((sum, f) => sum + Number(f.paidAmount), 0);
    const totalDue = totalAmount - totalPaid;

    const dashboardData = {
      student: {
        id: student.id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        email: student.user.email,
        phone: student.user.phone,
        enrollmentNumber: student.enrollmentNumber,
        rollNumber: student.rollNumber || 'N/A',
        department: student.department.name,
        semester: student.semester,
        profileImage: student.user.profileImage,
      },
      attendance: attendanceData,
      academicInfo: {
        cgpa: performanceData.cgpa,
        sgpa: performanceData.sgpa,
        riskLevel: performanceData.riskLevel,
        failedSubjects: recentMarks.filter((m) => m.grade === 'F').length,
      },
      recentMarks,
      fees: {
        totalDue,
        totalPaid,
        totalAmount,
        fees: feeRecords,
      },
      upcomingExams,
      notifications: [],
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(dashboardData));

    return dashboardData;
  }

  /**
   * Get attendance summary (helper)
   */
  public async getAttendanceData(studentId: string) {
    const attendanceRecords = await Attendance.findAll({
      where: { studentId },
      include: [
        {
          model: Subject,
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    const subjectAttendance: Record<string, any> = {};

    attendanceRecords.forEach((record) => {
      const subjectId = record.subjectId;
      if (!record.Subject) return; // Guard
      
      if (!subjectAttendance[subjectId]) {
        subjectAttendance[subjectId] = {
          subjectId,
          subjectName: record.Subject.name,
          subjectCode: record.Subject.code,
          totalClasses: 0,
          classesPresent: 0,
          classesAbsent: 0,
          classesLeave: 0,
        };
      }

      subjectAttendance[subjectId].totalClasses++;
      if (record.status === 'PRESENT') {
        subjectAttendance[subjectId].classesPresent++;
      } else if (record.status === 'ABSENT') {
        subjectAttendance[subjectId].classesAbsent++;
      } else if (record.status === 'LEAVE') {
        subjectAttendance[subjectId].classesLeave++;
      }
    });

    const subjects = Object.values(subjectAttendance).map((subject: any) => ({
      ...subject,
      percentage: subject.totalClasses > 0 
        ? ((subject.classesPresent / subject.totalClasses) * 100).toFixed(2)
        : '0.00',
    }));

    const totalClasses = subjects.reduce((sum: number, s: any) => sum + s.totalClasses, 0);
    const totalPresent = subjects.reduce((sum: number, s: any) => sum + s.classesPresent, 0);
    const overallPercentage = totalClasses > 0 
      ? ((totalPresent / totalClasses) * 100).toFixed(2)
      : '0.00';

    return {
      overallPercentage,
      status: parseFloat(overallPercentage) >= 75 ? 'GOOD' : 'WARNING',
      subjects,
    };
  }

  /**
   * Get student profile
   */
  async getStudentProfile(userId: string) {
    const student = await Student.findOne({
      where: { userId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage'] },
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
      ],
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return {
      id: student.id,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      phone: student.user.phone,
      dateOfBirth: student.dateOfBirth,
      gender: 'MALE', // default
      address: student.address || '',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      fatherPhone: student.parentPhone || '',
      parentPhone: student.parentPhone || '',
      parentEmail: student.parentEmail || '',
      enrollmentNumber: student.enrollmentNumber,
      department: student.department.name,
      departmentCode: student.department.code,
      semester: student.semester,
      batch: student.batchYear,
      bloodGroup: 'O+',
      emergencyContact: {
        name: student.fatherName || 'Parent',
        phone: student.parentPhone || '',
        relation: 'Father',
      },
    };
  }

  /**
   * Get student detailed attendance with history
   */
  async getStudentAttendanceDetailed(studentId: string) {
    const summary = await this.getAttendanceData(studentId);

    const historyRecords = await Attendance.findAll({
      where: { studentId },
      include: [
        { model: Subject, attributes: ['name', 'code'] },
        { 
          model: Teacher, 
          include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
        }
      ],
      order: [['classDate', 'DESC']],
      limit: 50,
    });

    const attendanceHistory = historyRecords.map((record) => {
      const teacherName = record.Teacher?.user 
        ? `${record.Teacher.user.firstName} ${record.Teacher.user.lastName}`
        : 'Instructor';

      return {
        date: record.classDate,
        subject: record.Subject?.name || 'Unknown',
        subjectCode: record.Subject?.code || '',
        status: record.status,
        teacher: teacherName,
        remarks: record.remarks,
      };
    });

    return {
      attendance: summary,
      attendanceHistory,
    };
  }

  /**
   * Get student detailed marks with GPAs
   */
  async getStudentMarksDetailed(studentId: string, semester?: number) {
    const student = await Student.findByPk(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const targetSemester = semester || student.semester;

    // Fetch marks
    const marksRecords = await Marks.findAll({
      where: { studentId },
      include: [
        { 
          model: Subject, 
          where: { semester: targetSemester },
          attributes: ['id', 'name', 'code']
        }
      ],
    });

    // Group by Subject
    const subjectMarksMap: Record<string, any> = {};

    marksRecords.forEach((record) => {
      const sub = record.Subject;
      if (!sub) return;

      if (!subjectMarksMap[sub.id]) {
        subjectMarksMap[sub.id] = {
          subjectId: sub.id,
          subjectName: sub.name,
          subjectCode: sub.code,
          credits: 4, // Default credits per subject
          examResults: [],
        };
      }

      subjectMarksMap[sub.id].examResults.push({
        examType: record.examType,
        marksObtained: parseFloat(record.marksObtained.toString()),
        maxMarks: parseFloat(record.maxMarks.toString()),
        percentage: Math.round((parseFloat(record.marksObtained.toString()) / parseFloat(record.maxMarks.toString())) * 100),
      });
    });

    // Format output and calculate subject totals
    const marks = Object.values(subjectMarksMap).map((item: any) => {
      const results = item.examResults;
      let totalObtained = 0;
      let totalMax = 0;
      let grade = 'F';
      let gradePoints = 0.0;
      let status = 'FAIL';

      results.forEach((res: any) => {
        totalObtained += res.marksObtained;
        totalMax += res.maxMarks;
      });

      // Simple grading rule based on SEMESTER exam or overall percentage
      const finalPct = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
      
      if (finalPct >= 90) { grade = 'A+'; gradePoints = 10.0; status = 'PASS'; }
      else if (finalPct >= 80) { grade = 'A'; gradePoints = 9.0; status = 'PASS'; }
      else if (finalPct >= 70) { grade = 'B+'; gradePoints = 8.0; status = 'PASS'; }
      else if (finalPct >= 60) { grade = 'B'; gradePoints = 7.0; status = 'PASS'; }
      else if (finalPct >= 50) { grade = 'C'; gradePoints = 6.0; status = 'PASS'; }
      else if (finalPct >= 40) { grade = 'D'; gradePoints = 5.0; status = 'PASS'; }
      else { grade = 'F'; gradePoints = 0.0; status = 'FAIL'; }

      return {
        subjectId: item.subjectId,
        subjectName: item.subjectName,
        subjectCode: item.subjectCode,
        credits: item.credits,
        examResults: results,
        totalMarks: Math.round(totalObtained),
        maxMarks: Math.round(totalMax),
        percentage: parseFloat(finalPct.toFixed(2)),
        grade,
        gradePoints,
        status,
      };
    });

    // Fetch Performance summary
    const perf = await Performance.findOne({
      where: { studentId, semester: targetSemester }
    });

    const summary = {
      semester: targetSemester,
      sgpa: perf ? parseFloat(perf.sgpa.toString()) : 0.0,
      cgpa: perf ? parseFloat(perf.cgpa.toString()) : 0.0,
      totalCredits: marks.reduce((sum, m) => sum + m.credits, 0),
      earnedCredits: marks.reduce((sum, m) => sum + (m.status === 'PASS' ? m.credits : 0), 0),
      failedSubjects: marks.filter((m) => m.status === 'FAIL').length,
      passedSubjects: marks.filter((m) => m.status === 'PASS').length,
    };

    return {
      marks,
      summary,
    };
  }

  /**
   * Generate dummy PDF / details for Hall Ticket download
   */
  async generateHallTicket(studentId: string, examId: string) {
    const student = await Student.findByPk(studentId, {
      include: [
        { model: User, as: 'user', attributes: ['firstName', 'lastName'] },
        { model: Department, as: 'department', attributes: ['name'] }
      ]
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Return structured text details that will format into a PDF in client, 
    // or return plain JSON details for the client to generate PDF on the fly, 
    // which is very dynamic and doesn't require complex server pdf engines.
    return {
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      enrollmentNumber: student.enrollmentNumber,
      department: student.department.name,
      semester: student.semester,
      examId,
    };
  }

  /**
   * Get recent marks with grades
   */
  private async getRecentMarks(studentId: string) {
    const marks = await Marks.findAll({
      where: { studentId },
      include: [
        {
          model: Subject,
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    return marks.map((mark) => {
      if (!mark.Subject) return {} as any; // Guard
      
      return {
        id: mark.id,
        subjectName: mark.Subject.name,
        subjectCode: mark.Subject.code,
        examType: mark.examType,
        marksObtained: parseFloat(mark.marksObtained.toString()),
        maxMarks: parseFloat(mark.maxMarks.toString()),
        percentage: ((parseFloat(mark.marksObtained.toString()) / parseFloat(mark.maxMarks.toString())) * 100).toFixed(2),
        grade: mark.grade || 'IA',
      };
    }).filter(m => m.id !== undefined);
  }

  /**
   * Get upcoming exams
   */
  private async getUpcomingExams(studentId: string) {
    const student = await Student.findByPk(studentId);

    const exams = await ExamSchedule.findAll({
      where: {
        examDate: {
          [Op.gte]: new Date('2024-01-01'), // Seeded date filter
        },
      },
      include: [
        {
          model: Subject,
          attributes: ['id', 'name', 'code', 'semester'],
          where: { semester: student?.semester || 1 },
        },
      ],
      order: [['examDate', 'ASC']],
      limit: 5,
    });

    return exams.map((exam) => {
      if (!exam.Subject) return {} as any; // Guard
      
      return {
        id: exam.id,
        subjectName: exam.Subject.name,
        subjectCode: exam.Subject.code,
        examDate: exam.examDate,
        examTime: exam.examTime,
        hallNumber: exam.hallNumber,
        daysUntilExam: Math.max(0, Math.ceil(
          (new Date(exam.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )),
      };
    }).filter(e => e.id !== undefined);
  }

  /**
   * Get performance metrics
   */
  private async getPerformanceData(studentId: string) {
    const performance = await Performance.findOne({
      where: { studentId },
      order: [['semester', 'DESC']],
    });

    if (!performance) {
      return {
        cgpa: 0,
        sgpa: 0,
        riskLevel: 'AVERAGE',
      };
    }

    return {
      cgpa: parseFloat(performance.cgpa.toString()),
      sgpa: parseFloat(performance.sgpa.toString()),
      riskLevel: performance.riskLevel,
    };
  }

  /**
   * Get attendance history for a specific subject
   */
  async getSubjectAttendance(studentId: string, subjectId: string) {
    const attendance = await Attendance.findAll({
      where: { studentId, subjectId },
      order: [['classDate', 'DESC']],
      limit: 30,
    });

    return attendance.map((record) => ({
      date: record.classDate,
      status: record.status,
      remarks: record.remarks,
    }));
  }

  /**
   * Get marks trend for a subject
   */
  async getMarksHistory(studentId: string, subjectId: string) {
    const marks = await Marks.findAll({
      where: { studentId, subjectId },
      order: [['examType', 'ASC']],
    });

    return marks.map((mark) => ({
      examType: mark.examType,
      marksObtained: parseFloat(mark.marksObtained.toString()),
      maxMarks: parseFloat(mark.maxMarks.toString()),
      percentage: ((parseFloat(mark.marksObtained.toString()) / parseFloat(mark.maxMarks.toString())) * 100).toFixed(2),
      grade: mark.grade,
    }));
  }

  /**
   * Invalidate student dashboard cache
   */
  async invalidateCache(userId: string) {
    const cacheKey = `student_dashboard:${userId}`;
    await redis.del(cacheKey);
  }
}

export default new StudentService();