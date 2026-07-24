import React, { useState } from 'react';
import { FileText, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import Toast from '../../components/common/Toast';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  appliedOn: string;
}

const initialLeaves: LeaveRequest[] = [
  { id: 'LR-1042', type: 'Medical Leave', startDate: '18 Sep 2026', endDate: '20 Sep 2026', reason: 'Severe dental surgery recovery protocol.', status: 'APPROVED', appliedOn: '16 Sep 2026' },
  { id: 'LR-0941', type: 'Casual Leave', startDate: '12 May 2026', endDate: '13 May 2026', reason: 'Family emergency attendance.', status: 'APPROVED', appliedOn: '10 May 2026' }
];

export const LeavePage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialLeaves);
  const [type, setType] = useState('Medical Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      setToast('Please complete all form inputs.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newRequest: LeaveRequest = {
        id: `LR-${Math.floor(1000 + Math.random() * 9000)}`,
        type,
        startDate,
        endDate,
        reason,
        status: 'PENDING',
        appliedOn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      setRequests([newRequest, ...requests]);
      setSubmitting(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      setToast('Leave request submitted successfully for approval.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          type={toast.includes('success') ? 'success' : 'error'}
          message={toast}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Header Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Leave Application Box</h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Apply for casual, medical, or official duty leave and check approvals</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (col-span-5) */}
        <div className="lg:col-span-5 glass-panel rounded-[32px] p-6 shadow-ambient">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight mb-5 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            New Leave Application
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Leave Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-200 dark:border-neutral-750 text-neutral-800 dark:text-neutral-200 rounded-2xl py-3.5 px-4 text-sm font-semibold outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="Medical Leave">Medical Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="On-Duty (Academic Event)">On-Duty (Academic Event)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-200 dark:border-neutral-750 text-neutral-800 dark:text-neutral-200 rounded-2xl py-3 px-4 text-xs font-semibold outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-200 dark:border-neutral-750 text-neutral-800 dark:text-neutral-200 rounded-2xl py-3 px-4 text-xs font-semibold outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Reason / Description</label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the reason for leave in details..."
                className="w-full bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-200 dark:border-neutral-750 focus:border-neutral-400 dark:focus:border-neutral-650 rounded-2xl py-3 px-4 text-sm outline-none transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary-custom font-bold py-3.5 rounded-2xl text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting Leave Ticket...' : 'File Leave Request'}
              </button>
            </div>
          </form>
        </div>

        {/* Right List (col-span-7) */}
        <div className="lg:col-span-7 glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight mb-5 border-b border-neutral-100 dark:border-neutral-850 pb-3">
            Leave Requests History
          </h3>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {requests.map((lr) => (
              <div
                key={lr.id}
                className="p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 bg-white/40 dark:bg-neutral-900/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{lr.type}</span>
                    <span className="text-[10px] font-mono text-neutral-400">{lr.id}</span>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    lr.status === 'APPROVED' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {lr.status === 'APPROVED' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approved
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Pending
                      </>
                    )}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">{lr.reason}</p>

                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-semibold border-t border-neutral-100/50 dark:border-neutral-800/50 pt-2.5">
                  <span>Applied On: {lr.appliedOn}</span>
                  <span className="text-neutral-500 dark:text-neutral-300 font-bold">
                    Dates: {lr.startDate} - {lr.endDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavePage;
