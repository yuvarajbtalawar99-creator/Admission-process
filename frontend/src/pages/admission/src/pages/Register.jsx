import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, Loader2, Eye, EyeOff, GraduationCap, User, ArrowRight, ShieldCheck, KeyRound, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../../../../utils/validation.util';
import OtpInputBox from '../components/OtpInputBox';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isCheckingPhone, setIsCheckingPhone] = useState(false);

    // OTP Modal states
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);
    const [resendingOtp, setResendingOtp] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Lock background scroll when modal is open & add ESC key listener
    useEffect(() => {
        if (showOtpModal) {
            document.body.style.overflow = 'hidden';
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    setShowOtpModal(false);
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                document.body.style.overflow = '';
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [showOtpModal]);

    // Cooldown Timer Effect
    useEffect(() => {
        let timer;
        if (showOtpModal && resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showOtpModal, resendCooldown]);

    useEffect(() => {
        const checkPhoneUniqueness = async () => {
            const val = formData.phone;
            if (!val) {
                setPhoneError('');
                return;
            }
            
            if (val.length !== 10 || isNaN(val)) {
                setPhoneError('Mobile number must be a 10-digit number');
                return;
            }

            setIsCheckingPhone(true);
            setPhoneError('');

            try {
                const res = await api.post('/auth/check-phone', { phone: val });
                if (res.data.exists) {
                    setPhoneError('This mobile number is already registered.');
                } else {
                    setPhoneError('');
                }
            } catch (err) {
                console.error('Phone check failed', err);
            } finally {
                setIsCheckingPhone(false);
            }
        };

        const timer = setTimeout(checkPhoneUniqueness, 600);
        return () => clearTimeout(timer);
    }, [formData.phone]);

    useEffect(() => {
        const val = formData.password;
        if (!val) {
            setPasswordError('');
            return;
        }
        if (val.length < 8) {
            setPasswordError('Password must be at least 8 characters.');
        } else {
            setPasswordError('');
        }
    }, [formData.password]);

    // Handle Form Submit -> Sends Registration OTP
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationResult = registerSchema.safeParse({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone || '',
        });

        if (!validationResult.success) {
            const firstIssue = validationResult.error.issues[0];
            toast.error(firstIssue.message);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (phoneError) {
            toast.error(phoneError);
            return;
        }

        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        setLoading(true);
        try {
            // Request Registration OTP via Nodemailer
            const res = await api.post('/auth/send-registration-otp', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
            });

            if (res.data.success) {
                toast.success('OTP sent to your email address!');
                setShowOtpModal(true);
                setResendCooldown(60);
                setOtp('');
            }
        } catch (error) {
            const fields = error.response?.data?.fields;
            if (fields && typeof fields === 'object') {
                Object.values(fields).forEach((msg) => {
                    toast.error(msg);
                });
            } else {
                toast.error(error.response?.data?.error || 'Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP handler
    const handleResendOtp = async () => {
        if (resendCooldown > 0 || resendingOtp) return;
        setResendingOtp(true);
        try {
            const res = await api.post('/auth/send-registration-otp', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
            });
            if (res.data.success) {
                toast.success('A new OTP has been sent to your email address.');
                setResendCooldown(60);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to resend OTP.');
        } finally {
            setResendingOtp(false);
        }
    };

    // Verify OTP & Complete Registration
    const handleVerifyAndRegister = async (e) => {
        if (e) e.preventDefault();
        if (!otp || otp.length !== 6 || isNaN(Number(otp))) {
            toast.error('Please enter a valid 6-digit numeric OTP code.');
            return;
        }

        setVerifyingOtp(true);
        try {
            // Step 1: Verify OTP
            const verifyRes = await api.post('/auth/verify-registration-otp', {
                email: formData.email,
                otp,
            });

            if (verifyRes.data.success) {
                // Step 2: Register Account
                const registerRes = await api.post('/auth/register', {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                });

                if (registerRes.data.success) {
                    toast.success('Email verified & Account created successfully! 🎉');
                    setShowOtpModal(false);
                    login(registerRes.data.data.token);
                    navigate('/admission/dashboard');
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'OTP verification failed.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    return (
        <div className="w-full animate-fade-in max-w-md mx-auto lg:mx-0">
            <div className="mb-3 sm:mb-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary-100 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1.5 sm:mb-2">
                    <GraduationCap size={13} />
                    Admission 2026
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-0.5">Student Registration</h2>
                <p className="text-xs text-slate-500">Create your account to begin the admission process</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700" htmlFor="firstName">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                            placeholder="John"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700" htmlFor="lastName">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                            placeholder="Doe"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="email">
                        <Mail size={14} className="text-slate-400" />
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                        placeholder="student@example.com"
                        required
                    />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="phone">
                            <Phone size={14} className="text-slate-400" />
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        {isCheckingPhone && <span className="text-[10px] text-primary-600 font-semibold animate-pulse">Checking...</span>}
                    </div>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 transition-all text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 ${phoneError ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-primary-600 focus:border-primary-600'}`}
                        placeholder="9876543210"
                        required
                    />
                    {phoneError && <p className="text-[11px] text-red-500 font-medium">{phoneError}</p>}
                </div>

                {/* Password & Confirm side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="password">
                            <Lock size={14} className="text-slate-400" />
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 transition-all text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 ${passwordError ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-primary-600 focus:border-primary-600'}`}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                        {passwordError && <p className="text-[11px] text-red-500 font-medium">{passwordError}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700" htmlFor="confirmPassword">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !!phoneError || !!passwordError}
                    className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-md shadow-primary-600/20 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm mt-1"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Email OTP...</span>
                        </>
                    ) : (
                        <>
                            <span>Continue Registration</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-3 text-center text-xs text-slate-600">
                Already registered?{' '}
                <Link to="/admission/login" className="font-bold text-primary-600 hover:underline">
                    Log in here
                </Link>
            </div>

            {/* ═══ EMAIL OTP VERIFICATION MODAL ═══ */}
            {showOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-[8px] transition-opacity duration-300">
                    <div className="bg-white dark:bg-neutral-900 rounded-[24px] w-[92vw] max-w-[380px] sm:w-[480px] sm:max-w-[480px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-neutral-800 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
                        
                        <button
                            onClick={() => setShowOtpModal(false)}
                            className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Close (Esc)"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center space-y-3">
                            <div className="size-14 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-indigo-100 dark:border-indigo-900/40">
                                <KeyRound size={26} />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Email OTP Verification</h3>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto mt-1 break-all px-2">
                                    We sent a 6-digit verification code to <strong className="text-slate-900 dark:text-white font-bold">{formData.email}</strong>
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest text-center mb-1">
                                    Enter 6-Digit Verification Code
                                </label>
                                
                                <OtpInputBox
                                    value={otp}
                                    onChange={(val) => setOtp(val)}
                                    onEnterSubmit={handleVerifyAndRegister}
                                    disabled={verifyingOtp}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={verifyingOtp || otp.length !== 6}
                                className="w-full h-[52px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-[14px] text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {verifyingOtp ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Verifying & Registering...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={18} />
                                        <span>Verify OTP & Create Account</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-neutral-800">
                            <span className="text-slate-500 font-medium">
                                Didn't receive the code?
                            </span>

                            <button
                                onClick={handleResendOtp}
                                disabled={resendCooldown > 0 || resendingOtp}
                                className="font-extrabold text-indigo-600 hover:underline flex items-center gap-1.5 disabled:opacity-50 disabled:no-underline"
                            >
                                <RefreshCw size={12} className={resendingOtp ? 'animate-spin' : ''} />
                                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
