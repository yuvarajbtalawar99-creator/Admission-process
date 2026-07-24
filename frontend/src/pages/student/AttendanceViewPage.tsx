import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import StudentService from '../../services/student.service';
import LoadingContainer from '../../components/common/LoadingContainer';
import Skeleton, { TableSkeleton } from '../../components/common/Skeleton';
import Toast from '../../components/common/Toast';

interface AttendanceSummary {
  overallPercentage: string;
  status: 'GOOD' | 'WARNING';
  subjects: Array<{
    subjectId: string;
    subjectName: string;
    subjectCode: string;
    totalClasses: number;
    classesPresent: number;
    classesAbsent: number;
    classesLeave: number;
    percentage: string;
  }>;
}

interface AttendanceHistoryItem {
  date: string;
  subject: string;
  subjectCode: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
  teacher: string;
  remarks: string;
}

const monthsList = [
  { name: 'All Months', value: 'ALL' },
  { name: 'January', value: '0' },
  { name: 'February', value: '1' },
  { name: 'March', value: '2' },
  { name: 'April', value: '3' },
  { name: 'May', value: '4' },
  { name: 'June', value: '5' },
  { name: 'July', value: '6' },
  { name: 'August', value: '7' },
  { name: 'September', value: '8' },
  { name: 'October', value: '9' },
  { name: 'November', value: '10' },
  { name: 'December', value: '11' },
];

export const AttendanceViewPage: React.FC = () => {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [history, setHistory] = useState<AttendanceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter States
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [searchText, setSearchText] = useState<string>('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await StudentService.getOverallAttendance();
      setSummary(data.attendance);
      setHistory(data.attendanceHistory);
      
      if (data.attendance?.subjects?.length > 0) {
        setSelectedSubject(data.attendance.subjects[0].subjectCode);
      }
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.response?.data?.error || 'Failed to fetch attendance records.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject, selectedMonth, searchText]);

  const getSubjectStatus = (pctStr: string) => {
    const pct = parseFloat(pctStr);
    if (pct === 100) return { text: 'Perfect', icon: '✅', colorClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400' };
    if (pct >= 90) return { text: 'Excellent', icon: '✅', colorClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400' };
    if (pct >= 76) return { text: 'Good', icon: '✅', colorClass: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400' };
    return { text: 'Critical', icon: '⚠️', colorClass: 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-450' };
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === 'PRESENT') return 'bg-[#E8F5E9] text-[#16A34A] dark:bg-emerald-950/30 dark:text-emerald-400';
    if (status === 'LEAVE') return 'bg-[#E8E5FF] text-[#4F46E5] dark:bg-indigo-950/30 dark:text-indigo-400';
    return 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-450';
  };

  const formatRecordDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatRemark = (remark: string, status: string) => {
    if (!remark) return '';
    if (remark === 'Attended class regularly') return '';
    if (remark === 'Applied for medical leave') return 'Medical';
    if (remark === 'Absent without prior notice') return '';
    return remark;
  };

  const filteredHistory = history.filter((record) => {
    if (selectedSubject !== 'ALL' && record.subjectCode !== selectedSubject) {
      return false;
    }
    if (selectedMonth !== 'ALL') {
      const recordDate = new Date(record.date);
      if (recordDate.getMonth().toString() !== selectedMonth) {
        return false;
      }
    }
    if (searchText) {
      const query = searchText.toLowerCase();
      const matchesSearch =
        record.remarks?.toLowerCase().includes(query) ||
        record.teacher?.toLowerCase().includes(query) ||
        record.subject?.toLowerCase().includes(query) ||
        record.status?.toLowerCase().includes(query) ||
        formatRecordDate(record.date).toLowerCase().includes(query);
      if (!matchesSearch) {
        return false;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const headers = ['Date', 'Subject', 'Status', 'Remarks', 'Teacher'];
    const rows = filteredHistory.map((record) => [
      new Date(record.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
      `${record.subject} (${record.subjectCode})`,
      record.status,
      record.remarks || '',
      record.teacher,
    ]);
    const csvString = [headers.join(','), ...rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage({
      type: 'success',
      message: 'Exported attendance records successfully.',
    });
  };

  const AttendanceSkeleton: React.FC = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-panel rounded-[24px] p-4 shadow-ambient space-y-2">
              <Skeleton width="40%" height="8px" />
              <Skeleton width="80%" height="12px" />
              <Skeleton width="100%" height="24px" className="mt-2" />
            </div>
          ))}
        </div>
        <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
          <TableSkeleton rows={5} cols={5} />
        </div>
      </div>
    );
  };

  const selectedSubName = summary?.subjects.find((s) => s.subjectCode === selectedSubject)?.subjectName || 'All Subjects';

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}

      <LoadingContainer
        isLoading={loading}
        skeleton={<AttendanceSkeleton />}
        hintText="Fetching attendance records..."
      >
        <div className="space-y-6">
          {summary && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-panel rounded-[32px] p-6 md:p-8 shadow-ambient gap-4">
              <div>
                <h2 className="text-[22px] font-bold text-neutral-900 dark:text-white tracking-tight">Overall Attendance</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">View academic progress & logs</p>
                  <span className="text-neutral-300 dark:text-neutral-700 select-none text-xs">•</span>
                  <span className={`text-xs font-bold ${
                    parseFloat(summary.overallPercentage) >= 75 ? 'text-[#16A34A] dark:text-emerald-400' : 'text-rose-655 dark:text-rose-400'
                  }`}>
                    {parseFloat(summary.overallPercentage) >= 75 ? 'Good (≥75%)' : 'Warning (<75%)'}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-[36px] md:text-[44px] font-extrabold text-neutral-900 dark:text-white tracking-tight leading-none">
                  {parseFloat(summary.overallPercentage).toFixed(0)}%
                </span>
              </div>
            </div>
          )}

          {/* FILTERS PANEL */}
          {summary && (
            <div className="glass-panel rounded-[24px] p-4 shadow-ambient flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                <span>FILTERS:</span>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Subject Selector (Fixed text & background visibility) */}
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-xs font-bold bg-neutral-950 dark:bg-neutral-900 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 text-white cursor-pointer min-w-[160px]"
                >
                  <option value="ALL" className="text-neutral-900 bg-white dark:text-white dark:bg-neutral-800">All Subjects</option>
                  {summary.subjects.map((sub) => (
                    <option key={sub.subjectId} value={sub.subjectCode} className="text-neutral-900 bg-white dark:text-white dark:bg-neutral-800">
                      {sub.subjectName}
                    </option>
                  ))}
                </select>

                {/* Month Selector (Fixed text & background visibility) */}
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-xs font-bold bg-neutral-950 dark:bg-neutral-900 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 text-black cursor-pointer min-w-[120px]"
                >
                  {monthsList.map((m) => (
                    <option key={m.value} value={m.value} className="text-neutral-900 bg-white dark:text-white dark:bg-neutral-800">
                      {m.name}
                    </option>
                  ))}
                </select>

                <div className="relative w-full sm:w-auto flex-1 sm:flex-initial min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full px-3 py-2 pl-8 text-xs font-semibold bg-neutral-250 dark:bg-neutral-200 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 text-black placeholder:text-neutral-500"
                  />
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-900 dark:text-neutral-400" />
                </div>

                <button
                  onClick={handleExportCSV}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          )}

          {/* SUBJECT-WISE BREAKDOWN */}
          {summary && (
            <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight pl-2">
                Subject-wise Breakdown
              </h3>
              <div className="overflow-hidden rounded-[20px] glass-table-container shadow-sm border border-neutral-100 dark:border-neutral-800/40">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4 text-center">Classes</th>
                        <th className="px-6 py-4 text-center">Present</th>
                        <th className="px-6 py-4 text-center">%</th>
                        <th className="px-6 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                      {summary.subjects.map((item) => {
                        const pct = parseFloat(item.percentage);
                        const status = getSubjectStatus(item.percentage);
                        const isSelected = selectedSubject === item.subjectCode;
                        return (
                          <tr
                            key={item.subjectId}
                            onClick={() => setSelectedSubject(item.subjectCode)}
                            className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 cursor-pointer transition-colors duration-150 ${
                              isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                            }`}
                          >
                            <td className="px-6 py-4">
                              <span className="font-bold text-neutral-900 dark:text-white">
                                {item.subjectName}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-neutral-900 dark:text-white">
                              {item.totalClasses}
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-neutral-900 dark:text-white">
                              {item.classesPresent}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-neutral-900 dark:text-white">
                              {pct.toFixed(0)}%
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold ${status.colorClass}`}>
                                {status.icon} {status.text}
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
          )}

          {/* CHRONOLOGICAL ATTENDANCE DETAILS */}
          <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight pl-2">
              Attendance Details - {selectedSubName}
            </h3>
            <div className="overflow-hidden rounded-[20px] glass-table-container shadow-sm border border-neutral-100 dark:border-neutral-800/40">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      {selectedSubject === 'ALL' && <th className="px-6 py-4">Subject</th>}
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                    {paginatedHistory.length > 0 ? (
                      paginatedHistory.map((record, index) => (
                        <tr
                          key={index}
                          className="hover:bg-neutral-50/50 dark:hover:bg-neutral-850/40 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">
                            {formatRecordDate(record.date)}
                          </td>
                          {selectedSubject === 'ALL' && (
                            <td className="px-6 py-4 text-neutral-900 dark:text-white font-semibold">
                              {record.subject}
                            </td>
                          )}
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${getStatusBadgeClass(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400 font-medium">
                            {formatRemark(record.remarks, record.status)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={selectedSubject === 'ALL' ? 4 : 3} className="px-6 py-12 text-center text-neutral-400 font-medium">
                          No attendance logs match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION PANEL */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-xl border border-neutral-200/50 dark:border-neutral-800/40 transition-all ${
                    currentPage === 1
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-[1.05]'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-350" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                      currentPage === pageNumber
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm scale-[1.05]'
                        : 'border-neutral-200/50 dark:border-neutral-800/40 text-neutral-600 dark:text-neutral-350 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-xl border border-neutral-200/50 dark:border-neutral-800/40 transition-all ${
                    currentPage === totalPages
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-[1.05]'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-350" />
                </button>
              </div>
            )}
          </div>
        </div>
      </LoadingContainer>
    </div>
  );
};

export default AttendanceViewPage;