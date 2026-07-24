import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Activity, Award, CreditCard, MessageSquare, ChevronRight, CheckCircle2, XCircle, MinusCircle, BookOpen } from 'lucide-react';

interface AttendanceEntry {
  date: string;
  subject: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
}

interface ExamEntry {
  subject: string;
  date: string;
  type: string;
  daysLeft: number;
}

const mockAttendance: AttendanceEntry[] = [
  { date: 'Jun 24', subject: 'Data Structures', status: 'PRESENT' },
  { date: 'Jun 24', subject: 'DBMS', status: 'PRESENT' },
  { date: 'Jun 23', subject: 'OS Lab', status: 'ABSENT' },
  { date: 'Jun 23', subject: 'Software Engg.', status: 'PRESENT' },
  { date: 'Jun 22', subject: 'Automata', status: 'PRESENT' },
  { date: 'Jun 22', subject: 'Data Structures', status: 'PRESENT' },
  { date: 'Jun 21', subject: 'DBMS', status: 'LEAVE' },
  { date: 'Jun 21', subject: 'Software Engg.', status: 'PRESENT' },
  { date: 'Jun 20', subject: 'OS Lab', status: 'PRESENT' },
  { date: 'Jun 20', subject: 'Automata', status: 'PRESENT' },
];

const mockExams: ExamEntry[] = [
  { subject: 'Advanced Data Structures', date: 'Jun 26, 2026', type: 'Theory', daysLeft: 2 },
  { subject: 'Database Management', date: 'Jun 29, 2026', type: 'Lab', daysLeft: 5 },
  { subject: 'Automata Theory', date: 'Jul 2, 2026', type: 'Theory', daysLeft: 8 },
];

export const ParentDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const child = {
    name: 'Arjun Kumar',
    class: 'BE – Computer Science (Sem 5)',
    rollNo: 'CS21003',
    enrollmentNo: 'CS-2021-003',
  };

  const stats = [
    { label: 'Attendance %', value: '86.5%', sub: 'Overall this semester', color: '#16A34A', icon: Activity },
    { label: 'CGPA', value: '7.85', sub: 'Cumulative GPA', color: '#7C3AED', icon: Award },
    { label: 'Pending Fees', value: '₹2,500', sub: 'Due by Jun 30', color: '#E11D48', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-[32px] px-6 py-6 shadow-ambient flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-sm flex-shrink-0" style={{ backgroundColor: '#E11D48' }}>
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">Parent Portal</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-800 dark:text-white tracking-tight mt-0.5">
              Welcome, {user?.name?.split(' ')[0] || 'Parent'} 👋
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-semibold">
              Monitoring: {child.name} • {child.class}
            </p>
          </div>
        </div>
        <Link to="/parent/contact" className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all flex items-center gap-2" style={{ backgroundColor: '#E11D48' }}>
          <MessageSquare className="w-3.5 h-3.5" /> Contact Teacher
        </Link>
      </div>

      {/* Child Info Card */}
      <div className="glass-panel rounded-[28px] p-5 shadow-ambient">
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Ward Information</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Full Name</p>
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">{child.name}</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Class</p>
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">{child.class}</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Roll No</p>
            <p className="text-sm font-mono font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">{child.rollNo}</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Enrollment</p>
            <p className="text-sm font-mono font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">{child.enrollmentNo}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-panel rounded-[28px] p-5 shadow-ambient hover:scale-[1.02] transition-all" style={{ borderLeft: `4px solid ${card.color}` }}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">{card.label}</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white">{card.value}</h3>
                <p className="text-[11px] text-neutral-400 font-semibold mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance History */}
        <div className="lg:col-span-7 glass-panel rounded-[28px] shadow-ambient overflow-hidden">
          <div className="p-5 border-b border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white">Recent Attendance</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Last 10 class entries</p>
            </div>
            <Link to="/parent/attendance" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: '#E11D48' }}>
              Full History <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Date</th>
                  <th className="px-4 py-3 text-left font-bold">Subject</th>
                  <th className="px-4 py-3 text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
                {mockAttendance.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400">{entry.date}</td>
                    <td className="px-4 py-3 text-xs font-bold text-neutral-700 dark:text-neutral-300">{entry.subject}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                        entry.status === 'PRESENT'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : entry.status === 'ABSENT'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {entry.status === 'PRESENT' ? <CheckCircle2 className="w-3 h-3" /> :
                         entry.status === 'ABSENT' ? <XCircle className="w-3 h-3" /> :
                         <MinusCircle className="w-3 h-3" />}
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Upcoming Exams + Fee Summary */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Upcoming Exams */}
          <div className="glass-panel rounded-[28px] p-5 shadow-ambient space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Upcoming Exams</h3>
              <Link to="/parent/performance" className="text-xs font-bold hover:underline" style={{ color: '#E11D48' }}>
                View All
              </Link>
            </div>
            <div className="space-y-2.5">
              {mockExams.map((exam, idx) => (
                <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{exam.subject}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{exam.date} • {exam.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black flex-shrink-0 ${
                      exam.daysLeft <= 3 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                      exam.daysLeft <= 7 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                    }`}>
                      {exam.daysLeft}d left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Status Summary */}
          <div className="glass-panel rounded-[28px] p-5 shadow-ambient space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Fee Status</h3>
              <Link to="/parent/fees" className="text-xs font-bold hover:underline" style={{ color: '#E11D48' }}>
                View Details
              </Link>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500 font-semibold">Total Fees</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">₹7,500</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500 font-semibold">Paid</span>
                <span className="font-bold text-emerald-600">₹5,000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500 font-semibold">Balance Due</span>
                <span className="font-bold text-rose-600">₹2,500</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 mt-2">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '66.7%' }} />
              </div>
              <p className="text-[10px] text-neutral-400 font-semibold text-right">66.7% paid • Due: Jun 30</p>
            </div>
            <Link
              to="/parent/fees"
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#E11D48' }}
            >
              <BookOpen className="w-3.5 h-3.5" /> Pay Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardPage;
