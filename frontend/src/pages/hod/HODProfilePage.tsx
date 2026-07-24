import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  ShieldCheck 
} from 'lucide-react';

export const HODProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [firstName, setFirstName] = useState(user?.firstName || 'Dr. Sharma');
  const [lastName, setLastName] = useState(user?.lastName || 'Prasad');
  const [phone, setPhone] = useState(user?.phone || '9876543202');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('HOD Profile details updated.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.warning('Please fill password inputs.');
      return;
    }
    toast.success('Security password updated successfully.');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Profile Overview Banner */}
      <div className="glass-panel rounded-[32px] px-6 py-6 shadow-ambient flex items-center space-x-4">
        <img
          src={user?.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&fit=crop'}
          alt="HOD Profile"
          className="w-16 h-16 rounded-2xl object-cover border border-white/50 shadow-sm"
        />
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-neutral-800 dark:text-white tracking-tight">
            {firstName} {lastName}
          </h2>
          <p className="text-xs text-neutral-450 font-bold mt-1">
            Role: HEAD OF DEPARTMENT (HOD) CSE | Active Status: ACTIVE
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Personal Details */}
        <div className="lg:col-span-7 glass-panel rounded-[32px] p-6 shadow-ambient">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800/50 pb-3 mb-4">
            <User className="w-4.5 h-4.5 text-sky-500" />
            PERSONAL DETAILS
          </h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-sky-500 font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-sky-500 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">Phone / Mobile No</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs outline-none focus:border-sky-500 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-405" />
                <input
                  type="email"
                  value={user?.email || 'hod@college.com'}
                  disabled
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-xl text-xs outline-none font-semibold text-neutral-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Profile Details
            </button>
          </form>
        </div>

        {/* Security update */}
        <div className="lg:col-span-5 glass-panel rounded-[32px] p-6 shadow-ambient">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800/50 pb-3 mb-4">
            <Lock className="w-4.5 h-4.5 text-violet-500" />
            SECURITY CREDENTIALS
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Update Security Credentials
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default HODProfilePage;
