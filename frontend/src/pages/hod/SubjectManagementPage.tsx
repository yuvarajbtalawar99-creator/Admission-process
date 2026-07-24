import React, { useEffect, useState } from 'react';
import hodService, { HODSubjectData } from '../../services/hod.service';
import { toast } from 'react-toastify';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ClipboardCheck, 
  ChevronRight, 
  User, 
  AlertCircle,
  FileText,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';

export const SubjectManagementPage: React.FC = () => {
  const [data, setData] = useState<HODSubjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Proposals decisions
  const [remarks, setRemarks] = useState('');
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | 'DEFERRED'>('APPROVED');

  const loadData = async () => {
    try {
      const res = await hodService.getSubjects();
      setData(res);
    } catch (err) {
      toast.error('Failed to load subject lists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decidingId) return;
    try {
      await hodService.approveCurriculumChange(decidingId, decision, remarks);
      toast.success(`Proposal marked as ${decision.toLowerCase()}!`);
      setDecidingId(null);
      setRemarks('');
      loadData();
    } catch (err) {
      toast.error('Failed to process curriculum change decision.');
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-28 bg-neutral-250 dark:bg-neutral-800 rounded-3xl" />
        <div className="h-96 bg-neutral-250 dark:bg-neutral-800 rounded-3xl" />
      </div>
    );
  }

  const { courses, proposedChanges } = data;

  const filteredCourses = courses.filter(c => {
    return c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
  });

  const workloads = [
    { name: 'Dr. Smith', load: 3, students: 85, status: 'BALANCED', color: '#16A34A' },
    { name: 'Prof. John', load: 3, students: 90, status: 'BALANCED', color: '#16A34A' },
    { name: 'Mr. Raj', load: 2, students: 75, status: 'BALANCED', color: '#16A34A' },
    { name: 'Mr. Ashok Kumar', load: 4, students: 110, status: 'OVERLOADED', color: '#DC2626' }
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Course stats overview */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm mb-4">📚 COURSES OVERVIEW</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Courses', value: courses.length || 45 },
            { label: 'Active This Semester', value: 28 },
            { label: 'New This Year', value: 5 },
            { label: 'Proposed For Approval', value: proposedChanges.length },
            { label: 'Archived / Inactive', value: 12 }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/40 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">{item.label}</span>
              <span className="text-xl font-black text-neutral-900 dark:text-white mt-2">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active courses table */}
        <div className="lg:col-span-8 glass-panel rounded-[28px] shadow-ambient overflow-hidden">
          <div className="p-5 border-b border-neutral-100 dark:border-neutral-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">📋 ACTIVE COURSES (Current Semester)</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Assigned instructors & student enrollments</p>
            </div>
            <div className="relative w-full md:w-60">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search course code/name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Course Info</th>
                  <th className="px-4 py-3 text-center font-bold">Semester</th>
                  <th className="px-4 py-3 text-left font-bold">Instructor</th>
                  <th className="px-4 py-3 text-center font-bold">Enrollment</th>
                  <th className="px-4 py-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">{c.name}</p>
                        <p className="font-mono text-[9px] text-neutral-450">{c.code}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400">Sem {c.semester}</td>
                    <td className="px-4 py-3 text-xs font-bold text-neutral-750 dark:text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        {c.instructor}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-bold text-neutral-750 dark:text-neutral-300">{c.enrollment} students</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => toast.info(`Editing course details: ${c.code}`)} className="text-sky-600 hover:underline text-xs font-bold cursor-pointer">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workload Balance Panel */}
        <div className="lg:col-span-4 glass-panel rounded-[28px] p-5 shadow-ambient space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <ClipboardCheck className="w-4 h-4 text-emerald-500" />
            🎓 INSTRUCTOR WORKLOAD BALANCE
          </h3>
          <div className="space-y-3">
            {workloads.map((w, idx) => (
              <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-850/40 border rounded-2xl flex flex-col justify-between gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-neutral-850 dark:text-neutral-200">{w.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black`} style={{ backgroundColor: `${w.color}15`, color: w.color }}>
                    {w.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold">
                  <span>Courses: {w.load} active</span>
                  <span>Students: {w.students} total</span>
                </div>
                {w.status === 'OVERLOADED' && (
                  <button onClick={() => toast.success('Workload rebalanced. 1 subject reassigned.')} className="w-full mt-1.5 py-1.5 bg-neutral-900 text-white rounded-lg text-[9px] font-bold hover:bg-neutral-800 cursor-pointer">
                    Rebalance Load
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Curriculum proposals */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <h3 className="font-bold text-neutral-900 dark:text-white text-sm mb-4">🔴 PENDING CURRICULUM PROPOSALS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposedChanges.map((proposal) => (
            <div key={proposal.id} className="p-5 border rounded-2xl bg-neutral-50/50 dark:bg-neutral-850/10 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                    proposal.type === 'NEW' ? 'bg-emerald-150 text-emerald-700' : 'bg-amber-150 text-amber-700'
                  }`}>
                    {proposal.type} COURSE
                  </span>
                  <h4 className="text-sm font-extrabold text-neutral-850 dark:text-neutral-200 mt-1">{proposal.courseName} ({proposal.courseCode})</h4>
                </div>
                <span className="text-[10px] text-neutral-400 font-bold">Proposed by: {proposal.proposedBy}</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                <strong>Learning Outcomes/Changes:</strong> {proposal.outcomes}
              </p>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => { setDecidingId(proposal.id); setDecision('APPROVED'); }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Approve Change
                </button>
                <button
                  onClick={() => { setDecidingId(proposal.id); setDecision('REJECTED'); }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Reject Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Modal */}
      {decidingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">📋 Curriculum Change Decision</h3>
            <form onSubmit={handleDecisionSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Remarks / Feedback</label>
                <textarea
                  rows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter evaluation remarks or changes requested..."
                  required
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs outline-none focus:border-emerald-500 resize-none"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold cursor-pointer">
                  Submit Decision
                </button>
                <button type="button" onClick={() => setDecidingId(null)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
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

export default SubjectManagementPage;
