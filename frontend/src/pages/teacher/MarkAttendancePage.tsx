import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle2, XCircle, MinusCircle, Users, Save } from 'lucide-react';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE';

interface StudentRow {
  id: string;
  rollNo: string;
  name: string;
  status: AttendanceStatus;
}

const initialStudents: StudentRow[] = [
  { id: '1', rollNo: 'CS21001', name: 'Aarav Sharma', status: 'PRESENT' },
  { id: '2', rollNo: 'CS21002', name: 'Ananya Patel', status: 'PRESENT' },
  { id: '3', rollNo: 'CS21003', name: 'Arjun Reddy', status: 'PRESENT' },
  { id: '4', rollNo: 'CS21004', name: 'Divya Nair', status: 'PRESENT' },
  { id: '5', rollNo: 'CS21005', name: 'Ishaan Kumar', status: 'PRESENT' },
  { id: '6', rollNo: 'CS21006', name: 'Kavya Menon', status: 'PRESENT' },
  { id: '7', rollNo: 'CS21007', name: 'Kiran Joshi', status: 'PRESENT' },
  { id: '8', rollNo: 'CS21008', name: 'Meera Iyer', status: 'PRESENT' },
  { id: '9', rollNo: 'CS21009', name: 'Nikhil Bhat', status: 'PRESENT' },
  { id: '10', rollNo: 'CS21010', name: 'Pooja Shetty', status: 'PRESENT' },
  { id: '11', rollNo: 'CS21011', name: 'Rahul Desai', status: 'PRESENT' },
  { id: '12', rollNo: 'CS21012', name: 'Riya Singh', status: 'PRESENT' },
  { id: '13', rollNo: 'CS21013', name: 'Rohit Kulkarni', status: 'PRESENT' },
  { id: '14', rollNo: 'CS21014', name: 'Sneha Gowda', status: 'PRESENT' },
  { id: '15', rollNo: 'CS21015', name: 'Vikram Hegde', status: 'PRESENT' },
];

const subjects = [
  { value: 'CS-301', label: 'CS-301 – Advanced Data Structures' },
  { value: 'CS-305', label: 'CS-305 – Database Management Systems' },
  { value: 'CS-309L', label: 'CS-309L – OS Laboratory' },
  { value: 'CS-303', label: 'CS-303 – Formal Languages & Automata' },
];

export const MarkAttendancePage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('CS-301');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentRow[]>(initialStudents);
  const [submitting, setSubmitting] = useState(false);

  const setStatus = (id: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const markAll = (status: AttendanceStatus) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const counts = students.reduce(
    (acc, s) => {
      acc[s.status]++;
      return acc;
    },
    { PRESENT: 0, ABSENT: 0, LEAVE: 0 }
  );

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Attendance submitted for ${selectedSubject} on ${selectedDate}. ${counts.PRESENT} present, ${counts.ABSENT} absent.`);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header Controls */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="space-y-1 flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-teal-500 transition-colors"
            >
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm font-bold text-neutral-600 dark:text-neutral-400">
              <Users className="w-4 h-4" /> {students.length} Students
            </div>
          </div>
        </div>
      </div>

      {/* Summary + Bulk Actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3">
          <div className="glass-panel rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-bold shadow-ambient">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-600">{counts.PRESENT} Present</span>
          </div>
          <div className="glass-panel rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-bold shadow-ambient">
            <XCircle className="w-4 h-4 text-rose-500" />
            <span className="text-rose-600">{counts.ABSENT} Absent</span>
          </div>
          <div className="glass-panel rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-bold shadow-ambient">
            <MinusCircle className="w-4 h-4 text-amber-500" />
            <span className="text-amber-600">{counts.LEAVE} Leave</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => markAll('PRESENT')}
            className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-xl transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll('ABSENT')}
            className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50 rounded-xl transition-colors"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Student Table */}
      <div className="glass-panel rounded-[28px] shadow-ambient overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200/60 dark:border-neutral-700/60 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 font-bold w-10">#</th>
                <th className="px-5 py-4 font-bold">Roll No</th>
                <th className="px-5 py-4 font-bold">Student Name</th>
                <th className="px-5 py-4 font-bold text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                  <td className="px-5 py-4 text-neutral-400 font-semibold text-xs">{index + 1}</td>
                  <td className="px-5 py-4 font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">{student.rollNo}</td>
                  <td className="px-5 py-4 font-semibold text-neutral-800 dark:text-neutral-200">{student.name}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setStatus(student.id, 'PRESENT')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          student.status === 'PRESENT'
                            ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Present
                      </button>
                      <button
                        onClick={() => setStatus(student.id, 'ABSENT')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          student.status === 'ABSENT'
                            ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-rose-50 hover:text-rose-600'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Absent
                      </button>
                      <button
                        onClick={() => setStatus(student.id, 'LEAVE')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          student.status === 'LEAVE'
                            ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-amber-50 hover:text-amber-600'
                        }`}
                      >
                        <MinusCircle className="w-3.5 h-3.5" /> Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit Footer */}
        <div className="px-5 py-4 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/30">
          <span className="text-xs text-neutral-500 font-semibold">
            {counts.PRESENT} / {students.length} students present
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all disabled:opacity-70"
            style={{ backgroundColor: '#0D9488' }}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Submit Attendance
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendancePage;
