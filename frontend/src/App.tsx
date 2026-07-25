import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import { store, RootState } from './store';
import API from './services/api';
import { loginSuccess } from './store/authSlice';
import { forceLogout } from './utils/auth.utils';

// ─── Layouts ─────────────────────────────────────────────────────────────────
import ProtectedLayout from './components/layout/ProtectedLayout';
import StudentLayout from './components/layout/StudentLayout';
import AdminLayout from './components/layout/AdminLayout';
import TeacherLayout from './components/layout/TeacherLayout';
import HODLayout from './components/layout/HODLayout';
import PrincipalLayout from './components/layout/PrincipalLayout';
import ParentLayout from './components/layout/ParentLayout';
import TopLoadingBar from './components/common/TopLoadingBar';

import LoginPage from './pages/common/LoginPage';

// ─── Admission Portal Imports ────────────────────────────────────────────────
import { AuthProvider as AdmissionAuthProvider } from './pages/admission/src/context/AuthContext';
import AdmissionLogin from './pages/admission/src/pages/Login';
import AdmissionRegister from './pages/admission/src/pages/Register';
import AdmissionAuthLayout from './pages/admission/src/layouts/AuthLayout';
import AdmissionDashboardLayout from './pages/admission/src/layouts/DashboardLayout';
import AdmissionStudentDashboard from './pages/admission/src/pages/student/StudentDashboard';
import AdmissionForm from './pages/admission/src/pages/student/AdmissionForm';
import './pages/admission/src/index.css'; // Isolated admission stylesheet

// ─── Student Pages ────────────────────────────────────────────────────────────
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import AttendanceViewPage from './pages/student/AttendanceViewPage';
import MarksViewPage from './pages/student/MarksViewPage';
import FeePaymentPage from './pages/student/FeePaymentPage';
import GrievancePortalPage from './pages/student/GrievancePortalPage';
import TimetablePage from './pages/student/TimetablePage';
import ExamsPage from './pages/student/ExamsPage';
import PerformancePage from './pages/student/PerformancePage';
import PaymentsPage from './pages/student/PaymentsPage';
import MessagesPage from './pages/student/MessagesPage';
import AnnouncementsPage from './pages/student/AnnouncementsPage';
import NotificationsPage from './pages/student/NotificationsPage';
import DocumentsPage from './pages/student/DocumentsPage';
import LeavePage from './pages/student/LeavePage';
import PreferencesPage from './pages/student/PreferencesPage';
import AccountPage from './pages/student/AccountPage';
import AssignmentPage from './pages/student/AssignmentPage';
import StudyMaterialPage from './pages/student/StudyMaterialPage';
import ContactTeacherPage from './pages/student/ContactTeacherPage';

// ─── Admin Pages ──────────────────────────────────────────────────────────────
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import StudentEnrollmentPage from './pages/admin/StudentEnrollmentPage';
import DocumentVerificationPage from './pages/admin/DocumentVerificationPage';
import IDCardGenerationPage from './pages/admin/IDCardGenerationPage';
import ExamSchedulePage from './pages/admin/ExamSchedulePage';
import TimetableCreationPage from './pages/admin/TimetableCreationPage';
import FeeManagementPage from './pages/admin/FeeManagementPage';
import FeeCollectionReportPage from './pages/admin/FeeCollectionReportPage';
import AdmissionQueuePage from './pages/admin/admissions/AdmissionQueuePage';
import AdmissionReviewPage from './pages/admin/admissions/AdmissionReviewPage';
import StudentManagementPage from './pages/admin/users/StudentManagementPage';
import TeacherManagementPage from './pages/admin/users/TeacherManagementPage';
import HodManagementPage from './pages/admin/users/HodManagementPage';
import PrincipalManagementPage from './pages/admin/users/PrincipalManagementPage';
import ParentManagementPage from './pages/admin/users/ParentManagementPage';
import BulkCredentialPage from './pages/admin/users/BulkCredentialPage';
import AdminNotificationsPage from './pages/admin/communications/AdminNotificationsPage';
import AdminMessagesPage from './pages/admin/communications/AdminMessagesPage';
import AdminAnnouncementsPage from './pages/admin/communications/AdminAnnouncementsPage';
import AdminAnalyticsPage from './pages/admin/analytics/AdminAnalyticsPage';
import CredentialManagementPage from './pages/admin/settings/CredentialManagementPage';
import AdminSystemSettingsPage from './pages/admin/settings/AdminSystemSettingsPage';
import AdminAuditLogsPage from './pages/admin/settings/AdminAuditLogsPage';

// ─── Teacher Pages ────────────────────────────────────────────────────────────
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';
import MarkAttendancePage from './pages/teacher/MarkAttendancePage';
import UploadMarksPage from './pages/teacher/UploadMarksPage';
import CreateAssignmentPage from './pages/teacher/CreateAssignmentPage';
import UploadMaterialPage from './pages/teacher/UploadMaterialPage';
import StudentPerformancePage from './pages/teacher/StudentPerformancePage';
import ViewSubmissionsPage from './pages/teacher/ViewSubmissionsPage';
import TeacherReportPage from './pages/teacher/ReportPage';

// ─── HOD Pages ────────────────────────────────────────────────────────────────
import HODDashboardPage from './pages/hod/HODDashboardPage';
import DepartmentStudentsPage from './pages/hod/DepartmentStudentsPage';
import FacultyPerformancePage from './pages/hod/FacultyPerformancePage';
import SubjectManagementPage from './pages/hod/SubjectManagementPage';
import DepartmentAnalyticsPage from './pages/hod/DepartmentAnalyticsPage';
import DepartmentReportPage from './pages/hod/DepartmentReportPage';
import TimetableExamPage from './pages/hod/TimetableExamPage';
import BudgetResourcePage from './pages/hod/BudgetResourcePage';
import LeaveManagementPage from './pages/hod/LeaveManagementPage';
import GrievancesPage from './pages/hod/GrievancesPage';
import ResearchInnovationPage from './pages/hod/ResearchInnovationPage';
import IndustryPartnershipPage from './pages/hod/IndustryPartnershipPage';
import DepartmentSettingsPage from './pages/hod/DepartmentSettingsPage';
import HODProfilePage from './pages/hod/HODProfilePage';

// ─── Principal Pages ──────────────────────────────────────────────────────────
import PrincipalDashboardPage from './pages/principal/PrincipalDashboardPage';
import ApprovalQueuePage from './pages/principal/ApprovalQueuePage';
import StaffManagementPage from './pages/principal/StaffManagementPage';
import AnnounceementPage from './pages/principal/AnnounceementPage';
import CollegeAnalyticsPage from './pages/principal/CollegeAnalyticsPage';
import ReportGenerationPage from './pages/principal/ReportGenerationPage';
import PrincipalProfilePage from './pages/principal/PrincipalProfilePage';
import { PrincipalAdmissionQueuePage } from './pages/principal/PrincipalAdmissionQueuePage';
import { PrincipalAdmissionReviewPage } from './pages/principal/PrincipalAdmissionReviewPage';

// ─── Parent Pages ─────────────────────────────────────────────────────────────
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import AttendanceMonitorPage from './pages/parent/AttendanceMonitorPage';
import ChildPerformancePage from './pages/parent/ChildPerformancePage';
import FeeStatusPage from './pages/parent/FeeStatusPage';
import ParentNotificationsPage from './pages/parent/NotificationsPage';
import ParentContactTeacherPage from './pages/parent/ContactTeacherPage';

// ─── Fallback Pages ───────────────────────────────────────────────────────────
const UnauthorizedPage: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
    <h1 className="text-4xl font-extrabold text-rose-500">403 — Access Denied</h1>
    <p className="text-slate-400 mt-2 text-sm">You do not have permission to view this resource.</p>
    <a href="/login" className="mt-6 text-indigo-400 hover:underline text-sm font-semibold">Back to Login</a>
  </div>
);

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
    <h1 className="text-4xl font-extrabold text-indigo-500">404 — Not Found</h1>
    <p className="text-slate-400 mt-2 text-sm">The page you are looking for does not exist.</p>
    <a href="/login" className="mt-6 text-indigo-400 hover:underline text-sm font-semibold">Back to Login</a>
  </div>
);

// ─── Role-based root redirect ─────────────────────────────────────────────────
const RoleBasedRedirect: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role;

  if (role === 'STUDENT') return <Navigate to="/admission/dashboard" replace />;
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'PRINCIPAL') return <Navigate to="/principal/dashboard" replace />;
  
  // Default fallback for other roles
  return <Navigate to="/unauthorized" replace />;
};

// ─── Session bootstrap ────────────────────────────────────────────────────────
const AuthBootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await API.get('/auth/status');
          if (res.data.success) {
            dispatch(loginSuccess({ user: res.data.data.user, token }));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
              forceLogout(true);
            }
          }
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            forceLogout(true);
          }
        }
      }
      setBootstrapped(true);
    };
    bootstrap();
  }, [dispatch]);

  if (!bootstrapped) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-neutral-900">
        <div className="size-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <p className="text-slate-500 dark:text-neutral-400 font-bold tracking-tight text-xs uppercase">Verifying session…</p>
      </div>
    );
  }
  return <>{children}</>;
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <TopLoadingBar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <AuthBootstrap>
          <Routes>
            {/* ── Public ── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* ── Admission Portal (Public) ── */}
            <Route element={
              <AdmissionAuthProvider>
                <AdmissionAuthLayout />
              </AdmissionAuthProvider>
            }>
              <Route path="/admission/login" element={<AdmissionLogin />} />
              <Route path="/admission/register" element={<AdmissionRegister />} />
            </Route>

            {/* ── Protected (all authenticated roles) ── */}
            <Route path="/" element={<ProtectedLayout />}>
              <Route index element={<RoleBasedRedirect />} />

              {/* ── Admission Student Portal (Protected) ── */}
              <Route path="admission" element={
                <AdmissionAuthProvider>
                  <AdmissionDashboardLayout />
                </AdmissionAuthProvider>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdmissionStudentDashboard />} />
                <Route path="application" element={<AdmissionForm />} />
              </Route>

              {/* ── Student Portal ── */}
              <Route path="student" element={<StudentLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboardPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
                <Route path="attendance" element={<AttendanceViewPage />} />
                <Route path="marks" element={<MarksViewPage />} />
                <Route path="fees" element={<FeePaymentPage />} />
                <Route path="grievances" element={<GrievancePortalPage />} />
                <Route path="timetable" element={<TimetablePage />} />
                <Route path="exams" element={<ExamsPage />} />
                <Route path="performance" element={<PerformancePage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="leave" element={<LeavePage />} />
                <Route path="preferences" element={<PreferencesPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="assignments" element={<AssignmentPage />} />
                <Route path="study-material" element={<StudyMaterialPage />} />
                <Route path="contact-teacher" element={<ContactTeacherPage />} />
              </Route>

              {/* ── Admin Portal ── */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                {/* Admissions */}
                <Route path="admissions/queue" element={<AdmissionQueuePage defaultStatus="QUEUE" />} />
                <Route path="admissions/review/:id" element={<AdmissionReviewPage />} />
                <Route path="admissions/resubmitted" element={<AdmissionQueuePage defaultStatus="RESUBMITTED" />} />
                <Route path="admissions/rejected" element={<AdmissionQueuePage defaultStatus="REJECTED" />} />
                <Route path="admissions/verified" element={<AdmissionQueuePage defaultStatus="APPROVED" />} />
                <Route path="admissions/approved" element={<AdmissionQueuePage defaultStatus="ENROLLED" />} />
                <Route path="admissions/history" element={<AdmissionQueuePage defaultStatus="ALL" />} />
                {/* User Management */}
                <Route path="users/students" element={<StudentManagementPage />} />
                <Route path="users/teachers" element={<TeacherManagementPage />} />
                <Route path="users/hods" element={<HodManagementPage />} />
                <Route path="users/principals" element={<PrincipalManagementPage />} />
                <Route path="users/parents" element={<ParentManagementPage />} />
                {/* Communications */}
                <Route path="notifications" element={<AdminNotificationsPage />} />
                <Route path="messages" element={<AdminMessagesPage />} />
                <Route path="announcements" element={<AdminAnnouncementsPage />} />
                {/* Settings */}
                <Route path="settings/system" element={<AdminSystemSettingsPage />} />
                <Route path="settings/logs" element={<AdminAuditLogsPage />} />
                <Route path="credentials" element={<CredentialManagementPage />} />
                <Route path="credentials/bulk" element={<BulkCredentialPage />} />
              </Route>

              {/* ── Teacher Portal ── */}
              <Route path="teacher" element={<TeacherLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<TeacherDashboardPage />} />
                <Route path="attendance" element={<MarkAttendancePage />} />
                <Route path="marks" element={<UploadMarksPage />} />
                <Route path="assignments" element={<CreateAssignmentPage />} />
                <Route path="submissions" element={<ViewSubmissionsPage />} />
                <Route path="materials" element={<UploadMaterialPage />} />
                <Route path="performance" element={<StudentPerformancePage />} />
                <Route path="reports" element={<TeacherReportPage />} />
              </Route>

              {/* ── HOD Portal ── */}
              <Route path="hod" element={<HODLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<HODDashboardPage />} />
                <Route path="students" element={<DepartmentStudentsPage />} />
                <Route path="faculty" element={<FacultyPerformancePage />} />
                <Route path="subjects" element={<SubjectManagementPage />} />
                <Route path="analytics" element={<DepartmentAnalyticsPage />} />
                <Route path="reports" element={<DepartmentReportPage />} />
                <Route path="timetable" element={<TimetableExamPage />} />
                <Route path="budget" element={<BudgetResourcePage />} />
                <Route path="leave" element={<LeaveManagementPage />} />
                <Route path="grievances" element={<GrievancesPage />} />
                <Route path="research" element={<ResearchInnovationPage />} />
                <Route path="partnerships" element={<IndustryPartnershipPage />} />
                <Route path="settings" element={<DepartmentSettingsPage />} />
                <Route path="profile" element={<HODProfilePage />} />
              </Route>

              {/* ── Principal Portal ── */}
              <Route path="principal" element={<PrincipalLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<PrincipalDashboardPage />} />
                <Route path="approvals" element={<ApprovalQueuePage />} />
                <Route path="admissions" element={<PrincipalAdmissionQueuePage defaultStatus="APPROVED" />} />
                <Route path="admissions/pending" element={<PrincipalAdmissionQueuePage defaultStatus="APPROVED" />} />
                <Route path="admissions/approved" element={<PrincipalAdmissionQueuePage defaultStatus="ENROLLED" />} />
                <Route path="admissions/rejected" element={<PrincipalAdmissionQueuePage defaultStatus="REJECTED" />} />
                <Route path="admissions/history" element={<PrincipalAdmissionQueuePage defaultStatus="ALL" />} />
                <Route path="admissions/review/:id" element={<PrincipalAdmissionReviewPage />} />
                <Route path="staff" element={<StaffManagementPage />} />
                <Route path="announcements" element={<AnnounceementPage />} />
                <Route path="analytics" element={<CollegeAnalyticsPage />} />
                <Route path="reports" element={<ReportGenerationPage />} />
                <Route path="profile" element={<PrincipalProfilePage />} />
              </Route>

              {/* ── Parent Portal ── */}
              <Route path="parent" element={<ParentLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ParentDashboardPage />} />
                <Route path="attendance" element={<AttendanceMonitorPage />} />
                <Route path="performance" element={<ChildPerformancePage />} />
                <Route path="fees" element={<FeeStatusPage />} />
                <Route path="notifications" element={<ParentNotificationsPage />} />
                <Route path="contact" element={<ParentContactTeacherPage />} />
              </Route>
            </Route>

            {/* ── Global 404 ── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthBootstrap>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
