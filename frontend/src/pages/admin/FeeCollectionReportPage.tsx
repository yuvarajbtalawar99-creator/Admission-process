import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Toast from '../../components/common/Toast';
import { getAcademicYear } from '../../utils/date.util';
import officeService from '../../services/office.service';

type Department = string;

const DEPT_STYLE: Record<string, { pill: string; accent: string }> = {
  'Computer Science & Engineering':             { pill: 'bg-amber-100 text-amber-800',    accent: '#d97706' },
  'Electronics & Communication Engineering':    { pill: 'bg-violet-100 text-violet-800',  accent: '#7C3AED' },
  'Mechanical Engineering':                     { pill: 'bg-rose-100 text-rose-800',      accent: '#e11d48' },
  'Civil Engineering':                          { pill: 'bg-emerald-100 text-emerald-800', accent: '#16a34a' },
};

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  PAID:    { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Paid' },
  PARTIAL: { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'Partial' },
  OVERDUE: { bg: 'bg-rose-100',    text: 'text-rose-700',    label: 'Overdue' },
};

export const FeeCollectionReportPage: React.FC = () => {
  const [deptFilter, setDeptFilter] = useState<Department | 'ALL'>('ALL');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [data, setData] = useState<{ deptChartData: any[]; records: any[] }>({ deptChartData: [], records: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    officeService.getFeeReportData()
      .then(res => {
        setData(res || { deptChartData: [], records: [] });
      })
      .catch(err => {
        console.error('Error loading fee reports:', err);
        setToast({ type: 'error', message: 'Failed to load fee reports.' });
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = deptFilter === 'ALL' ? data.records : data.records.filter((r) => r.dept === deptFilter);
  const totalCollected = data.records.reduce((s, r) => s + r.paid, 0);
  const totalPending   = data.records.reduce((s, r) => s + r.pending, 0);
  const overdue        = data.records.filter((r) => r.status === 'OVERDUE').length;

  const deptFilters = [
    { key: 'ALL' as const,                              label: 'All',          style: 'bg-[#bae6fd] text-black border-[#7dd3fc]' },
    { key: 'Computer Science & Engineering' as Department, label: 'CSE',         style: 'bg-amber-100 text-black border-amber-300' },
    { key: 'Electronics & Communication Engineering' as Department, label: 'ECE', style: 'bg-violet-100 text-black border-violet-300' },
    { key: 'Mechanical Engineering' as Department,      label: 'ME',           style: 'bg-rose-100 text-black border-rose-300' },
    { key: 'Civil Engineering' as Department,           label: 'CE',           style: 'bg-emerald-100 text-black border-emerald-300' },
  ];

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)' }}>
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Fee Collection Report</h2>
            <p className="text-xs text-neutral-400 font-medium">Academic Year {getAcademicYear()} · All Departments</p>
          </div>
        </div>
        <button
          onClick={() => setToast({ type: 'success', message: 'Fee report downloaded as PDF.' })}
          className="btn-admin-primary px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Collected', value: `₹${(totalCollected/100000).toFixed(1)}L`, icon: TrendingUp, color: '#16a34a', bg: 'bg-emerald-50', border: 'border-l-emerald-400' },
          { label: 'Total Pending',   value: `₹${(totalPending/100000).toFixed(1)}L`,   icon: AlertCircle, color: '#e11d48', bg: 'bg-rose-50',    border: 'border-l-rose-400' },
          { label: 'Overdue Students', value: String(overdue),                           icon: AlertCircle, color: '#d97706', bg: 'bg-amber-50',   border: 'border-l-amber-400' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`glass-panel rounded-[28px] p-5 shadow-ambient border-l-4 ${s.border}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">{s.label}</span>
                <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-neutral-900 mt-3">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <h3 className="text-[18px] font-bold text-neutral-900 mb-4">Department-wise Fee Collection</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.deptChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} tick={{ fill: '#a3a3a3', fontSize: 10 }} />
              <Tooltip formatter={(v: number, name: string) => [`₹${(v/100000).toFixed(2)}L`, name === 'collected' ? 'Collected' : 'Pending']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="collected" name="Collected" radius={[6,6,0,0]} barSize={28}>
                {data.deptChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
              <Bar dataKey="pending" name="Pending" radius={[6,6,0,0]} barSize={28} fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Table */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-[18px] font-bold text-neutral-900">Student-wise Fee Ledger</h3>
          <div className="flex flex-wrap gap-2">
            {deptFilters.map(({ key, label, style }) => (
              <button key={key} onClick={() => setDeptFilter(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                  deptFilter === key ? style + ' shadow-sm' : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                }`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[22px] glass-table-container shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Department</th>
                  <th className="px-5 py-4 text-right">Total Fee</th>
                  <th className="px-5 py-4 text-right">Paid</th>
                  <th className="px-5 py-4 text-right">Pending</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Last Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((r) => {
                  const ds = DEPT_STYLE[r.dept] || { pill: 'bg-neutral-100 text-neutral-800', accent: '#6b7280' };
                  const ss = STATUS_STYLE[r.status] || { bg: 'bg-neutral-100', text: 'text-neutral-700', label: r.status };
                  return (
                    <tr key={r.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-neutral-900 text-xs">{r.name}</p>
                        <p className="text-[10px] text-neutral-400 font-semibold">{r.rollNo}</p>
                      </td>
                      <td className="px-5 py-4"><span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${ds.pill}`}>{r.dept}</span></td>
                      <td className="px-5 py-4 text-right font-bold text-xs">₹{r.totalFee.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right font-bold text-xs text-emerald-600">₹{r.paid.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right font-bold text-xs text-rose-600">{r.pending > 0 ? `₹${r.pending.toLocaleString()}` : '—'}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full ${ss.bg} ${ss.text}`}>{ss.label}</span>
                      </td>
                      <td className="px-5 py-4 text-right text-[10px] text-neutral-500 font-semibold">{r.lastPaid}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeCollectionReportPage;
