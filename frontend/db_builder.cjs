const fs = require('fs');
const path = require('path');

async function run() {
  console.log('--- DATABASE BUILD & INDEX OPTIMIZATION STARTED ---');
  let report = '# Database Build & Optimization Report\n\n';
  report += `Execution time: ${new Date().toISOString()}\n\n`;

  // 1. Load configuration from backend/.env
  const envPath = path.join(__dirname, '../backend/.env');
  let config = {
    host: 'localhost',
    port: 5432,
    database: 'college_erp_db',
    user: 'erp_user',
    password: 'erp_password_123'
  };

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*DB_(HOST|PORT|NAME|USER|PASSWORD)\s*=\s*(.*)\s*$/);
      if (match) {
        const key = match[1];
        const val = match[2].trim().replace(/^['"]|['"]$/g, '');
        if (key === 'HOST') config.host = val;
        if (key === 'PORT') config.port = parseInt(val, 10);
        if (key === 'NAME') config.database = val;
        if (key === 'USER') config.user = val;
        if (key === 'PASSWORD') config.password = val;
      }
    }
  }

  // 2. Connect to PostgreSQL
  const pgPath = path.join(__dirname, '../backend/node_modules/pg');
  const { Client } = require(pgPath);
  const client = new Client({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    connectionTimeoutMillis: 5000
  });

  try {
    await client.connect();
    report += `✅ Successfully connected to database: \`${config.database}\` on \`${config.host}:${config.port}\`\n\n`;
  } catch (err) {
    report += `❌ **Critical Connection Failure**: Could not connect to database: ${err.message}\n`;
    writeReport(report);
    return;
  }

  // 3. Fetch all active tables
  let dbTables = [];
  try {
    const tablesRes = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
    );
    dbTables = tablesRes.rows.map(r => r.table_name);
  } catch (e) {
    report += `❌ Failed to retrieve tables list: ${e.message}\n`;
    writeReport(report);
    await client.end();
    return;
  }

  // 4. Define indexes to build based on active tables and columns
  const indexesToBuild = [
    // Users table indexes
    {
      tableName: 'users',
      indexName: 'idx_users_email',
      sql: `CREATE INDEX idx_users_email ON users(email) WHERE status != 'SUSPENDED';`
    },
    {
      tableName: 'users',
      indexName: 'idx_users_role',
      sql: `CREATE INDEX idx_users_role ON users(role);`
    },
    {
      tableName: 'users',
      indexName: 'idx_users_status',
      sql: `CREATE INDEX idx_users_status ON users(status);`
    },
    {
      tableName: 'users',
      indexName: 'idx_users_created_at',
      sql: `CREATE INDEX idx_users_created_at ON users("createdAt");`
    },

    // Students table indexes
    {
      tableName: 'students',
      indexName: 'idx_students_enrollment_number',
      sql: `CREATE INDEX idx_students_enrollment_number ON students("enrollmentNumber");`
    },
    {
      tableName: 'students',
      indexName: 'idx_students_department_id',
      sql: `CREATE INDEX idx_students_department_id ON students("departmentId");`
    },
    {
      tableName: 'students',
      indexName: 'idx_students_semester',
      sql: `CREATE INDEX idx_students_semester ON students(semester);`
    },
    {
      tableName: 'students',
      indexName: 'idx_students_admission_status',
      sql: `CREATE INDEX idx_students_admission_status ON students("admissionStatus");`
    },
    {
      tableName: 'students',
      indexName: 'idx_students_user_id',
      sql: `CREATE INDEX idx_students_user_id ON students("userId");`
    },

    // Teachers table indexes
    {
      tableName: 'teachers',
      indexName: 'idx_teachers_department_id',
      sql: `CREATE INDEX idx_teachers_department_id ON teachers("departmentId");`
    },
    {
      tableName: 'teachers',
      indexName: 'idx_teachers_user_id',
      sql: `CREATE INDEX idx_teachers_user_id ON teachers("userId");`
    },

    // Admissions table indexes
    {
      tableName: 'admissions',
      indexName: 'idx_admissions_status',
      sql: `CREATE INDEX idx_admissions_status ON admissions("applicationStatus");`
    },
    {
      tableName: 'admissions',
      indexName: 'idx_admissions_user_id',
      sql: `CREATE INDEX idx_admissions_user_id ON admissions("userId");`
    },
    {
      tableName: 'admissions',
      indexName: 'idx_admissions_application_number',
      sql: `CREATE INDEX idx_admissions_application_number ON admissions("applicationNumber");`
    },
    {
      tableName: 'admissions',
      indexName: 'idx_admissions_admission_type',
      sql: `CREATE INDEX idx_admissions_admission_type ON admissions("admissionType");`
    },
    {
      tableName: 'admissions',
      indexName: 'idx_admissions_created_at',
      sql: `CREATE INDEX idx_admissions_created_at ON admissions("createdAt");`
    },

    // Attendance table indexes
    {
      tableName: 'attendance',
      indexName: 'idx_attendance_student_id',
      sql: `CREATE INDEX idx_attendance_student_id ON attendance("studentId");`
    },
    {
      tableName: 'attendance',
      indexName: 'idx_attendance_subject_id',
      sql: `CREATE INDEX idx_attendance_subject_id ON attendance("subjectId");`
    },
    {
      tableName: 'attendance',
      indexName: 'idx_attendance_class_date',
      sql: `CREATE INDEX idx_attendance_class_date ON attendance("classDate");`
    },

    // Marks table indexes
    {
      tableName: 'marks',
      indexName: 'idx_marks_student_id',
      sql: `CREATE INDEX idx_marks_student_id ON marks("studentId");`
    },
    {
      tableName: 'marks',
      indexName: 'idx_marks_subject_id',
      sql: `CREATE INDEX idx_marks_subject_id ON marks("subjectId");`
    },
    {
      tableName: 'marks',
      indexName: 'idx_marks_exam_type',
      sql: `CREATE INDEX idx_marks_exam_type ON marks("examType");`
    },
    {
      tableName: 'marks',
      indexName: 'idx_marks_semester',
      sql: `CREATE INDEX idx_marks_semester ON marks(semester);`
    },

    // Performance table indexes
    {
      tableName: 'performance',
      indexName: 'idx_performance_student_id',
      sql: `CREATE INDEX idx_performance_student_id ON performance("studentId");`
    },
    {
      tableName: 'performance',
      indexName: 'idx_performance_semester',
      sql: `CREATE INDEX idx_performance_semester ON performance(semester);`
    },

    // Verified USNs indexes
    {
      tableName: 'verified_usns',
      indexName: 'idx_verified_usns_usn',
      sql: `CREATE INDEX idx_verified_usns_usn ON verified_usns(usn);`
    },
    {
      tableName: 'verified_usns',
      indexName: 'idx_verified_usns_status',
      sql: `CREATE INDEX idx_verified_usns_status ON verified_usns(status);`
    },

    // Audit Log indexes
    {
      tableName: 'audit_logs',
      indexName: 'idx_audit_logs_user_id',
      sql: `CREATE INDEX idx_audit_logs_user_id ON audit_logs("userId");`
    },
    {
      tableName: 'audit_logs',
      indexName: 'idx_audit_logs_action',
      sql: `CREATE INDEX idx_audit_logs_action ON audit_logs(action);`
    },
    {
      tableName: 'audit_logs',
      indexName: 'idx_audit_logs_created_at',
      sql: `CREATE INDEX idx_audit_logs_created_at ON audit_logs("createdAt");`
    },

    // Composite indexes (High Performance)
    {
      tableName: 'performance',
      indexName: 'idx_perf_student_sem',
      sql: `CREATE INDEX idx_perf_student_sem ON performance("studentId", semester);`
    },
    {
      tableName: 'marks',
      indexName: 'idx_marks_student_subject_sem',
      sql: `CREATE INDEX idx_marks_student_subject_sem ON marks("studentId", "subjectId", semester);`
    },
    {
      tableName: 'attendance',
      indexName: 'idx_att_student_date',
      sql: `CREATE INDEX idx_att_student_date ON attendance("studentId", "classDate");`
    },
    {
      tableName: 'admissions',
      indexName: 'idx_adm_status_type_created',
      sql: `CREATE INDEX idx_adm_status_type_created ON admissions("applicationStatus", "admissionType", "createdAt" DESC);`
    }
  ];

  report += `## 🛠️ Schema Index Optimization\n\n`;
  report += `| Table Name | Index Name | Exists in DB? | Action Taken | Result / Error |\n`;
  report += `|---|---|---|---|---|\n`;

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const idx of indexesToBuild) {
    const tableExists = dbTables.includes(idx.tableName);
    if (!tableExists) {
      report += `| \`${idx.tableName}\` | \`${idx.indexName}\` | ❌ Table Missing | ⏭️ Skipped | Target table not found in database |\n`;
      skippedCount++;
      continue;
    }

    // Check if index already exists in postgres catalog
    try {
      const idxCheckRes = await client.query(
        `SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename = $1 AND indexname = $2;`,
        [idx.tableName, idx.indexName]
      );

      if (idxCheckRes.rows.length > 0) {
        report += `| \`${idx.tableName}\` | \`${idx.indexName}\` | ✅ Table Exists | ⏭️ Skipped | Index already exists |\n`;
        skippedCount++;
      } else {
        // Execute the index creation SQL
        await client.query(idx.sql);
        report += `| \`${idx.tableName}\` | \`${idx.indexName}\` | ✅ Table Exists | 🔨 Created | Index built successfully |\n`;
        successCount++;
      }
    } catch (e) {
      report += `| \`${idx.tableName}\` | \`${idx.indexName}\` | ✅ Table Exists | ❌ Error | Failed: ${e.message} |\n`;
      errorCount++;
    }
  }

  report += `\n### Execution Summary:\n`;
  report += `- Indexes successfully created: **${successCount}**\n`;
  report += `- Indexes skipped (already exist or table missing): **${skippedCount}**\n`;
  report += `- Indexes failed with errors: **${errorCount}**\n\n`;

  // 5. Database Maintenance Execution (Vacuum and Analyze)
  report += `## 🔄 Database Maintenance & Optimization\n`;
  const maintenanceCommands = [
    { cmd: 'ANALYZE users;', desc: 'Analyze users stats' },
    { cmd: 'ANALYZE students;', desc: 'Analyze students stats' },
    { cmd: 'ANALYZE teachers;', desc: 'Analyze teachers stats' },
    { cmd: 'ANALYZE admissions;', desc: 'Analyze admissions stats' },
    { cmd: 'ANALYZE attendance;', desc: 'Analyze attendance stats' },
    { cmd: 'ANALYZE marks;', desc: 'Analyze marks stats' },
    { cmd: 'ANALYZE performance;', desc: 'Analyze performance stats' },
    { cmd: 'VACUUM ANALYZE students;', desc: 'Vacuum & Analyze students' },
    { cmd: 'VACUUM ANALYZE admissions;', desc: 'Vacuum & Analyze admissions' }
  ];

  report += `\nRunning vacuum and analyze tuning queries:\n\n`;
  report += `| Command | Description | Status | Details |\n`;
  report += `|---|---|---|---|\n`;

  for (const item of maintenanceCommands) {
    // extract table name from command to check if it exists
    const match = item.cmd.match(/(?:ANALYZE|VACUUM)\s+(?:ANALYZE\s+)?(\w+);?/i);
    const tbl = match ? match[1] : '';
    
    if (tbl && !dbTables.includes(tbl)) {
      report += `| \`${item.cmd}\` | ${item.desc} | skipped | Table \`${tbl}\` missing in database |\n`;
      continue;
    }

    try {
      await client.query(item.cmd);
      report += `| \`${item.cmd}\` | ${item.desc} | ✅ Completed | Executed successfully |\n`;
    } catch (e) {
      report += `| \`${item.cmd}\` | ${item.desc} | ❌ Failed | Error: ${e.message} |\n`;
    }
  }

  await client.end();
  writeReport(report);
}

function writeReport(report) {
  const outputPath = path.join(__dirname, '../db_build_report.md');
  fs.writeFileSync(outputPath, report, 'utf-8');
  console.log(`--- DB BUILD COMPLETED. Report written to ${outputPath} ---`);
}

run();
