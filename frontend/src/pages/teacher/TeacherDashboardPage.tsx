import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  Calendar,
  Users,
  BookOpen,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ElementType;
}

interface RecentActivity {
  id: string;
  text: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

interface UpcomingClass {
  id: string;
  subject: string;
  code: string;
  time: string;
  room: string;
  students: number;
  semester: string;
}

const mockActivities: RecentActivity[] = [
  { id: '1', text: 'Marked attendance for CS-301 (Sem 5 A)', time: '2 hours ago', type: 'success' },
  { id: '2', text: 'Uploaded IA-2 marks for DBMS (CS-305)', time: '5 hours ago', type: 'success' },
  { id: '3', text: '3 students have < 75% attendance in OS Lab', time: '1 day ago', type: 'warning' },
  { id: '4', text: 'Created assignment: Data Structures Problem Set 3', time: '2 days ago', type: 'info' },
  { id: '5', text: 'Study material uploaded: Automata Theory Notes Ch-4', time: '3 days ago', type: 'info' },
];

const mockUpcomingClasses: UpcomingClass[] = [
  { id: '1', subject: 'Advanced Data Structures', code: 'CS-301', time: '09:00 AM', room: 'CSE-203', students: 62, semester: 'Sem 5' },
  { id: '2', subject: 'Database Management Systems', code: 'CS-305', time: '11:00 AM', room: 'CSE-201', students: 58, semester: 'Sem 5' },
  { id: '3', subject: 'Operating Systems Lab', code: 'CS-309L', time: '02:00 PM', room: 'Lab-3', students: 30, semester: 'Sem 5' },
];

export const TeacherDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const statCards: StatCard[] = [
    { label: "Today's Classes", value: '3', sub: 'Next at 09:00 AM', color: '#0D9488', icon: Calendar },
    { label: 'Students Taught', value: '186', sub: 'Across 4 subjects', color: '#7C3AED', icon: Users },
    { label: 'Pending Marks Entry', value: '2', sub: 'IA-2 entries due', color: '#D97706', icon: BookOpen },
    { label: 'Assignments Due', value: '1', sub: 'Deadline in 3 days', color: '#E11D48', icon: FileText },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-[32px] px-6 py-6 shadow-ambient flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop'}
            alt="Teacher"
            className="w-16 h-16 rounded-2xl object-cover border border-white/50 shadow-sm"
          />
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">Teacher Portal</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-800 dark:text-white tracking-tight mt-0.5">
              Welcome back, {user?.name?.split(' ')[0] || 'Professor'}! 👨‍🏫
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-semibold">
              Department of Computer Science &amp; Engineering
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-white/40 dark:bg-neutral-500/40 border border-neutral-200/50 dark:border-neutral-800 px-4 py-2.5 rounded-2xl">
          <Clock className="w-5 h-5 text-neutral-400" />
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Today</p>
            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Jun 24, 2026</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="glass-panel rounded-[28px] p-5 shadow-ambient hover:scale-[1.02] transition-all"
              style={{ borderLeft: `4px solid ${card.color}` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">{card.label}</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{card.value}</h3>
                <p className="text-[11px] text-neutral-400 font-semibold mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-4 glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Quick Actions</h3>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">Common teacher tasks</p>
          </div>

          <div className="space-y-3">
            <Link to="/teacher/attendance" className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-teal-50 dark:bg-neutral-800/50 dark:hover:bg-teal-900/20 border border-neutral-100 dark:border-neutral-800 rounded-2xl transition-all cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D948820', color: '#0D9488' }}>
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Mark Today's Attendance</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link to="/teacher/marks" className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-violet-50 dark:bg-neutral-800/50 dark:hover:bg-violet-900/20 border border-neutral-100 dark:border-neutral-800 rounded-2xl transition-all cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Upload Marks</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link to="/teacher/assignments" className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-amber-50 dark:bg-neutral-800/50 dark:hover:bg-amber-900/20 border border-neutral-100 dark:border-neutral-800 rounded-2xl transition-all cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Create Assignment</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link to="/teacher/performance" className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-sky-50 dark:bg-neutral-800/50 dark:hover:bg-sky-900/20 border border-neutral-100 dark:border-neutral-800 rounded-2xl transition-all cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">View Student Performance</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="lg:col-span-8 glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Today's Timetable</h3>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">Your scheduled classes for today</p>
          </div>

          <div className="space-y-3">
            {mockUpcomingClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-neutral-100 dark:border-neutral-800/50 hover:border-teal-200 dark:hover:border-teal-800/30 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs font-extrabold text-teal-600 dark:text-teal-400">{cls.time}</p>
                    <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">{cls.room}</p>
                  </div>
                  <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-700" />
                  <div>
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{cls.subject}</p>
                    <p className="text-[11px] text-neutral-400 font-semibold mt-0.5">{cls.code} • {cls.semester} • {cls.students} students</p>
                  </div>
                </div>
                <Link
                  to="/teacher/attendance"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: '#0D9488' }}
                >
                  Mark Attendance
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Recent Activity</h3>
          <p className="text-xs text-neutral-400 font-medium mt-0.5">Your latest actions in the portal</p>
        </div>

        <div className="space-y-3">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-neutral-100/60 dark:border-neutral-800/40 last:border-0 last:pb-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                activity.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                activity.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                'bg-sky-100 text-sky-600'
              }`}>
                {activity.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                 activity.type === 'warning' ? <AlertCircle className="w-4 h-4" /> :
                 <FileText className="w-4 h-4" />}
              </div>
              <div className="flex-1 flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{activity.text}</p>
                <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap flex-shrink-0">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
