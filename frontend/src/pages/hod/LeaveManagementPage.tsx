import React, { useEffect, useState } from 'react';
import hodService, { HODPendingActions } from '../../services/hod.service';
import { toast } from 'react-toastify';
import { 
  ClipboardList, 
  Clock, 
  Check, 
  X, 
  AlertCircle,
  Calendar,
  Send,
  User
} from 'lucide-react';

export const LeaveManagementPage: React.FC = () => {
  const [data, setData] = useState<HODPendingActions | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Decision Modal
  const [decideLeave, setDecideLeave] = useState<any | null>(null);
  const [status, setStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const res = await hodService.getPendingActions();
      setData(res);
    } catch (err) {
      toast.error('Failed to load leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLeaveDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decideLeave) return;
    setSubmitting(true);
    try {
      await hodService.approveLeave(decideLeave.id, status, remarks);
      toast.success(`Leave request has been ${status.toLowerCase()}!`);
      setDecideLeave(null);
      setRemarks('');
      loadData();
    } catch (err) {
      toast.error('Failed to process leave request decision.');
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

  const { leaves } = data;

  const leaveHistory = [
    { name: 'Dr. Smith', type: 'CASUAL', start: '15 Jan 2026', end: '16 Jan 2026', status: 'APPROVED', remarks: 'Attending IEEE workshop.' },
    { name: 'Prof. John', type: 'SICK', start: '10 Feb 2026', end: '12 Feb 2026', status: 'APPROVED', remarks: 'Recovering from viral fever.' },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Leave counts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-amber-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Pending Approvals</p>
          <h3 className="text-2xl font-black text-neutral-850 dark:text-white mt-1">{leaves.length} Requests</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Awaiting HOD signature</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Approved This Month</p>
          <h3 className="text-2xl font-black text-neutral-850 dark:text-white mt-1">4 Leaves</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Arrangement classes configured</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-rose-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Avg Faculty Absence</p>
          <h3 className="text-2xl font-black text-neutral-850 dark:text-white mt-1">1.2 Days</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Lowest across college departments</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Leave requests */}
        <div className="lg:col-span-7 glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <ClipboardList className="w-4.5 h-4.5 text-amber-500" />
            📋 PENDING LEAVE REQUESTS ({leaves.length})
          </h3>
          {leaves.length === 0 ? (
            <p className="text-xs text-neutral-400 font-bold py-6 text-center">No pending leave requests found.</p>
          ) : (
            <div className="space-y-4">
              {leaves.map((l) => (
                <div key={l.id} className="p-4 bg-neutral-50 dark:bg-neutral-850/40 rounded-2xl border space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img src={l.user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt={l.user?.firstName} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-extrabold text-neutral-850 dark:text-neutral-200">
                          {l.user?.firstName} {l.user?.lastName}
                        </h4>
                        <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Role: {l.role}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 rounded-lg text-[9px] font-black">{l.type} LEAVE</span>
                  </div>
                  
                  <p className="text-xs text-neutral-500 dark:text-neutral-405 leading-relaxed font-semibold">
                    <strong>Reason:</strong> {l.reason}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold border-t pt-2.5">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Start: {l.startDate}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> End: {l.endDate}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => { setDecideLeave(l); setStatus('APPROVED'); }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-bold cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => { setDecideLeave(l); setStatus('REJECTED'); }}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[9px] font-bold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leave History */}
        <div className="lg:col-span-5 glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            🗓️ RECENT LEAVE LOGS
          </h3>
          <div className="space-y-3">
            {leaveHistory.map((item, idx) => (
              <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-850/40 rounded-2xl border space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-neutral-850 dark:text-neutral-200">{item.name}</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">APPROVED</span>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 font-bold">
                  <span>Type: {item.type}</span>
                  <span>{item.start} - {item.end}</span>
                </div>
                <p className="text-[10px] text-neutral-450 font-semibold italic mt-1 leading-normal">"{item.remarks}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Leave Decision Modal */}
      {decideLeave && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">
              Leave Request Decision ({status})
            </h3>
            <form onSubmit={handleLeaveDecision} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">HOD Remarks</label>
                <textarea
                  rows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter leave remarks or reason for rejection/approval details..."
                  required
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 resize-none font-semibold"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-neutral-950 hover:bg-neutral-850 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting Remarks...' : 'Submit Decision'}
                </button>
                <button
                  type="button"
                  onClick={() => setDecideLeave(null)}
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

export default LeaveManagementPage;
