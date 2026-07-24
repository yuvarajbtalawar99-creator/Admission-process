import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Check, 
  X, 
  AlertCircle, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  ClipboardList,
  DollarSign,
  UserCheck,
  BookOpen,
  ArrowRight,
  User,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  admissionType: string;
  branchId: string;
  applicationStatus: string;
  submittedAt: string;
  documentsVerified?: boolean;
  feesVerified?: boolean;
  eligibilityVerified?: boolean;
  verificationRemarks?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string;
  };
  branch: {
    name: string;
    code: string;
  };
  studentpersonaldetails?: {
    gender: string;
    dateOfBirth: string;
    religion: string;
    caste: string;
    category: string;
    phone: string;
    email: string;
    nationality: string;
  };
  studentparentdetails?: {
    fatherName: string;
    fatherPhone: string;
    fatherEmail: string;
    fatherAnnualIncome: number;
    motherName: string;
  };
  studentaddress?: {
    currentAddressLine1: string;
    currentCity: string;
    currentState: string;
    currentPincode: string;
  };
  studentacademicdetails?: {
    tenthSchool: string;
    tenthBoard: string;
    tenthPercentage: number;
    twelfthSchool: string;
    twelfthBoard: string;
    twelfthPercentage: number;
    twelfthStream: string;
    cetRank?: number;
    cetScore?: number;
    cetYear?: number;
  };
  studentdocuments?: {
    photoUrl?: string;
    tenthMarksheetUrl?: string;
    twelfthMarksheetUrl?: string;
    aadhaarUrl?: string;
  };
}

interface BudgetReq {
  id: string;
  title: string;
  amount: number;
  department: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DEFERRED';
  justification: string;
  hodRecommendation: string;
  financeReview: string;
  deadline: string;
  remarks?: string;
}

export const ApprovalQueuePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'admissions';

  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<BudgetReq[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [curriculums, setCurriculums] = useState<any[]>([]);

  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionApplication | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<BudgetReq | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<any | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [remarks, setRemarks] = useState<string>('');
  const [rejectReasonCode, setRejectReasonCode] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  
  // Selection for bulk actions
  const [selectedAdmissionIds, setSelectedAdmissionIds] = useState<string[]>([]);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
    setSelectedAdmission(null);
    setSelectedBudget(null);
    setSelectedLeave(null);
    setSelectedCurriculum(null);
    setRemarks('');
    setRejectReasonCode('');
    setSelectedAdmissionIds([]);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (currentTab === 'admissions') {
        const res = await API.get('/principal/admissions/pending');
        if (res.data.success) {
          setAdmissions(res.data.data.applications);
          setRejectionReasons(res.data.data.rejectionReasons);
          if (res.data.data.applications.length > 0) {
            setSelectedAdmission(res.data.data.applications[0]);
          }
        }
      } else if (currentTab === 'budgets') {
        const res = await API.get('/principal/budget/pending');
        if (res.data.success) {
          const pendingBudgets = res.data.data.filter((b: BudgetReq) => b.status === 'PENDING');
          setBudgets(pendingBudgets);
          if (pendingBudgets.length > 0) {
            setSelectedBudget(pendingBudgets[0]);
          }
        }
      } else if (currentTab === 'staff') {
        const res = await API.get('/principal/leaves/pending');
        if (res.data.success) {
          setLeaves(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedLeave(res.data.data[0]);
          }
        }
      } else if (currentTab === 'curriculum') {
        const res = await API.get('/principal/curriculum/pending');
        if (res.data.success) {
          setCurriculums(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedCurriculum(res.data.data[0]);
          }
        }
      }
    } catch (err: any) {
      toast.error('Error fetching approval queue data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTab]);

  const handleAdmissionDecision = async (decision: 'APPROVED' | 'REJECTED' | 'WAITLISTED' | 'CONDITIONAL') => {
    if (!selectedAdmission) return;
    if (decision === 'REJECTED' && !rejectReasonCode) {
      toast.warning('Please select a rejection reason code.');
      return;
    }

    try {
      const res = await API.put(`/principal/admissions/${selectedAdmission.id}/decide`, {
        decision,
        remarks,
        rejectReasonCode: decision === 'REJECTED' ? rejectReasonCode : undefined,
      });

      if (res.data.success) {
        toast.success(`Application has been ${decision.toLowerCase()} successfully.`);
        if (res.data.data.enrollmentNumber) {
          toast.info(`USN Generated: ${res.data.data.enrollmentNumber}`);
        }
        setRemarks('');
        setRejectReasonCode('');
        loadData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit decision.');
    }
  };

  const handleBulkApproveAdmissions = async () => {
    if (selectedAdmissionIds.length === 0) {
      toast.warning('No applications selected.');
      return;
    }

    try {
      const res = await API.put('/principal/admissions/bulk/approve', {
        ids: selectedAdmissionIds,
      });

      if (res.data.success) {
        toast.success(`Processed bulk approvals.`);
        setSelectedAdmissionIds([]);
        loadData();
      }
    } catch (err: any) {
      toast.error('Bulk approvals failed.');
    }
  };

  const handleBudgetDecision = async (status: 'APPROVED' | 'REJECTED' | 'DEFERRED') => {
    if (!selectedBudget) return;
    try {
      const res = await API.put(`/principal/budget/${selectedBudget.id}/decide`, {
        status,
        remarks,
      });

      if (res.data.success) {
        toast.success(`Budget request ${status.toLowerCase()} successfully.`);
        setRemarks('');
        loadData();
      }
    } catch (err: any) {
      toast.error('Failed to submit decision.');
    }
  };

  const handleLeaveDecision = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedLeave) return;
    try {
      const res = await API.put(`/principal/leaves/${selectedLeave.id}/decide`, {
        status,
        remarks,
      });

      if (res.data.success) {
        toast.success(`Leave request ${status.toLowerCase()} successfully.`);
        setRemarks('');
        loadData();
      }
    } catch (err: any) {
      toast.error('Failed to submit leave decision.');
    }
  };

  const handleCurriculumDecision = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedCurriculum) return;
    try {
      const res = await API.put(`/principal/curriculum/${selectedCurriculum.id}/decide`, {
        status,
        remarks,
      });

      if (res.data.success) {
        toast.success(`Curriculum proposal ${status.toLowerCase()} successfully.`);
        setRemarks('');
        loadData();
      }
    } catch (err: any) {
      toast.error('Failed to submit curriculum decision.');
    }
  };

  const filteredAdmissions = admissions.filter(app => {
    const fullName = `${app.user.firstName} ${app.user.lastName}`.toLowerCase();
    const searchMatch = fullName.includes(search.toLowerCase()) || app.applicationNumber.toLowerCase().includes(search.toLowerCase());
    const deptMatch = deptFilter === 'All' || app.branch.code === deptFilter;
    return searchMatch && deptMatch;
  });

  const toggleSelectAdmission = (id: string) => {
    if (selectedAdmissionIds.includes(id)) {
      setSelectedAdmissionIds(selectedAdmissionIds.filter(x => x !== id));
    } else {
      setSelectedAdmissionIds([...selectedAdmissionIds, id]);
    }
  };

  const selectAllAdmissions = () => {
    if (selectedAdmissionIds.length === filteredAdmissions.length) {
      setSelectedAdmissionIds([]);
    } else {
      setSelectedAdmissionIds(filteredAdmissions.map(x => x.id));
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Tab Selectors */}
      <div className="flex bg-neutral-100 dark:bg-neutral-800/80 p-1.5 rounded-[22px] max-w-xl shadow-inner border border-neutral-200/40 dark:border-neutral-700/30">
        {[
          { id: 'admissions', label: 'Admissions approvals', icon: UserCheck },
          { id: 'budgets', label: 'Budget Requisitions', icon: DollarSign },
          { id: 'staff', label: 'Staff requests', icon: Briefcase },
          { id: 'curriculum', label: 'Curriculum & Appeals', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-[16px] text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                isActive 
                  ? 'bg-white dark:bg-neutral-900 shadow-sm text-amber-600 dark:text-amber-500 scale-[1.02]' 
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="glass-panel rounded-[28px] p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="size-10 rounded-full border-4 border-amber-100 border-t-amber-600 animate-spin" />
          <p className="text-sm font-bold text-neutral-500">Loading queue items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main List Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Search & Filter (Admissions Only) */}
            {currentTab === 'admissions' && (
              <div className="glass-panel rounded-3xl p-4 shadow-sm space-y-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by name, application#..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="flex-1 py-1.5 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
                  >
                    <option value="All">All Departments</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                    <option value="CSE-AIML">CSE-AIML</option>
                  </select>
                  <button 
                    onClick={selectAllAdmissions}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold"
                  >
                    {selectedAdmissionIds.length === filteredAdmissions.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>
            )}

            {/* List Panels */}
            {currentTab === 'admissions' && (
              <div className="space-y-3">
                {filteredAdmissions.length === 0 ? (
                  <div className="glass-panel rounded-[28px] p-8 text-center text-neutral-400 text-xs font-bold">
                    No pending admissions applications found.
                  </div>
                ) : (
                  filteredAdmissions.map((app) => (
                    <div 
                      key={app.id}
                      onClick={() => setSelectedAdmission(app)}
                      className={`glass-panel rounded-[24px] p-4 cursor-pointer hover:border-amber-300/60 dark:hover:border-amber-800/40 transition-all flex items-start gap-3 border ${
                        selectedAdmission?.id === app.id 
                          ? 'border-amber-500 bg-amber-50/10 dark:bg-amber-900/5' 
                          : 'border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAdmissionIds.includes(app.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleSelectAdmission(app.id)}
                        className="mt-1.5 accent-amber-600 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-neutral-400 font-bold">{app.applicationNumber}</span>
                          <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            {app.branch.code}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-neutral-800 dark:text-neutral-100 mt-1">
                          {app.user.firstName} {app.user.lastName}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-neutral-400 font-medium">Type: {app.admissionType}</span>
                          <span className="text-[10px] text-neutral-400 font-medium">Rank: {app.studentacademicdetails?.cetRank || 'N/A'}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 self-center" />
                    </div>
                  ))
                )}

                {selectedAdmissionIds.length > 0 && (
                  <button
                    onClick={handleBulkApproveAdmissions}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Bulk Approve Selected ({selectedAdmissionIds.length})
                  </button>
                )}
              </div>
            )}

            {currentTab === 'budgets' && (
              <div className="space-y-3">
                {budgets.length === 0 ? (
                  <div className="glass-panel rounded-[28px] p-8 text-center text-neutral-400 text-xs font-bold">
                    No budget requests found.
                  </div>
                ) : (
                  budgets.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBudget(b)}
                      className={`glass-panel rounded-[24px] p-4 cursor-pointer hover:border-amber-300/60 dark:hover:border-amber-800/40 transition-all flex items-start justify-between border ${
                        selectedBudget?.id === b.id 
                          ? 'border-amber-500 bg-amber-50/10 dark:bg-amber-900/5' 
                          : 'border-transparent'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                            b.priority === 'HIGH' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-350'
                          }`}>
                            {b.priority} PRIORITY
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-100 mt-2">{b.title}</h4>
                        <p className="text-[10px] text-neutral-400 mt-1 font-semibold">{b.department}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-neutral-900 dark:text-white">
                          ₹{parseFloat(b.amount.toString()).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {currentTab === 'staff' && (
              <div className="space-y-3">
                {leaves.length === 0 ? (
                  <div className="glass-panel rounded-[28px] p-8 text-center text-neutral-400 text-xs font-bold">
                    No leave requests awaiting Principal approval.
                  </div>
                ) : (
                  leaves.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => setSelectedLeave(l)}
                      className={`glass-panel rounded-[24px] p-4 cursor-pointer hover:border-amber-300/60 dark:hover:border-amber-800/40 transition-all flex items-start justify-between border ${
                        selectedLeave?.id === l.id 
                          ? 'border-amber-500 bg-amber-50/10 dark:bg-amber-900/5' 
                          : 'border-transparent'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[8px] font-black bg-violet-100 text-violet-700">
                            {l.type} LEAVE
                          </span>
                          <span className="px-2 py-0.5 rounded text-[8px] font-black bg-amber-100 text-amber-700">
                            {l.workflowStage.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-neutral-850 dark:text-neutral-100 mt-2">
                          {l.user?.firstName} {l.user?.lastName}
                        </h4>
                        <p className="text-[10px] text-neutral-400 mt-1 font-semibold">Dept: {l.department?.code}</p>
                      </div>
                      <div className="text-right text-[10px] text-neutral-405 font-bold">
                        {l.startDate}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {currentTab === 'curriculum' && (
              <div className="space-y-3">
                {curriculums.length === 0 ? (
                  <div className="glass-panel rounded-[28px] p-8 text-center text-neutral-400 text-xs font-bold">
                    No curriculum proposals awaiting decision.
                  </div>
                ) : (
                  curriculums.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCurriculum(c)}
                      className={`glass-panel rounded-[24px] p-4 cursor-pointer hover:border-amber-300/60 dark:hover:border-amber-800/40 transition-all flex items-start justify-between border ${
                        selectedCurriculum?.id === c.id 
                          ? 'border-amber-500 bg-amber-50/10 dark:bg-amber-900/5' 
                          : 'border-transparent'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[8px] font-black bg-indigo-100 text-indigo-700">
                            {c.type}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-neutral-850 dark:text-neutral-100 mt-2">
                          {c.courseName}
                        </h4>
                        <p className="text-[10px] text-neutral-400 mt-1 font-semibold">{c.courseCode} | Credits: {c.credits}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* Detailed Decision / Review Panel */}
          <div className="lg:col-span-7">
            {currentTab === 'admissions' && selectedAdmission && (
              <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-6 animate-scale-up">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-150/40 pb-5">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={selectedAdmission.user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop'}
                      alt="Student"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="text-md font-black text-neutral-900 dark:text-white">
                        {selectedAdmission.user.firstName} {selectedAdmission.user.lastName}
                      </h3>
                      <p className="text-[10px] font-bold text-neutral-400 flex items-center gap-1">
                        Application: {selectedAdmission.applicationNumber} | Type: {selectedAdmission.admissionType}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-black px-3 py-1 rounded-lg">
                    {selectedAdmission.applicationStatus}
                  </span>
                </div>

                {/* Admin Audit notes display */}
                <div className="bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40 rounded-3xl p-4.5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-800 dark:text-indigo-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Admin Verification Audit
                    </span>
                    <span className="text-[9px] font-black uppercase text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                      Passed Verification
                    </span>
                  </div>

                  {/* Audit Checklist status */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
                    <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded-xl border border-neutral-150/30">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-neutral-500">Docs:</span>
                      <span className="text-neutral-800 dark:text-neutral-200">Verified</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded-xl border border-neutral-150/30">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-neutral-500">Fees:</span>
                      <span className="text-neutral-800 dark:text-neutral-200">Verified</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded-xl border border-neutral-150/30">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-neutral-500">Eligibility:</span>
                      <span className="text-neutral-800 dark:text-neutral-200">Verified</span>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {selectedAdmission.verificationRemarks && (
                    <div className="bg-white/80 dark:bg-neutral-900/50 p-3 rounded-2xl border border-indigo-50/50 dark:border-indigo-950/50 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                      <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest leading-none">Admin Internal Notes:</p>
                      <p className="text-xs text-neutral-750 dark:text-neutral-300 font-semibold italic leading-relaxed mt-1.5 whitespace-pre-line pl-1.5">
                        "{selectedAdmission.verificationRemarks}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Subsections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      Personal Details
                    </h4>
                    <div className="bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl p-3.5 text-xs space-y-1.5">
                      <div className="flex justify-between"><span className="text-neutral-400">Gender:</span> <span className="font-bold">{selectedAdmission.studentpersonaldetails?.gender || 'MALE'}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">DOB:</span> <span className="font-bold">{selectedAdmission.studentpersonaldetails?.dateOfBirth || 'N/A'}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Religion:</span> <span className="font-bold">{selectedAdmission.studentpersonaldetails?.religion || 'Hindu'}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Caste:</span> <span className="font-bold">{selectedAdmission.studentpersonaldetails?.caste || 'General'}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Category:</span> <span className="font-bold">{selectedAdmission.studentpersonaldetails?.category || 'GEN'}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Nationality:</span> <span className="font-bold">{selectedAdmission.studentpersonaldetails?.nationality || 'Indian'}</span></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Academic Qualifications
                    </h4>
                    <div className="bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl p-3.5 text-xs space-y-1.5">
                      <div className="flex justify-between"><span className="text-neutral-400">10th Board:</span> <span className="font-bold">{selectedAdmission.studentacademicdetails?.tenthBoard || 'CBSE'}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">10th score:</span> <span className="font-bold">{selectedAdmission.studentacademicdetails?.tenthPercentage || 85}%</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">12th Board:</span> <span className="font-bold">{selectedAdmission.studentacademicdetails?.twelfthBoard || 'CBSE'}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">12th score:</span> <span className="font-bold">{selectedAdmission.studentacademicdetails?.twelfthPercentage || 82}%</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">CET score:</span> <span className="font-bold">{selectedAdmission.studentacademicdetails?.cetScore || 145}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">CET Rank:</span> <span className="font-bold">{selectedAdmission.studentacademicdetails?.cetRank || 2800}</span></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      Parent Details
                    </h4>
                    <div className="bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl p-3.5 text-xs space-y-1.5">
                      <div className="flex justify-between"><span className="text-neutral-400">Father:</span> <span className="font-bold">{selectedAdmission.studentparentdetails?.fatherName || 'Ramesh Patel'}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Mother:</span> <span className="font-bold">{selectedAdmission.studentparentdetails?.motherName || 'Sunita Devi'}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Annual Income:</span> <span className="font-bold">₹{selectedAdmission.studentparentdetails?.fatherAnnualIncome?.toLocaleString() || '6,00,000'}</span></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Contact Address
                    </h4>
                    <div className="bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl p-3.5 text-xs space-y-1.5">
                      <p className="font-bold leading-normal">
                        {selectedAdmission.studentaddress?.currentAddressLine1 || '45, MG Road'}, 
                        {selectedAdmission.studentaddress?.currentCity || ' Bengaluru'}, 
                        {selectedAdmission.studentaddress?.currentState || ' Karnataka'} - 
                        {selectedAdmission.studentaddress?.currentPincode || ' 560001'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">📁 Documents Vault</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: '10th Marksheet', url: selectedAdmission.studentdocuments?.tenthMarksheetUrl },
                      { name: '12th Marksheet', url: selectedAdmission.studentdocuments?.twelfthMarksheetUrl },
                      { name: 'Aadhaar Card', url: selectedAdmission.studentdocuments?.aadhaarUrl },
                      { name: 'Photo ID', url: selectedAdmission.studentdocuments?.photoUrl }
                    ].map((doc, idx) => (
                      <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-800/35 border rounded-xl flex flex-col justify-between h-20">
                        <span className="text-[10px] font-black text-neutral-600 dark:text-neutral-300 leading-tight">{doc.name}</span>
                        {doc.url ? (
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[9px] font-bold text-amber-600 hover:underline flex items-center gap-1 mt-2"
                          >
                            View File <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-[8px] text-rose-500 font-bold">Missing</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-800/20 border space-y-4">
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">✍️ Principal Remarks & Decision</h4>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add remarks or justification notes here..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                      className="w-full p-3.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-700/60 rounded-xl focus:border-amber-500 focus:outline-none"
                    />

                    <div className="flex gap-2.5">
                      <button 
                        onClick={() => handleAdmissionDecision('APPROVED')}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => handleAdmissionDecision('CONDITIONAL')}
                        className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-xs font-black shadow-sm transition-colors"
                      >
                        Conditional
                      </button>
                      <button 
                        onClick={() => handleAdmissionDecision('WAITLISTED')}
                        className="px-4 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-black shadow-sm transition-colors"
                      >
                        Waitlist
                      </button>
                    </div>

                    <div className="pt-2 border-t border-neutral-200/50 flex flex-col md:flex-row items-stretch md:items-center gap-3">
                      <select
                        value={rejectReasonCode}
                        onChange={(e) => setRejectReasonCode(e.target.value)}
                        className="flex-1 p-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-700/60 rounded-xl focus:outline-none"
                      >
                        <option value="">-- Choose Rejection Reason Code --</option>
                        {rejectionReasons.map((r) => (
                          <option key={r.code} value={r.code}>{r.label}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleAdmissionDecision('REJECTED')}
                        className="py-2.5 px-6 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {currentTab === 'budgets' && selectedBudget && (
              <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-6 animate-scale-up">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-150/40 pb-5">
                  <div>
                    <span className="text-[10px] bg-rose-100 text-rose-700 font-black px-2 py-0.5 rounded-lg uppercase">
                      {selectedBudget.priority} Priority
                    </span>
                    <h3 className="text-md font-black text-neutral-900 dark:text-white mt-2">
                      {selectedBudget.title}
                    </h3>
                    <p className="text-[10px] font-bold text-neutral-400">
                      Requisitioning Dept: {selectedBudget.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-neutral-900 dark:text-white">
                      ₹{selectedBudget.amount.toLocaleString()}
                    </span>
                    <p className="text-[9px] text-neutral-400 font-bold mt-0.5">Budget Allocation Year: 2026</p>
                  </div>
                </div>

                {/* Justification details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">📋 Requisition Justification</h4>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-150/40">
                    <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 font-semibold">{selectedBudget.justification}</p>
                  </div>
                </div>

                {/* Review status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl text-xs space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-neutral-450">HOD Recommendation</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      <span className="font-extrabold text-emerald-600">{selectedBudget.hodRecommendation}</span>
                    </div>
                  </div>
                  <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl text-xs space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-neutral-450">Finance Review</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="font-extrabold text-emerald-600">{selectedBudget.financeReview}</span>
                    </div>
                  </div>
                </div>

                {/* Remarks & Action Desk */}
                <div className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-800/20 border space-y-4">
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">✍️ Budget Decision Remarks</h4>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add reviewer notes or conditions..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                      className="w-full p-3.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-700/60 rounded-xl focus:border-amber-500 focus:outline-none"
                    />

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleBudgetDecision('APPROVED')}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Approve Requisition
                      </button>
                      <button 
                        onClick={() => handleBudgetDecision('DEFERRED')}
                        className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-xs font-black shadow-sm transition-colors"
                      >
                        Defer Budget
                      </button>
                      <button 
                        onClick={() => handleBudgetDecision('REJECTED')}
                        className="px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-sm transition-colors"
                      >
                        Reject Request
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {currentTab === 'staff' && selectedLeave && (
              <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-6 animate-scale-up">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-150/40 pb-5">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={selectedLeave.user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop'}
                      alt="Staff"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="text-md font-black text-neutral-900 dark:text-white">
                        {selectedLeave.user?.firstName} {selectedLeave.user?.lastName}
                      </h3>
                      <p className="text-[10px] font-bold text-neutral-455">
                        Department: {selectedLeave.department?.name} ({selectedLeave.department?.code})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-violet-100 text-violet-750 font-black px-3 py-1 rounded-lg">
                    {selectedLeave.type} LEAVE
                  </span>
                </div>

                {/* Leave dates details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl text-xs space-y-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Start Date
                    </span>
                    <span className="font-extrabold text-neutral-850 dark:text-neutral-200">{selectedLeave.startDate}</span>
                  </div>
                  <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl text-xs space-y-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> End Date
                    </span>
                    <span className="font-extrabold text-neutral-855 dark:text-neutral-200">{selectedLeave.endDate}</span>
                  </div>
                </div>

                {/* Justification details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">📋 Reason for Leave Requisition</h4>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-150/40">
                    <p className="text-xs leading-relaxed text-neutral-705 dark:text-neutral-300 font-semibold">{selectedLeave.reason}</p>
                  </div>
                </div>

                {/* Remarks & Action Desk */}
                <div className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-800/20 border space-y-4">
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">✍️ Leave Redressal Decisions</h4>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add reviewer notes or conditions..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                      className="w-full p-3.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-700/60 rounded-xl focus:border-amber-500 focus:outline-none"
                    />

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleLeaveDecision('APPROVED')}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Approve Leave
                      </button>
                      <button 
                        onClick={() => handleLeaveDecision('REJECTED')}
                        className="px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <X className="w-4 h-4" /> Reject Request
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {currentTab === 'curriculum' && selectedCurriculum && (
              <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-6 animate-scale-up">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-150/40 pb-5">
                  <div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-750 font-black px-2 py-0.5 rounded-lg uppercase">
                      Curriculum Update: {selectedCurriculum.type}
                    </span>
                    <h3 className="text-md font-black text-neutral-900 dark:text-white mt-2">
                      {selectedCurriculum.courseName}
                    </h3>
                    <p className="text-[10px] font-bold text-neutral-455">
                      Course Code: {selectedCurriculum.courseCode} | Credits: {selectedCurriculum.credits}
                    </p>
                  </div>
                  <span className="text-[10px] text-neutral-450 font-bold">
                    Proposer: {selectedCurriculum.proposer?.firstName} {selectedCurriculum.proposer?.lastName}
                  </span>
                </div>

                {/* Outcomes details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">📋 Proposed Syllabus & Learning Outcomes</h4>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-150/40">
                    <p className="text-xs leading-relaxed text-neutral-705 dark:text-neutral-300 font-semibold">{selectedCurriculum.outcomes}</p>
                  </div>
                </div>

                {/* Remarks & Action Desk */}
                <div className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-800/20 border space-y-4">
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">✍️ Curriculum Amendment Decision</h4>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add reviewer notes or conditions..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                      className="w-full p-3.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-700/60 rounded-xl focus:border-amber-500 focus:outline-none"
                    />

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCurriculumDecision('APPROVED')}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Approve Amendment
                      </button>
                      <button 
                        onClick={() => handleCurriculumDecision('REJECTED')}
                        className="px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <X className="w-4 h-4" /> Reject Proposal
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalQueuePage;
