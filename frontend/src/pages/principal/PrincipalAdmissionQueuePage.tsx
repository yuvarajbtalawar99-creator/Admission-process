import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import admissionService, { AdmissionApplication, AdmissionListResult } from '../../services/admission.service';
import { 
  Search, Filter, ChevronLeft, ChevronRight, Eye, CheckCircle2, Clock, XCircle, FileText, 
  RefreshCw, CheckSquare, Square, Download, Award, ShieldCheck, 
  SlidersHorizontal, ArrowRight, UserCheck, X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

interface PrincipalAdmissionQueuePageProps {
  defaultStatus?: string;
}

export const PrincipalAdmissionQueuePage: React.FC<PrincipalAdmissionQueuePageProps> = ({ defaultStatus = 'APPROVED' }) => {
  const navigate = useNavigate();

  const getRouteForStatus = (tabStatus: string) => {
    switch (tabStatus) {
      case 'APPROVED': return '/principal/admissions/pending';
      case 'ENROLLED': return '/principal/admissions/approved';
      case 'REJECTED': return '/principal/admissions/rejected';
      case 'ALL': return '/principal/admissions/history';
      default: return '/principal/admissions/pending';
    }
  };

  const [data, setData] = useState<AdmissionListResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<{ id: string; name: string; code: string }[]>([]);
  
  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>(defaultStatus);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [branchId, setBranchId] = useState('ALL');
  const [admissionType, setAdmissionType] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Bulk actions selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Dynamic Pipeline Counts
  const [stats, setStats] = useState({
    submitted: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    enrolled: 0,
    total: 0
  });

  const loadInitialData = async () => {
    try {
      const [statsData, branchData] = await Promise.all([
        admissionService.getStats(),
        admissionService.getBranches()
      ]);
      if (statsData) setStats(statsData);
      if (branchData) setBranches(branchData);
    } catch (e) {
      console.error('Failed to load initial data', e);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let activeStatus = status;
      if (status === 'ALL' && statusFilter !== 'ALL') {
        activeStatus = statusFilter;
      }

      const result = await admissionService.listApplications({
        page,
        limit: 10,
        status: activeStatus,
        branchId: branchId === 'ALL' ? undefined : branchId,
        admissionType: admissionType === 'ALL' ? undefined : admissionType,
        search,
        sortBy,
        sortOrder
      });
      setData(result);
      setSelectedIds([]); // Clear selection on load
    } catch (error) {
      console.error('Failed to fetch applications', error);
      toast.error('Failed to fetch applications list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    setStatus(defaultStatus);
    setStatusFilter('ALL');
    setPage(page => 1);
  }, [defaultStatus]);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, [page, status, statusFilter, branchId, admissionType, sortBy, sortOrder, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleRefresh = async () => {
    await Promise.all([fetchApplications(), loadInitialData()]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.applications) {
      setSelectedIds(data.applications.map(app => app.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    
    const confirmMessage = `Are you sure you want to approve and sign-off on these ${selectedIds.length} selected applications?`;
    if (!window.confirm(confirmMessage)) return;

    setBulkLoading(true);
    try {
      await API.put('/principal/admissions/bulk/approve', { ids: selectedIds });
      toast.success(`Successfully approved ${selectedIds.length} applications.`);
      await handleRefresh();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.error || 'Failed to approve applications');
    } finally {
      setBulkLoading(false);
    }
  };

  const getStatusBadge = (app: AdmissionApplication) => {
    switch (app.applicationStatus) {
      case 'SUBMITTED':
        return <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 w-28"><Clock size={10}/> Pending Review</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 w-28"><FileText size={10}/> In Progress</span>;
      case 'APPROVED':
        return <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 w-28"><ShieldCheck size={10}/> Verified</span>;
      case 'ENROLLED':
        return <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 w-28"><CheckCircle2 size={10}/> Approved</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 w-28"><XCircle size={10}/> Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center justify-center w-28">{app.applicationStatus}</span>;
    }
  };

  const tabs = [
    { name: "Pending Approval", status: "APPROVED", count: stats.approved, color: "bg-indigo-500" },
    { name: "Approved", status: "ENROLLED", count: stats.enrolled, color: "bg-emerald-500" },
    { name: "Rejected", status: "REJECTED", count: stats.rejected, color: "bg-rose-500" },
    { name: "All Applications", status: "ALL", count: stats.total, color: "bg-neutral-500" },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Dynamic Header */}
      <div className="glass-panel rounded-[32px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-ambient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] -mr-32 -mt-32"></div>
        <div className="space-y-1 relative z-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider">
            Official Student Admission Queue
          </h1>
          <p className="text-xs text-neutral-400 font-semibold">
            Principal Oversight & Final Approval Authority
          </p>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button 
            onClick={handleRefresh}
            className="h-10 w-10 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 rounded-xl border border-neutral-200/60 dark:border-neutral-700/50 text-neutral-500 transition-all active:scale-95"
            title="Refresh List"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 pb-1 border-b border-neutral-100 dark:border-neutral-800/80">
        {tabs.map((t) => {
          const isActive = status === t.status;
          return (
            <button
              key={t.name}
              onClick={() => {
                navigate(getRouteForStatus(t.status));
              }}
              className={`h-11 px-5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border ${
                isActive
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-md'
                  : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-neutral-500 border-neutral-100 dark:border-neutral-800'
              }`}
            >
              <span>{t.name}</span>
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${
                isActive 
                  ? 'bg-white/20 text-white dark:bg-neutral-900 dark:text-neutral-200' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
              }`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters Panel */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by candidate name, application ID, or email..."
              className="w-full h-12 pl-11 pr-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-neutral-400"
            />
          </div>
          <div className="flex gap-2">
            <button 
              type="submit"
              className="h-12 px-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-2xl text-xs font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
            >
              Apply Filter
            </button>
            {(search || searchInput) && (
              <button 
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSearch('');
                  setPage(1);
                }}
                className="h-12 w-12 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-neutral-100 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800/50">
          <div className="flex flex-wrap items-center gap-3">
            {/* Branch Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Branch:</span>
              <select 
                value={branchId}
                onChange={(e) => { setBranchId(e.target.value); setPage(1); }}
                className="h-9 px-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl text-xs font-bold outline-none text-neutral-700 dark:text-neutral-300"
              >
                <option value="ALL">All Branches</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                ))}
              </select>
            </div>

            {/* Admission Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Quota:</span>
              <select 
                value={admissionType}
                onChange={(e) => { setAdmissionType(e.target.value); setPage(1); }}
                className="h-9 px-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl text-xs font-bold outline-none text-neutral-700 dark:text-neutral-300"
              >
                <option value="ALL">All Quotas</option>
                <option value="KCET">KCET (Merit)</option>
                <option value="DCET">DCET (Lateral)</option>
                <option value="MANAGEMENT">Management</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Sort By:</span>
              <select 
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="h-9 px-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl text-xs font-bold outline-none text-neutral-700 dark:text-neutral-300"
              >
                <option value="date">Submission Date</option>
                <option value="name">Candidate Name</option>
                <option value="appNo">Application ID</option>
              </select>
              <select 
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value as 'ASC' | 'DESC'); setPage(1); }}
                className="h-9 px-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl text-xs font-bold outline-none text-neutral-700 dark:text-neutral-300"
              >
                <option value="DESC">Newest First</option>
                <option value="ASC">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Action Panel */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between shadow-sm animate-slide-in">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              {selectedIds.length} candidate(s) selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            {status === 'APPROVED' && (
              <button 
                disabled={bulkLoading}
                onClick={handleBulkApprove}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/10 cursor-pointer disabled:opacity-50"
              >
                <CheckSquare size={14} />
                Bulk Approve & Enroll
              </button>
            )}
            <button 
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Applications List Table */}
      <div className="overflow-x-auto rounded-[28px] border border-neutral-100 dark:border-neutral-800 glass-panel shadow-ambient">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-neutral-50 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 text-[10px] uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={data?.applications.length ? selectedIds.length === data.applications.length : false}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-5 py-4 font-bold">App ID</th>
              <th className="px-5 py-4 font-bold">Applicant Info</th>
              <th className="px-5 py-4 font-bold">Branch</th>
              <th className="px-5 py-4 font-bold">Entrance / Merit</th>
              <th className="px-5 py-4 font-bold">Submitted Date</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center text-neutral-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">
                  Loading Applications...
                </td>
              </tr>
            ) : data?.applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                  No applications in this stage pipeline.
                </td>
              </tr>
            ) : (
              data?.applications.map((app) => {
                const isChecked = selectedIds.includes(app.id);
                const acad = app.studentacademicdetails as any;
                return (
                  <tr key={app.id} className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition-colors ${isChecked ? 'bg-amber-50/10' : ''}`}>
                    <td className="px-5 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => handleSelectRow(app.id, e.target.checked)}
                        className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                      {app.applicationNumber}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {app.user?.profileImage ? (
                          <img src={app.user.profileImage} alt="profile" className="w-8 h-8 rounded-full object-cover border border-neutral-100 dark:border-neutral-850" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center font-black text-[10px] uppercase">
                            {app.user?.firstName?.[0] || ''}{app.user?.lastName?.[0] || ''}
                          </div>
                        )}
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          {app.user?.firstName} {app.user?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-neutral-700 dark:text-neutral-300">
                      {app.branch?.code || '-'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">
                        {app.admissionType || '—'}
                      </span>
                      {app.admissionType === 'KCET' && acad?.cetRank && (
                        <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">Rank: #{acad.cetRank}</span>
                      )}
                      {app.admissionType === 'DCET' && acad?.dcetRank && (
                        <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">Rank: #{acad.dcetRank}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold text-neutral-500 whitespace-nowrap">
                      {app.submittedAt ? format(new Date(app.submittedAt), 'dd MMM yyyy, hh:mm a') : '-'}
                    </td>
                    <td className="px-5 py-4">
                      {getStatusBadge(app)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link 
                        to={`/principal/admissions/review/${app.id}`}
                        className="px-4 py-2 border border-neutral-200/80 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye size={13} />
                        Review
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-transparent rounded-2xl border border-neutral-150 dark:border-neutral-800/80">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3.5 py-1.5 border border-neutral-200/80 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Previous Page
          </button>
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Page {page} of {data.totalPages}
          </span>
          <button 
            disabled={page === data.totalPages}
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            className="px-3.5 py-1.5 border border-neutral-200/80 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
};

export default PrincipalAdmissionQueuePage;
