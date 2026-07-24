import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Edit2, Trash2, CheckCircle2, Bell, X } from 'lucide-react';
import Toast from '../../components/common/Toast';

type Department = 'Computer Science' | 'Computer Science (AIML)' | 'Mathematics' | 'Electronics';

const DEPT_STYLE: Record<Department, { pill: string; accent: string; card: string }> = {
  'Computer Science':    { pill: 'bg-amber-100 text-amber-800',    accent: '#d97706', card: 'border-amber-200 bg-amber-50/60' },
  'Computer Science (AIML)': { pill: 'bg-rose-100 text-rose-800',      accent: '#e11d48', card: 'border-rose-200 bg-rose-50/60' },
  'Mathematics':         { pill: 'bg-emerald-100 text-emerald-800', accent: '#16a34a', card: 'border-emerald-200 bg-emerald-50/60' },
  'Electronics':         { pill: 'bg-violet-100 text-violet-800',  accent: '#7C3AED', card: 'border-violet-200 bg-violet-50/60' },
};

interface ExamEntry {
  id: string; subject: string; dept: Department; semester: number;
  date: string; time: string; room: string; invigilator: string; published: boolean;
}

const initialExams: ExamEntry[] = [
  { id: '1', subject: 'Data Structures', dept: 'Computer Science', semester: 4, date: '2026-07-10', time: '10:00 AM - 01:00 PM', room: 'Hall A', invigilator: 'Dr. Priya Nair',   published: true },
  { id: '2', subject: 'Algorithms',      dept: 'Computer Science', semester: 4, date: '2026-07-12', time: '10:00 AM - 01:00 PM', room: 'Hall A', invigilator: 'Prof. Raj Kumar', published: true },
  { id: '3', subject: 'Database Systems',dept: 'Computer Science (AIML)', semester: 4, date: '2026-07-11', time: '02:00 PM - 05:00 PM', room: 'Hall B', invigilator: 'Dr. Meera Joshi', published: false },
  { id: '4', subject: 'Signals & Systems',dept: 'Electronics',     semester: 4, date: '2026-07-14', time: '10:00 AM - 01:00 PM', room: 'Hall C', invigilator: 'Dr. Kiran Shah',  published: false },
  { id: '5', subject: 'Real Analysis',   dept: 'Mathematics',      semester: 4, date: '2026-07-15', time: '02:00 PM - 05:00 PM', room: 'Hall D', invigilator: 'Prof. Anita Roy',  published: true },
];

const blankExam: Omit<ExamEntry, 'id' | 'published'> = { subject: '', dept: 'Computer Science', semester: 4, date: '', time: '10:00 AM - 01:00 PM', room: '', invigilator: '' };

export const ExamSchedulePage: React.FC = () => {
  const [exams, setExams]     = useState<ExamEntry[]>([]);
  const [showForm, setForm]   = useState(false);
  const [form, setForm2]      = useState({ ...blankExam });
  const [deptFilter, setDept] = useState<Department | 'ALL'>('ALL');
  const [toast, setToast]     = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const local = localStorage.getItem('jcer_exam_schedules');
    if (local) {
      setExams(JSON.parse(local));
    } else {
      localStorage.setItem('jcer_exam_schedules', JSON.stringify(initialExams));
      setExams(initialExams);
    }
  }, []);

  const updateExams = (updated: ExamEntry[]) => {
    setExams(updated);
    localStorage.setItem('jcer_exam_schedules', JSON.stringify(updated));
  };

  const filtered = deptFilter === 'ALL' ? exams : exams.filter((e) => e.dept === deptFilter);

  const addExam = () => {
    if (!form.subject || !form.date || !form.room) { setToast({ type: 'error', message: 'Fill subject, date and room.' }); return; }
    const updated = [...exams, { ...form, id: Date.now().toString(), published: false }];
    updateExams(updated);
    setForm2({ ...blankExam });
    setForm(false);
    setToast({ type: 'success', message: 'Exam entry added. Publish to notify students.' });
  };

  const togglePublish = (id: string) => {
    const exam = exams.find((e) => e.id === id);
    const updated = exams.map((e) => e.id === id ? { ...e, published: !e.published } : e);
    updateExams(updated);
    if (!exam?.published) setToast({ type: 'success', message: 'Exam schedule published. Students notified!' });
  };

  const deleteExam = (id: string) => { setExams((p) => p.filter((e) => e.id !== id)); setToast({ type: 'success', message: 'Exam entry removed.' }); };

  const deptFilters = [
    { key: 'ALL' as const, label: 'All', style: 'bg-[#bae6fd] text-black border-[#7dd3fc]' },
    { key: 'Computer Science' as Department, label: 'CS', style: 'bg-amber-100 text-black border-amber-300' },
    { key: 'Computer Science (AIML)' as Department, label: 'CS-AIML', style: 'bg-rose-100 text-black border-rose-300' },
    { key: 'Mathematics' as Department, label: 'Math', style: 'bg-emerald-100 text-black border-emerald-300' },
    { key: 'Electronics' as Department, label: 'EC', style: 'bg-violet-100 text-black border-violet-300' },
  ];

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#e11d48,#be123c)' }}>
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Exam Schedule Manager</h2>
            <p className="text-xs text-neutral-400 font-medium">Create, publish and manage semester exam timetables</p>
          </div>
        </div>
        <button onClick={() => setForm(!showForm)} className="btn-admin-primary px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:scale-[1.02] cursor-pointer">
          <Plus className="w-4 h-4" /> Add Exam Entry
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
          <h3 className="text-[18px] font-bold text-neutral-900">New Exam Entry</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Subject Name', key: 'subject', type: 'text', placeholder: 'e.g. Compiler Design' },
              { label: 'Room / Hall',  key: 'room',    type: 'text', placeholder: 'e.g. Hall A' },
              { label: 'Invigilator', key: 'invigilator', type: 'text', placeholder: 'e.g. Dr. Sharma' },
              { label: 'Exam Date',   key: 'date',    type: 'date',  placeholder: '' },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                  onChange={(e) => setForm2((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none text-neutral-800" />
              </div>
            ))}
            <div>
              <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">Department</label>
              <select value={form.dept} onChange={(e) => setForm2((p) => ({ ...p, dept: e.target.value as Department }))}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none text-neutral-800 cursor-pointer">
                {(Object.keys(DEPT_STYLE) as Department[]).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">Time Slot</label>
              <select value={form.time} onChange={(e) => setForm2((p) => ({ ...p, time: e.target.value }))}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none text-neutral-800 cursor-pointer">
                {['10:00 AM - 01:00 PM', '02:00 PM - 05:00 PM', '09:00 AM - 12:00 PM'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addExam} className="btn-admin-primary px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer">
              <CalendarDays className="w-3.5 h-3.5" /> Add Entry
            </button>
            <button onClick={() => setForm(false)} className="px-5 py-2.5 rounded-2xl text-xs font-bold border border-neutral-200 hover:bg-neutral-100 cursor-pointer transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filter + Table */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-[18px] font-bold text-neutral-900">Exam Schedule ({filtered.length} entries)</h3>
          <div className="flex flex-wrap gap-2">
            {deptFilters.map(({ key, label, style }) => (
              <button key={key} onClick={() => setDept(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                  deptFilter === key ? style + ' shadow-sm' : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                }`}>{label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((exam) => {
            const ds = DEPT_STYLE[exam.dept];
            return (
              <div key={exam.id} className={`rounded-[22px] border p-5 ${ds.card} flex flex-col gap-3`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${ds.pill}`}>{exam.dept}</span>
                    <h4 className="text-sm font-extrabold text-neutral-800 mt-1.5">{exam.subject}</h4>
                    <p className="text-[10px] text-neutral-500 font-semibold">Semester {exam.semester}</p>
                  </div>
                  <span className={`text-[9px] font-extrabold px-2 py-1 rounded-full ${exam.published ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}>
                    {exam.published ? '✓ Published' : 'Draft'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Date', value: new Date(exam.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) },
                    { label: 'Time', value: exam.time },
                    { label: 'Room', value: exam.room },
                    { label: 'Invigilator', value: exam.invigilator },
                  ].map((f) => (
                    <div key={f.label} className="bg-white/70 rounded-xl px-3 py-2 border border-white/80">
                      <p className="text-[8px] text-neutral-400 font-bold uppercase">{f.label}</p>
                      <p className="text-[10px] font-bold text-neutral-800">{f.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => togglePublish(exam.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      exam.published
                        ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        : 'text-white hover:opacity-90'
                    }`}
                    style={!exam.published ? { backgroundColor: ds.accent } : {}}>
                    {exam.published ? <><X className="w-3.5 h-3.5" /> Unpublish</> : <><Bell className="w-3.5 h-3.5" /> Publish</>}
                  </button>
                  <button onClick={() => deleteExam(exam.id)} className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 cursor-pointer transition-all">
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamSchedulePage;
