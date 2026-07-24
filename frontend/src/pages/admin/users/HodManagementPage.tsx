import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone, X, Shield, Lock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import userManagementService from '../../../services/userManagement.service';
import { toast } from 'react-toastify';

export const HodManagementPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [hods, setHods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHOD, setSelectedHOD] = useState<any | null>(null);

  const fetchHods = async () => {
    setLoading(true);
    try {
      const res = await userManagementService.getHODs();
      if (res.success) {
        setHods(res.data);
      }
    } catch (err: any) {
      toast.error('Failed to load HODs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHods();
  }, []);

  const filteredHods = hods.filter(hod => {
    const matchesSearch = searchTerm === '' || 
      hod.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      hod.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      hod.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = deptFilter === 'ALL' || hod.departmentId === deptFilter; // Simplified for now since we're using mock depts

    return matchesSearch && matchesDept;
  });

  const handleEditClick = (hod: any) => {
    setSelectedHOD(hod);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl pb-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Head of Departments</h2>
          <p className="text-sm text-neutral-500">Manage departmental leadership, assignments, and access.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <button 
              onClick={() => setIsAssignModalOpen(true)}
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-500/20 flex items-center gap-2 transition-all"
            >
              <Shield size={16} /> Assign New HOD
            </button>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="glass-panel rounded-2xl shadow-ambient border border-neutral-200/50 dark:border-neutral-800/40 p-5">
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-center bg-neutral-50 dark:bg-neutral-800/30 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Dept:</span>
              <select 
                value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:border-violet-500 shadow-sm min-w-[120px]"
              >
                <option value="ALL">All Depts</option>
                <option value="CS">Computer Science</option>
                <option value="CS-AIML">Computer Science & Engineering (AIML)</option>
                <option value="EC">Electronics</option>
                <option value="ME">Mechanical</option>
                <option value="CV">Civil</option>
              </select>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium focus:border-violet-500 outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* HODS LIST TABLE */}
      <div className="glass-panel rounded-2xl shadow-ambient border border-neutral-200/50 dark:border-neutral-800/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200/60 dark:border-neutral-700/60 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 font-bold">No</th>
                <th className="px-5 py-4 font-bold">Name & Email</th>
                <th className="px-5 py-4 font-bold">Department</th>
                <th className="px-5 py-4 font-bold">Contact</th>
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
                      Loading HODs...
                    </div>
                  </td>
                </tr>
              ) : filteredHods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-neutral-500 font-semibold">
                    No Head of Departments found.
                  </td>
                </tr>
              ) : (
                filteredHods.map((hod, index) => {
                  return (
                    <tr key={hod.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group">
                      <td className="px-5 py-4 font-semibold text-neutral-500">{index + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={hod.user.profileImage || `https://ui-avatars.com/api/?name=${hod.user.firstName}+${hod.user.lastName}&background=random`} 
                            alt={hod.user.firstName}
                            className="w-10 h-10 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700" 
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-neutral-900 dark:text-white">
                              {hod.user.firstName} {hod.user.lastName}
                            </span>
                            <span className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                              <Mail size={10} /> {hod.user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">{hod.department?.name || 'N/A'}</span>
                          <span className="text-[10px] font-bold text-neutral-500 uppercase">{hod.department?.code}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                         <span className="text-xs text-neutral-500 flex items-center gap-1">
                            <Phone size={12} /> {hod.user.phone || 'N/A'}
                          </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center w-max gap-1.5 ${
                          hod.isActive 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${hod.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {hod.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditClick(hod)}
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

      {/* EDIT MODAL PLACEHOLDER */}
      {isEditModalOpen && selectedHOD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Edit size={18} className="text-violet-600" />
                  Edit HOD - {selectedHOD.user.firstName}
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              
              <section>
                <h4 className="text-xs font-black text-neutral-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                  <Lock size={12} /> Appointment Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-2">Current Status</label>
                    <select 
                      defaultValue={selectedHOD.isActive ? 'ACTIVE' : 'INACTIVE'}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500"
                    >
                      <option value="ACTIVE">✅ Active</option>
                      <option value="INACTIVE">⏸️ Inactive (Relieved)</option>
                    </select>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-xs font-black text-neutral-400 tracking-widest uppercase mb-4">Edit Profile Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">First Name</label>
                    <input type="text" defaultValue={selectedHOD.user.firstName} className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Last Name</label>
                    <input type="text" defaultValue={selectedHOD.user.lastName} className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                  </div>
                </div>
              </section>

            </div>

            <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
              <button onClick={() => { toast.success('HOD updated!'); setIsEditModalOpen(false); }} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN HOD MODAL PLACEHOLDER */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Shield size={18} className="text-violet-600" /> Assign Department HOD
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl text-xs font-semibold text-indigo-800 dark:text-indigo-300 flex gap-2">
                Note: Assigning a new HOD will automatically relieve the current HOD of their duties in that department.
              </div>

              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Select Department *</label>
                    <select className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500">
                      <option>Computer Science</option>
                      <option>Computer Science & Engineering (AIML)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Select Teacher to Assign *</label>
                    <select className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500">
                      <option>Search teacher by name or email...</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Tenure Start Date *</label>
                    <input type="date" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Appointment Order No *</label>
                    <input type="text" placeholder="e.g. APPT/2024/001" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                  </div>
                </div>
              </section>
            </div>
            <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex justify-end gap-3">
              <button onClick={() => setIsAssignModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
              <button onClick={() => { toast.success('HOD assigned successfully!'); setIsAssignModalOpen(false); }} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all">Assign HOD</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HodManagementPage;
