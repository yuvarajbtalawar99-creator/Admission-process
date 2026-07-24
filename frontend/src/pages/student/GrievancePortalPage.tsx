import React, { useState, useEffect } from 'react';
import { Send, Inbox, AlertTriangle, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Toast from '../../components/common/Toast';
import studentService from '../../services/student.service';

interface Grievance {
  id: string;
  category: string;
  title: string;
  description: string;
  createdAt: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  resolution?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export const GrievancePortalPage: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 5, totalPages: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // New Form states
  const [category, setCategory] = useState('Academics');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchGrievances = async (page: number) => {
    try {
      setFetching(true);
      const res = await studentService.getStudentGrievances(page, 5);
      setGrievances(res.grievances);
      setPagination(res.pagination);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.response?.data?.error || 'Failed to load grievances.'
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchGrievances(currentPage);
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      setToastMessage({ type: 'error', message: 'Please provide both a subject and details.' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await studentService.lodgeGrievance({
        category,
        subject,
        description,
      });

      setToastMessage({
        type: 'success',
        message: `Grievance submitted successfully. Ticket ID: ${response.data.id}`
      });
      setSubject('');
      setDescription('');
      
      // Refresh to page 1 to show the newly added grievance
      if (currentPage === 1) {
        await fetchGrievances(1);
      } else {
        setCurrentPage(1);
      }
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.response?.data?.error || 'Failed to submit grievance.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'RESOLVED') return <CheckCircle className="w-4 h-4 text-[#16A34A]" />;
    if (status === 'UNDER_REVIEW') return <Clock className="w-4 h-4 text-[#4F46E5]" />;
    if (status === 'REJECTED') return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'RESOLVED') return 'text-[#16A34A] bg-[#E8F5E9] dark:bg-emerald-950/30';
    if (status === 'UNDER_REVIEW') return 'text-[#4F46E5] bg-[#E8E5FF] dark:bg-indigo-950/30';
    if (status === 'REJECTED') return 'text-rose-700 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-450';
    return 'text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-450';
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

      {/* Header Info Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <h2 className="text-[22px] font-bold text-neutral-900 dark:text-white tracking-tight">Student Grievance Box</h2>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Lodge complaints or share feedback directly with administration</p>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LODGE NEW TICKET (col-span-5) */}
        <div className="lg:col-span-5 glass-panel rounded-[32px] p-6 shadow-ambient">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mb-6 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <Send className="w-5 h-5 text-neutral-500" />
            <span>Lodge a Grievance</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-neutral-200 dark:border-neutral-750 text-neutral-900 rounded-2xl py-3.5 px-4 text-sm font-semibold outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="Academics" className="text-neutral-900 bg-white">Academics</option>
                <option value="Infrastructure" className="text-neutral-900 bg-white">Infrastructure / Maintenance</option>
                <option value="Hostel & Mess" className="text-neutral-900 bg-white">Hostel & Mess</option>
                <option value="Finance & Scholarships" className="text-neutral-900 bg-white">Finance & Scholarships</option>
                <option value="Other" className="text-neutral-900 bg-white">Other / General Feedback</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Subject / Short Title</label>
              <input
                type="text"
                placeholder="e.g. WiFi connection drops in library"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-white border border-neutral-200 focus:border-neutral-400 rounded-2xl py-3.5 px-4 text-sm text-neutral-900 font-semibold outline-none transition-colors placeholder:text-neutral-300 placeholder:font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Description & Details</label>
              <textarea
                rows={4}
                placeholder="Provide detailed description of your issue including dates, locations, and details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-white border border-neutral-200 focus:border-neutral-400 rounded-2xl py-3.5 px-4 text-sm text-neutral-900 font-semibold outline-none transition-colors resize-none placeholder:text-neutral-300 placeholder:font-normal"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary-custom font-bold py-3.5 rounded-2xl text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting Grievance Ticket...' : 'File Grievance'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: PREVIOUS SUBMISSIONS & STATS (col-span-7) */}
        <div className="lg:col-span-7 glass-panel rounded-[32px] p-6 shadow-ambient">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mb-6 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <Inbox className="w-5 h-5 text-neutral-500" />
            <span>My Lodged Tickets ({pagination.total})</span>
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {fetching ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-500"></div>
              </div>
            ) : grievances.length > 0 ? (
              grievances.map((item) => (
                <div 
                  key={item.id}
                  className="p-5 border border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-850/20 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-neutral-400">#{item.id.substring(0, 8).toUpperCase()}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                      <span className="text-xs font-semibold text-neutral-500">{item.category}</span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 w-fit ${getStatusBadge(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="capitalize">{item.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <h4 className="text-[15px] font-bold text-neutral-900 dark:text-white tracking-tight">
                    {item.title}
                  </h4>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                    {item.description}
                  </p>

                  {/* Admin response block if available */}
                  {item.resolution && (
                    <div className="p-3.5 rounded-xl bg-[#E8E5FF] text-[#0d7d23] dark:bg-indigo-550/20 dark:text-indigo-400 border border-[#D9D6FF]/40 text-xs font-medium mt-2 leading-relaxed">
                      <span className="font-bold block mb-1">Administrative Resolution:</span>
                      {item.resolution}
                    </div>
                  )}

                  <div className="text-[10px] text-neutral-400 font-medium pt-1 text-right">
                    Filed on {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-neutral-400 py-12">You have not lodged any grievances yet.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || fetching}
                className="p-2 rounded-xl hover:bg-neutral-150 dark:hover:bg-neutral-850 disabled:opacity-30 cursor-pointer flex items-center gap-1 text-xs font-bold text-neutral-600 dark:text-neutral-350 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-neutral-500 font-bold">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages || fetching}
                className="p-2 rounded-xl hover:bg-neutral-150 dark:hover:bg-neutral-850 disabled:opacity-30 cursor-pointer flex items-center gap-1 text-xs font-bold text-neutral-600 dark:text-neutral-350 transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GrievancePortalPage;
