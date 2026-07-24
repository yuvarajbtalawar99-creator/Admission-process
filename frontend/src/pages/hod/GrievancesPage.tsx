import React, { useEffect, useState } from 'react';
import hodService, { HODGrievanceData } from '../../services/hod.service';
import { toast } from 'react-toastify';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Send,
  MessageSquare,
  User,
  ShieldAlert
} from 'lucide-react';

export const GrievancesPage: React.FC = () => {
  const [data, setData] = useState<HODGrievanceData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Resolve Modal
  const [selectedGrievance, setSelectedGrievance] = useState<any | null>(null);
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const res = await hodService.getGrievances();
      setData(res);
    } catch (err) {
      toast.error('Failed to load grievances.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolveGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance || !resolution) return;
    setSubmitting(true);
    try {
      await hodService.resolveGrievance(selectedGrievance.id, resolution, 'RESOLVED');
      toast.success('Grievance ticket resolved and student notified.');
      setSelectedGrievance(null);
      setResolution('');
      loadData();
    } catch (err) {
      toast.error('Failed to resolve grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'RESOLVED') return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20';
    if (status === 'UNDER_REVIEW') return 'text-sky-700 bg-sky-50 dark:bg-sky-950/20';
    return 'text-amber-700 bg-amber-50 dark:bg-amber-950/20';
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'HIGH' || priority === 'CRITICAL') return 'text-rose-700 bg-rose-50';
    return 'text-neutral-500 bg-neutral-150';
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-28 bg-neutral-250 dark:bg-neutral-800 rounded-3xl" />
        <div className="h-96 bg-neutral-250 dark:bg-neutral-800 rounded-3xl" />
      </div>
    );
  }

  const { grievances, pending_count } = data;

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-rose-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Pending Complaints</p>
          <h3 className="text-2xl font-black text-neutral-850 dark:text-white mt-1">{pending_count} Active</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Requires immediate HOD redressal</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Resolved Complaints</p>
          <h3 className="text-2xl font-black text-neutral-850 dark:text-white mt-1">
            {grievances.filter(g => g.status === 'RESOLVED').length} Tickets
          </h3>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">100% resolution index</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-violet-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Average Resolution Time</p>
          <h3 className="text-2xl font-black text-neutral-850 dark:text-white mt-1">24 Hours</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Adhering to UGC compliance standards</span>
        </div>
      </div>

      {/* Grievances list */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
        <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          📋 STUDENT GRIEVANCES
        </h3>
        {grievances.length === 0 ? (
          <p className="text-xs text-neutral-400 font-bold py-6 text-center">No student grievances submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {grievances.map((g) => (
              <div key={g.id} className="p-4 bg-neutral-50 dark:bg-neutral-850/40 rounded-2xl border space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-neutral-400">Grievance Ticket</span>
                    <h4 className="text-sm font-extrabold text-neutral-850 dark:text-neutral-200 mt-1">{g.title}</h4>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase ${getPriorityBadge(g.priority)}`}>
                      {g.priority} PRIORITY
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase ${getStatusBadge(g.status)}`}>
                      {g.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal font-semibold">
                  {g.description}
                </p>

                {g.resolution && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 rounded-xl text-[11px] font-semibold leading-relaxed">
                    <strong>HOD Resolution:</strong> {g.resolution}
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold border-t pt-2.5">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Student: {g.student?.firstName} {g.student?.lastName}</span>
                  {g.status !== 'RESOLVED' && (
                    <button
                      onClick={() => setSelectedGrievance(g)}
                      className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Resolve Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Redressal Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">⚖️ Redress Grievance Ticket</h3>
              <button onClick={() => setSelectedGrievance(null)} className="text-neutral-400 hover:text-neutral-650 font-bold text-sm">✕</button>
            </div>
            
            <form onSubmit={handleResolveGrievance} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Resolution Details</label>
                <textarea
                  rows={4}
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Provide resolution details. What action was taken by department?"
                  required
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs outline-none focus:border-rose-500 resize-none font-semibold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-neutral-950 hover:bg-neutral-850 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Resolving...' : 'Submit Resolution'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
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

export default GrievancesPage;
