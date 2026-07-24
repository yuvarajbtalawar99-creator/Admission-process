import React, { useEffect, useState } from 'react';
import hodService, { HODStudentData } from '../../services/hod.service';
import { toast } from 'react-toastify';
import { 
  Users, 
  Search, 
  Filter, 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const DepartmentStudentsPage: React.FC = () => {
  const [data, setData] = useState<HODStudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [semFilter, setSemFilter] = useState('All');
  
  // Mentor Modal
  const [mentorStudent, setMentorStudent] = useState<any | null>(null);
  const [mentorName, setMentorName] = useState('Dr. Smith');
  const [assigning, setAssigning] = useState(false);

  const loadData = async () => {
    try {
      const res = await hodService.getStudents();
      setData(res);
    } catch (err) {
      toast.error('Failed to load department student metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorStudent) return;
    setAssigning(true);
    setTimeout(() => {
      toast.success(`Academic Mentor '${mentorName}' assigned to ${mentorStudent.name}!`);
      setMentorStudent(null);
      setAssigning(false);
    }, 1000);
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-28 bg-neutral-250 dark:bg-neutral-800 rounded-3xl" />
        <div className="h-96 bg-neutral-250 dark:bg-neutral-800 rounded-3xl" />
      </div>
    );
  }

  const { students, stats, atRisk } = data;

  const filteredStudents = students.filter(s => {
    const nameMatch = s.name.toLowerCase().includes(search.toLowerCase()) || s.enrollmentNumber.toLowerCase().includes(search.toLowerCase());
    const semMatch = semFilter === 'All' || s.semester.toString() === semFilter;
    return nameMatch && semMatch;
  });

  const cards = [
    { label: 'Total Students', value: stats.total, sub: 'Enrolled in branch', color: '#0284C7', icon: Users },
    { label: 'On Track', value: stats.onTrack, sub: 'Regular progression', color: '#16A34A', icon: CheckCircle },
    { label: 'At-Risk', value: stats.atRisk, sub: 'Low attendance/CGPA', color: '#DC2626', icon: AlertTriangle },
    { label: 'Excellence', value: stats.excellence, sub: 'CGPA ≥ 7.5 threshold', color: '#7C3AED', icon: GraduationCap },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-panel rounded-[28px] p-5 shadow-ambient hover:scale-[1.02] transition-all" style={{ borderLeft: `4px solid ${card.color}` }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">{card.label}</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">{card.value}</h3>
                <p className="text-[10px] text-neutral-400 font-semibold mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters bar */}
      <div className="glass-panel rounded-3xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search students by name or USN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:border-sky-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={semFilter}
            onChange={(e) => setSemFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
          >
            <option value="All">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="3">Semester 3</option>
            <option value="5">Semester 5</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Student list table */}
        <div className="lg:col-span-8 glass-panel rounded-[28px] shadow-ambient overflow-hidden">
          <div className="p-5 border-b border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">📋 STUDENT DIRECTORY</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Enrolled branch students list & attendance</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Student</th>
                  <th className="px-4 py-3 text-center font-bold">Semester</th>
                  <th className="px-4 py-3 text-center font-bold">Attendance</th>
                  <th className="px-4 py-3 text-center font-bold">CGPA Score</th>
                  <th className="px-4 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={s.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt={s.name} className="w-8 h-8 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">{s.name}</p>
                          <p className="font-mono text-[9px] text-neutral-450">{s.enrollmentNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400">Sem {s.semester}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                        s.attendance >= 85 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        s.attendance >= 75 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450'
                      }`}>
                        {s.attendance}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-neutral-100 dark:bg-neutral-800 text-neutral-850 dark:text-neutral-200">
                        {s.cgpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1.5">
                      <button
                        onClick={() => setMentorStudent(s)}
                        className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Assign Mentor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* At-Risk Students list panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-[28px] p-5 shadow-ambient space-y-4">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              ⚠️ AT-RISK STUDENTS ({atRisk.length})
            </h3>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {atRisk.map((student) => (
                <div key={student.id} className="p-3 bg-rose-50/50 dark:bg-rose-950/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">{student.name}</h4>
                    <span className="text-[10px] font-mono text-neutral-450">{student.enrollmentNumber}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400 font-bold">
                    <span>CGPA: {student.cgpa.toFixed(2)}</span>
                    <span className={student.attendance < 75 ? 'text-rose-500' : ''}>Attendance: {student.attendance}%</span>
                  </div>
                  <div className="pt-2 flex gap-1.5">
                    <button onClick={() => setMentorStudent(student)} className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[9px] font-bold cursor-pointer">
                      Assign Mentor
                    </button>
                    <button onClick={() => toast.info('Parent notified regarding academic concern.')} className="px-2 py-1 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[9px] font-bold hover:bg-neutral-50 cursor-pointer">
                      Contact Parent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Achievements panel */}
          <div className="glass-panel rounded-[28px] p-5 shadow-ambient space-y-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              💪 BRANCH ACHIEVEMENTS
            </h3>
            <div className="space-y-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border">
                ✓ 25 Students received Merit Scholarships this semester.
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border">
                ✓ Arjun Sharma published research paper on Blockchains in IEEE.
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border">
                ✓ 45 active industry internship integrations secured.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mentor Assignment Modal */}
      {mentorStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">👨‍🏫 Assign Academic Mentor - {mentorStudent.name}</h3>
              <button onClick={() => setMentorStudent(null)} className="text-neutral-400 hover:text-neutral-600 font-bold text-sm">✕</button>
            </div>
            
            <form onSubmit={handleAssignMentor} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Select Faculty Advisor</label>
                <select
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 px-3 text-xs outline-none cursor-pointer"
                >
                  <option value="Dr. Smith">Dr. Smith - Professor (AI/ML)</option>
                  <option value="Prof. John">Prof. John - Associate Professor (Networks)</option>
                  <option value="Mr. Raj">Mr. Raj - Assistant Professor (Web Dev)</option>
                  <option value="Prof. Deepa Nair">Prof. Deepa Nair - Assistant Professor (OS)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={assigning}
                  className="flex-1 py-2.5 bg-neutral-950 hover:bg-neutral-850 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                >
                  {assigning ? 'Assigning Mentor...' : 'Assign Advisor'}
                </button>
                <button
                  type="button"
                  onClick={() => setMentorStudent(null)}
                  className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DepartmentStudentsPage;
