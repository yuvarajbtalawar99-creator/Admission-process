import React, { useState } from 'react';
import { KeyRound, ShieldAlert } from 'lucide-react';
import authService from '../../services/auth.service';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import { toast } from 'react-toastify';

export const ForcePasswordChange: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.changePassword(oldPassword, newPassword);
      const token = authService.getToken() as string;
      
      // Update Redux state
      dispatch(loginSuccess({ user, token }));
      toast.success('Password updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center">
            <ShieldAlert size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-center mb-2">Update Required</h2>
        <p className="text-sm text-neutral-500 text-center mb-8">
          For your security, please change your temporary password before accessing your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <><KeyRound size={18} /> Save & Continue</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordChange;
