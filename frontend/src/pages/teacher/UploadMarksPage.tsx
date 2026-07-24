import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Save, AlertCircle } from 'lucide-react';

type ExamType = 'IA1' | 'IA2' | 'SEMESTER';

interface StudentMarkRow {
  id: string;
  rollNo: string;
  name: string;
  marks: string;
}

const calculateGrade = (marks: number, maxMarks: number): string => {
  const pct = (marks / maxMarks) * 100;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
};

const gradeColor = (grade: string): string => {
  switch (grade) {
    case 'A+': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'A': return 'text-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400';
    case 'B+': return 'text-sky-600 bg-sky-50 dark:bg-sky-900/30 dark:text-sky-400';
    case 'B': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400';
    case 'C': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400';
    case 'D': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400';
    case 'F': return 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400';
    default: return 'text-neutral-500 bg-neutral-50';
  }
};

const initialStudents: StudentMarkRow[] = [
  { id: '1', rollNo: 'CS21001', name: 'Aarav Sharma', marks: '' },
  { id: '2', rollNo: 'CS21002', name: 'Ananya Patel', marks: '' },
  { id: '3', rollNo: 'CS21003', name: 'Arjun Reddy', marks: '' },
  { id: '4', rollNo: 'CS21004', name: 'Divya Nair', marks: '' },
  { id: '5', rollNo: 'CS21005', name: 'Ishaan Kumar', marks: '' },
  { id: '6', rollNo: 'CS21006', name: 'Kavya Menon', marks: '' },
  { id: '7', rollNo: 'CS21007', name: 'Kiran Joshi', marks: '' },
  { id: '8', rollNo: 'CS21008', name: 'Meera Iyer', marks: '' },
  { id: '9', rollNo: 'CS21009', name: 'Nikhil Bhat', marks: '' },
  { id: '10', rollNo: 'CS21010', name: 'Pooja Shetty', marks: '' },
  { id: '11', rollNo: 'CS21011', name: 'Rahul Desai', marks: '' },
  { id: '12', rollNo: 'CS21012', name: 'Riya Singh', marks: '' },
];

const subjects = [
  { value: 'CS-301', label: 'CS-301 – Advanced Data Structures' },
  { value: 'CS-305', label: 'CS-305 – Database Management Systems' },
  { value: 'CS-303', label: 'CS-303 – Formal Languages & Automata' },
  { value: 'CS-307', label: 'CS-307 – Software Engineering' },
];

export const UploadMarksPage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('CS-301');
  const [examType, setExamType] = useState<ExamType>('IA1');
  const [maxMarks, setMaxMarks] = useState('20');
  const [students, setStudents] = useState<StudentMarkRow[]>(initialStudents);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const maxMarksNum = parseInt(maxMarks) || 20;

  // Reset marks when exam type changes
  useEffect(() => {
    setStudents(initialStudents.map((s) => ({ ...s, marks: '' })));
    setErrors({});
    if (examType === 'SEMESTER') setMaxMarks('100');
    else setMaxMarks('20');
  }, [examType]);

  const handleMarksChange = (id: string, value: string) => {
    const num = parseInt(value);
    if (value !== '' && (isNaN(num) || num < 0 || num > maxMarksNum)) {
      setErrors((prev) => ({ ...prev, [id]: `Max ${maxMarksNum}` }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, marks: value } : s))
    );
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix validation errors before submitting.');
      return;
    }
    const incomplete = students.filter((s) => s.marks === '');
    if (incomplete.length > 0) {
      toast.error(`${incomplete.length} student(s) have no marks entered.`);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`${examType} marks uploaded for ${selectedSubject}. ${students.length} entries saved.`);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Configuration */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4">Configure Marks Entry</h3>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1 flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-500 transition-colors"
            >
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Exam Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value as ExamType)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-500 transition-colors"
            >
              <option value="IA1">IA-1 (Internal Assessment 1)</option>
              <option value="IA2">IA-2 (Internal Assessment 2)</option>
              <option value="SEMESTER">Semester Exam</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Max Marks</label>
            <input
              type="number"
              min="1"
              max="200"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
              className="w-24 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Grade Reference */}
      <div className="glass-panel rounded-[28px] p-4 shadow-ambient">
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Grade Boundaries</p>
        <div className="flex flex-wrap gap-2">
          {[
            { grade: 'A+', range: '≥90%' },
            { grade: 'A', range: '≥80%' },
            { grade: 'B+', range: '≥70%' },
            { grade: 'B', range: '≥60%' },
            { grade: 'C', range: '≥50%' },
            { grade: 'D', range: '≥40%' },
            { grade: 'F', range: '<40%' },
          ].map(({ grade, range }) => (
            <span key={grade} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${gradeColor(grade)}`}>
              {grade}: {range}
            </span>
          ))}
        </div>
      </div>

      {/* Marks Table */}
      <div className="glass-panel rounded-[28px] shadow-ambient overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200/60 dark:border-neutral-700/60 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 font-bold w-10">#</th>
                <th className="px-5 py-4 font-bold">Roll No</th>
                <th className="px-5 py-4 font-bold">Student Name</th>
                <th className="px-5 py-4 font-bold">Marks Obtained (/{maxMarksNum})</th>
                <th className="px-5 py-4 font-bold text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
              {students.map((student, index) => {
                const marksNum = parseInt(student.marks);
                const grade = student.marks !== '' && !isNaN(marksNum)
                  ? calculateGrade(marksNum, maxMarksNum)
                  : '—';
                const hasError = !!errors[student.id];

                return (
                  <tr key={student.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-5 py-3 text-neutral-400 font-semibold text-xs">{index + 1}</td>
                    <td className="px-5 py-3 font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">{student.rollNo}</td>
                    <td className="px-5 py-3 font-semibold text-neutral-800 dark:text-neutral-200">{student.name}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={maxMarksNum}
                          value={student.marks}
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          placeholder="—"
                          className={`w-20 bg-neutral-50 dark:bg-neutral-800 border rounded-lg px-3 py-1.5 text-sm font-semibold outline-none transition-colors ${
                            hasError
                              ? 'border-rose-400 focus:border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                              : 'border-neutral-200 dark:border-neutral-700 focus:border-violet-500'
                          }`}
                        />
                        {hasError && (
                          <span className="flex items-center gap-1 text-xs font-bold text-rose-500">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors[student.id]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${grade !== '—' ? gradeColor(grade) : 'text-neutral-300 dark:text-neutral-600'}`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/30">
          <span className="text-xs text-neutral-500 font-semibold">
            {students.filter((s) => s.marks !== '').length} / {students.length} entries filled
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md transition-all disabled:opacity-70"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Submit All Marks
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadMarksPage;
