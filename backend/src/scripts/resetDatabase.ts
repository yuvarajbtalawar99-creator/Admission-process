import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import db from '../config/database';
import User from '../models/User';
import Admission from '../models/Admission';
import AdmissionDocument from '../models/AdmissionDocument';
import AdmissionAcademicDetail from '../models/AdmissionAcademicDetail';
import AdmissionAddress from '../models/AdmissionAddress';
import AdmissionParentDetail from '../models/AdmissionParentDetail';
import AdmissionPersonalDetail from '../models/AdmissionPersonalDetail';
import AuditLog from '../models/AuditLog';
import Notification from '../models/Notification';
import Otp from '../models/Otp';
import Parent from '../models/Parent';
import Student from '../models/Student';
import UsnRegistry from '../models/UsnRegistry';
import redisClient from '../config/redis';

async function resetDatabase() {
  console.log('🚀 Starting Development Database Reset...');

  try {
    await db.authenticate();
    console.log('✓ Database connected successfully.');

    const transaction = await db.transaction();

    try {
      console.log('🧹 Deleting admission child details...');
      await AdmissionDocument.destroy({ where: {}, truncate: false, transaction });
      await AdmissionAcademicDetail.destroy({ where: {}, truncate: false, transaction });
      await AdmissionAddress.destroy({ where: {}, truncate: false, transaction });
      await AdmissionParentDetail.destroy({ where: {}, truncate: false, transaction });
      await AdmissionPersonalDetail.destroy({ where: {}, truncate: false, transaction });

      console.log('🧹 Deleting admissions...');
      await Admission.destroy({ where: {}, truncate: false, transaction });

      console.log('🧹 Deleting student records & parents...');
      await Student.destroy({ where: {}, truncate: false, transaction });
      await Parent.destroy({ where: {}, truncate: false, transaction });

      console.log('🧹 Deleting transactional logs, OTPs, notifications & USN registries...');
      await Otp.destroy({ where: {}, truncate: false, transaction });
      await Notification.destroy({ where: {}, truncate: false, transaction });
      await AuditLog.destroy({ where: {}, truncate: false, transaction });
      await UsnRegistry.destroy({ where: {}, truncate: false, transaction });

      console.log('🧹 Deleting student users (preserving Admin and Principal)...');
      await db.query(
        `DELETE FROM "users" WHERE role NOT IN ('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL', 'TEACHER', 'HOD');`,
        { transaction }
      );

      // Reset all PostgreSQL auto-increment sequences if any
      console.log('🔄 Resetting auto-increment sequences...');
      await db.query(`
        DO $$
        DECLARE r RECORD;
        BEGIN
          FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
            EXECUTE 'ALTER SEQUENCE ' || quote_ident(r.sequence_name) || ' RESTART WITH 1;';
          END LOOP;
        END $$;
      `, { transaction });

      await transaction.commit();
      console.log('✓ Database records deleted and sequences reset successfully.');
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    // Clear uploaded files in uploads directory
    console.log('📂 Cleaning uploaded files directory...');
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let deletedFilesCount = 0;
      for (const file of files) {
        if (file !== '.gitkeep') {
          const filePath = path.join(uploadsDir, file);
          if (fs.lstatSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            deletedFilesCount++;
          }
        }
      }
      console.log(`✓ Deleted ${deletedFilesCount} uploaded file(s).`);
    }

    // Clear Redis Session/Cache if connected
    try {
      if (redisClient && typeof redisClient.flushall === 'function') {
        await redisClient.flushall();
        console.log('✓ Redis cache flushed successfully.');
      }
    } catch (redisErr: any) {
      console.warn('⚠️ Redis flush skipped:', redisErr.message);
    }

    // ═══ VERIFICATION ═══
    console.log('\n========================================');
    console.log('🔍 VERIFICATION SUMMARY');
    console.log('========================================');

    const preservedUsers = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'role']
    });
    console.log(`\nSystem Users Preserved (${preservedUsers.length}):`);
    preservedUsers.forEach(u => console.log(`  - [${u.role}] ${u.firstName || ''} ${u.lastName || ''} (${u.email})`));

    const studentCount = await User.count({ where: { role: 'STUDENT' } });
    const admissionCount = await Admission.count();
    const docCount = await AdmissionDocument.count();
    const otpCount = await Otp.count();
    const notifCount = await Notification.count();
    const auditCount = await AuditLog.count();

    console.log('\nTransactional Record Counts:');
    console.log(`  • Student Users: ${studentCount}`);
    console.log(`  • Admission Applications: ${admissionCount}`);
    console.log(`  • Uploaded Documents: ${docCount}`);
    console.log(`  • OTP Records: ${otpCount}`);
    console.log(`  • Notifications: ${notifCount}`);
    console.log(`  • Audit Logs: ${auditCount}`);

    const nextAppSeq = String(admissionCount + 1).padStart(5, '0');
    const year = new Date().getFullYear();
    console.log(`\nNext Generated Application Number: APP-${year}-${nextAppSeq}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();
