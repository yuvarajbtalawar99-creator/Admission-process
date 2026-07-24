import React, { useState, useEffect } from 'react';
import { Clock, Save } from 'lucide-react';
import Toast from '../../components/common/Toast';

type Department = 'Computer Science' | 'Computer Science (AIML)' | 'Mathematics' | 'Electronics';
type Semester   = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const DEPT_STYLE: Record<Department, { pill: string; accent: string }> = {
  'Computer Science':    { pill: 'bg-amber-100 text-amber-800',    accent: '#d97706' },
  'Computer Science (AIML)': { pill: 'bg-rose-100 text-rose-800',      accent: '#e11d48' },
  'Mathematics':         { pill: 'bg-emerald-100 text-emerald-800', accent: '#16a34a' },
  'Electronics':         { pill: 'bg-violet-100 text-violet-800',  accent: '#7C3AED' },
};

const DAYS    = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

type TimetableGrid = Record<string, Record<string, string>>;

const initialGrid: TimetableGrid = {
  Monday:    { '08:00 AM': 'Data Structures', '09:00 AM': 'Engineering Maths', '10:00 AM': 'OS Lab', '11:00 AM': 'DBMS', '12:00 PM': 'Break', '02:00 PM': 'Algorithms', '03:00 PM': 'Project', '04:00 PM': '' },
  Tuesday:   { '08:00 AM': 'Algorithms', '09:00 AM': 'Data Structures', '10:00 AM': '', '11:00 AM': 'Computer Networks', '12:00 PM': 'Break', '02:00 PM': 'DBMS Lab', '03:00 PM': 'DBMS Lab', '04:00 PM': '' },
  Wednesday: { '08:00 AM': 'Computer Networks', '09:00 AM': 'Engineering Maths', '10:00 AM': 'OS Lab', '11:00 AM': '', '12:00 PM': 'Break', '02:00 PM': 'Data Structures', '03:00 PM': 'Seminar', '04:00 PM': '' },
  Thursday:  { '08:00 AM': 'DBMS', '09:00 AM': 'Algorithms', '10:00 AM': 'Computer Networks', '11:00 AM': 'OS Lab', '12:00 PM': 'Break', '02:00 PM': '', '03:00 PM': 'Project', '04:00 PM': '' },
  Friday:    { '08:00 AM': 'Engineering Maths', '09:00 AM': 'DBMS', '10:00 AM': 'Algorithms', '11:00 AM': 'Computer Networks', '12:00 PM': 'Break', '02:00 PM': 'Data Structures', '03:00 PM': '', '04:00 PM': 'Elective' },
  Saturday:  { '08:00 AM': 'OS Lab', '09:00 AM': 'OS Lab', '10:00 AM': '', '11:00 AM': '', '12:00 PM': '', '02:00 PM': '', '03:00 PM': '', '04:00 PM': '' },
};

const SUBJECT_COLORS: Record<string, string> = {
  'Data Structures': '#bae6fd', 'Algorithms': '#bbf7d0', 'Engineering Maths': '#fce7f3',
  'DBMS': '#fde68a', 'Computer Networks': '#ddd6fe', 'OS Lab': '#fed7aa',
  'DBMS Lab': '#fde68a', 'Project': '#e0e7ff', 'Seminar': '#f0fdf4',
  'Break': '#f5f5f5', 'Elective': '#fce7f3',
};

export const TimetableCreationPage: React.FC = () => {
  const [dept, setDept]       = useState<Department>('Computer Science');
  const [semester, setSem]    = useState<Semester>(4);
  const [grid, setGrid]       = useState<TimetableGrid>({});
  const [editing, setEditing] = useState<{ day: string; period: string } | null>(null);
  const [inputVal, setInput]  = useState('');
  const [toast, setToast]     = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const key = `jcer_timetable_${dept}_sem${semester}`;
    const local = localStorage.getItem(key);
    if (local) {
      setGrid(JSON.parse(local));
    } else {
      localStorage.setItem(key, JSON.stringify(initialGrid));
      setGrid(initialGrid);
    }
  }, [dept, semester]);

  const ds = DEPT_STYLE[dept];

  const startEdit = (day: string, period: string) => {
    setEditing({ day, period });
    setInput(grid[day]?.[period] || '');
  };
  const saveCell = () => {
    if (!editing) return;
    const newGrid = {
      ...grid,
      [editing.day]: {
        ...grid[editing.day],
        [editing.period]: inputVal,
      },
    };
    setGrid(newGrid);
    const key = `jcer_timetable_${dept}_sem${semester}`;
    localStorage.setItem(key, JSON.stringify(newGrid));
    setEditing(null);
  };
  const saveTimetable = () => setToast({ type: 'success', message: `Timetable for ${dept} · Semester ${semester} saved successfully.` });

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)' }}>
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Timetable Management</h2>
            <p className="text-xs text-neutral-400 font-medium">Click any cell to edit the subject. Save to publish.</p>
          </div>
        </div>
        <button onClick={saveTimetable} className="btn-admin-primary px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:scale-[1.02] cursor-pointer">
          <Save className="w-4 h-4" /> Save Timetable
        </button>
      </div>

      {/* Selectors */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient flex flex-wrap gap-4">
        <div>
          <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1.5">Department</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DEPT_STYLE) as Department[]).map((d) => {
              const ds2 = DEPT_STYLE[d];
              return (
                <button key={d} onClick={() => setDept(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    dept === d ? `${ds2.pill} shadow-sm` : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                  }`}>{d}</button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1.5">Semester</label>
          <div className="flex flex-wrap gap-2">
            {([1,2,3,4,5,6,7,8] as Semester[]).map((s) => (
              <button key={s} onClick={() => setSem(s)}
                className={`w-9 h-9 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                  semester === s
                    ? `text-white shadow-sm`
                    : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                }`}
                style={semester === s ? { backgroundColor: ds.accent } : {}}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-neutral-900">{dept} · Semester {semester} Timetable</h3>
          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${ds.pill}`}>Click any cell to edit</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th className="py-3 px-3 text-left text-[10px] font-extrabold text-neutral-500 uppercase w-28">Period</th>
                {DAYS.map((day) => (
                  <th key={day} className="py-3 px-2 text-center text-[10px] font-extrabold uppercase tracking-wider"
                    style={{ color: ds.accent }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {PERIODS.map((period) => (
                <tr key={period} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-2 px-3">
                    <span className="text-[10px] font-bold text-neutral-500 whitespace-nowrap">{period}</span>
                  </td>
                  {DAYS.map((day) => {
                    const subject = grid[day]?.[period] || '';
                    const isEditing = editing?.day === day && editing?.period === period;
                    const subjectColor = SUBJECT_COLORS[subject] || '';
                    return (
                      <td key={day} className="py-1.5 px-1.5 text-center">
                        {isEditing ? (
                          <input
                            autoFocus
                            value={inputVal}
                            onChange={(e) => setInput(e.target.value)}
                            onBlur={saveCell}
                            onKeyDown={(e) => e.key === 'Enter' && saveCell()}
                            className="w-full text-center text-[10px] font-bold bg-white border-2 border-violet-400 rounded-lg py-1 px-1 outline-none"
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(day, period)}
                            className={`w-full min-h-[32px] text-[10px] font-bold rounded-lg py-1 px-1.5 transition-all hover:scale-[1.03] cursor-pointer border ${
                              subject === 'Break'
                                ? 'bg-neutral-50 text-neutral-400 border-neutral-100 italic'
                                : subject
                                  ? 'border-transparent text-neutral-800'
                                  : 'bg-neutral-50 border-dashed border-neutral-200 text-neutral-300 hover:border-violet-300'
                            }`}
                            style={subject && subject !== 'Break' ? { backgroundColor: subjectColor || '#f0f0f0', borderColor: subjectColor || '#e5e5e5' } : {}}
                          >
                            {subject || '+'}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-100">
          {Object.entries(SUBJECT_COLORS).slice(0, 8).map(([sub, color]) => (
            <div key={sub} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
              <span className="text-[9px] font-semibold text-neutral-500">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetableCreationPage;
