import React, { useState, useEffect } from 'react';
import { Search, Link as LinkIcon, Edit, Mail, Phone, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import userManagementService from '../../../services/userManagement.service';
import { toast } from 'react-toastify';

export const ParentManagementPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchParents = async () => {
    setLoading(true);
    try {
      const res = await userManagementService.getParents();
      if (res.success) {
        setParents(res.data);
      }
    } catch (err: any) {
      toast.error('Failed to load Parent accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const filteredParents = parents.filter(parent => {
    return searchTerm === '' || 
      parent.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      parent.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      parent.user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl pb-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Parent Accounts</h2>
          <p className="text-sm text-neutral-500">Manage parent access and view linked student associations.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl shadow-ambient border border-neutral-200/50 dark:border-neutral-800/40 p-5">
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-center bg-neutral-50 dark:bg-neutral-800/30 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by parent name, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium focus:border-violet-500 outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* PARENTS LIST TABLE */}
      <div className="glass-panel rounded-2xl shadow-ambient border border-neutral-200/50 dark:border-neutral-800/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200/60 dark:border-neutral-700/60 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 font-bold">No</th>
                <th className="px-5 py-4 font-bold">Parent Details</th>
                <th className="px-5 py-4 font-bold">Contact</th>
                <th className="px-5 py-4 font-bold">Linked Student(s)</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-neutral-500 font-semibold">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      Loading parents...
                    </div>
                  </td>
                </tr>
              ) : filteredParents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-neutral-500 font-semibold">
                    No Parent accounts found.
                  </td>
                </tr>
              ) : (
                filteredParents.map((parent, index) => {
                  return (
                    <tr key={parent.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group">
                      <td className="px-5 py-4 font-semibold text-neutral-500">{index + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center">
                            <Users size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-neutral-900 dark:text-white">
                              {parent.user.firstName} {parent.user.lastName}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5">
                              {parent.relationToStudent || 'Parent/Guardian'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 text-xs text-neutral-500">
                           <span className="flex items-center gap-1"><Mail size={12} /> {parent.user.email}</span>
                           <span className="flex items-center gap-1"><Phone size={12} /> {parent.user.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                         {parent.students && parent.students.length > 0 ? (
                           <div className="flex flex-col gap-1">
                             {parent.students.map((student: any) => (
                               <div key={student.id} className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                 <LinkIcon size={12} /> {student.user.firstName} {student.user.lastName} ({student.enrollmentNumber})
                               </div>
                             ))}
                           </div>
                         ) : (
                           <span className="text-xs text-neutral-400 italic">No linked students</span>
                         )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center w-max gap-1.5 ${
                          parent.user.status === 'ACTIVE' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${parent.user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {parent.user.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center transition-colors"
                          >
                            <Edit size={14} />
                          </button>
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

export default ParentManagementPage;
