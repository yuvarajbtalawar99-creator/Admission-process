import { Request, Response } from 'express';
import * as xlsx from 'xlsx';
import db from '../config/database';
import VerifiedUSN from '../models/VerifiedUSN';
import User from '../models/User';
import Student from '../models/Student';
import AuditLog from '../models/AuditLog';
import bcrypt from 'bcryptjs';

const USN_REGEX = /^2JR(\d{2})([A-Z]{2})(\d{3})$/;
const CURRENT_SEMESTER_TYPE = 'ODD'; // Temporarily hardcoded

const getCurrentAcademicYear = (): number => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed: 0 = Jan, 5 = June
  if (month >= 5) {
    return year;
  } else {
    return year - 1;
  }
};

export const uploadUSNRegistry = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const adminId = (req as any).user.id;
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let validCount = 0;
    let invalidCount = 0;
    const errors: string[] = [];
    const validRows: any[] = [];
    const currentAcademicYear = getCurrentAcademicYear();

    // Parse and Validate
    for (const row of data) {
      const { USN, Section } = row;
      const cleanUSN = USN ? USN.trim().toUpperCase() : null;

      if (!cleanUSN) {
        invalidCount++;
        errors.push(`Row missing USN.`);
        continue;
      }

      const match = USN_REGEX.exec(cleanUSN);
      if (!match) {
        invalidCount++;
        errors.push(`USN ${cleanUSN} is invalid format. Expected 2JR(YY)(CC)(NNN).`);
        continue;
      }

      const [, yy, cc, nnn] = match;
      const admissionYear = 2000 + parseInt(yy, 10);
      const department = cc;

      const yearDiff = currentAcademicYear - admissionYear;
      const baseSemester = yearDiff * 2;
      const semester = CURRENT_SEMESTER_TYPE === 'ODD' ? baseSemester + 1 : baseSemester + 2;

      if (semester < 2 || semester > 8) {
        invalidCount++;
        errors.push(`USN ${cleanUSN}: Invalid calculated semester ${semester} (Must be 2-8).`);
        continue;
      }

      validRows.push({
        usn: cleanUSN,
        semester,
        department,
        admissionYear,
        section: Section ? Section.trim() : null,
        status: 'APPROVED',
        uploadedBy: adminId,
      });
    }

    // Insert valid rows
    let inserted = 0;
    for (const validRow of validRows) {
      try {
        await VerifiedUSN.create(validRow);
        inserted++;
      } catch (err: any) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          invalidCount++;
          errors.push(`USN ${validRow.usn} already exists in registry.`);
        } else {
          invalidCount++;
          errors.push(`Error saving USN ${validRow.usn}: ${err.message}`);
        }
      }
    }

    await AuditLog.create({
      userId: adminId,
      action: 'USN_REGISTRY_UPLOADED',
      details: { inserted, invalidCount },
      ipAddress: req.ip || 'Unknown'
    });

    res.status(200).json({
      success: true,
      message: 'USN registry processed successfully',
      data: {
        total: data.length,
        valid: inserted,
        invalid: invalidCount,
        errors
      }
    });

  } catch (error: any) {
    console.error('uploadUSNRegistry error:', error);
    res.status(500).json({ success: false, message: 'Server error processing file' });
  }
};

export const getUSNRegistry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { semester, department, status } = req.query;
    const where: any = {};
    if (semester && semester !== 'ALL') where.semester = parseInt(semester as string, 10);
    if (department && department !== 'ALL') where.department = department;
    if (status && status !== 'ALL') where.status = status;

    const usns = await VerifiedUSN.findAll({ where, order: [['uploadedAt', 'DESC']] });
    res.status(200).json({ success: true, data: usns });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching USN registry' });
  }
};

export const bulkUploadStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const adminId = (req as any).user.id;
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const isPreview = req.body.preview === 'true';

    let readyToCreate = 0;
    let rejected = 0;
    const errors: any[] = [];
    const validStudents: any[] = [];

    // Validation Pass
    for (const row of data) {
      const { USN, Name, Email, Phone, DOB, Gender, Department, Semester } = row;
      const cleanUSN = USN ? USN.trim().toUpperCase() : null;

      if (!cleanUSN || !Name || !Email) {
        rejected++;
        errors.push({ usn: cleanUSN, name: Name, reason: 'Missing USN, Name, or Email' });
        continue;
      }

      if (!USN_REGEX.test(cleanUSN)) {
        rejected++;
        errors.push({ usn: cleanUSN, name: Name, reason: 'Invalid USN Format (Expected 2JR...)' });
        continue;
      }

      // Check USN in VerifiedUSN
      const verifiedUsn = await VerifiedUSN.findOne({ where: { usn: cleanUSN } });
      if (!verifiedUsn) {
        rejected++;
        errors.push({ usn: cleanUSN, name: Name, reason: 'USN not found in officially Verified Registry' });
        continue;
      }
      
      if (verifiedUsn.status !== 'APPROVED') {
        rejected++;
        errors.push({ usn: cleanUSN, name: Name, reason: 'USN already used/provisioned' });
        continue;
      }

      // Check Mismatches
      if (Department && Department.trim() !== verifiedUsn.department) {
        rejected++;
        errors.push({ usn: cleanUSN, name: Name, reason: `Department mismatch. Excel: ${Department}, Registry: ${verifiedUsn.department}` });
        continue;
      }

      const warnings = [];
      if (Semester && parseInt(Semester, 10) !== verifiedUsn.semester) {
        warnings.push(`Semester mismatch ignored (Excel: ${Semester}, Auto-Derived: ${verifiedUsn.semester})`);
      }

      // Check Email duplicate
      const existingUser = await User.findOne({ where: { email: Email } });
      if (existingUser) {
        rejected++;
        errors.push({ usn: cleanUSN, name: Name, reason: 'Email already exists in system' });
        continue;
      }

      validStudents.push({
        usnData: verifiedUsn,
        personalData: { Name, Email, Phone, DOB, Gender },
        warnings
      });
      readyToCreate++;
    }

    if (isPreview) {
      res.status(200).json({
        success: true,
        data: { readyToCreate, rejected, errors, validStudents }
      });
      return;
    }

    // Final Creation Pass (wrapped in transaction)
    let createdCount = 0;
    const creationErrors: any[] = [];

    await db.transaction(async (t) => {
      // Log Attempt
      await AuditLog.create({
        userId: adminId,
        action: 'STUDENT_BULK_UPLOAD_ATTEMPT',
        details: { totalAttempted: validStudents.length },
        ipAddress: req.ip || 'Unknown'
      }, { transaction: t });

      for (const studentData of validStudents) {
        try {
          const { usnData, personalData } = studentData;
          const { Name, Email, Phone, DOB, Gender } = personalData;
          
          const passwordHash = await bcrypt.hash(usnData.usn, 10);
          
          const parts = Name.split(' ');
          const firstName = parts[0];
          const lastName = parts.slice(1).join(' ') || ' ';

          // 1. Create User
          const user = await User.create({
            firstName,
            lastName,
            email: Email,
            phone: Phone ? String(Phone) : null,
            password: passwordHash,
            role: 'STUDENT',
            status: 'ACTIVE',
            mustChangePassword: true,
            username: usnData.usn,
          }, { transaction: t });

          // Fetch Department ID to map from the string department
          // Simplification: We assume the string in USN master matches department code or name
          // Since the prompt specified department is a string in USN, but Student table needs a UUID, 
          // we should ideally fetch the department by code.
          const departmentRow = await db.models.Department.findOne({
            where: { code: usnData.department },
            transaction: t
          }) as any;

          const deptId = departmentRow ? departmentRow.id : null;
          if (!deptId) {
             throw new Error(`Department code ${usnData.department} not found in DB`);
          }

          // 2. Create Student
          await Student.create({
            userId: (user as any).id,
            usn: usnData.usn,
            enrollmentNumber: usnData.usn, // Keep legacy compatibility as requested
            batchYear: usnData.admissionYear,
            departmentId: deptId,
            semester: usnData.semester,
            admissionStatus: 'APPROVED'
          }, { transaction: t });

          // 3. Update VerifiedUSN
          usnData.status = 'USED';
          usnData.usedAt = new Date();
          await usnData.save({ transaction: t });

          // 4. Log creation
          await AuditLog.create({
            userId: adminId,
            action: 'STUDENT_CREATED',
            details: { usn: usnData.usn, semester: usnData.semester },
            ipAddress: req.ip || 'Unknown'
          }, { transaction: t });

          createdCount++;
        } catch (err: any) {
          creationErrors.push({ usn: studentData.usnData.usn, reason: err.message });
          // In Sequelize, if an error happens in transaction and we don't throw, it continues
          // but we DO want to throw to rollback the whole batch if anything fails, 
          // OR we can just throw to trigger full rollback. The user requested transaction to avoid half states.
          throw err; 
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Students created successfully',
      data: { created: createdCount, errors: creationErrors }
    });

  } catch (error: any) {
    console.error('bulkUploadStudents error:', error);
    res.status(500).json({ success: false, message: 'Server error processing file or transaction failed', details: error.message });
  }
};
