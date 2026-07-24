import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff, LayoutGrid, AlertCircle } from 'lucide-react';
import Toast from '../../components/common/Toast';

export const AccountPage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setToast({ type: 'error', message: 'Please complete all form inputs.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'Confirm password does not match.' });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setToast({ type: 'success', message: 'Security credentials updated successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Banner Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Security & Account Settings</h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Configure credentials, active sessions, and multi-factor authentication</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side Form - Change Password (col-span-7) */}
        <form onSubmit={handlePasswordChange} className="lg:col-span-7 glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Key className="w-5 h-5 text-indigo-550" />
            Change Account Password
          </h3>

          <div className="space-y-1 relative">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Current Password</label>
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-750 focus:border-indigo-500 rounded-2xl py-3.5 px-4 pr-11 text-xs font-semibold outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3.5 top-9 text-neutral-450 hover:text-neutral-700 dark:hover:text-white cursor-pointer p-0.5"
            >
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-1 relative">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">New Password</label>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-750 focus:border-indigo-500 rounded-2xl py-3.5 px-4 pr-11 text-xs font-semibold outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-9 text-neutral-450 hover:text-neutral-700 dark:hover:text-white cursor-pointer p-0.5"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-1 relative">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Confirm New Password</label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-750 focus:border-indigo-500 rounded-2xl py-3.5 px-4 pr-11 text-xs font-semibold outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-9 text-neutral-450 hover:text-neutral-700 dark:hover:text-white cursor-pointer p-0.5"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary-custom font-bold px-6 py-3 rounded-2xl text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Updating credentials...' : 'Update Password'}
            </button>
          </div>
        </form>

        {/* Right Side - Session Details (col-span-5) */}
        <div className="lg:col-span-5 glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <LayoutGrid className="w-5 h-5 text-neutral-450" />
            Security Warnings
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 text-xs text-amber-600 dark:text-amber-400 font-medium leading-relaxed">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Two-Factor Authentication (2FA) is currently disabled. Enable 2FA to protect your student portal from credential theft.</p>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">Last Successful Login</p>
              <p className="text-xs font-bold text-neutral-800 dark:text-white mt-1">24 June 2026, 03:15 PM</p>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">IP Address: 192.168.1.10 (Pune, India)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
