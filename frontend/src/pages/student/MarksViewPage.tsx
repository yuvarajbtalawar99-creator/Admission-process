import React, { useEffect, useState } from 'react';
import StudentService from '../../services/student.service';
import MarksChart from '../../components/charts/MarksChart';
import LoadingContainer from '../../components/common/LoadingContainer';
import Skeleton, { TableSkeleton, ChartSkeleton } from '../../components/common/Skeleton';
import Toast from '../../components/common/Toast';
import { jsPDF } from 'jspdf';
import { Download, ChevronDown } from 'lucide-react';

interface ExamResult {
  examType: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
}

interface SubjectMarkItem {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  credits: number;
  examResults: ExamResult[];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  gradePoints: number;
  status: 'PASS' | 'FAIL';
}

interface AcademicSummary {
  semester: number;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  failedSubjects: number;
  passedSubjects: number;
}

export const MarksViewPage: React.FC = () => {
  const [marks, setMarks] = useState<SubjectMarkItem[]>([]);
  const [summary, setSummary] = useState<AcademicSummary | null>(null);
  const [selectedSemester, setSelectedSemester] = useState(3);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchMarks(selectedSemester);
  }, [selectedSemester]);

  const fetchMarks = async (sem: number) => {
    try {
      setLoading(true);
      const data = await StudentService.getOverallMarks(sem);
      setMarks(data.marks);
      setSummary(data.summary);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.response?.data?.error || 'Failed to load examination marks.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadScorecard = () => {
    if (!summary || marks.length === 0) return;
    
    try {
      const doc = new jsPDF();
      
      // Header Banner
      doc.setFillColor(26, 26, 26);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('Helvetica', 'bold');
      doc.text('VYONLABS COLLEGE OF ENGINEERING', 105, 18, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.text('OFFICIAL ACADEMIC TRANSCRIPT & SCORECARD', 105, 28, { align: 'center' });

      // Student info block
      doc.setTextColor(26, 26, 26);
      doc.setFontSize(11);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Semester: ${selectedSemester}`, 20, 55);
      doc.text(`SGPA: ${summary.sgpa.toFixed(2)}`, 20, 62);
      doc.text(`CGPA: ${summary.cgpa.toFixed(2)}`, 20, 69);
      
      doc.text(`Total Credits: ${summary.totalCredits}`, 130, 55);
      doc.text(`Credits Earned: ${summary.earnedCredits}`, 130, 62);
      doc.text(`Result Status: ${summary.failedSubjects === 0 ? 'ALL CLEAR / PASS' : 'FAIL'}`, 130, 69);

      // Horizontal separator line
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 75, 190, 75);

      // Table Header
      doc.setFillColor(243, 244, 246);
      doc.rect(20, 80, 170, 10, 'F');
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(9);
      doc.text('SUBJECT', 22, 86.5);
      doc.text('CREDITS', 100, 86.5);
      doc.text('TOTAL', 125, 86.5);
      doc.text('GRADE', 150, 86.5);
      doc.text('STATUS', 170, 86.5);

      // Table rows
      let y = 96;
      marks.forEach((item) => {
        doc.setTextColor(26, 26, 26);
        doc.setFont('Helvetica', 'normal');
        
        const text = `${item.subjectName} (${item.subjectCode})`;
        doc.text(text.substring(0, 42), 22, y);
        doc.text(String(item.credits), 105, y);
        doc.text(`${item.totalMarks}/${item.maxMarks}`, 125, y);
        doc.text(item.grade, 154, y);
        doc.text(item.status, 172, y);
        
        y += 10;
      });

      // Signature block
      doc.setDrawColor(226, 232, 240);
      doc.line(20, y + 20, 190, y + 20);
      
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(8);
      doc.text('Generated electronically via VyonLabs ERP system portal.', 20, y + 30);
      doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 130, y + 30);

      doc.save(`Scorecard_Semester_${selectedSemester}.pdf`);
      setToastMessage({
        type: 'success',
        message: 'Academic Scorecard PDF generated and downloaded!',
      });
    } catch (err) {
      setToastMessage({
        type: 'error',
        message: 'Could not generate scorecard PDF.',
      });
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'text-[#16A34A] bg-[#E8F5E9] dark:bg-emerald-950/30 dark:text-emerald-400';
    if (grade.startsWith('B')) return 'text-[#4F46E5] bg-[#E8E5FF] dark:bg-indigo-950/30 dark:text-indigo-400';
    if (grade.startsWith('C') || grade.startsWith('D')) return 'text-[#0284C7] bg-[#E1F5FE] dark:bg-sky-950/30 dark:text-sky-400';
    return 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-450';
  };

  const MarksSkeleton: React.FC = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-panel rounded-[28px] p-5 shadow-ambient space-y-2">
              <Skeleton width="60%" height="12px" />
              <Skeleton width="40%" height="24px" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ChartSkeleton />
          </div>
          <div className="lg:col-span-2 glass-panel rounded-[32px] p-6 shadow-ambient">
            <TableSkeleton rows={5} cols={5} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header Selector Grid */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between glass-panel rounded-[32px] p-6 shadow-ambient">
        <div>
          <h2 className="text-[22px] font-bold text-neutral-900 dark:text-white tracking-tight">Grades & Transcript</h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Verify results and download scorecard</p>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(parseInt(e.target.value, 10))}
              className="bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 text-neutral-800 dark:text-neutral-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
              <option value={3}>Semester 3</option>
              <option value={4}>Semester 4</option>
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          <button
            onClick={handleDownloadScorecard}
            className="btn-primary-custom font-bold px-5 py-2.5 rounded-xl text-xs transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Scorecard</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Block Wrapped Explicitly */}
      <LoadingContainer
        isLoading={loading}
        skeleton={<MarksSkeleton />}
        hintText="Fetching examination scorecard..."
      >
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="glass-panel rounded-[28px] p-5 shadow-ambient">
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Semester SGPA</p>
              <p className="text-2xl font-extrabold text-[#4F46E5] tracking-tight mt-1">{summary.sgpa.toFixed(2)}</p>
            </div>
            <div className="glass-panel rounded-[28px] p-5 shadow-ambient">
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Cumulative CGPA</p>
              <p className="text-2xl font-extrabold text-[#16A34A] tracking-tight mt-1">{summary.cgpa.toFixed(2)}</p>
            </div>
            <div className="glass-panel rounded-[28px] p-5 shadow-ambient">
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Credits Earned</p>
              <p className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight mt-1">
                {summary.earnedCredits} <span className="text-xs text-neutral-400 font-medium">/ {summary.totalCredits}</span>
              </p>
            </div>
            <div className="glass-panel rounded-[28px] p-5 shadow-ambient">
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Passed Subjects</p>
              <p className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight mt-1">
                {summary.passedSubjects} <span className="text-xs text-neutral-400 font-medium">/ {summary.passedSubjects + summary.failedSubjects}</span>
              </p>
            </div>
          </div>
        )}
      </LoadingContainer>

      {/* Graph and Table Grid (Now correctly separated as a sibling element) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparison Chart Container */}
        <div className="lg:col-span-1 glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mb-2">Subject Percentages</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium mb-6">
              Visual bar chart comparison of final performance percentages across subjects.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {marks.length > 0 && <MarksChart data={marks} />}
          </div>
        </div>

        {/* Breakdown Results Table */}
        <div className="lg:col-span-2 glass-table-container rounded-[32px] p-6 shadow-ambient">
          <h3 className="text-lg font-bold tracking-tight mb-6">Subject Results Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-4 text-left">Subject</th>
                  <th className="px-4 py-4 text-center">IA1 (20)</th>
                  <th className="px-4 py-4 text-center">IA2 (20)</th>
                  <th className="px-4 py-4 text-center">Semester (100)</th>
                  <th className="px-4 py-4 text-center">Letter Grade</th>
                  <th className="px-4 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                {marks.map((item) => {
                  const ia1 = item.examResults.find((r) => r.examType === 'IA1')?.marksObtained ?? '-';
                  const ia2 = item.examResults.find((r) => r.examType === 'IA2')?.marksObtained ?? '-';
                  const semResult = item.examResults.find((r) => r.examType === 'SEMESTER')?.marksObtained ?? '-';

                  return (
                    <tr key={item.subjectId} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-850/30 transition-all duration-150">
                      <td className="px-4 py-4 text-left">
                        <p className="font-bold text-neutral-900 dark:text-white">{item.subjectName}</p>
                        <p className="text-neutral-400 text-xs font-semibold mt-0.5">{item.subjectCode} • {item.credits} Credits</p>
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-neutral-600 dark:text-neutral-300">{ia1}</td>
                      <td className="px-4 py-4 text-center font-semibold text-neutral-600 dark:text-neutral-300">{ia2}</td>
                      <td className="px-4 py-4 text-center font-bold text-neutral-900 dark:text-white">{semResult}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${getGradeColor(item.grade)}`}>
                          {item.grade}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`font-bold text-sm ${item.status === 'PASS' ? 'text-[#16A34A]' : 'text-rose-500'}`}>
                          {item.status}
                        </span>
                      </td>
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

export default MarksViewPage;