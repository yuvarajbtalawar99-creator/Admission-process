const fs = require('fs');
const path = require('path');

async function run() {
  console.log('--- DB DIAGNOSTICS STARTED VIA VITE RELOADER ---');
  let report = '# Database Deep Diagnostic Report\n\n';
  report += `Report generated at: ${new Date().toISOString()}\n\n`;

  // 1. Read backend .env
  const envPath = path.join(__dirname, '../backend/.env');
  let config = {
    host: 'localhost',
    port: 5432,
    database: 'college_erp_db',
    user: 'erp_user',
    password: 'erp_password_123'
  };

  try {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*DB_(HOST|PORT|NAME|USER|PASSWORD)\s*=\s*(.*)\s*$/);
        if (match) {
          const key = match[1];
          const val = match[2].trim().replace(/^['"]|['"]$/g, ''); // strip quotes
          if (key === 'HOST') config.host = val;
          if (key === 'PORT') config.port = parseInt(val, 10);
          if (key === 'NAME') config.database = val;
          if (key === 'USER') config.user = val;
          if (key === 'PASSWORD') config.password = val;
        }
      }
      report += `✅ Loaded credentials from \`backend/.env\`\n`;
    } else {
      report += `⚠️ \`backend/.env\` not found, using default configuration.\n`;
    }
  } catch (err) {
    report += `⚠️ Error reading \`backend/.env\`: ${err.message}. Using default configuration.\n`;
  }

  report += `  - **Host**: \`${config.host}\`\n`;
  report += `  - **Port**: \`${config.port}\`\n`;
  report += `  - **Database**: \`${config.database}\`\n`;
  report += `  - **User**: \`${config.user}\`\n\n`;

  // 2. Connect to PostgreSQL using backend's pg library
  let client;
  try {
    // Dynamically resolve 'pg' from backend node_modules
    const pgPath = path.join(__dirname, '../backend/node_modules/pg');
    const { Client } = require(pgPath);
    
    client = new Client({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      connectionTimeoutMillis: 5000
    });

    await client.connect();
    report += `## 1. Database Connection & System Info\n`;
    report += `- **Connection Status**: ✅ Successfully connected to PostgreSQL database.\n`;
  } catch (err) {
    report += `## 1. Database Connection & System Info\n`;
    report += `### ❌ CONNECTION FAILURE\n`;
    report += `- **Error**: Failed to connect to PostgreSQL.\n`;
    report += `- **Message**: \`${err.message}\`\n`;
    report += `- **Detail**: Please ensure the Docker containers are running (\`docker compose up -d\`) and that port 5432 is open.\n\n`;
    writeReport(report);
    return;
  }

  try {
    // 3. Gather Server Info
    const versionRes = await client.query('SELECT version();');
    const pgVersion = versionRes.rows[0]?.version || 'Unknown';
    report += `- **PostgreSQL Version**: \`${pgVersion}\`\n`;

    const sizeRes = await client.query(`SELECT pg_size_pretty(pg_database_size('${config.database}'));`);
    const dbSize = sizeRes.rows[0]?.pg_size_pretty || 'Unknown';
    report += `- **Database Size**: \`${dbSize}\`\n`;

    const connRes = await client.query('SELECT count(*), state FROM pg_stat_activity GROUP BY state;');
    report += `- **Active Connections by State**:\n`;
    for (const row of connRes.rows) {
      report += `  - \`${row.state || 'idle/unknown'}\`: ${row.count}\n`;
    }
    report += '\n';

    // 4. Query Tables in Public Schema
    report += `## 2. PostgreSQL Schema Check\n`;
    const tablesRes = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );
    const dbTables = tablesRes.rows.map(r => r.table_name);
    report += `- **Total Tables in Public Schema**: ${dbTables.length}\n`;
    report += `- **Tables found**:\n  \`\`\`\n  ${dbTables.join(', ')}\n  \`\`\`\n\n`;

    // 5. Expected Tables vs Database Tables Check
    // Compile list of expected tables from Sequelize models
    const expectedTables = [
      { name: 'Admin', table: 'admins', status: 'Required' },
      { name: 'Admission', table: 'admissions', status: 'Required' },
      { name: 'AdmissionAcademicDetail', table: 'admission_academic_details', status: 'Required' },
      { name: 'AdmissionAddress', table: 'admission_addresses', status: 'Required' },
      { name: 'AdmissionDocument', table: 'admission_documents', status: 'Required' },
      { name: 'AdmissionParentDetail', table: 'admission_parent_details', status: 'Required' },
      { name: 'AdmissionPersonalDetail', table: 'admission_personal_details', status: 'Required' },
      { name: 'Announcement', table: 'announcements', status: 'Required' },
      { name: 'Attendance', table: 'attendance', status: 'Required' },
      { name: 'AuditLog', table: 'audit_logs', status: 'Required' },
      { name: 'BudgetRequest', table: 'budget_requests', status: 'Required' },
      { name: 'ComplianceCheck', table: 'compliance_checks', status: 'Required' },
      { name: 'CurriculumChange', table: 'curriculum_changes', status: 'Required' },
      { name: 'Department', table: 'departments', status: 'Required' },
      { name: 'ExamSchedule', table: 'exam_schedules', status: 'Required' },
      { name: 'FacultyEvaluation', table: 'faculty_evaluations', status: 'Required' },
      { name: 'Fee', table: 'fees', status: 'Required' },
      { name: 'FeePayment', table: 'fee_payments', status: 'Required' },
      { name: 'Grievance', table: 'grievances', status: 'Required' },
      { name: 'HOD', table: 'hods', status: 'Required' },
      { name: 'Leave', table: 'leaves', status: 'Required' },
      { name: 'Marks', table: 'marks', status: 'Required' },
      { name: 'Message', table: 'messages', status: 'Required' },
      { name: 'Notification', table: 'notifications', status: 'Required' },
      { name: 'Parent', table: 'parents', status: 'Required' },
      { name: 'Performance', table: 'performance', status: 'Required' },
      { name: 'RejectionReason', table: 'rejection_reasons', status: 'Required' },
      { name: 'StrategicGoal', table: 'strategic_goals', status: 'Required' },
      { name: 'Student', table: 'students', status: 'Required' },
      { name: 'Subject', table: 'subjects', status: 'Required' },
      { name: 'Teacher', table: 'teachers', status: 'Required' },
      { name: 'User', table: 'users', status: 'Required' },
      { name: 'VerifiedUSN', table: 'verified_usns', status: 'Required' }
    ];

    report += `## 3. Table Status & Row Counts\n`;
    report += `Verifying each of the expected ERP system tables in PostgreSQL...\n\n`;
    report += `| Model Name | Table Name | Table Exists? | Row Count | Status / Load Detail |\n`;
    report += `|---|---|---|---|---|\n`;

    let missingCount = 0;
    for (const item of expectedTables) {
      const tableExists = dbTables.includes(item.table);
      let rowCount = 'N/A';
      let status = '❌ Missing';

      if (tableExists) {
        try {
          const countRes = await client.query(`SELECT count(*) FROM "${item.table}";`);
          rowCount = countRes.rows[0].count;
          status = '✅ Healthy';
        } catch (e) {
          status = `❌ Load Error: ${e.message}`;
        }
      } else {
        missingCount++;
      }

      report += `| ${item.name} | \`${item.table}\` | ${tableExists ? '✅ Yes' : '❌ No'} | ${rowCount} | ${status} |\n`;
    }
    report += '\n';

    report += `### Summary of Table Verification:\n`;
    report += `- Total Expected Tables: **${expectedTables.length}**\n`;
    report += `- Tables Present in DB: **${expectedTables.length - missingCount}**\n`;
    report += `- Tables Missing in DB: **${missingCount}**\n\n`;

    // 6. Row-Level Security (RLS) Check
    report += `## 4. Row-Level Security (RLS) Status\n`;
    const rlsRes = await client.query(
      `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`
    );

    report += `| Table Name | RLS Enabled? |\n`;
    report += `|---|---|\n`;
    for (const r of rlsRes.rows) {
      report += `| \`${r.tablename}\` | ${r.rowsecurity ? '🔒 Enabled (TRUE)' : '🔓 Disabled (FALSE)'} |\n`;
    }
    report += '\n';

    // RLS Policies Check
    const policiesRes = await client.query(
      `SELECT tablename, policyname, roles, cmd, qual, with_check FROM pg_policies ORDER BY tablename, policyname;`
    );

    report += `### Defined RLS Policies:\n`;
    if (policiesRes.rows.length === 0) {
      report += `*No RLS policies are active in this database.*\n\n`;
    } else {
      report += `| Table | Policy Name | Command | Roles | Definition |\n`;
      report += `|---|---|---|---|---|\n`;
      for (const p of policiesRes.rows) {
        report += `| \`${p.tablename}\` | \`${p.policyname}\` | \`${p.cmd}\` | \`${p.roles.join(', ')}\` | \`${p.qual || p.with_check || ''}\` |\n`;
      }
      report += '\n';
    }

    // 7. Seed Validation Details
    report += `## 5. Seed Data Check\n`;
    const checkSeed = async (table, label) => {
      if (dbTables.includes(table)) {
        try {
          const res = await client.query(`SELECT count(*) FROM "${table}";`);
          const count = parseInt(res.rows[0].count, 10);
          return `- **${label}** (\`${table}\`): ${count} records. ${count > 0 ? '✅ Seeded' : '⚠️ Empty'}\n`;
        } catch (e) {
          return `- **${label}** (\`${table}\`): ❌ Error checking: ${e.message}\n`;
        }
      } else {
        return `- **${label}** (\`${table}\`): ❌ Table does not exist\n`;
      }
    };

    report += await checkSeed('users', 'Users');
    report += await checkSeed('departments', 'Departments');
    report += await checkSeed('students', 'Students');
    report += await checkSeed('teachers', 'Teachers');
    report += await checkSeed('hods', 'HODs');
    report += await checkSeed('admissions', 'Admissions');
    report += await checkSeed('fees', 'Fees');

  } catch (err) {
    report += `\n\n### ❌ DIAGNOSTIC CRITICAL FAILURE\nAn error occurred while running queries:\n\`\`\`\n${err.stack || err.message}\n\`\`\`\n`;
  } finally {
    if (client) {
      await client.end();
    }
  }

  writeReport(report);
}

function writeReport(report) {
  const outputPath = path.join(__dirname, '../db_report.md');
  fs.writeFileSync(outputPath, report, 'utf-8');
  console.log(`--- DB DIAGNOSTICS COMPLETED. Report written to ${outputPath} ---`);
}

run();
