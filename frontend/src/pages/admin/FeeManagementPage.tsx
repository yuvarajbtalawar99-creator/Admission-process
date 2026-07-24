import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit2, Trash2, Save, X, CheckCircle2 } from 'lucide-react';
import Toast from '../../components/common/Toast';

type Department = 'Computer Science' | 'Computer Science (AIML)' | 'Mathematics' | 'Electronics';
interface FeeItem { id: string; component: string; amount: number; frequency: string; dept: Department; semester: number; }

const DEPT_STYLE: Record<Department, { pill: string; accent: string; card: string }> = {
  'Computer Science':    { pill: 'bg-amber-100 text-amber-800',    accent: '#d97706', card: 'border-amber-200 bg-amber-50/50' },
  'Computer Science (AIML)': { pill: 'bg-rose-100 text-rose-800',      accent: '#e11d48', card: 'border-rose-200 bg-rose-50/50' },
  'Mathematics':         { pill: 'bg-emerald-100 text-emerald-800', accent: '#16a34a', card: 'border-emerald-200 bg-emerald-50/50' },
  'Electronics':         { pill: 'bg-violet-100 text-violet-800',  accent: '#7C3AED', card: 'border-violet-200 bg-violet-50/50' },
};

const initialFees: FeeItem[] = [
  { id: '1', component: 'Tuition Fee',    amount: 45000, frequency: 'Per Semester', dept: 'Computer Science',    semester: 1 },
  { id: '2', component: 'Laboratory Fee', amount: 8000,  frequency: 'Per Semester', dept: 'Computer Science',    semester: 1 },
  { id: '3', component: 'Library Fee',    amount: 2500,  frequency: 'Annual',       dept: 'Computer Science',    semester: 1 },
  { id: '4', component: 'Tuition Fee',    amount: 42000, frequency: 'Per Semester', dept: 'Computer Science (AIML)', semester: 1 },
  { id: '5', component: 'Laboratory Fee', amount: 7000,  frequency: 'Per Semester', dept: 'Computer Science (AIML)', semester: 1 },
  { id: '6', component: 'Tuition Fee',    amount: 38000, frequency: 'Per Semester', dept: 'Mathematics',         semester: 1 },
  { id: '7', component: 'Tuition Fee',    amount: 43000, frequency: 'Per Semester', dept: 'Electronics',         semester: 1 },
  { id: '8', component: 'Laboratory Fee', amount: 9000,  frequency: 'Per Semester', dept: 'Electronics',         semester: 1 },
];

export const FeeManagementPage: React.FC = () => {
  const [fees, setFees]           = useState<FeeItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setAmount]   = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [toast, setToast]         = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [newFee, setNewFee]       = useState({ component: '', amount: '', frequency: 'Per Semester', dept: 'Computer Science' as Department, semester: 1 });

  useEffect(() => {
    const local = localStorage.getItem('jcer_fee_components');
    if (local) {
      setFees(JSON.parse(local));
    } else {
      localStorage.setItem('jcer_fee_components', JSON.stringify(initialFees));
      setFees(initialFees);
    }
  }, []);

  const updateFees = (updated: FeeItem[]) => {
    setFees(updated);
    localStorage.setItem('jcer_fee_components', JSON.stringify(updated));
  };

  const startEdit = (fee: FeeItem) => { setEditingId(fee.id); setAmount(String(fee.amount)); };
  const saveEdit  = (id: string)   => {
    const updated = fees.map((f) => f.id === id ? { ...f, amount: Number(editAmount) } : f);
    updateFees(updated);
    setEditingId(null);
    setToast({ type: 'success', message: 'Fee amount updated successfully.' });
  };
  const deleteFee = (id: string) => {
    const updated = fees.filter((f) => f.id !== id);
    updateFees(updated);
    setToast({ type: 'success', message: 'Fee component removed.' });
  };
  const addFee = () => {
    if (!newFee.component || !newFee.amount) { setToast({ type: 'error', message: 'Fill all fields.' }); return; }
    const updated = [...fees, { id: Date.now().toString(), ...newFee, amount: Number(newFee.amount) }];
    updateFees(updated);
    setShowForm(false);
    setNewFee({ component: '', amount: '', frequency: 'Per Semester', dept: 'Computer Science', semester: 1 });
    setToast({ type: 'success', message: 'New fee component added.' });
  };

  const grouped = (Object.keys(DEPT_STYLE) as Department[]).map((dept) => ({
    dept,
    items: fees.filter((f) => f.dept === dept),
    total: fees.filter((f) => f.dept === dept).reduce((s, f) => s + f.amount, 0),
  }));

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Fee Structure Manager</h2>
            <p className="text-xs text-neutral-400 font-medium">Define and manage fee components per department</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-admin-primary px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:scale-[1.02] transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> Add Fee Component
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
          <h3 className="text-[18px] font-bold text-neutral-900">Add New Fee Component</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Component Name', key: 'component', type: 'text', placeholder: 'e.g. Exam Fee' },
              { label: 'Amount (₹)', key: 'amount', type: 'number', placeholder: 'e.g. 5000' },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={(newFee as any)[f.key]}
                  onChange={(e) => setNewFee((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none text-neutral-800"
                />
              </div>
            ))}
            <div>
              <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">Department</label>
              <select value={newFee.dept} onChange={(e) => setNewFee((p) => ({ ...p, dept: e.target.value as Department }))}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none text-neutral-800 cursor-pointer">
                {(Object.keys(DEPT_STYLE) as Department[]).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">Frequency</label>
              <select value={newFee.frequency} onChange={(e) => setNewFee((p) => ({ ...p, frequency: e.target.value }))}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none text-neutral-800 cursor-pointer">
                {['Per Semester', 'Annual', 'One-Time'].map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addFee} className="btn-admin-primary px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer hover:scale-[1.02]">
              <Save className="w-3.5 h-3.5" /> Save Component
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-2xl text-xs font-bold border border-neutral-200 hover:bg-neutral-100 transition-all cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Department Grouped Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {grouped.map(({ dept, items, total }) => {
          const ds = DEPT_STYLE[dept];
          return (
            <div key={dept} className={`rounded-[28px] border p-5 ${ds.card} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${ds.pill}`}>{dept}</span>
                  <p className="text-xs text-neutral-400 font-semibold mt-1">{items.length} fee components</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 font-semibold">Total / Semester</p>
                  <p className="text-xl font-extrabold" style={{ color: ds.accent }}>₹{total.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2.5 border border-white">
                    <div>
                      <p className="text-xs font-bold text-neutral-800">{fee.component}</p>
                      <p className="text-[9px] text-neutral-400 font-semibold">{fee.frequency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingId === fee.id ? (
                        <>
                          <input type="number" value={editAmount} onChange={(e) => setAmount(e.target.value)}
                            className="w-24 bg-neutral-50 border border-violet-300 rounded-lg py-1 px-2 text-xs font-bold outline-none" />
                          <button onClick={() => saveEdit(fee.id)} className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center cursor-pointer">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center cursor-pointer">
                            <X className="w-3 h-3 text-neutral-600" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-extrabold text-neutral-800">₹{fee.amount.toLocaleString()}</span>
                          <button onClick={() => startEdit(fee)} className="w-7 h-7 rounded-full hover:bg-violet-100 flex items-center justify-center cursor-pointer transition-all">
                            <Edit2 className="w-3.5 h-3.5" style={{ color: '#7C3AED' }} />
                          </button>
                          <button onClick={() => deleteFee(fee.id)} className="w-7 h-7 rounded-full hover:bg-rose-100 flex items-center justify-center cursor-pointer transition-all">
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeeManagementPage;
