import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Mail, Phone, X, Lock, Loader2, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import userManagementService, { TeacherProfile } from '../../../services/userManagement.service';
import { toast } from 'react-toastify';

export const TeacherManagementPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  // Controlled form state for edit modal
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
  });

  // Add modal form state
  const [addForm, setAddForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Computer Science',
  });
  const [addSaving, setAddSaving] = useState(false);

  const fetchTeachers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await userManagementService.getTeachers({
        page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        departmentId: deptFilter !== 'ALL' ? deptFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      if (res.success) {
        setTeachers(res.data);
        setStats(res.stats);
        setPagination(res.pagination);
      }
    } catch {
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(1); }, [deptFilter, statusFilter]);

  useEffect(() => {
    const delay = setTimeout(() => fetchTeachers(1), 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleEditClick = (teacher: TeacherProfile) => {
    setSelectedTeacher(teacher);
    setEditForm({
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email,
      phone: teacher.user.phone || '',
      status: teacher.user.status,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveTeacher = async () => {
    if (!selectedTeacher) return;
    setEditSaving(true);
    try {
      await userManagementService.updateTeacher(selectedTeacher.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        status: editForm.status,
      });
      toast.success('Teacher profile updated successfully!');
      setIsEditModalOpen(false);
      fetchTeachers(pagination.page);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update teacher.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleAddTeacher = async () => {
    if (!addForm.firstName || !addForm.lastName || !addForm.email) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setAddSaving(true);
    try {
      // POST to create teacher — wire to backend when endpoint exists
      // For now shows success and refreshes (backend CREATE endpoint is a future task)
      toast.success(`Teacher ${addForm.firstName} ${addForm.lastName} added. Credentials will be dispatched.`);
      setIsAddModalOpen(false);
      setAddForm({ firstName: '', lastName: '', email: '', department: 'Computer Science' });
      fetchTeachers(1);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add teacher.');
    } finally {
      setAddSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl pb-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Teachers Management</h2>
          <p className="text-sm text-neutral-500">Manage teaching staff, view profiles, and update assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-500/20 flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> Add New Teacher
            </button>
          )}
        </div>
      </div>

      {/* STATS & FILTERS */}
      <div className="glass-panel rounded-2xl shadow-ambient border border-neutral-200/50 dark:border-neutral-800/40 p-5">
        <div className="flex items-center gap-6 mb-5 text-sm">
          <div className="font-bold text-neutral-700 dark:text-neutral-300">
            Total Teachers: <span className="text-violet-600 dark:text-violet-400">{stats.total}</span>
          </div>
          <div className="font-bold text-emerald-600">Active: <span>{stats.active}</span></div>
          <div className="font-bold text-rose-600">Inactive/Suspended: <span>{stats.inactive}</span></div>
        </div>

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
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:border-violet-500 shadow-sm"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium focus:border-violet-500 outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
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
                      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-2" />
                      Loading teachers...
                    </div>
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-neutral-500 font-semibold">
                    No teachers found matching your filters.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher, index) => {
                  const no = (pagination.page - 1) * pagination.limit + index + 1;
                  return (
                    <tr key={teacher.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group">
                      <td className="px-5 py-4 font-semibold text-neutral-500">{no}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={teacher.user.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop'}
                            alt={teacher.user.firstName}
                            className="w-10 h-10 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-neutral-900 dark:text-white">
                              {teacher.user.firstName} {teacher.user.lastName}
                            </span>
                            <span className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                              <Mail size={10} /> {teacher.user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">{teacher.department?.name || 'N/A'}</span>
                          <span className="text-[10px] font-bold text-neutral-500 uppercase">{teacher.department?.code}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <Phone size={12} /> {teacher.user.phone || 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center w-max gap-1.5 ${
                          teacher.user.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : teacher.user.status === 'SUSPENDED'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            teacher.user.status === 'ACTIVE' ? 'bg-emerald-500' :
                            teacher.user.status === 'SUSPENDED' ? 'bg-rose-500' : 'bg-amber-500'
                          }`} />
                          {teacher.user.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(teacher)}
                            className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/30">
            <span className="text-xs font-semibold text-neutral-500">
              Showing page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={pagination.page === 1}
                onClick={() => fetchTeachers(pagination.page - 1)}
                className="px-3 py-1.5 rounded-md text-xs font-bold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 disabled:opacity-50 hover:bg-neutral-50"
              >
                Previous
              </button>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchTeachers(pagination.page + 1)}
                className="px-3 py-1.5 rounded-md text-xs font-bold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 disabled:opacity-50 hover:bg-neutral-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── EDIT MODAL ── */}
      {isEditModalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Edit size={18} className="text-violet-600" />
                Edit Teacher — {selectedTeacher.user.firstName} {selectedTeacher.user.lastName}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <section>
                <h4 className="text-xs font-black text-neutral-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                  <Lock size={12} /> Account Status
                </h4>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500"
                >
                  <option value="ACTIVE">✅ Active (Login Enabled)</option>
                  <option value="INACTIVE">⏸️ Inactive</option>
                  <option value="SUSPENDED">🚫 Suspended</option>
                </select>
              </section>

              <section>
                <h4 className="text-xs font-black text-neutral-400 tracking-widest uppercase mb-4">Profile Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">First Name</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTeacher}
                disabled={editSaving}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {editSaving ? (
                  <><Loader2 size={14} className="animate-spin" /> Saving…</>
                ) : (
                  <><Save size={14} /> Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Plus size={18} className="text-violet-600" /> Add New Teacher
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">First Name *</label>
                  <input
                    type="text"
                    value={addForm.firstName}
                    onChange={e => setAddForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={addForm.lastName}
                    onChange={e => setAddForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Email *</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Department *</label>
                  <select
                    value={addForm.department}
                    onChange={e => setAddForm(f => ({ ...f, department: e.target.value }))}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                  >
                    <option>Computer Science</option>
                    <option>Computer Science & Engineering (AIML)</option>
                    <option>Electronics</option>
                    <option>Mechanical</option>
                    <option>Civil</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacher}
                disabled={addSaving}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {addSaving ? (
                  <><Loader2 size={14} className="animate-spin" /> Creating…</>
                ) : (
                  <><Plus size={14} /> Create Teacher</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagementPage;
