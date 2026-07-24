import fs from 'fs';
import path from 'path';
import sequelize from './config/database';

// Import all 33 active models to register them with the sequelize instance
import Admin from './models/Admin';
import Admission from './models/Admission';
import AdmissionAcademicDetail from './models/AdmissionAcademicDetail';
import AdmissionAddress from './models/AdmissionAddress';
import AdmissionDocument from './models/AdmissionDocument';
import AdmissionParentDetail from './models/AdmissionParentDetail';
import AdmissionPersonalDetail from './models/AdmissionPersonalDetail';
import Announcement from './models/Announcement';
import Attendance from './models/Attendance';
import AuditLog from './models/AuditLog';
import BudgetRequest from './models/BudgetRequest';
import ComplianceCheck from './models/ComplianceCheck';
import CurriculumChange from './models/CurriculumChange';
import Department from './models/Department';
import ExamSchedule from './models/ExamSchedule';
import FacultyEvaluation from './models/FacultyEvaluation';
import Fee from './models/Fee';
import FeePayment from './models/FeePayment';
import Grievance from './models/Grievance';
import HOD from './models/HOD';
import Leave from './models/Leave';
import Marks from './models/Marks';
import Message from './models/Message';
import Notification from './models/Notification';
import Parent from './models/Parent';
import Performance from './models/Performance';
import RejectionReason from './models/RejectionReason';
import StrategicGoal from './models/StrategicGoal';
import Student from './models/Student';
import Subject from './models/Subject';
import Teacher from './models/Teacher';
import User from './models/User';
import VerifiedUSN from './models/VerifiedUSN';

export async function runDiagnostics() {
  console.log('--- STARTING DEEP DATABASE DIAGNOSTICS ---');
  let report = '# Database Deep Diagnostic Report\n\n';
  report += `Report generated at: ${new Date().toISOString()}\n\n`;

  try {
    // 1. Connection and Version Information
    report += '## 1. Database Connection & System Info\n';
    await sequelize.authenticate();
    report += '- **Connection Status**: ✅ Successfully connected to PostgreSQL database.\n';
    
    const [versionResult]: any = await sequelize.query('SELECT version();');
    const pgVersion = versionResult[0]?.version || 'Unknown';
    report += `- **PostgreSQL Version**: \`${pgVersion}\`\n`;

    const [dbSizeResult]: any = await sequelize.query(`SELECT pg_size_pretty(pg_database_size('${sequelize.config.database}'));`);
    const dbSize = dbSizeResult[0]?.pg_size_pretty || 'Unknown';
    report += `- **Database Name**: \`${sequelize.config.database}\`\n`;
    report += `- **Database Host**: \`${sequelize.config.host}:${sequelize.config.port}\`\n`;
    report += `- **Database Size**: \`${dbSize}\`\n`;

    const [connectionsResult]: any = await sequelize.query('SELECT count(*), state FROM pg_stat_activity GROUP BY state;');
    report += '- **Active Connections by State**:\n';
    for (const conn of connectionsResult) {
      report += `  - \`${conn.state || 'unknown'}\`: ${conn.count}\n`;
    }
    report += '\n';

    // 2. Query Tables in PostgreSQL Schema
    report += '## 2. PostgreSQL Schema Check\n';
    const [schemaTablesResult]: any = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );
    
    const dbTables = schemaTablesResult.map((t: any) => t.table_name);
    report += `- **Total Tables in Public Schema**: ${dbTables.length}\n`;
    report += `- **Tables found**:\n  \`\`\`\n  ${dbTables.join(', ')}\n  \`\`\`\n\n`;

    // 3. Model Analysis & Verification
    report += '## 3. Sequelize Model Verification & Row Counts\n';
    report += 'Checking all 33 active registered Sequelize models...\n\n';
    
    report += '| Model Name | Table Name | DB Table Exists? | Load Status | Row Count | Details / Error |\n';
    report += '|---|---|---|---|---|---|\n';

    const activeModels: Array<{ name: string; model: any }> = [
      { name: 'Admin', model: Admin },
      { name: 'Admission', model: Admission },
      { name: 'AdmissionAcademicDetail', model: AdmissionAcademicDetail },
      { name: 'AdmissionAddress', model: AdmissionAddress },
      { name: 'AdmissionDocument', model: AdmissionDocument },
      { name: 'AdmissionParentDetail', model: AdmissionParentDetail },
      { name: 'AdmissionPersonalDetail', model: AdmissionPersonalDetail },
      { name: 'Announcement', model: Announcement },
      { name: 'Attendance', model: Attendance },
      { name: 'AuditLog', model: AuditLog },
      { name: 'BudgetRequest', model: BudgetRequest },
      { name: 'ComplianceCheck', model: ComplianceCheck },
      { name: 'CurriculumChange', model: CurriculumChange },
      { name: 'Department', model: Department },
      { name: 'ExamSchedule', model: ExamSchedule },
      { name: 'FacultyEvaluation', model: FacultyEvaluation },
      { name: 'Fee', model: Fee },
      { name: 'FeePayment', model: FeePayment },
      { name: 'Grievance', model: Grievance },
      { name: 'HOD', model: HOD },
      { name: 'Leave', model: Leave },
      { name: 'Marks', model: Marks },
      { name: 'Message', model: Message },
      { name: 'Notification', model: Notification },
      { name: 'Parent', model: Parent },
      { name: 'Performance', model: Performance },
      { name: 'RejectionReason', model: RejectionReason },
      { name: 'StrategicGoal', model: StrategicGoal },
      { name: 'Student', model: Student },
      { name: 'Subject', model: Subject },
      { name: 'Teacher', model: Teacher },
      { name: 'User', model: User },
      { name: 'VerifiedUSN', model: VerifiedUSN }
    ];

    let missingTablesCount = 0;
    let loadFailedCount = 0;

    for (const m of activeModels) {
      const tableName = m.model.tableName;
      const tableExists = dbTables.includes(tableName);
      let loadStatus = '❌';
      let rowCountStr = 'N/A';
      let details = '';

      if (tableExists) {
        try {
          const count = await m.model.count();
          rowCountStr = count.toString();
          
          // Test findOne loading
          await m.model.findOne();
          loadStatus = '✅ OK';
          details = 'Loaded successfully';
        } catch (e: any) {
          loadStatus = '❌ Error';
          loadFailedCount++;
          details = `Load failed: ${e.message}`;
        }
      } else {
        missingTablesCount++;
        details = 'Table missing in database';
      }

      report += `| ${m.name} | \`${tableName}\` | ${tableExists ? '✅ Yes' : '❌ No'} | ${loadStatus} | ${rowCountStr} | ${details} |\n`;
    }
    report += '\n';

    // Summarize mapping
    report += '### Summary of Model Mapping:\n';
    report += `- Active Sequelize Models Checked: **${activeModels.length}**\n`;
    report += `- Models with missing tables: **${missingTablesCount}**\n`;
    report += `- Models that failed loading: **${loadFailedCount}**\n\n`;

    // 4. Row-Level Security (RLS) Inspection
    report += '## 4. Row-Level Security (RLS) & Policies Status\n';
    const [rlsResult]: any = await sequelize.query(
      `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`
    );

    report += '| Table Name | RLS Enabled? |\n';
    report += '|---|---|\n';
    for (const r of rlsResult) {
      report += `| \`${r.tablename}\` | ${r.rowsecurity ? '🔒 Enabled (TRUE)' : '🔓 Disabled (FALSE)'} |\n`;
    }
    report += '\n';

    // RLS Policies detailed list
    const [policiesResult]: any = await sequelize.query(
      `SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check FROM pg_policies ORDER BY tablename, policyname;`
    );

    report += '### Defined RLS Policies:\n';
    if (policiesResult.length === 0) {
      report += '*No RLS policies defined in the database.*\n\n';
    } else {
      report += '| Table | Policy Name | Command | Roles | Qual / Definition |\n';
      report += '|---|---|---|---|---|\n';
      for (const p of policiesResult) {
        report += `| \`${p.tablename}\` | \`${p.policyname}\` | \`${p.cmd}\` | \`${p.roles.join(', ')}\` | \`${p.qual || p.with_check || ''}\` |\n`;
      }
      report += '\n';
    }

    // 5. Unmapped database tables check
    report += '## 5. Unmapped Database Tables\n';
    const mappedTableNames = activeModels.map(m => m.model.tableName);
    const unmappedTables = dbTables.filter(name => !mappedTableNames.includes(name));

    if (unmappedTables.length === 0) {
      report += '- All tables in the database are mapped to the active Sequelize models.\n\n';
    } else {
      report += '- The following tables exist in the database but are not mapped to the active 33 Sequelize models:\n';
      for (const t of unmappedTables) {
        // Get row count of unmapped table
        let countStr = 'Unknown';
        try {
          const [countRes]: any = await sequelize.query(`SELECT count(*) FROM "${t}";`);
          countStr = countRes[0]?.count || '0';
        } catch {}
        report += `  - \`${t}\` (Row count: ${countStr})\n`;
      }
      report += '\n';
    }

    // 6. Test Data Validation / Seed Verification
    report += '## 6. Seed & Critical Test Data Check\n';
    // Count users, departments, and admissions to see if seeded data is present
    const checkTableRows = async (model: any, name: string) => {
      try {
        const count = await model.count();
        return `- **${name}** table: \`${count}\` records. ${count > 0 ? '✅ Seeded' : '⚠️ Empty'}\n`;
      } catch (e: any) {
        return `- **${name}** table: ❌ Error querying: ${e.message}\n`;
      }
    };

    report += await checkTableRows(User, 'users');
    report += await checkTableRows(Department, 'departments');
    report += await checkTableRows(Student, 'students');
    report += await checkTableRows(Teacher, 'teachers');
    report += await checkTableRows(HOD, 'hods');
    report += await checkTableRows(Admission, 'admissions');
    report += await checkTableRows(Fee, 'fees');

  } catch (err: any) {
    report += `\n\n### ❌ DIAGNOSTIC CRITICAL FAILURE\nAn error occurred while running diagnostics:\n\`\`\`\n${err.stack || err.message}\n\`\`\`\n`;
  }

  // Write report to backend/src directory so it syncs from Docker container
  const outputPath = path.join(__dirname, 'db_report.md');
  fs.writeFileSync(outputPath, report, 'utf-8');
  console.log(`--- DIAGNOSTICS COMPLETED. Report written to ${outputPath} ---`);
}
