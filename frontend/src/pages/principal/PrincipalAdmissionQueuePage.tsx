import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { AdmissionApplication, AdmissionListResult } from '../../services/admission.service';
import {
  Search, ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle, FileText,
  RefreshCw, Eye
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
  const [branchId, setBranchId] = useState('ALL');
  const [admissionType, setAdmissionType] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Stats
  const [stats, setStats] = useState({
    approved: 0,
    enrolled: 0,
    rejected: 0,
    total: 0
  });

  const loadInitialData = async () => {
    try {
      const [statsRes, branchRes] = await Promise.all([
        API.get('/principal/admissions/stats'),
        API.get('/branches')
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (branchRes.data.data) setBranches(branchRes.data.data);
    } catch (e) {
      console.error('Failed to load initial data', e);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('page', String(page));
      query.set('limit', '10');
      if (status) query.set('status', status);
      if (branchId !== 'ALL') query.set('branchId', branchId);
      if (admissionType !== 'ALL') query.set('admissionType', admissionType);
      if (search) query.set('search', search);
      if (sortBy) query.set('sortBy', sortBy);
      if (sortOrder) query.set('sortOrder', sortOrder);

      const res = await API.get(`/principal/admissions/list?${query.toString()}`);
      if (res.data.success) {
        setData(res.data.data as AdmissionListResult);
      }
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
    setPage(1);
  }, [defaultStatus]);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, [page, status, branchId, admissionType, sortBy, sortOrder, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleRefresh = async () => {
    await Promise.all([fetchApplications(), loadInitialData()]);
  };

  const getStatusBadge = (app: AdmissionApplication) => {
    switch (app.applicationStatus) {
      case 'APPROVED':
        return (
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 w-36">
            <Clock size={10} /> Awaiting for Review
          </span>
        );
      case 'ENROLLED':
        return (
          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 w-36">
            <CheckCircle2 size={10} /> Enrolled
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 w-36">
            <XCircle size={10} /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center justify-center w-36">
            {app.applicationStatus}
          </span>
        );
    }
  };

  const tabs = [
    { name: 'Pending Review', status: 'APPROVED', count: stats.approved, color: 'bg-amber-500' },
    { name: 'Approved', status: 'ENROLLED', count: stats.enrolled, color: 'bg-emerald-500' },
    { name: 'Rejected', status: 'REJECTED', count: stats.rejected, color: 'bg-rose-500' },
    { name: 'All History', status: 'ALL', count: stats.total, color: 'bg-neutral-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl pb-12">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
            Admissions Review Queue
          </h2>
          <p className="text-sm font-semibold text-neutral-500">
            Review verified applications forwarded for principal sign-off.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm self-start md:self-auto flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-300"
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Stage Tab View */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const isActive = status === tab.status;
          return (
            <button
              key={tab.name}
              onClick={() => navigate(getRouteForStatus(tab.status))}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 shadow-sm relative overflow-hidden flex flex-col justify-between h-24 ${
                isActive
                  ? 'bg-neutral-900 border-neutral-950 dark:bg-white dark:border-white text-white dark:text-neutral-900'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-[11px] font-black uppercase tracking-widest opacity-60">{tab.name}</span>
                <span className={`w-2 h-2 rounded-full ${tab.color}`} />
              </div>
              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-2xl font-black leading-none">{tab.count}</span>
                <span className="text-[10px] font-bold opacity-60">apps</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 dark:border-neutral-800 p-5 space-y-4">

        {/* Filters Top Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, app number..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </form>

          {/* Department */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Dept:</span>
            <select
              value={branchId}
              onChange={(e) => { setBranchId(e.target.value); setPage(1); }}
              className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Departments</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
              ))}
            </select>
          </div>

          {/* Admission Type */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Type:</span>
            <select
              value={admissionType}
              onChange={(e) => { setAdmissionType(e.target.value); setPage(1); }}
              className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Entrance</option>
              <option value="KCET">KCET</option>
              <option value="DCET">DCET</option>
              <option value="MANAGEMENT">MANAGEMENT</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="date">Date Submitted</option>
              <option value="rank">Merit / App Number</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value as any); setPage(1); }}
              className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="DESC">Newest First</option>
              <option value="ASC">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto rounded-xl border border-neutral-100 dark:border-neutral-800">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-neutral-50 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-bold">App ID</th>
                <th className="px-4 py-3 font-bold">Applicant Info</th>
                <th className="px-4 py-3 font-bold">Branch</th>
                <th className="px-4 py-3 font-bold">Entrance / Merit</th>
                <th className="px-4 py-3 font-bold">Submitted Date</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="size-6 rounded-full border-2 border-amber-100 border-t-amber-500 animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-2">
                        Loading applications…
                      </span>
                    </div>
                  </td>
                </tr>
              ) : data?.applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                    No applications found in this stage.
                  </td>
                </tr>
              ) : (
                data?.applications.map((app) => {
                  const acad = app.studentacademicdetails as any;
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-neutral-900 dark:text-neutral-200">
                        {app.applicationNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {app.user?.profileImage ? (
                            <img src={app.user.profileImage} alt="profile" className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-[10px] uppercase">
                              {app.user?.firstName?.[0] || ''}{app.user?.lastName?.[0] || ''}
                            </div>
                          )}
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {app.user?.firstName} {app.user?.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-neutral-700 dark:text-neutral-300">
                        {app.branch?.code || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-neutral-700 dark:text-neutral-300">
                          {app.admissionType || '—'}
                        </span>
                        {app.admissionType === 'KCET' && acad?.cetRank && (
                          <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">
                            Rank: #{acad.cetRank}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-neutral-500 whitespace-nowrap">
                        {app.submittedAt ? format(new Date(app.submittedAt), 'dd MMM yyyy, hh:mm a') : '-'}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(app)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/principal/admissions/review/${app.id}`)}
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm gap-1.5 ${
                            app.applicationStatus === 'APPROVED'
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                          }`}
                        >
                          <Eye size={10} />
                          {app.applicationStatus === 'APPROVED' ? 'Review' : 'View'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
              Page {data.page} of {data.totalPages} ({data.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 disabled:opacity-50 hover:bg-neutral-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page === data.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 disabled:opacity-50 hover:bg-neutral-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrincipalAdmissionQueuePage;
