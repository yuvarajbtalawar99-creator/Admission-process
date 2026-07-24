import React, { useEffect, useState } from 'react';
import hodService, { HODBudgetData } from '../../services/hod.service';
import { toast } from 'react-toastify';
import { 
  DollarSign, 
  Plus, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  FileText
} from 'lucide-react';

export const BudgetResourcePage: React.FC = () => {
  const [data, setData] = useState<HODBudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // New Request Form
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [justification, setJustification] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const res = await hodService.getBudget();
      setData(res);
    } catch (err) {
      toast.error('Failed to load budget statements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !justification) {
      toast.warning('Please provide all details.');
      return;
    }
    setSubmitting(true);
    try {
      await hodService.submitBudgetRequest({
        title,
        amount: Number(amount),
        priority,
        justification,
        deadline: deadline || undefined,
      });
      toast.success('Budget Request submitted to Principal for review.');
      setOpenModal(false);
      setTitle('');
      setAmount('');
      setJustification('');
      setDeadline('');
      loadData();
    } catch (err) {
      toast.error('Failed to submit budget request.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'APPROVED') return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20';
    if (status === 'REJECTED') return 'text-rose-700 bg-rose-50 dark:bg-rose-950/20';
    if (status === 'DEFERRED') return 'text-amber-700 bg-amber-50 dark:bg-amber-950/20';
    return 'text-sky-700 bg-sky-50 dark:bg-sky-950/20';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'APPROVED') return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
    if (status === 'REJECTED') return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
    return <Clock className="w-3.5 h-3.5 text-sky-600" />;
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-28 bg-neutral-250 dark:bg-neutral-800 rounded-3xl" />
        <div className="h-96 bg-neutral-250 dark:bg-neutral-800 rounded-3xl" />
      </div>
    );
  }

  const { allocated, spent, requests_pending, requests } = data;
  const utilizedPercent = Math.min(Math.round((spent / allocated) * 100), 100);

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-sky-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Allocated Budget</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white mt-1">₹{(allocated / 10000000).toFixed(1)} Cr</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Annual department allocation</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Spent & Utilized</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white mt-1">₹{(spent / 100000).toFixed(1)} Lakhs</h3>
          <span className="text-[10px] text-emerald-600 font-black block mt-1">{utilizedPercent}% Utilized</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-amber-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Requests Pending</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white mt-1">₹{(requests_pending / 100000).toFixed(1)} Lakhs</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Awaiting principal final review</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-[10px] uppercase font-bold text-neutral-450">New Expenditure</p>
          <button
            onClick={() => setOpenModal(true)}
            className="w-full mt-2 py-2 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Request Budget
          </button>
        </div>
      </div>

      {/* Utilization progress bar */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">📊 BUDGET UTILIZATION PROFILE</span>
          <span className="text-xs font-black text-emerald-600">{utilizedPercent}% Utilized</span>
        </div>
        <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden border border-neutral-200/50">
          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${utilizedPercent}%` }} />
        </div>
      </div>

      {/* Previous requests */}
      <div className="glass-panel rounded-[28px] shadow-ambient overflow-hidden">
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800/50">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm">📋 BUDGET REQUESTS HISTORY</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Requisition status & principal decisions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Request Item / Description</th>
                <th className="px-4 py-3 text-center font-bold">Amount</th>
                <th className="px-4 py-3 text-center font-bold">Priority</th>
                <th className="px-4 py-3 text-center font-bold">HOD Rec</th>
                <th className="px-4 py-3 text-center font-bold">Finance Rev</th>
                <th className="px-4 py-3 text-center font-bold">Decision Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-neutral-850 dark:text-neutral-200 text-xs">{r.title}</p>
                      <p className="text-[10px] text-neutral-400 font-semibold leading-normal mt-0.5 max-w-sm truncate">{r.justification}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-extrabold text-neutral-850 dark:text-neutral-200">
                    ₹{parseFloat(r.amount.toString()).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                      r.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-black text-emerald-600">✓ Recommended</td>
                  <td className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    {r.financeReview.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-bold inline-flex items-center gap-1.5 capitalize ${getStatusBadge(r.status)}`}>
                      {getStatusIcon(r.status)}
                      {r.status.toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">💰 Create Budget Requisition</h3>
              <button onClick={() => setOpenModal(false)} className="text-neutral-400 hover:text-neutral-650 font-bold text-sm">✕</button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Item Title / Project</label>
                <input
                  type="text"
                  placeholder="e.g. Workstation upgrades for Deep Learning lab"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Requested Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer font-semibold"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Justification & Rationale</label>
                <textarea
                  rows={4}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Justify this expense. Mention courses affected, lab deficiencies etc..."
                  required
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs outline-none resize-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-neutral-950 hover:bg-neutral-850 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting Requisition...' : 'Submit to Principal'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
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

export default BudgetResourcePage;
