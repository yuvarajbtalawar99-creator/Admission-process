import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  CheckCircle,
  FileDown
} from 'lucide-react';
import API from '../../services/api';

export const DepartmentReportPage: React.FC = () => {
  const [type, setType] = useState('annual');
  const [semester, setSemester] = useState('All');
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<any | null>(null);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await API.get(`/hod/reports/generate?type=${type}&semester=${semester}`);
      if (res.data.success) {
        setReport(res.data.data);
        toast.success('Report compiled successfully!');
      }
    } catch (err) {
      toast.error('Failed to generate department report.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    toast.info('Downloading department PDF report...');
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form panel */}
        <div className="lg:col-span-5 glass-panel rounded-[32px] p-6 shadow-ambient">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800/50 pb-3 mb-4">
            <FileText className="w-4.5 h-4.5 text-sky-500" />
            COMPILE DEPARTMENT REPORT
          </h3>
          <form onSubmit={handleGenerateReport} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">Report Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 px-3 text-xs outline-none cursor-pointer font-semibold"
              >
                <option value="annual">Annual Academic Progress Report</option>
                <option value="semester">Semester Appraisal Sheet</option>
                <option value="faculty">Faculty Workload & Performance Report</option>
                <option value="budget">Resource Utilisation & Budget Sheet</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">Scope / Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 px-3 text-xs outline-none cursor-pointer font-semibold"
              >
                <option value="All">All Semesters</option>
                <option value="1">Semester 1 Only</option>
                <option value="3">Semester 3 Only</option>
                <option value="5">Semester 5 Only</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {generating ? 'Generating Document...' : 'Compile Document'}
            </button>
          </form>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-7 glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col justify-between min-h-[250px]">
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm border-b border-neutral-100 dark:border-neutral-800/50 pb-3 mb-4">
              📥 COMPILED EXPORTS & DOWNLOADS
            </h3>
            {report ? (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-850/40 rounded-2xl border space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-extrabold text-neutral-850 dark:text-neutral-200 uppercase">{report.type} Report</h4>
                      <p className="text-[10px] text-neutral-450 font-semibold mt-0.5">Size: {report.fileSize}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
                <div className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1.5 border-t pt-2.5">
                  <Clock className="w-3.5 h-3.5" /> Compiled at: {new Date(report.generatedAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 flex flex-col items-center justify-center gap-2 text-neutral-400">
                <FileDown className="w-10 h-10 text-neutral-350" />
                <p className="text-xs font-bold">Select parameters on the left and click 'Compile Document' to download reports.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DepartmentReportPage;
