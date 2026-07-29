import React, { useState, useEffect } from 'react';
import { Mail, Lock, KeyRound, Loader2, ShieldCheck, CheckCircle2, RefreshCw, X, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import OtpInputBox from './OtpInputBox';

export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendingOtp, setResendingOtp] = useState(false);

  // Prevent background scrolling when modal is open & add ESC listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  // Cooldown Timer
  useEffect(() => {
    let timer;
    if (isOpen && step === 2 && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, step, resendCooldown]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  // Step 1: Send Forgot Password OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/send-forgot-password-otp', { email });
      if (res.data.success) {
        toast.success('Password reset OTP sent to your email!');
        setStep(2);
        setResendCooldown(60);
        setOtp('');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send OTP. Please check your email address.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendingOtp) return;
    setResendingOtp(true);
    try {
      const res = await api.post('/auth/send-forgot-password-otp', { email });
      if (res.data.success) {
        toast.success('A new password reset OTP has been sent to your email.');
        setResendCooldown(60);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setResendingOtp(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.length !== 6 || isNaN(Number(otp))) {
      toast.error('Please enter a valid 6-digit numeric OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-forgot-password-otp', { email, otp });
      if (res.data.success) {
        toast.success('OTP verified! Please set your new password.');
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        newPassword,
        confirmPassword,
      });

      if (res.data.success) {
        toast.success('Password updated successfully! Please log in with your new password.');
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-[8px] transition-opacity duration-300">
      <div className="bg-white dark:bg-neutral-900 rounded-[24px] w-[92vw] max-w-[380px] sm:w-[480px] sm:max-w-[480px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-neutral-800 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* Header Branding & Status */}
        <div className="text-center space-y-3">
          <div className="size-14 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-indigo-100 dark:border-indigo-900/40">
            {step === 1 && <Mail size={26} />}
            {step === 2 && <KeyRound size={26} />}
            {step === 3 && <Lock size={26} />}
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Verify Email OTP'}
              {step === 3 && 'Reset Password'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto mt-1 break-all px-2">
              {step === 1 && 'Enter your registered email address to receive a password reset OTP.'}
              {step === 2 && (
                <>We sent a 6-digit code to <strong className="text-slate-900 dark:text-white font-bold">{email}</strong></>
              )}
              {step === 3 && 'Set a strong password for your JCER admission portal account.'}
            </p>
          </div>
        </div>

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Mail size={15} className="text-indigo-600" />
                Registered Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-4 h-[52px] bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-[14px] focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm font-semibold outline-none transition-all"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full h-[52px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-[14px] text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Sending Reset OTP...</span>
                </>
              ) : (
                <>
                  <span>Send Reset OTP</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: 6-BOX OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest text-center mb-1">
                Enter 6-Digit Verification Code
              </label>
              
              <OtpInputBox
                value={otp}
                onChange={(val) => setOtp(val)}
                onEnterSubmit={handleVerifyOtp}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full h-[52px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-[14px] text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Verify OTP Code</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-indigo-600 font-bold"
              >
                ← Change Email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || resendingOtp}
                className="font-extrabold text-indigo-600 hover:underline flex items-center gap-1.5 disabled:opacity-50 disabled:no-underline"
              >
                <RefreshCw size={12} className={resendingOtp ? 'animate-spin' : ''} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 h-[52px] bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-[14px] focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm font-semibold outline-none"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 h-[52px] bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-[14px] focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm font-semibold outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
              className="w-full h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-[14px] text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
