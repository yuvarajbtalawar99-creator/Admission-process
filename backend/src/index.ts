import app from './app';
import sequelize from './config/database';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Authenticate database connection
    console.log('Connecting to PostgreSQL database...');
    await sequelize.authenticate();
    
    // Split lifecycle: only run schema alteration in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Syncing database schema (development alter)...');
      await sequelize.sync({ alter: true });
    } else {
      console.log('Syncing database schema...');
      await sequelize.sync();
    }
    
    // Alter PostgreSQL enum values for Principal actions if they are missing
    try {
      const enumValues = [
        'PRINCIPAL_APPROVED_ADMISSION',
        'PRINCIPAL_REJECTED_ADMISSION',
        'PRINCIPAL_APPROVED_BUDGET',
        'PRINCIPAL_REJECTED_BUDGET',
        'PRINCIPAL_APPROVED_LEAVE',
        'PRINCIPAL_REJECTED_LEAVE',
        'PRINCIPAL_APPROVED_CURRICULUM_CHANGE',
        'PRINCIPAL_REJECTED_CURRICULUM_CHANGE',
        'PRINCIPAL_APPROVED_EVALUATION',
        'PRINCIPAL_REJECTED_EVALUATION',
        'PRINCIPAL_DECIDED_FEE_WAIVER'
      ];
      for (const val of enumValues) {
        await sequelize.query(`ALTER TYPE "enum_audit_logs_action" ADD VALUE IF NOT EXISTS '${val}'`).catch(() => {
          // ADD VALUE IF NOT EXISTS works in PG, catch dialect errors
        });
      }
      console.log('✓ Audit log enum migration verified.');
    } catch (e: any) {
      console.log('ENUM migration skipped:', e.message);
    }

    // Alter PostgreSQL enum values for Admission Category if they are missing
    try {
      const categoryEnumValues = ['C1', '2A', '2B', '3A', '3B'];
      for (const val of categoryEnumValues) {
        await sequelize.query(`ALTER TYPE "enum_admission_personal_details_category" ADD VALUE IF NOT EXISTS '${val}'`).catch(() => {
          // ADD VALUE IF NOT EXISTS works in PG, catch dialect errors
        });
      }
      console.log('✓ Admission category enum migration verified.');
    } catch (e: any) {
      console.log('Admission category ENUM migration skipped:', e.message);
    }

    // Automatically update the department name from 'Information Science & Engineering' to 'Computer Science & Engineering (AIML)' if it exists
    try {
      await sequelize.query(`
        UPDATE "departments" 
        SET "name" = 'Computer Science & Engineering (AIML)', "code" = 'CSE-AIML' 
        WHERE "name" = 'Information Science & Engineering' OR "code" = 'ISE'
      `);
      console.log('✓ Department name updated to Computer Science & Engineering (AIML) in database.');
    } catch (e: any) {
      console.log('Department migration check skipped/failed:', e.message);
    }
    
    console.log('Database connection has been established successfully.');
    
    // Auto-seed database if no Admin accounts exist
    try {
      const { default: User } = await import('./models/User');
      const adminCount = await User.count({ where: { role: 'ADMIN' } });
      if (adminCount === 0) {
        console.log('No Admin user found. Running automatic database seed...');
        const { seed } = await import('./seeds/index');
        await seed(false);
      } else {
        console.log('✓ Database already seeded (Admin user found).');
      }
    } catch (seedErr: any) {
      console.warn('Seeding check failed or skipped:', seedErr.message);
    }

    // Run Database Row-Level Security (RLS) setup if enabled
    if (process.env.DB_RLS_ENABLED === 'true') {
      console.log('Row-Level Security (RLS) is enabled, but setup utility is not present.');
    }

    // Print beautiful features startup validation banner
    try {
      const { default: SystemConfiguration } = await import('./models/SystemConfiguration');
      const config = await SystemConfiguration.findOne();
      const dbFeatures = config?.features || {};
      const keys = ['admission', 'admin', 'principal', 'student', 'teacher', 'hod', 'parent', 'fees', 'library', 'placement', 'hostel', 'grievances'];
      
      console.log('\n--------------------------------------------------');
      console.log(`JCER ERP SYSTEM — STARTUP FEATURE VALIDATION`);
      console.log(`Deployment Profile: [${process.env.DEPLOYMENT_PROFILE || 'admission-only'}]`);
      console.log(`Node Environment:   [${process.env.NODE_ENV || 'development'}]`);
      console.log('--------------------------------------------------');
      
      for (const key of keys) {
        const envKey = `FEATURE_${key.toUpperCase()}`;
        const envVal = process.env[envKey];
        let isEnabled = false;
        let source = 'DEFAULT';
        
        if (envVal !== undefined) {
          isEnabled = envVal === 'true';
          source = 'ENV_VAR';
        } else {
          isEnabled = !!dbFeatures[key];
          source = 'DATABASE';
        }
        
        const statusText = isEnabled ? '✔ ENABLED ' : '✖ DISABLED';
        const padding = 15 - key.length;
        const nameLabel = key.charAt(0).toUpperCase() + key.slice(1);
        console.log(`${nameLabel}:${' '.repeat(padding)} [${statusText}] (Source: ${source})`);
      }
      console.log('--------------------------------------------------\n');
    } catch (e: any) {
      console.warn('Startup feature validation banner failed:', e.message);
    }

    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the application server:', error);
    process.exit(1);
  }
}

startServer();
