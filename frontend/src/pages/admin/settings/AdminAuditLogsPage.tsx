import React, { useState, useEffect } from 'react';
import { Activity, Search, Shield, Filter, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import settingsService, { AuditLog } from '../../../services/settings.service';
import { toast } from 'react-toastify';

export const AdminAuditLogsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await settingsService.getAuditLogs();
      if (res.success) {
        setLogs(res.data);
      }
    } catch (err: any) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress?.includes(searchTerm)
  );

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500">
        <Shield size={48} className="text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Access Denied</h2>
        <p>Audit Logs are restricted to SUPER_ADMIN authority.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <Activity className="text-violet-600" /> System Audit Logs
          </h2>
          <p className="text-sm text-neutral-500 font-medium mt-1">
            Track and monitor administrative actions, security events, and configuration changes.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl shadow-ambient border border-neutral-200/50 dark:border-neutral-800/40 p-5">
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-center bg-neutral-50 dark:bg-neutral-800/30 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by action, user, IP..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium focus:border-violet-500 outline-none shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-neutral-400" size={16} />
            <span className="text-xs font-bold text-neutral-500">Filter By Date (Coming Soon)</span>
          </div>
        </div>
      </div>

      {/* LOGS TABLE */}
      <div className="glass-panel rounded-2xl shadow-ambient border border-neutral-200/50 dark:border-neutral-800/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200/60 dark:border-neutral-700/60 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 font-bold">Timestamp</th>
                <th className="px-5 py-4 font-bold">Action</th>
                <th className="px-5 py-4 font-bold">User</th>
                <th className="px-5 py-4 font-bold">IP Address</th>
                <th className="px-5 py-4 font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-500 font-semibold">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      Loading audit logs...
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-500 font-semibold">
                    No matching audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors font-mono">
                      <td className="px-5 py-4 text-neutral-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-extrabold text-violet-700 dark:text-violet-400">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-neutral-800 dark:text-neutral-200">
                        {log.userName}
                      </td>
                      <td className="px-5 py-4 text-neutral-500">
                        {log.ipAddress || 'Unknown'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="max-w-xs truncate text-neutral-400" title={JSON.stringify(log.details)}>
                          {JSON.stringify(log.details)}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminAuditLogsPage;
