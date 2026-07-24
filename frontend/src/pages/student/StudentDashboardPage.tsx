import React, { useEffect, useState } from 'react';
import StudentService, { StudentDashboard } from '../../services/student.service';
import TrendChart from '../../components/charts/TrendChart';
import LoadingContainer from '../../components/common/LoadingContainer';
import { DashboardSkeleton } from '../../components/common/Skeleton';
import Toast from '../../components/common/Toast';
import { 
  Search, 
  Maximize2, 
  Calendar as CalendarIcon, 
  BookOpen, 
  CheckSquare, 
  ChevronDown, 
  Award,
  Download,
  CreditCard,
  FileText,
  Bell,
  Clock,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Activity,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface CourseItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  color: string; // Tailwind class
  textColor: string;
  darkColor: string;
  pillColor: string;
  students: string[];
}

const mockCourses: CourseItem[] = [
  {
    id: '1',
    title: 'Speak with Confidence',
    subtitle: 'Learn how to speak English clearly and confidently in everyday situations.',
    date: '27 Apr 2025',
    color: 'bg-[#E8E5FF]',
    textColor: 'text-[#4F46E5]',
    darkColor: 'border-[#D9D6FF]',
    pillColor: 'bg-[#1A1A1A]',
    students: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop',
    ]
  },
  {
    id: '2',
    title: 'Master the Basics',
    subtitle: 'Build a strong foundation with essential grammar and vocabulary.',
    date: '30 Apr 2025',
    color: 'bg-[#E1F5FE]',
    textColor: 'text-[#0284C7]',
    darkColor: 'border-[#B3E5FC]',
    pillColor: 'bg-[#1A1A1A]',
    students: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop',
    ]
  },
  {
    id: '3',
    title: 'Sound Like a Native',
    subtitle: 'Improve your pronunciation and intonation for natural speech.',
    date: '15 May 2025',
    color: 'bg-[#E8F5E9]',
    textColor: 'text-[#16A34A]',
    darkColor: 'border-[#C8E6C9]',
    pillColor: 'bg-[#1A1A1A]',
    students: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&fit=crop',
    ]
  }
];

interface HomeworkItem {
  id: string;
  title: string;
  progress: number;
}

const initialHomework: HomeworkItem[] = [
  { id: '1', title: 'Learn 10 new words today', progress: 57 },
  { id: '2', title: 'Do I grammar task today', progress: 42 },
  { id: '3', title: 'Watch a video, answer 3 questions', progress: 31 },
  { id: '4', title: 'Write 3 sentences with vocab', progress: 84 }
];

interface FriendScore {
  name: string;
  score: string;
  avatar: string;
  books: number;
  hours: number;
  level: number;
}

const friendsList: FriendScore[] = [
  { name: 'Anna Morgan', score: '10,568', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop', books: 25, hours: 832, level: 48 },
  { name: 'Jake Thompson', score: '10,234', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop', books: 23, hours: 778, level: 39 },
  { name: 'Sofia Bennett', score: '9,892', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop', books: 20, hours: 742, level: 33 },
  { name: 'Emily Carter', score: '9,322', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop', books: 17, hours: 643, level: 28 }
];

// New Dashboard Mock Data
const attendanceChartData = [
  { name: 'Data Struct.', percentage: 88, color: '#6366f1' },
  { name: 'Automata', percentage: 82, color: '#0284c7' },
  { name: 'DBMS', percentage: 90, color: '#16a34a' },
  { name: 'Software Eng.', percentage: 84, color: '#ec4899' },
  { name: 'OS Lab', percentage: 92, color: '#8b5cf6' }
];

interface ExamItem {
  id: string;
  subject: string;
  code: string;
  type: string;
  date: string;
  daysLeft: number;
}

const mockExams: ExamItem[] = [
  { id: '1', subject: 'Advanced Data Structures', code: 'CS-301', type: 'Written Theory', date: 'Jun 26, 2026', daysLeft: 2 },
  { id: '2', subject: 'Database Management Systems', code: 'CS-305', type: 'Practical Lab', date: 'Jun 29, 2026', daysLeft: 5 },
  { id: '3', subject: 'Formal Languages & Automata', code: 'CS-303', type: 'Written Theory', date: 'Jul 02, 2026', daysLeft: 8 },
  { id: '4', subject: 'Software Engineering Principles', code: 'CS-307', type: 'Viva Voce', date: 'Jul 06, 2026', daysLeft: 12 },
  { id: '5', subject: 'Operating Systems Laboratory', code: 'CS-309', type: 'Practical Lab', date: 'Jul 09, 2026', daysLeft: 15 }
];

interface RecentMarkItem {
  id: string;
  subject: string;
  code: string;
  examType: 'Internal' | 'Semester' | 'Total';
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  status: 'PASS' | 'FAIL';
}

const mockRecentMarks: RecentMarkItem[] = [
  { id: '1', subject: 'Advanced Data Structures', code: 'CS-301', examType: 'Internal', marksObtained: 18, maxMarks: 20, percentage: 90, grade: 'A+', status: 'PASS' },
  { id: '2', subject: 'Formal Languages & Automata', code: 'CS-303', examType: 'Internal', marksObtained: 17, maxMarks: 20, percentage: 85, grade: 'A', status: 'PASS' },
  { id: '3', subject: 'Database Management Systems', code: 'CS-305', examType: 'Internal', marksObtained: 19, maxMarks: 20, percentage: 95, grade: 'O', status: 'PASS' },
  { id: '4', subject: 'Software Engineering Principles', code: 'CS-307', examType: 'Internal', marksObtained: 16, maxMarks: 20, percentage: 80, grade: 'B+', status: 'PASS' },
  { id: '5', subject: 'Operating Systems Laboratory', code: 'CS-309', examType: 'Internal', marksObtained: 19, maxMarks: 20, percentage: 95, grade: 'O', status: 'PASS' },
  { id: '6', subject: 'Advanced Data Structures', code: 'CS-301', examType: 'Semester', marksObtained: 85, maxMarks: 100, percentage: 85, grade: 'A', status: 'PASS' },
  { id: '7', subject: 'Formal Languages & Automata', code: 'CS-303', examType: 'Semester', marksObtained: 78, maxMarks: 100, percentage: 78, grade: 'B', status: 'PASS' },
  { id: '8', subject: 'Database Management Systems', code: 'CS-305', examType: 'Semester', marksObtained: 92, maxMarks: 100, percentage: 92, grade: 'A+', status: 'PASS' },
  { id: '9', subject: 'Software Engineering Principles', code: 'CS-307', examType: 'Semester', marksObtained: 82, maxMarks: 100, percentage: 82, grade: 'B+', status: 'PASS' },
  { id: '10', subject: 'Operating Systems Laboratory', code: 'CS-309', examType: 'Semester', marksObtained: 94, maxMarks: 100, percentage: 94, grade: 'O', status: 'PASS' }
];

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}

const mockNotifications: NotificationItem[] = [
  { id: '1', title: 'Admit Card Available', description: 'Download Sem 3 examinations admit card now.', time: '2 hours ago', type: 'success' },
  { id: '2', title: 'Fees Payment Extended', description: 'Tuition fees deadline has been extended to Jun 30.', time: '5 hours ago', type: 'info' },
  { id: '3', title: 'Low Attendance Warning', description: 'Software Eng. attendance is at 74% (minimum 75% required).', time: '1 day ago', type: 'warning' },
  { id: '4', title: 'Mid-Sem Feedback Open', description: 'Academic performance feedback portal is open.', time: '2 days ago', type: 'info' },
  { id: '5', title: 'Lab Session Rescheduled', description: 'Operating Systems lab is rescheduled to Thursday 2 PM.', time: '3 days ago', type: 'info' }
];

const cgpaTrendData = [
  { semester: 'Sem 1', sgpa: 7.50, cgpa: 7.50 },
  { semester: 'Sem 2', sgpa: 7.90, cgpa: 7.70 },
  { semester: 'Sem 3', sgpa: 8.10, cgpa: 7.85 }
];

interface StudyReminderItem {
  id: string;
  title: string;
  deadline: string;
  isUrgent: boolean;
  completed: boolean;
}

const initialReminders: StudyReminderItem[] = [
  { id: '1', title: 'Submit DBMS Assignment 2', deadline: 'Today, 11:59 PM', isUrgent: true, completed: false },
  { id: '2', title: 'Complete OS Lab Report', deadline: 'Tomorrow, 2:00 PM', isUrgent: true, completed: false },
  { id: '3', title: 'Prepare Automata viva questions', deadline: 'Jun 28, 2026', isUrgent: false, completed: false },
  { id: '4', title: 'Write Technical Writing abstract', deadline: 'Jun 30, 2026', isUrgent: false, completed: false }
];

export const StudentDashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [homework, setHomework] = useState<HomeworkItem[]>(initialHomework);
  const [reminders, setReminders] = useState<StudyReminderItem[]>(initialReminders);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<'skills' | 'cgpa'>('skills');
  const [recentMarksFilter, setRecentMarksFilter] = useState<'All' | 'Internal' | 'Semester'>('All');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await StudentService.getStudentDashboard();
      setDashboard(data);
    } catch (err: any) {
      console.warn('API error loading dashboard, using fallback mock data:', err);
      setDashboard({
        student: {
          id: '1',
          name: 'John Doe',
          email: 'student@college.com',
          phone: '9876543210',
          enrollmentNumber: 'CS-2024-001',
          rollNumber: '01',
          department: 'Computer Science & Engineering',
          semester: 3,
          profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&fit=crop'
        },
        attendance: {
          overallPercentage: '86.50',
          status: 'GOOD',
          subjects: []
        },
        academicInfo: {
          cgpa: 7.85,
          sgpa: 8.10,
          riskLevel: 'GOOD',
          failedSubjects: 0
        },
        recentMarks: [],
        fees: {
          totalDue: 2500,
          totalPaid: 5000,
          totalAmount: 7500,
          fees: []
        },
        upcomingExams: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProgressIncrement = (id: string) => {
    setHomework(prev => prev.map(item => {
      if (item.id === id) {
        const nextProgress = item.progress >= 100 ? 0 : Math.min(100, item.progress + 5);
        return { ...item, progress: nextProgress };
      }
      return item;
    }));
  };

  const toggleReminderCompleted = (id: string) => {
    setReminders(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    }));
    setToastMessage({
      type: 'success',
      message: 'Reminder status updated!'
    });
  };

  const triggerQuickAction = (action: string) => {
    setToastMessage({
      type: 'success',
      message: `Action Triggered: ${action}`
    });
  };

  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMarks = (() => {
    if (recentMarksFilter === 'All') {
      const grouped: { [code: string]: RecentMarkItem } = {};
      
      mockRecentMarks.forEach(mark => {
        if (!grouped[mark.code]) {
          grouped[mark.code] = {
            id: mark.code,
            subject: mark.subject,
            code: mark.code,
            examType: 'Total',
            marksObtained: 0,
            maxMarks: 0,
            percentage: 0,
            grade: '',
            status: 'PASS'
          };
        }
        
        grouped[mark.code].marksObtained += mark.marksObtained;
        grouped[mark.code].maxMarks += mark.maxMarks;
      });

      return Object.values(grouped).map(item => {
        const pct = Math.round((item.marksObtained / item.maxMarks) * 100);
        item.percentage = pct;
        
        if (pct >= 90) item.grade = 'O';
        else if (pct >= 80) item.grade = 'A+';
        else if (pct >= 70) item.grade = 'A';
        else if (pct >= 60) item.grade = 'B+';
        else if (pct >= 50) item.grade = 'B';
        else if (pct >= 40) item.grade = 'C';
        else item.grade = 'F';

        item.status = pct >= 40 ? 'PASS' : 'FAIL';
        return item;
      });
    }

    return mockRecentMarks.filter(mark => mark.examType === recentMarksFilter);
  })();

  // Visual percentages calculations
  const totalAmount = dashboard?.fees?.totalAmount || 7500;
  const totalPaid = dashboard?.fees?.totalPaid || 5000;
  const totalDue = dashboard?.fees?.totalDue || 2500;
  const paidPercent = Math.round((totalPaid / totalAmount) * 100);

  return (
    <LoadingContainer
      isLoading={loading}
      skeleton={<DashboardSkeleton />}
      hintText="Fetching student dashboard data..."
    >
      <div className="space-y-6 pb-6 animate-fade-in">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* 1. Welcome Message Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between glass-panel px-6 py-6 rounded-[32px] shadow-ambient mb-2 gap-4">
        <div className="flex items-center space-x-4">
          <img 
            src={dashboard?.student?.profileImage || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&fit=crop'} 
            alt="Profile Avatar"
            className="w-16 h-16 rounded-2xl object-cover border border-white/50 shadow-sm"
          />
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">Student Cockpit</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-800 dark:text-white tracking-tight mt-0.5">
              Welcome back, {dashboard?.student?.name || 'Student'}! 👋
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-semibold">
              Department of {dashboard?.student?.department || 'Computer Science'} • Semester {dashboard?.student?.semester || 3}
            </p>
          </div>
        </div>
        
        {/* Date block */}
        <div className="flex items-center space-x-3 bg-white/40 dark:bg-neutral-500/40 border border-neutral-200/50 dark:border-neutral-800 px-4 py-2.5 rounded-2xl md:min-w-[150px]">
          <CalendarIcon className="w-5 h-5 text-neutral-400" />
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Today's Date</p>
            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Jun 24, 2026</p>
          </div>
        </div>
      </div>

      {/* 2. Quick Stats Cards (4 grid items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Stats Card 1: CGPA */}
        <div className="glass-panel rounded-[28px] p-5 shadow-ambient border-l-4 border-[#8b5cf6] hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">Cumulative GPA</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {dashboard?.academicInfo?.cgpa?.toFixed(2) || '7.85'} / 10
            </h3>
            <p className="text-[11px] text-emerald-500 font-bold tracking-wide mt-1 flex items-center gap-0.5">
              <span>↑ +0.15</span> <span className="text-neutral-400 font-medium">vs last semester</span>
            </p>
          </div>
        </div>

        {/* Stats Card 2: Attendance % */}
        <div className="glass-panel rounded-[28px] p-5 shadow-ambient border-l-4 border-[#16a34a] hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">Overall Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-[#16a34a] tracking-tight">
              {dashboard?.attendance?.overallPercentage || '86.50'}%
            </h3>
            <p className="text-[11px] text-emerald-500 font-bold tracking-wide mt-1 flex items-center gap-0.5">
              <span>On Track</span> <span className="text-neutral-400 font-medium">(Min Required 75%)</span>
            </p>
          </div>
        </div>

        {/* Stats Card 3: Pending Fees */}
        <div className="glass-panel rounded-[28px] p-5 shadow-ambient border-l-4 border-[#e11d48] hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">Pending Fees</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              ${dashboard?.fees?.totalDue?.toLocaleString() ?? '2,500'}
            </h3>
            <p className="text-[11px] text-rose-500 font-bold tracking-wide mt-1 flex items-center gap-0.5">
              <AlertCircle className="w-3.5 h-3.5" /> <span>Due in 6 Days</span>
            </p>
          </div>
        </div>

        {/* Stats Card 4: Performance Status */}
        <div className="glass-panel rounded-[28px] p-5 shadow-ambient border-l-4 border-[#0284c7] hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">Academic Status</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Excellent
            </h3>
            <p className="text-[11px] text-emerald-500 font-bold tracking-wide mt-1 flex items-center gap-0.5">
              <span>Low Risk</span> <span className="text-neutral-400 font-medium">0 failed classes</span>
            </p>
          </div>
        </div>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: COURSE SELECTION, QUICK ACTIONS, NOTIFICATIONS, STUDY REMINDERS (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Select a course card */}
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[22px] font-bold text-neutral-900 dark:text-white tracking-tight">Select a course</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Start learning today</p>
              </div>
              <button 
                className="w-10 h-10 rounded-full dark-chip flex items-center justify-center transition-all cursor-pointer hover:opacity-80"
                title="Expand courses"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-100 dark:border-neutral-800/80 focus:border-neutral-300 dark:focus:border-neutral-700 rounded-2xl py-3 px-4 text-sm outline-none transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                />
              </div>
              <button className="w-12 h-12 rounded-2xl btn-primary-custom flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer">
                <Search className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id === selectedCourse ? null : course.id)}
                    className={`w-full rounded-[24px] p-5 cursor-pointer text-left transition-all duration-300 hover:scale-[1.02] border ${course.color} ${course.textColor} ${
                      selectedCourse === course.id 
                        ? 'ring-2 ring-[#1A1A1A] border-transparent shadow-md' 
                        : 'border-transparent shadow-sm'
                    }`}
                  >
                    <h4 className="text-[17px] font-bold tracking-tight mb-1">{course.title}</h4>
                    <p className="text-xs opacity-75 font-medium leading-relaxed mb-4">{course.subtitle}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="btn-primary-custom rounded-xl py-1.5 px-3 flex items-center gap-1.5 text-[11px] font-semibold">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{course.date}</span>
                      </div>

                      <div className="flex -space-x-2">
                        {course.students.map((avatar, idx) => (
                          <img
                            key={idx}
                            src={avatar}
                            alt="Student avatar"
                            className="w-7 h-7 rounded-full border border-white object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 py-6">No courses found matching search query.</p>
              )}
            </div>
          </div>

          {/* Quick Action Buttons Widget */}
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col space-y-4">
            <div>
              <h3 className="text-[20px] font-bold text-neutral-900 dark:text-white tracking-tight">Quick Actions</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Instant shortcuts for portal requests</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => triggerQuickAction('Downloading Hall Ticket / Admit Card...')}
                className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-200/40 dark:hover:bg-neutral-800/70 border border-neutral-100 dark:border-neutral-800 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Download Hall Ticket</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => triggerQuickAction('Redirecting to Payment Gateway...')}
                className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-200/40 dark:hover:bg-neutral-800/70 border border-neutral-100 dark:border-neutral-800 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Pay Outstanding Fees</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => triggerQuickAction('Opening Leave Application Form...')}
                className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-200/40 dark:hover:bg-neutral-800/70 border border-neutral-100 dark:border-neutral-800 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Request Casual/Medical Leave</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Notifications Panel Widget (bell notifications) */}
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[20px] font-bold text-neutral-900 dark:text-white tracking-tight">System Alerts</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Latest notifications & announcements</p>
              </div>
              <div className="w-8 h-8 rounded-full dark-chip flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              {mockNotifications.map((notif) => (
                <div key={notif.id} className="flex gap-3 items-start border-b border-neutral-100/50 dark:border-neutral-800/30 pb-3 last:border-b-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                    notif.type === 'warning' ? 'bg-rose-500/10 text-rose-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {notif.type === 'success' ? <CheckCircle2 className="w-4.5 h-4.5" /> :
                     notif.type === 'warning' ? <AlertCircle className="w-4.5 h-4.5" /> :
                     <Bell className="w-4.5 h-4.5" />}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{notif.title}</p>
                      <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-normal font-medium">{notif.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Reminder Widget */}
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col space-y-4">
            <div>
              <h3 className="text-[20px] font-bold text-neutral-900 dark:text-white tracking-tight">Study Reminders</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Deadlines and pending course assignments</p>
            </div>

            <div className="space-y-3.5 pt-2">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id}
                  onClick={() => toggleReminderCompleted(reminder.id)}
                  className={`flex items-center space-x-3.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                    reminder.completed
                      ? 'bg-neutral-50/50 dark:bg-neutral-900/10 border-neutral-100 dark:border-neutral-800 opacity-60'
                      : 'bg-white/40 dark:bg-neutral-800/10 border-neutral-200/50 dark:border-neutral-800/60 hover:scale-[1.01]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    reminder.completed
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white dark:bg-white dark:border-white dark:text-black'
                      : 'border-neutral-300 dark:border-neutral-600'
                  }`}>
                    {reminder.completed && <CheckSquare className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${
                      reminder.completed ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'
                    }`}>
                      {reminder.title}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-0.5">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span className={`text-[10px] font-semibold ${
                        reminder.isUrgent && !reminder.completed ? 'text-rose-500 font-bold' : 'text-neutral-400'
                      }`}>
                        {reminder.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: GRAPHS, EXAMS, MARKS TABLE, FEE VISUALIZATION, TASK/FRIENDS (col-span-8) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* TABBED GRAPH CARD (Performance / CGPA semesters Trend) */}
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-[22px] font-bold text-neutral-900 dark:text-white tracking-tight">
                  {activeChartTab === 'skills' ? 'Skills Performance Chart' : 'CGPA Semester Trend'}
                </h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                  {activeChartTab === 'skills' ? 'Track results and watch your progress rise' : 'Cumulative performance curve across semesters'}
                </p>
              </div>

              {/* Chart Mode Selector Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveChartTab('skills')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    activeChartTab === 'skills'
                      ? 'bg-[#bae6fd] text-black border-[#7dd3fc] shadow-sm'
                      : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                  }`}
                >
                  Skills Trend
                </button>
                <button
                  onClick={() => setActiveChartTab('cgpa')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    activeChartTab === 'cgpa'
                      ? 'bg-[#e9d5ff] text-black border-[#d8b4fe] shadow-sm'
                      : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                  }`}
                >
                  CGPA Graph
                </button>
              </div>
            </div>

            {/* Performance Graph Details */}
            {activeChartTab === 'skills' ? (
              <>
                <div className="flex items-center space-x-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>Theory</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span>Practice</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                    <span>Lexicon</span>
                  </div>
                </div>
                <div className="pt-2">
                  <TrendChart />
                </div>
              </>
            ) : (
              /* CGPA Semester Trend Chart */
              <div className="h-[240px] pt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cgpaTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(0,0,0,0.04)" />
                    <XAxis 
                      dataKey="semester" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 500 }}
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      axisLine={false} 
                      tickLine={false} 
                      ticks={[0, 4, 6, 8, 10]}
                      tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '16px', 
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' 
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sgpa" 
                      stroke="#8b5cf6" 
                      strokeWidth={3} 
                      dot={{ r: 5, strokeWidth: 2, fill: '#8b5cf6' }} 
                      activeDot={{ r: 7 }}
                      name="SGPA"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cgpa" 
                      stroke="#16a34a" 
                      strokeWidth={3} 
                      dot={{ r: 5, strokeWidth: 2, fill: '#16a34a' }} 
                      activeDot={{ r: 7 }}
                      name="CGPA"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* ATTENDANCE CHART & FEE STATUS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Attendance Chart Widget */}
            <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col space-y-4">
              <div>
                <h3 className="text-[20px] font-bold text-neutral-900 dark:text-white tracking-tight">Attendance Chart</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Attendance ratio comparison by subject</p>
              </div>

              <div className="h-[210px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 500 }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      axisLine={false} 
                      tickLine={false}
                      ticks={[0, 50, 75, 100]}
                      tickFormatter={(val) => `${val}%`}
                      tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 500 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Attendance']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '12px', 
                        border: 'none',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.06)' 
                      }}
                    />
                    <Bar dataKey="percentage" radius={[8, 8, 0, 0]} barSize={24}>
                      {attendanceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fee Status Widget (paid vs pending) */}
            <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col justify-between min-h-[290px]">
              <div>
                <h3 className="text-[20px] font-bold text-neutral-900 dark:text-white tracking-tight">Fee Status</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Summary of paid vs pending dues</p>
              </div>

              {/* Progress representation */}
              <div className="py-4 space-y-5">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400 font-semibold">Total Amount</p>
                    <p className="text-2xl font-extrabold text-neutral-800 dark:text-white tracking-tight">
                      ${totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-2xl dark-chip text-[11px] font-bold">
                    {paidPercent}% Cleared
                  </span>
                </div>

                {/* Progress bar visual slider */}
                <div className="w-full h-4 bg-rose-500/10 rounded-full overflow-hidden flex relative">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500" 
                    style={{ width: `${paidPercent}%` }}
                    title={`Paid: ${paidPercent}%`}
                  />
                  <div 
                    className="h-full bg-gradient-to-r from-rose-400 to-rose-500" 
                    style={{ width: `${100 - paidPercent}%` }}
                    title={`Pending: ${100 - paidPercent}%`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Paid Amount</p>
                    <p className="text-lg font-bold text-emerald-500 mt-0.5">${totalPaid.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Pending Dues</p>
                    <p className="text-lg font-bold text-rose-500 mt-0.5">${totalDue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* UPCOMING EXAMS COUNTDOWN WIDGET */}
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col space-y-4">
            <div>
              <h3 className="text-[20px] font-bold text-neutral-900 dark:text-white tracking-tight">Upcoming Examinations</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Next 5 university exam schedules and counters</p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 pt-1">
              {mockExams.map((exam) => (
                <div 
                  key={exam.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/45 dark:bg-neutral-800/10 border border-neutral-200/50 dark:border-neutral-800/60 rounded-[22px] hover:scale-[1.01] transition-transform gap-3"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{exam.subject}</p>
                      <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">{exam.code} • {exam.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-neutral-100 dark:border-0 pt-2 sm:pt-0">
                    <span className="text-xs text-neutral-400 font-semibold">{exam.date}</span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm ${
                      exam.daysLeft <= 3 
                        ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20' 
                        : 'bg-emerald-50 text-[#16a34a] dark:bg-emerald-950/20'
                    }`}>
                      {exam.daysLeft} {exam.daysLeft === 1 ? 'day' : 'days'} to go
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT MARKS TABLE WIDGET */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pl-2">
              <div>
                <h3 className="text-[20px] font-bold text-neutral-900 dark:text-white tracking-tight">Recent Exam Results</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium font-semibold">Latest 10 academic marks lists</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                {([
                  { label: 'All', activeStyle: 'bg-[#bae6fd] text-black border-[#7dd3fc]' },
                  { label: 'Internal', activeStyle: 'bg-[#bbf7d0] text-black border-[#6ee7b7]' },
                  { label: 'Semester', activeStyle: 'bg-[#e9d5ff] text-black border-[#d8b4fe]' },
                ] as const).map(({ label, activeStyle }) => (
                  <button
                    key={label}
                    onClick={() => setRecentMarksFilter(label as 'All' | 'Internal' | 'Semester')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      recentMarksFilter === label
                        ? activeStyle + ' shadow-sm'
                        : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recents marks ledger */}
            <div className="overflow-hidden rounded-[28px] glass-table-container shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-5 py-4">Subject</th>
                      <th className="px-5 py-4">Exam Type</th>
                      <th className="px-5 py-4 text-center">Marks</th>
                      <th className="px-5 py-4 text-center">Percentage</th>
                      <th className="px-5 py-4 text-center">Grade</th>
                      <th className="px-5 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                    {filteredMarks.map((item) => {
                      const examTypePill =
                        item.examType === 'Internal'
                          ? 'bg-[#bbf7d0] text-black'
                          : item.examType === 'Semester'
                          ? 'bg-[#e9d5ff] text-black'
                          : 'bg-[#bae6fd] text-black';
                      return (
                      <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-bold text-neutral-900 dark:text-white">{item.subject}</p>
                          <p className="text-neutral-450 text-[10px] font-semibold mt-0.5">{item.code}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${examTypePill}`}>
                            {item.examType === 'Total' ? 'Combined' : item.examType}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center font-bold">{item.marksObtained} / {item.maxMarks}</td>
                        <td className="px-5 py-4 text-center font-extrabold text-[#4F46E5]">{item.percentage}%</td>
                        <td className="px-5 py-4 text-center">
                          <span className="px-2.5 py-1 bg-[#fef9c3] text-black rounded-lg text-xs font-bold">
                            {item.grade}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold tracking-wider ${
                            item.status === 'PASS' 
                              ? 'bg-emerald-50 text-emerald-600' 
                              : 'bg-rose-50 text-rose-500'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* BOTTOM RIGHT GRID: TWO COLUMNS FOR HOMEWORK & LEADERBOARD (col-span-8 child) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Homework pending list */}
            <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[22px] font-bold text-neutral-900 dark:text-white tracking-tight">Homework</h3>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Check and complete tasks</p>
                </div>
                <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-700/70 border border-neutral-100 dark:border-neutral-800 text-[12px] font-bold text-neutral-500 dark:text-neutral-400 transition-all cursor-pointer">
                  <span>Day</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Homework progress list */}
              <div className="space-y-4 pt-2">
                {homework.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => handleProgressIncrement(task.id)}
                    className="flex items-center space-x-4 cursor-pointer group transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] hover:bg-neutral-800 text-white flex items-center justify-center transition-colors shadow-sm">
                      <CheckSquare className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1 group-hover:text-black dark:group-hover:text-white">
                        {task.title}
                      </p>
                      
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600 rounded-full transition-all duration-500" 
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>

                    <span className="text-[18px] font-extrabold text-neutral-800 dark:text-neutral-200 tracking-tight">
                      {task.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Friends Leaderboard / Score card */}
            <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[22px] font-bold text-neutral-900 dark:text-white tracking-tight">Friends Score</h3>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">See how you rank among friends</p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full dark-chip text-[12px] font-bold select-none">
                  All
                </span>
              </div>

              {/* Friends Score List */}
              <div className="space-y-4 pt-1">
                {friendsList.map((friend) => (
                  <div key={friend.name} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-11 h-11 rounded-full object-cover border border-neutral-200/50"
                      />
                      <div>
                        <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white">
                          {friend.name}
                        </p>
                        <div className="flex items-center space-x-2.5 mt-0.5 text-[10px] text-neutral-400 font-medium">
                          <span className="flex items-center gap-0.5" title="Completed Books">
                            <BookOpen className="w-3 h-3" /> {friend.books}
                          </span>
                          <span className="flex items-center gap-0.5" title="Hours Studied">
                            ⏱️ {friend.hours}h
                          </span>
                          <span className="flex items-center gap-0.5" title="Performance Level">
                            <Award className="w-3 h-3" /> {friend.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[18px] font-extrabold text-neutral-800 dark:text-neutral-200 tracking-tight">
                      {friend.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
    </LoadingContainer>
  );
};

export default StudentDashboardPage;