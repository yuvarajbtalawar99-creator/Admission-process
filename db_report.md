# Database Deep Diagnostic Report

Report generated at: 2026-07-03T13:44:54.846Z

✅ Loaded credentials from `backend/.env`
  - **Host**: `localhost`
  - **Port**: `5432`
  - **Database**: `college_erp_db`
  - **User**: `erp_user`

## 1. Database Connection & System Info
- **Connection Status**: ✅ Successfully connected to PostgreSQL database.
- **PostgreSQL Version**: `PostgreSQL 15.18 on x86_64-pc-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit`
- **Database Size**: `18 MB`
- **Active Connections by State**:
  - `idle/unknown`: 5
  - `active`: 1

## 2. PostgreSQL Schema Check
- **Total Tables in Public Schema**: 33
- **Tables found**:
  ```
  admins, admission_academic_details, admission_addresses, admission_documents, admission_parent_details, admission_personal_details, admissions, announcements, attendance, audit_logs, budget_requests, compliance_checks, curriculum_changes, departments, exam_schedules, faculty_evaluations, fee_payments, fees, grievances, hods, leaves, marks, messages, notifications, parents, performance, rejection_reasons, strategic_goals, students, subjects, teachers, users, verified_usns
  ```

## 3. Table Status & Row Counts
Verifying each of the expected ERP system tables in PostgreSQL...

| Model Name | Table Name | Table Exists? | Row Count | Status / Load Detail |
|---|---|---|---|---|
| Admin | `admins` | ✅ Yes | 1 | ✅ Healthy |
| Admission | `admissions` | ✅ Yes | 2 | ✅ Healthy |
| AdmissionAcademicDetail | `admission_academic_details` | ✅ Yes | 1 | ✅ Healthy |
| AdmissionAddress | `admission_addresses` | ✅ Yes | 1 | ✅ Healthy |
| AdmissionDocument | `admission_documents` | ✅ Yes | 1 | ✅ Healthy |
| AdmissionParentDetail | `admission_parent_details` | ✅ Yes | 1 | ✅ Healthy |
| AdmissionPersonalDetail | `admission_personal_details` | ✅ Yes | 1 | ✅ Healthy |
| Announcement | `announcements` | ✅ Yes | 0 | ✅ Healthy |
| Attendance | `attendance` | ✅ Yes | 0 | ✅ Healthy |
| AuditLog | `audit_logs` | ✅ Yes | 204 | ✅ Healthy |
| BudgetRequest | `budget_requests` | ✅ Yes | 0 | ✅ Healthy |
| ComplianceCheck | `compliance_checks` | ✅ Yes | 0 | ✅ Healthy |
| CurriculumChange | `curriculum_changes` | ✅ Yes | 0 | ✅ Healthy |
| Department | `departments` | ✅ Yes | 5 | ✅ Healthy |
| ExamSchedule | `exam_schedules` | ✅ Yes | 0 | ✅ Healthy |
| FacultyEvaluation | `faculty_evaluations` | ✅ Yes | 1 | ✅ Healthy |
| Fee | `fees` | ✅ Yes | 0 | ✅ Healthy |
| FeePayment | `fee_payments` | ✅ Yes | 0 | ✅ Healthy |
| Grievance | `grievances` | ✅ Yes | 0 | ✅ Healthy |
| HOD | `hods` | ✅ Yes | 1 | ✅ Healthy |
| Leave | `leaves` | ✅ Yes | 0 | ✅ Healthy |
| Marks | `marks` | ✅ Yes | 0 | ✅ Healthy |
| Message | `messages` | ✅ Yes | 0 | ✅ Healthy |
| Notification | `notifications` | ✅ Yes | 0 | ✅ Healthy |
| Parent | `parents` | ✅ Yes | 0 | ✅ Healthy |
| Performance | `performance` | ✅ Yes | 0 | ✅ Healthy |
| RejectionReason | `rejection_reasons` | ✅ Yes | 9 | ✅ Healthy |
| StrategicGoal | `strategic_goals` | ✅ Yes | 0 | ✅ Healthy |
| Student | `students` | ✅ Yes | 1 | ✅ Healthy |
| Subject | `subjects` | ✅ Yes | 5 | ✅ Healthy |
| Teacher | `teachers` | ✅ Yes | 1 | ✅ Healthy |
| User | `users` | ✅ Yes | 6 | ✅ Healthy |
| VerifiedUSN | `verified_usns` | ✅ Yes | 0 | ✅ Healthy |

### Summary of Table Verification:
- Total Expected Tables: **33**
- Tables Present in DB: **33**
- Tables Missing in DB: **0**

## 4. Row-Level Security (RLS) Status
| Table Name | RLS Enabled? |
|---|---|
| `admins` | 🔓 Disabled (FALSE) |
| `admission_academic_details` | 🔓 Disabled (FALSE) |
| `admission_addresses` | 🔓 Disabled (FALSE) |
| `admission_documents` | 🔓 Disabled (FALSE) |
| `admission_parent_details` | 🔓 Disabled (FALSE) |
| `admission_personal_details` | 🔓 Disabled (FALSE) |
| `admissions` | 🔓 Disabled (FALSE) |
| `announcements` | 🔓 Disabled (FALSE) |
| `attendance` | 🔓 Disabled (FALSE) |
| `audit_logs` | 🔓 Disabled (FALSE) |
| `budget_requests` | 🔓 Disabled (FALSE) |
| `compliance_checks` | 🔓 Disabled (FALSE) |
| `curriculum_changes` | 🔓 Disabled (FALSE) |
| `departments` | 🔓 Disabled (FALSE) |
| `exam_schedules` | 🔓 Disabled (FALSE) |
| `faculty_evaluations` | 🔓 Disabled (FALSE) |
| `fee_payments` | 🔓 Disabled (FALSE) |
| `fees` | 🔓 Disabled (FALSE) |
| `grievances` | 🔓 Disabled (FALSE) |
| `hods` | 🔓 Disabled (FALSE) |
| `leaves` | 🔓 Disabled (FALSE) |
| `marks` | 🔓 Disabled (FALSE) |
| `messages` | 🔓 Disabled (FALSE) |
| `notifications` | 🔓 Disabled (FALSE) |
| `parents` | 🔓 Disabled (FALSE) |
| `performance` | 🔓 Disabled (FALSE) |
| `rejection_reasons` | 🔓 Disabled (FALSE) |
| `strategic_goals` | 🔓 Disabled (FALSE) |
| `students` | 🔓 Disabled (FALSE) |
| `subjects` | 🔓 Disabled (FALSE) |
| `teachers` | 🔓 Disabled (FALSE) |
| `users` | 🔓 Disabled (FALSE) |
| `verified_usns` | 🔓 Disabled (FALSE) |

### Defined RLS Policies:
*No RLS policies are active in this database.*

## 5. Seed Data Check
- **Users** (`users`): 6 records. ✅ Seeded
- **Departments** (`departments`): 5 records. ✅ Seeded
- **Students** (`students`): 1 records. ✅ Seeded
- **Teachers** (`teachers`): 1 records. ✅ Seeded
- **HODs** (`hods`): 1 records. ✅ Seeded
- **Admissions** (`admissions`): 2 records. ✅ Seeded
- **Fees** (`fees`): 0 records. ⚠️ Empty
