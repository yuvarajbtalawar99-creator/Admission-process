import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldAlert, Users, Mail, CheckSquare, Square, Search, Info, Shield, RefreshCw } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import credentialService, { PendingCredential } from '../../../services/credential.service';
import { toast } from 'react-toastify';

export const CredentialManagementPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // State for Bulk Generation
  const [pendingStudents, setPendingStudents] = useState<PendingCredential[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dispatchingBulk, setDispatchingBulk] = useState(false);
  const [searchPending, setSearchPending] = useState('');

  // State for Manual Reset
  const [resetUserId, setResetUserId] = useState('');
  const [resetting, setResetting] = useState(false);

  const fetchPending = async () => {
    try {
      setLoadingPending(true);
      const res = await credentialService.getPendingCredentials();
      if (res.success) {
        setPendingStudents(res.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to fetch pending credentials');
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredPending.length && filteredPending.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPending.map(s => s.id)));
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
      setDispatchingBulk(true);
      const studentIds = Array.from(selectedIds);
      const res = await credentialService.bulkDispatchCredentials(studentIds);
      if (res.success) {
        toast.success(res.message || `Credentials dispatched to ${selectedIds.size} students`);
        setSelectedIds(new Set());
        fetchPending(); // Refresh list
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to dispatch credentials');
    } finally {
      setDispatchingBulk(false);
    }
  };

  const handleManualReset = async () => {
    if (!resetUserId) {
      toast.error('Please enter a User ID');
      return;
    }
    try {
      setResetting(true);
      const res = await credentialService.dispatchSingleCredential(resetUserId);
      if (res.success) {
        toast.success(`Password reset for ${res.data.username}. New temp password: ${res.data.plainPassword}`);
        setResetUserId('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const filteredPending = pendingStudents.filter(s => 
    s.user?.firstName.toLowerCase().includes(searchPending.toLowerCase()) ||
    s.user?.lastName.toLowerCase().includes(searchPending.toLowerCase()) ||
    s.enrollmentNumber.toLowerCase().includes(searchPending.toLowerCase())
  );

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500">
        <ShieldAlert size={48} className="text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Access Denied</h2>
        <p>Credential Management is restricted to SUPER_ADMIN authority.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-3">
            <KeyRound className="text-violet-600" /> Credential Management
          </h2>
          <p className="text-sm text-neutral-500 font-medium mt-1">
            Generate official university identities and manage system access.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bulk Generation Section (Takes up 2 cols on large screens) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-neutral-200/60 shadow-ambient flex flex-col h-full">
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">Pending Credentials</h3>
              </div>
              <p className="text-xs text-neutral-500">Generate credentials for newly enrolled students.</p>
            </div>
            
            <button 
              onClick={fetchPending}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
              title="Refresh List"
            >
              <RefreshCw size={14} className={loadingPending ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4 p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search USN or Name..." 
                value={searchPending}
                onChange={(e) => setSearchPending(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs focus:ring-2 focus:ring-violet-500 outline-none transition-shadow"
              />
            </div>
            <button
              disabled={dispatchingBulk || selectedIds.size === 0}
              onClick={handleBulkDispatch}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
            >
              {dispatchingBulk ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Mail size={14} />
              )}
              Dispatch Selected ({selectedIds.size})
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl flex-1 max-h-[400px]">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="sticky top-0 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-10">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">
                    <button onClick={handleSelectAll} className="text-neutral-400 hover:text-indigo-600 transition-colors">
                      {selectedIds.size === filteredPending.length && filteredPending.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">Enrollment No</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">Student</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50 bg-white dark:bg-transparent">
                {loadingPending ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-neutral-400 text-xs">Loading pending students...</td>
                  </tr>
                ) : filteredPending.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-400">
                        <Shield size={32} className="mb-3 opacity-20" />
                        <p className="font-semibold text-sm">No pending credentials.</p>
                        <p className="text-[10px] mt-1">All enrolled students have identities.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPending.map(student => (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors cursor-pointer ${selectedIds.has(student.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                      onClick={() => handleSelect(student.id)}
                    >
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center text-neutral-400">
                          {selectedIds.has(student.id) ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">
                          {student.enrollmentNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <p className="font-bold text-xs text-neutral-800 dark:text-neutral-200">
                            {student.user?.firstName} {student.user?.lastName}
                          </p>
                          <p className="text-[10px] text-neutral-500">{student.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-wider rounded-md">
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
        </div>

        {/* Security & Password Reset Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-neutral-200/60 shadow-ambient flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">Manual Password Reset</h3>
            </div>
            
            <p className="text-xs text-neutral-500 mb-6 flex-1">
              Force reset a password for a specific user account (Student, Teacher, Admin) if they have lost access.
            </p>
            
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Enter User Database ID" 
                value={resetUserId}
                onChange={e => setResetUserId(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500 font-mono" 
              />
              <button 
                onClick={handleManualReset}
                disabled={resetting || !resetUserId}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {resetting ? (
                   <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                   <KeyRound size={16} />
                )}
                Reset Password
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-2">
              <Info className="text-amber-500 shrink-0 mt-0.5" size={14} />
              <p className="text-[10px] text-amber-700 font-medium">
                The new temporary password will be returned immediately upon success. Make sure to securely communicate it to the user.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CredentialManagementPage;
