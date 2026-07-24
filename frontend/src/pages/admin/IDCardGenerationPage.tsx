import React, { useState, useEffect } from 'react';
import { IdCard, Search, Printer, Users, Download } from 'lucide-react';
import Toast from '../../components/common/Toast';
import userManagementService, { StudentProfile } from '../../services/userManagement.service';

type Department = string;

const DEPT_STYLE: Record<string, { pill: string; accent: string; grad: string }> = {
  'Computer Science & Engineering':             { pill: 'bg-amber-100 text-amber-800',    accent: '#d97706', grad: 'from-amber-500 to-amber-600' },
  'Electronics & Communication Engineering':    { pill: 'bg-violet-100 text-violet-800',  accent: '#7C3AED', grad: 'from-violet-500 to-violet-600' },
  'Mechanical Engineering':                     { pill: 'bg-rose-100 text-rose-800',      accent: '#e11d48', grad: 'from-rose-500 to-rose-600' },
  'Civil Engineering':                          { pill: 'bg-emerald-100 text-emerald-800', accent: '#16a34a', grad: 'from-emerald-500 to-emerald-600' },
};

interface Student {
  id: string; rollNo: string; name: string; dept: Department;
  dob: string; blood: string; phone: string; validUntil: string;
  avatar: string; idGenerated: boolean;
}

export const IDCardGenerationPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);
  const [search, setSearch]     = useState('');
  const [deptFilter, setDept]   = useState<Department | 'ALL'>('ALL');
  const [preview, setPreview]   = useState<Student | null>(null);
  const [toast, setToast]       = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Load generated IDs
    const localGenerated = localStorage.getItem('jcer_generated_ids');
    const genList: string[] = localGenerated ? JSON.parse(localGenerated) : [];
    setGeneratedIds(genList);

    userManagementService.getStudents({ limit: 100 })
      .then(res => {
        if (res?.data) {
          const mapped = res.data.map((s: StudentProfile) => ({
            id: s.id,
            rollNo: s.enrollmentNumber || 'N/A',
            name: `${s.user.firstName} ${s.user.lastName || ''}`.trim(),
            dept: s.department?.name || 'Computer Science & Engineering',
            dob: '15 Aug 2005',
            blood: 'O+',
            phone: s.user.phone || 'N/A',
            validUntil: 'May 2028',
            avatar: s.user.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&fit=crop',
            idGenerated: genList.includes(s.id),
          }));
          setStudents(mapped);
        }
      })
      .catch(err => {
        console.error('Error loading students for ID card gen:', err);
        setToast({ type: 'error', message: 'Failed to load student list.' });
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) => {
    const matchDept = deptFilter === 'ALL' || s.dept === deptFilter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const generateId = (id: string) => {
    const updated = [...generatedIds, id];
    setGeneratedIds(updated);
    localStorage.setItem('jcer_generated_ids', JSON.stringify(updated));
    setStudents((p) => p.map((s) => s.id === id ? { ...s, idGenerated: true } : s));
    if (preview && preview.id === id) {
      setPreview({ ...preview, idGenerated: true });
    }
    setToast({ type: 'success', message: 'ID Card generated successfully. Ready to print.' });
  };

  const deptFilters = [
    { key: 'ALL' as const, label: 'All', style: 'bg-[#bae6fd] text-black border-[#7dd3fc]' },
    { key: 'Computer Science & Engineering' as Department, label: 'CSE', style: 'bg-amber-100 text-black border-amber-300' },
    { key: 'Electronics & Communication Engineering' as Department, label: 'ECE', style: 'bg-violet-100 text-black border-violet-300' },
    { key: 'Mechanical Engineering' as Department, label: 'ME', style: 'bg-rose-100 text-black border-rose-300' },
    { key: 'Civil Engineering' as Department, label: 'CE', style: 'bg-emerald-100 text-black border-emerald-300' },
  ];

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)' }}>
            <IdCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Student Registry &amp; ID Cards</h2>
            <p className="text-xs text-neutral-400 font-medium">View all enrolled students and generate ID cards</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-semibold px-3 py-1.5 bg-neutral-100 rounded-xl flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> {students.length} Total Students
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {deptFilters.map(({ key, label, style }) => (
            <button key={key} onClick={() => setDept(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                deptFilter === key ? style + ' shadow-sm' : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
              }`}>{label}</button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <input type="text" placeholder="Search by name or roll no..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 pl-8 text-xs outline-none text-neutral-800" />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((student) => {
          const ds = DEPT_STYLE[student.dept] || { pill: 'bg-neutral-100 text-neutral-800', accent: '#7C3AED', grad: 'from-violet-500 to-violet-600' };
          return (
            <div key={student.id} className="glass-panel rounded-[28px] p-5 shadow-ambient flex flex-col space-y-3 hover:scale-[1.02] transition-all">
              <div className="flex items-center space-x-3">
                <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: ds.accent }} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-neutral-800 truncate">{student.name}</p>
                  <p className="text-[9px] text-neutral-400 font-semibold">{student.rollNo}</p>
                  <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded mt-0.5 inline-block ${ds.pill}`}>{student.dept}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'DOB', value: student.dob },
                  { label: 'Blood', value: student.blood },
                ].map((f) => (
                  <div key={f.label} className="bg-neutral-50 rounded-xl p-2 border border-neutral-100">
                    <p className="text-[8px] text-neutral-400 font-bold uppercase">{f.label}</p>
                    <p className="text-[10px] font-bold text-neutral-800">{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                {student.idGenerated ? (
                  <>
                    <button onClick={() => setPreview(student)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-all"
                      style={{ backgroundColor: ds.accent }}>
                      <IdCard className="w-3.5 h-3.5" /> View Card
                    </button>
                    <button onClick={() => setToast({ type: 'success', message: `Printing ${student.name}'s ID card...` })}
                      className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 cursor-pointer transition-all">
                      <Printer className="w-3.5 h-3.5 text-neutral-600" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => generateId(student.id)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-violet-200 hover:bg-violet-50 transition-all"
                    style={{ color: '#7C3AED' }}>
                    <IdCard className="w-3.5 h-3.5" /> Generate ID
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ID Card Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-[28px] overflow-hidden shadow-2xl">
              {/* Card Top */}
              <div className={`bg-gradient-to-br ${(DEPT_STYLE[preview.dept] || { grad: 'from-violet-500 to-violet-600' }).grad} p-5 flex items-center justify-between`}>
                <div>
                  <p className="text-white/70 text-[9px] font-extrabold uppercase tracking-widest">JCER Institute</p>
                  <p className="text-white text-sm font-extrabold mt-0.5">Student Identity Card</p>
                </div>
                <img src="/jcer.png" alt="JCER" className="w-10 h-10 rounded-full bg-white/20 object-contain p-1" />
              </div>
              {/* Card Body */}
              <div className="bg-white p-5 flex items-center gap-4">
                <img src={preview.avatar} alt={preview.name} className="w-16 h-16 rounded-xl object-cover border-2" style={{ borderColor: (DEPT_STYLE[preview.dept] || { accent: '#7C3AED' }).accent }} />
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-neutral-900">{preview.name}</p>
                  <p className="text-[10px] font-bold text-neutral-500">{preview.rollNo}</p>
                  <p className="text-[10px] font-bold" style={{ color: (DEPT_STYLE[preview.dept] || { accent: '#7C3AED' }).accent }}>{preview.dept}</p>
                </div>
              </div>
              <div className="bg-white px-5 pb-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'DOB', value: preview.dob },
                  { label: 'Blood', value: preview.blood },
                  { label: 'Valid Until', value: preview.validUntil },
                ].map((f) => (
                  <div key={f.label} className="bg-neutral-50 rounded-xl p-2 text-center border border-neutral-100">
                    <p className="text-[7px] text-neutral-400 font-bold uppercase">{f.label}</p>
                    <p className="text-[10px] font-extrabold text-neutral-800">{f.value}</p>
                  </div>
                ))}
              </div>
              {/* Card Footer */}
              <div className="bg-neutral-50 px-5 py-3 flex gap-2">
                <button onClick={() => { setPreview(null); setToast({ type: 'success', message: `Printing ${preview.name}'s ID card...` }); }}
                  className="flex-1 btn-admin-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                  <Printer className="w-3.5 h-3.5" /> Print ID Card
                </button>
                <button onClick={() => setPreview(null)} className="px-4 py-2.5 rounded-xl bg-neutral-200 text-neutral-700 text-xs font-bold cursor-pointer hover:bg-neutral-300 transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDCardGenerationPage;
