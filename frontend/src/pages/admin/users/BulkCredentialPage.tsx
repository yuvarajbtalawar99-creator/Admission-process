import React, { useState, useEffect } from 'react';
import { Shield, KeyRound, CheckSquare, Square, Mail, Search, Info } from 'lucide-react';
import officeService, { PendingCredential } from '../../../services/office.service';
import { toast } from 'react-toastify';

export const BulkCredentialPage: React.FC = () => {
  const [students, setStudents] = useState<PendingCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dispatching, setDispatching] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await officeService.getPendingCredentials();
      setStudents(data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to fetch pending credentials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const handleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDispatch = async () => {
    if (selectedIds.size === 0) return;
    try {
      setDispatching(true);
      const studentIds = Array.from(selectedIds);
      const result = await officeService.bulkDispatchCredentials(studentIds);
      toast.success(result.message || `Credentials dispatched to ${selectedIds.size} students`);
      setSelectedIds(new Set());
      fetchPending(); // Refresh list
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to dispatch credentials');
    } finally {
      setDispatching(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.user?.firstName.toLowerCase().includes(search.toLowerCase()) ||
    s.user?.lastName.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollmentNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-3">
            <KeyRound className="text-violet-600" /> Bulk Credential Generation
          </h2>
          <p className="text-sm text-neutral-500 font-medium mt-1">
            Generate official university identities for newly enrolled students.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search USN or Name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-shadow"
            />
          </div>
          <button
            disabled={dispatching || selectedIds.size === 0}
            onClick={handleBulkDispatch}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            {dispatching ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            Dispatch Credentials ({selectedIds.size})
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl flex items-start gap-4">
        <Info className="text-blue-500 mt-0.5 shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">How this works</h4>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Selecting students and dispatching will generate an official <code className="px-1 bg-white/50 rounded">@jcer.edu.in</code> email and a strong temporary password. 
            These credentials will be sent to the personal email they used during admission. 
            Students will be forced to change their password on first login.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-ambient">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-4 py-4 w-12 text-center">
                  <button onClick={handleSelectAll} className="text-neutral-400 hover:text-violet-600 transition-colors">
                    {selectedIds.size === filteredStudents.length && filteredStudents.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-violet-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-4 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">USN (Enrollment)</th>
                <th className="px-4 py-4 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Student Name</th>
                <th className="px-4 py-4 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Personal Email</th>
                <th className="px-4 py-4 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400">Loading pending students...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <Shield size={48} className="mb-4 opacity-20" />
                      <p className="font-semibold">No pending credentials to dispatch.</p>
                      <p className="text-xs mt-1">All enrolled students have their official identities.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr 
                    key={student.id} 
                    className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors cursor-pointer ${selectedIds.has(student.id) ? 'bg-violet-50/30 dark:bg-violet-900/10' : ''}`}
                    onClick={() => handleSelect(student.id)}
                  >
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center text-neutral-400">
                        {selectedIds.has(student.id) ? (
                          <CheckSquare className="w-5 h-5 text-violet-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-extrabold text-neutral-900 dark:text-neutral-100 text-sm tracking-wide">
                        {student.enrollmentNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                            {student.user?.firstName} {student.user?.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs font-medium text-neutral-500">{student.user?.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-lg">
                        Pending Dispatch
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulkCredentialPage;
