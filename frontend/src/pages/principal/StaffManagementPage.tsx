import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  AlertCircle, 
  Search, 
  Filter, 
  Mail, 
  GraduationCap, 
  Calendar,
  Send,
  Sparkles
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  role: string;
  designation: string;
  department: string;
  deptCode: string;
  phdStatus: string;
}

interface StaffStats {
  total: number;
  permanent: number;
  contractual: number;
  onLeave: number;
  vacancies: number;
}

interface EvaluationProgress {
  submitted: number;
  total: number;
  deadline: string;
}

export const StaffManagementPage: React.FC = () => {
  const [directory, setDirectory] = useState<StaffMember[]>([]);
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [search, setSearch] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  const [sendingReminder, setSendingReminder] = useState<boolean>(false);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/principal/staff');
      if (res.data.success) {
        setDirectory(res.data.data.directory);
        setStats(res.data.data.stats);
        setEvaluation(res.data.data.evaluation);
        if (res.data.data.directory.length > 0) {
          setSelectedStaff(res.data.data.directory[0]);
        }
      }
    } catch (err: any) {
      toast.error('Failed to load staff details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleSendReminder = () => {
    setSendingReminder(true);
    setTimeout(() => {
      setSendingReminder(false);
      toast.success('Evaluation reminders dispatched via email to all pending faculty members!');
    }, 1200);
  };

  const filteredStaff = directory.filter(member => {
    const nameMatch = member.name.toLowerCase().includes(search.toLowerCase()) || member.email.toLowerCase().includes(search.toLowerCase());
    const deptMatch = deptFilter === 'All' || member.deptCode === deptFilter;
    const roleMatch = roleFilter === 'All' || member.role === roleFilter;
    return nameMatch && deptMatch && roleMatch;
  });

  if (loading || !stats || !evaluation) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
        </div>
        <div className="h-44 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
        <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
      </div>
    );
  }

  const kpis = [
    { label: 'Total Faculty', value: stats.total, sub: 'Active instructors', color: '#7C3AED', icon: Users },
    { label: 'Permanent', value: stats.permanent, sub: 'Tenured staff', color: '#16A34A', icon: UserCheck },
    { label: 'Contractual', value: stats.contractual, sub: 'Ad-hoc staff', color: '#D97706', icon: Briefcase },
    { label: 'Vacancies', value: stats.vacancies, sub: 'Required additions', color: '#EC4899', icon: AlertCircle },
  ];

  const evalPercentage = Math.round((evaluation.submitted / evaluation.total) * 100);

  return (
    <div className="space-y-6 pb-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((card) => {
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

      {/* Annual Faculty Evaluations Progress */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm">📋 ANNUAL FACULTY EVALUATIONS (Feb 1 - Feb 28)</h3>
          </div>
          <p className="text-xs text-neutral-400 leading-normal">
            Department performance monitoring is in progress. HODs compile evaluations for final review.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${evalPercentage}%` }} />
            </div>
            <span className="text-xs font-black text-neutral-700 dark:text-neutral-300">{evalPercentage}% ({evaluation.submitted}/{evaluation.total})</span>
          </div>
        </div>
        <div className="flex flex-col items-stretch md:items-end justify-center gap-2 min-w-[200px]">
          <div className="flex items-center gap-1 text-[10px] font-black text-rose-500 bg-rose-100/40 px-2.5 py-1 rounded-lg">
            <Calendar className="w-3.5 h-3.5" />
            DEADLINE: {evaluation.deadline} (8 days remaining)
          </div>
          <button
            onClick={handleSendReminder}
            disabled={sendingReminder}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-800 dark:hover:bg-neutral-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {sendingReminder ? 'Sending...' : 'Send Reminder to Faculty'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Directory Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="flex-1 py-1.5 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
              >
                <option value="All">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="CSE-AIML">CSE-AIML</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="flex-1 py-1.5 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="HOD">HOD</option>
                <option value="TEACHER">TEACHER</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredStaff.length === 0 ? (
              <div className="glass-panel rounded-[28px] p-8 text-center text-neutral-400 text-xs font-bold">
                No staff members found matching criteria.
              </div>
            ) : (
              filteredStaff.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedStaff(member)}
                  className={`glass-panel rounded-[24px] p-4 cursor-pointer hover:border-amber-300/60 dark:hover:border-amber-800/40 transition-all flex items-center justify-between border ${
                    selectedStaff?.id === member.id 
                      ? 'border-amber-500 bg-amber-50/10 dark:bg-amber-900/5' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop'}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-100">{member.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-bold mt-0.5">{member.designation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[8px] font-black bg-neutral-100 text-neutral-600 dark:bg-neutral-850 dark:text-neutral-400 uppercase">
                      {member.deptCode || 'HOD'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Staff Details Card */}
        <div className="lg:col-span-7">
          {selectedStaff ? (
            <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-6">
              
              <div className="flex items-center space-x-4 border-b border-neutral-150/40 pb-5">
                <img
                  src={selectedStaff.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop'}
                  alt={selectedStaff.name}
                  className="w-16 h-16 rounded-2xl object-cover border"
                />
                <div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    {selectedStaff.role}
                  </span>
                  <h3 className="text-md font-black text-neutral-900 dark:text-white mt-1">
                    {selectedStaff.name}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-bold mt-0.5">
                    {selectedStaff.designation} | Dept: {selectedStaff.department}
                  </p>
                </div>
              </div>

              {/* Stats / Parameters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">PhD Qualified</span>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-100 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-violet-500" />
                    {selectedStaff.phdStatus}
                  </span>
                </div>
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Courses Assigned</span>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-100">
                    2 Core Subjects
                  </span>
                </div>
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Evaluation Score</span>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-100 text-emerald-600">
                    4.6 / 5.0 (Top)
                  </span>
                </div>
              </div>

              {/* Detailed profile contact block */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">📞 Contact Information</h4>
                <div className="bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl p-4 text-xs space-y-2 leading-relaxed">
                  <div className="flex justify-between"><span className="text-neutral-400">Institutional Email:</span> <span className="font-bold">{selectedStaff.email}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Contact Number:</span> <span className="font-bold">{selectedStaff.phone || '98765 43210'}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Office Location:</span> <span className="font-bold">Main Admin Block, Floor 2</span></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <a 
                  href={`mailto:${selectedStaff.email}`} 
                  className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4" /> Send Direct Email
                </a>
                <button 
                  onClick={() => toast.success(`Self appraisal evaluation record generated for ${selectedStaff.name}`)}
                  className="px-4 py-3 border border-neutral-250/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold transition-all"
                >
                  Performance Review
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-[32px] p-12 text-center text-neutral-400 text-xs font-bold">
              Select a staff member from the directory list.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffManagementPage;
