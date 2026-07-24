import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FileText, 
  Settings, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Bookmark, 
  Sparkles,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface StrategicGoal {
  id: string;
  title: string;
  description: string;
  targetYear: number;
  currentValue: number;
  targetValue: number;
  status: 'ON_TRACK' | 'DELAYED' | 'COMPLETED';
  category: string;
}

interface ComplianceCheck {
  id: string;
  title: string;
  description: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';
  remarks?: string;
  checkedAt: string;
}

export const ReportGenerationPage: React.FC = () => {
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [compliance, setCompliance] = useState<ComplianceCheck[]>([]);
  const [compliancePct, setCompliancePct] = useState<number>(0);
  
  const [loadingGoals, setLoadingGoals] = useState<boolean>(true);
  const [loadingComp, setLoadingComp] = useState<boolean>(true);

  // Report Form states
  const [reportType, setReportType] = useState<string>('annual');
  const [branch, setBranch] = useState<string>('all');
  const [semester, setSemester] = useState<string>('all');
  const [generating, setGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Strategic Goal review modal / editing state
  const [editingGoal, setEditingGoal] = useState<StrategicGoal | null>(null);
  const [newVal, setNewVal] = useState<number>(0);
  const [newStatus, setNewStatus] = useState<'ON_TRACK' | 'DELAYED' | 'COMPLETED'>('ON_TRACK');
  const [updatingGoal, setUpdatingGoal] = useState<boolean>(false);

  const fetchGoals = async () => {
    setLoadingGoals(true);
    try {
      const res = await API.get('/principal/strategic-goals');
      if (res.data.success) {
        setGoals(res.data.data);
      }
    } catch (err: any) {
      toast.error('Failed to load strategic goals.');
    } finally {
      setLoadingGoals(false);
    }
  };

  const fetchCompliance = async () => {
    setLoadingComp(true);
    try {
      const res = await API.get('/principal/compliance/status');
      if (res.data.success) {
        setCompliance(res.data.data.checklist);
        setCompliancePct(res.data.data.completionPercentage);
      }
    } catch (err: any) {
      toast.error('Failed to load compliance checklist.');
    } finally {
      setLoadingComp(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchCompliance();
  }, []);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenerationProgress(10);
    setGeneratedReport(null);

    const timer = setInterval(() => {
      setGenerationProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          triggerReportCompletion();
          return 100;
        }
        return p + 20;
      });
    }, 300);
  };

  const triggerReportCompletion = async () => {
    try {
      const res = await API.get('/principal/reports/generate', {
        params: { type: reportType, branch, semester }
      });
      if (res.data.success) {
        setGeneratedReport(res.data.data);
        toast.success('Report compiled successfully!');
      }
    } catch {
      toast.error('Failed to compile report.');
    } finally {
      setGenerating(false);
    }
  };

  const handleGoalEditClick = (g: StrategicGoal) => {
    setEditingGoal(g);
    setNewVal(g.currentValue);
    setNewStatus(g.status);
  };

  const handleGoalUpdateSubmit = async () => {
    if (!editingGoal) return;
    setUpdatingGoal(true);
    try {
      const res = await API.post(`/principal/strategic-goals/${editingGoal.id}/review`, {
        currentValue: newVal,
        status: newStatus
      });

      if (res.data.success) {
        toast.success('Strategic goal progress updated.');
        setEditingGoal(null);
        fetchGoals();
      }
    } catch (err: any) {
      toast.error('Failed to update strategic plan progress.');
    } finally {
      setUpdatingGoal(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      
      {/* Upper Grid - Report Composer & Compliance Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Report Center */}
        <div className="lg:col-span-6 glass-panel rounded-[32px] p-6 shadow-ambient">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-neutral-900 dark:text-white text-md">📊 JCER REPORTING CENTER</h3>
          </div>

          <form onSubmit={handleGenerateReport} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Report Template</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full py-2.5 px-3.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
              >
                <option value="annual">Annual Academic progress Report</option>
                <option value="financial">Financial Oversight & Audit ledger</option>
                <option value="placement">Placement Record & Recruitment Statistics</option>
                <option value="accreditation">NAAC Accreditation preparedness portfolio</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Department Scope</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full py-2.5 px-3.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
                >
                  <option value="all">All Departments</option>
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="ME">Mechanical Engineering (ME)</option>
                  <option value="CE">Civil Engineering (CE)</option>
                  <option value="CSE-AIML">Computer Science & Engineering (AIML) (CSE-AIML)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Semester Range</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full py-2.5 px-3.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
                >
                  <option value="all">Full Year (All Semesters)</option>
                  <option value="odd">Odd Semesters (1, 3, 5, 7)</option>
                  <option value="even">Even Semesters (2, 4, 6, 8)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-800 dark:hover:bg-neutral-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Compiling statistics...' : 'Compile & Generate Report'}
            </button>
          </form>

          {/* Progress bar */}
          {generating && (
            <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800/40 border rounded-2xl space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-neutral-500">
                <span>Assembling ledger datasets...</span>
                <span>{generationProgress}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${generationProgress}%` }} />
              </div>
            </div>
          )}

          {/* Download link */}
          {generatedReport && (
            <div className="mt-4 p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs">
                <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-neutral-800 dark:text-neutral-100 uppercase text-[10px] tracking-wide">
                    {reportType.toUpperCase()} REPORT READY
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Size: {generatedReport.fileSize} | Format: PDF</p>
                </div>
              </div>
              <a
                href={generatedReport.downloadUrl}
                onClick={(e) => {
                  e.preventDefault();
                  toast.success('Mock download triggered successfully!');
                }}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black shadow-sm flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          )}
        </div>

        {/* Regulatory Compliance Overview */}
        <div className="lg:col-span-6 glass-panel rounded-[32px] p-6 shadow-ambient flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-neutral-900 dark:text-white text-md">🛡️ COMPLIANCE & NAAC ACCREDITATION</h3>
              </div>
              <span className="text-xs bg-indigo-100 text-indigo-700 font-black px-2.5 py-0.5 rounded-lg">
                {compliancePct}% Compliant
              </span>
            </div>

            <div className="space-y-3.5 mt-4 overflow-y-auto max-h-[190px] pr-1">
              {loadingComp ? (
                <div className="text-xs text-neutral-400 text-center py-6">Loading checklists...</div>
              ) : (
                compliance.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-xs leading-normal">
                    <div>
                      <h4 className="font-extrabold text-neutral-800 dark:text-neutral-200">{item.title}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{item.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black flex-shrink-0 uppercase ${
                      item.status === 'COMPLIANT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-405' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-405'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t flex justify-between items-center text-xs mt-4">
            <span className="text-neutral-400 font-semibold">UGC / AICTE Accreditation preparedness</span>
            <button 
              onClick={() => toast.success('Compliance audit schedule dispatched.')}
              className="text-amber-600 font-black hover:underline flex items-center gap-0.5"
            >
              Auditor checklist <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Strategic Goals Panel */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex items-center gap-2 mb-6">
          <Bookmark className="w-5 h-5 text-indigo-500" />
          <h3 className="font-extrabold text-neutral-900 dark:text-white text-md">🎯 STRATEGIC GOALS & 3-YEAR PLANNING</h3>
        </div>

        {loadingGoals ? (
          <div className="text-xs text-neutral-400 text-center py-10">Loading strategic plan milestones...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progressPct = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
              return (
                <div key={goal.id} className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border rounded-2xl flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">
                        {goal.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                        goal.status === 'ON_TRACK' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-405' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-450'
                      }`}>
                        {goal.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-100 mt-2">{goal.title}</h4>
                    <p className="text-[10px] text-neutral-400 mt-1 font-semibold leading-normal">{goal.description}</p>
                    
                    {/* Progress slider bar */}
                    <div className="space-y-1.5 mt-4">
                      <div className="flex justify-between text-[9px] font-black text-neutral-400">
                        <span>Current: {goal.currentValue} / Target: {goal.targetValue}</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t pt-3 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-neutral-400">Target Year: {goal.targetYear}</span>
                    <button 
                      onClick={() => handleGoalEditClick(goal)}
                      className="text-[10px] font-black text-amber-600 hover:underline flex items-center gap-0.5"
                    >
                      Update progress <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Update Modal Overlay */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-[28px] max-w-sm w-full p-6 shadow-2xl animate-fade-in space-y-5">
            <div className="flex items-center gap-2 border-b pb-3">
              <Bookmark className="w-4 h-4 text-indigo-500" />
              <h4 className="font-extrabold text-neutral-900 dark:text-white text-xs uppercase truncate">
                Update: {editingGoal.title}
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">Current Value</label>
                <input
                  type="number"
                  value={newVal}
                  onChange={(e) => setNewVal(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full py-2.5 px-3 bg-neutral-50 dark:bg-neutral-800 border rounded-xl focus:outline-none"
                >
                  <option value="ON_TRACK">ON TRACK</option>
                  <option value="DELAYED">DELAYED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleGoalUpdateSubmit}
                disabled={updatingGoal}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white rounded-xl text-xs font-black shadow-sm"
              >
                {updatingGoal ? 'Saving...' : 'Save progress'}
              </button>
              <button
                onClick={() => setEditingGoal(null)}
                className="px-4 py-2.5 border rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportGenerationPage;
