import React, { useEffect, useState } from 'react';
import hodService, { HODFacultyData } from '../../services/hod.service';
import { toast } from 'react-toastify';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  Star, 
  BookOpen, 
  AlertCircle, 
  UserCheck, 
  Plus, 
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const FacultyPerformancePage: React.FC = () => {
  const [data, setData] = useState<HODFacultyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [desigFilter, setDesigFilter] = useState('All');
  
  // Evaluation Modal states
  const [evalTeacher, setEvalTeacher] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const res = await hodService.getFaculty();
      setData(res);
    } catch (err) {
      toast.error('Failed to load faculty performance details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalTeacher) return;
    setSubmitting(true);
    try {
      await hodService.submitEvaluation(evalTeacher.id, rating, comments);
      toast.success(`Appraisal submitted for ${evalTeacher.name}!`);
      setEvalTeacher(null);
      setComments('');
      loadData();
    } catch (err) {
      toast.error('Failed to submit evaluation.');
    } finally {
      setSubmitting(false);
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

  const { faculty, stats, fpip } = data;

  const filteredFaculty = faculty.filter(f => {
    const nameMatch = f.name.toLowerCase().includes(search.toLowerCase()) || f.email.toLowerCase().includes(search.toLowerCase());
    const desigMatch = desigFilter === 'All' || f.designation === desigFilter;
    return nameMatch && desigMatch;
  });

  const cards = [
    { label: 'Total Faculty', value: stats.total, sub: 'Active teachers', color: '#7C3AED', icon: GraduationCap },
    { label: 'Permanent', value: stats.permanent, sub: 'Tenured staff', color: '#16A34A', icon: UserCheck },
    { label: 'Contractual', value: stats.contract, sub: 'Ad-hoc teachers', color: '#0284C7', icon: BookOpen },
    { label: 'Vacancies', value: stats.vacancies, sub: 'Target hires', color: '#EC4899', icon: Plus },
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
            placeholder="Search faculty by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={desigFilter}
            onChange={(e) => setDesigFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
          >
            <option value="All">All Designations</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Faculty List Table */}
        <div className="lg:col-span-8 glass-panel rounded-[28px] shadow-ambient overflow-hidden">
          <div className="p-5 border-b border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">👥 DEPT FACULTY RATINGS & LOAD</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Faculty course allocation & student ratings</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Faculty Name</th>
                  <th className="px-4 py-3 text-center font-bold">Designation</th>
                  <th className="px-4 py-3 text-center font-bold">Subjects</th>
                  <th className="px-4 py-3 text-center font-bold">Rating</th>
                  <th className="px-4 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
                {filteredFaculty.map((f) => (
                  <tr key={f.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={f.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt={f.name} className="w-8 h-8 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">{f.name}</p>
                          <p className="text-[10px] text-neutral-400">{f.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400">{f.designation}</td>
                    <td className="px-4 py-3 text-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                        {f.workload} active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="text-xs font-black text-neutral-800 dark:text-neutral-200">{f.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEvalTeacher(f)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Evaluate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FPIP Side Panel */}
        <div className="lg:col-span-4 glass-panel rounded-[28px] p-5 shadow-ambient space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            ⚠️ PERFORMANCE IMPROVEMENT PLANS
          </h3>
          <div className="space-y-3">
            {fpip.map((plan) => (
              <div key={plan.id} className="p-4 bg-rose-50/50 dark:bg-rose-950/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">{plan.facultyName}</h4>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-450 rounded text-[9px] font-black">Rating: {plan.rating}</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-450 leading-relaxed font-semibold">
                  <strong>Plan:</strong> {plan.plan}
                </p>
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold mt-2">
                  <span>Duration: {plan.duration}</span>
                  <span>Deadline: {plan.deadline}</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <button onClick={() => toast.success('Monitoring reports dispatched.')} className="px-3 py-1 bg-neutral-900 text-white rounded-lg text-[9px] font-bold hover:bg-neutral-800 cursor-pointer">
                    Monitor
                  </button>
                  <button onClick={() => toast.success('Improvement plan marked completed.')} className="px-3 py-1 bg-white border text-neutral-700 rounded-lg text-[9px] font-bold hover:bg-neutral-50 cursor-pointer">
                    Close Case
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Appraisal Modal Dialog */}
      {evalTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">📝 Faculty Evaluation - {evalTeacher.name}</h3>
              <button onClick={() => setEvalTeacher(null)} className="text-neutral-400 hover:text-neutral-600 font-bold text-sm">✕</button>
            </div>
            
            <form onSubmit={handleEvaluate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Teaching Rating (1-5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent Performance</option>
                  <option value="4">⭐⭐⭐⭐☆ 4 - Good Performance</option>
                  <option value="3">⭐⭐⭐☆☆ 3 - Satisfactory Performance</option>
                  <option value="2">⭐⭐☆☆☆ 2 - Needs Support</option>
                  <option value="1">⭐☆☆☆☆ 1 - Unsatisfactory</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Comments & Recommendations</label>
                <textarea
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide details about classroom presence, syllabus delivery, and research output..."
                  required
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs outline-none resize-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-neutral-950 hover:bg-neutral-850 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting Appraisal...' : 'Submit Appraisal'}
                </button>
                <button
                  type="button"
                  onClick={() => setEvalTeacher(null)}
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

export default FacultyPerformancePage;
