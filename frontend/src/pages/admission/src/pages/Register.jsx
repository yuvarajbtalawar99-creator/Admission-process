import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, Loader2, Eye, EyeOff, GraduationCap, User, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '@jcer/validation';

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
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform local validation using the shared schema
        const validationResult = registerSchema.safeParse({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone || '',
        });

        if (!validationResult.success) {
            // Display the first validation issue message
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
            const response = await api.post('/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });
            if (response.data.success) {
                toast.success('Registration successful! Redirecting to your portal...');
                login(response.data.data.token);
                navigate('/admission/dashboard');
            }
        } catch (error) {
            const fields = error.response?.data?.fields;
            if (fields && typeof fields === 'object') {
                // Display normalized field-level validation errors from backend
                Object.values(fields).forEach((msg) => {
                    toast.error(msg);
                });
            } else {
                toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-fade-in max-w-sm mx-auto lg:mx-0">
            <div className="mb-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
                    <GraduationCap size={14} />
                    Admission 2024
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Student Registration</h2>
                <p className="text-slate-500">Create your account to begin the admission process</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="firstName">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400"
                            placeholder="First"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="lastName">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400"
                            placeholder="Last"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2" htmlFor="email">
                        <Mail size={18} className="text-slate-400" />
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400"
                        placeholder="your.email@example.com"
                        required
                    />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2" htmlFor="phone">
                        <Phone size={18} className="text-slate-400" />
                        Mobile Number
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 transition-all text-slate-900 placeholder:text-slate-400 ${
                                phoneError
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : formData.phone.length === 10 && !phoneError
                                    ? 'border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500'
                                    : 'border-slate-200 focus:ring-primary-600 focus:border-primary-600'
                            }`}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                        />
                        {isCheckingPhone && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 size={16} className="animate-spin text-slate-400" />
                            </div>
                        )}
                    </div>
                    {phoneError && (
                        <p className={`text-xs font-medium animate-fade-in ${phoneError.includes('already') ? 'text-red-600' : 'text-slate-500'}`}>
                            {phoneError}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2" htmlFor="password">
                        <Lock size={18} className="text-slate-400" />
                        Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 transition-all text-slate-900 placeholder:text-slate-400 ${
                                passwordError
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : formData.password && !passwordError
                                    ? 'border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500'
                                    : 'border-slate-200 focus:ring-primary-600 focus:border-primary-600'
                            }`}
                            placeholder="Min 8 characters"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {passwordError && (
                        <p className="text-xs font-medium text-red-600 animate-fade-in">
                            {passwordError}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="confirmPassword">
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400"
                        placeholder="Repeat your password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : (
                        <>
                            Create Account & Apply
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-4">
                    Already have an account? <Link to="/admission/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
                </p>
                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Secured by SSL</span>
                    <span className="size-1 bg-slate-200 rounded-full"></span>
                    <span>Institutional Policy</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
