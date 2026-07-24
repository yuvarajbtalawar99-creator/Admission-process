import sequelize from '../config/database';
import logger from './logger.util';

/**
 * Dynamically applies PostgreSQL Row-Level Security (RLS) policies
 * to critical student and admissions tables in the ERP system.
 */
export const dbRlsSetup = async (): Promise<void> => {
  logger.info('Initializing Database Row-Level Security (RLS) policies...');
  
  try {
    // 1. Create app_internal background bypass role if not exists
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_internal') THEN
          CREATE ROLE app_internal;
        END IF;
      END
      $$;
    `);

    // Grant app_internal privilege to current database connection user
    const dbUser = process.env.DB_USER || 'erp_user';
    await sequelize.query(`GRANT app_internal TO "${dbUser}";`);

    const tables = ['students', 'parents', 'marks', 'attendance', 'fees', 'admissions'];

    for (const table of tables) {
      // Enable RLS and FORCE RLS (enforces policy restrictions even for the table owner/erp_user)
      await sequelize.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      await sequelize.query(`ALTER TABLE "${table}" FORCE ROW LEVEL SECURITY;`);
    }

    // --- Table 1: Students RLS Policy ---
    await sequelize.query('DROP POLICY IF EXISTS student_isolation ON students;');
    await sequelize.query(`
      CREATE POLICY student_isolation ON students
      USING (
        COALESCE(current_setting('app.current_user_role', true), 'ANON') IN ('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'app_internal')
        OR "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
        OR (
          COALESCE(current_setting('app.current_user_role', true), 'ANON') = 'PARENT'
          AND id IN (
            SELECT "studentId" FROM parents 
            WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
          )
        )
        OR (
          COALESCE(current_setting('app.current_user_role', true), 'ANON') IN ('TEACHER', 'HOD')
          AND "departmentId" IN (
            SELECT "departmentId" FROM teachers 
            WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
            UNION ALL
            SELECT "departmentId" FROM hods 
            WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid AND "isActive" = true
          )
        )
      );
    `);

    // --- Table 2: Parents RLS Policy ---
    await sequelize.query('DROP POLICY IF EXISTS parents_isolation ON parents;');
    await sequelize.query(`
      CREATE POLICY parents_isolation ON parents
      USING (
        COALESCE(current_setting('app.current_user_role', true), 'ANON') IN ('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'app_internal')
        OR "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
        OR (
          COALESCE(current_setting('app.current_user_role', true), 'ANON') = 'STUDENT'
          AND "studentId" IN (
            SELECT id FROM students 
            WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
          )
        )
      );
    `);

    // --- Table 3: Marks RLS Policy ---
    await sequelize.query('DROP POLICY IF EXISTS marks_isolation ON marks;');
    await sequelize.query(`
      CREATE POLICY marks_isolation ON marks
      USING (
        COALESCE(current_setting('app.current_user_role', true), 'ANON') IN ('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'app_internal')
        OR "studentId" IN (
          SELECT id FROM students 
          WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
        )
        OR "studentId" IN (
          SELECT "studentId" FROM parents 
          WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
        )
        OR "studentId" IN (
          SELECT id FROM students 
          WHERE "departmentId" IN (
            SELECT "departmentId" FROM teachers 
            WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
            UNION ALL
            SELECT "departmentId" FROM hods 
            WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid AND "isActive" = true
          )
        )
      );
    `);

    // --- Table 4: Attendance RLS Policy ---
    await sequelize.query('DROP POLICY IF EXISTS attendance_isolation ON attendance;');
    await sequelize.query(`
      CREATE POLICY attendance_isolation ON attendance
      USING (
        COALESCE(current_setting('app.current_user_role', true), 'ANON') IN ('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'app_internal')
        OR "studentId" IN (
          SELECT id FROM students 
          WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
        )
        OR "studentId" IN (
          SELECT "studentId" FROM parents 
          WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
        )
        OR "studentId" IN (
          SELECT id FROM students 
          WHERE "departmentId" IN (
            SELECT "departmentId" FROM teachers 
            WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
            UNION ALL
            SELECT "departmentId" FROM hods 
            WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid AND "isActive" = true
          )
        )
      );
    `);

    // --- Table 5: Fees RLS Policy ---
    await sequelize.query('DROP POLICY IF EXISTS fees_isolation ON fees;');
    await sequelize.query(`
      CREATE POLICY fees_isolation ON fees
      USING (
        COALESCE(current_setting('app.current_user_role', true), 'ANON') IN ('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'app_internal')
        OR "studentId" IN (
          SELECT id FROM students 
          WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
        )
        OR "studentId" IN (
          SELECT "studentId" FROM parents 
          WHERE "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
        )
      );
    `);

    // --- Table 6: Admissions RLS Policy ---
    await sequelize.query('DROP POLICY IF EXISTS admissions_isolation ON admissions;');
    await sequelize.query(`
      CREATE POLICY admissions_isolation ON admissions
      USING (
        COALESCE(current_setting('app.current_user_role', true), 'ANON') IN ('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'app_internal')
        OR "userId" = COALESCE(current_setting('app.current_user_id', true), 'NONE')::uuid
      );
    `);

    logger.info('Database Row-Level Security (RLS) policies applied successfully.');
  } catch (error: any) {
    logger.error(`Failed to set up database RLS: ${error.message}`);
    throw error;
  }
};
