import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAcademicYear } from '../../../../../utils/date.util';
import {
    User,
    GraduationCap,
    HelpCircle,
    Users,
    Upload,
    FileText as FileDigit,
    Send,
    Loader2,
    Activity,
    LifeBuoy,
    Calendar,
    FileText,
    CreditCard,
    Download,
    CheckCircle,
    PlayCircle,
    Lock,
    ArrowRight,
    Sparkles,
    Eye,
    Clock,
    Search,
    ShieldCheck,
    XCircle,
    AlertTriangle,
    Award
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import useApplicationStatus from '../../hooks/useApplicationStatus';
import StatusBadge from '../../components/StatusBadge';
import ActivityTimeline from '../../components/ActivityTimeline';
import Skeleton, { CardSkeleton } from '../../components/Skeleton';
import { downloadAdmissionPDF } from '../../utils/pdfGenerator';

const StudentDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sysConfig, setSysConfig] = useState(null);
    const {
        stepStatus,
        loading,
        getStepState,
        isStepAccessible,
        refetch
    } = useApplicationStatus();

    useEffect(() => {
        api.get('/admin/settings')
            .then(res => {
                if (res.data?.success && res.data?.data) {
                    setSysConfig(res.data.data);
                }
            })
            .catch(() => {
                api.get('/system/config').then(res => {
                    if (res.data?.success && res.data?.data) {
                        setSysConfig(res.data.data);
                    }
                }).catch(() => {});
            });
    }, []);

    if (loading) {
        return (
            <div className="space-y-10 pb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2 w-1/2">
                        <Skeleton width="40%" height="28px" />
                        <Skeleton width="80%" height="16px" className="mt-2" />
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm min-w-[300px] flex gap-5 items-center">
                        <div className="flex-grow space-y-2">
                            <Skeleton width="50%" height="10px" />
                            <Skeleton width="100%" height="10px" className="mt-1" />
                        </div>
                        <Skeleton width="48px" height="48px" circle />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(7)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    const completedCount = stepStatus?.completedCount || 0;
    const totalSteps = stepStatus?.totalSteps || 7;
    const progressPercent = stepStatus?.progressPercent || 0;
    const applicationStatus = stepStatus?.applicationStatus;
    const isSubmitted = applicationStatus && applicationStatus !== 'DRAFT' && applicationStatus !== 'CORRECTION_REQUIRED';
    const timeline = stepStatus?.timeline || {};

    const closingDateIso = sysConfig?.admissionClosingDate;
    const isClosed = closingDateIso ? (new Date() > new Date(closingDateIso)) : false;

    const computeFeeStatusText = (status, data) => {
        if (data?.applicationFeeStatus) return data.applicationFeeStatus;
        if (status === 'CANCELLED') return 'Refund Completed';
        if (status === 'CANCELLATION_REQUESTED') return 'Refund Initiated';
        if (status === 'FEE_VERIFIED' || status === 'ENROLLED' || status === 'USN_ASSIGNED' || data?.feesVerified) return 'Paid';
        if (status === 'FEE_RECEIPT_UPLOADED' || data?.admissionFeeReceiptUrl) return 'Payment Verification Pending';
        if (data?.admissionType === 'MANAGEMENT') return 'Not Applicable';
        return 'Pending Payment';
    };

    const feeStatusText = computeFeeStatusText(applicationStatus, stepStatus);

    // ═══════ SUBMITTED STATUS DASHBOARD ═══════
    if (isSubmitted) {
        return <SubmittedDashboard
            stepStatus={stepStatus}
            applicationStatus={applicationStatus}
            timeline={timeline}
            navigate={navigate}
            refetch={refetch}
            closingDateIso={closingDateIso}
            feeStatusText={feeStatusText}
            isClosed={isClosed}
        />;
    }

    // ═══════ FORM STEPS DASHBOARD ═══════
    const steps = [
        {
            id: 1, key: 'admission', title: "Admission Details",
            subtitle: "Select admission type and preferred branch.",
            icon: GraduationCap, targetStep: 1,
        },
        {
            id: 2, key: 'personalDetails', title: "Personal Details",
            subtitle: "Basic contact info and personal identification.",
            icon: User, targetStep: 2,
        },
        {
            id: 3, key: 'parentDetails', title: "Parent Details",
            subtitle: "Parent/Guardian identification and occupation.",
            icon: Users, targetStep: 3,
        },
        {
            id: 4, key: 'addressDetails', title: "Address Details",
            subtitle: "Permanent and correspondence addresses.",
            icon: HelpCircle, targetStep: 4,
        },
        {
            id: 5, key: 'academicDetails', title: "Academic Details",
            subtitle: "High school records and standardized test scores.",
            icon: GraduationCap, targetStep: 5,
        },
        {
            id: 6, key: 'documents', title: "Document Upload",
            subtitle: "Digital copies of certificates and ID proof.",
            icon: Upload, targetStep: 6,
        },
        {
            id: 7, key: 'review', title: "Review & Submit",
            subtitle: "Verify all information before final submission.",
            icon: Send, targetStep: 7,
        }
    ];

    const handleStepClick = (step) => {
        const state = getStepState(step.id);

        if (state === 'LOCKED') {
            toast.error("Complete the previous steps first to unlock this step.");
            return;
        }

        localStorage.setItem('admission_form_step', step.targetStep.toString());
        navigate('/admission/application');
    };

    return (
        <div className="animate-fade-in space-y-10 pb-16">
            {/* Welcome & Overall Progress */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Application Dashboard</h1>
                    <p className="text-slate-500 max-w-xl">Complete the following steps to submit your application for the {stepStatus?.academicYear || getAcademicYear()} Academic Year.</p>
                </div>

                {/* Progress Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm min-w-[300px]">
                    <div className="flex items-center gap-5">
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Overall Progress</span>
                                <span className="text-xs font-bold text-slate-900">{completedCount}/{totalSteps} steps</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700 ease-out"
                                    style={{
                                        width: `${progressPercent}%`,
                                        background: progressPercent === 100
                                            ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                                            : 'linear-gradient(90deg, #1241a1, #3b82f6)'
                                    }}
                                ></div>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                                {progressPercent === 100 ? '🎉 All steps completed!' : `${progressPercent}% completed`}
                            </p>
                        </div>
                        <div className={`size-12 flex items-center justify-center rounded-full transition-all duration-500 ${
                            progressPercent === 100
                                ? 'bg-green-100 text-green-600'
                                : 'bg-primary-600/10 text-primary-600'
                        }`}>
                            {progressPercent === 100 ? <CheckCircle size={24} /> : <Activity size={24} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {steps.map((step, index) => {
                    const state = getStepState(step.id);
                    const isCompleted = state === 'COMPLETED';
                    const isActive = state === 'ACTIVE';
                    const isLocked = state === 'LOCKED';

                    return (
                        <div
                            key={step.id}
                            onClick={() => handleStepClick(step)}
                            className={`
                                step-card group relative flex flex-col bg-white rounded-xl p-6 transition-all duration-500
                                ${isActive
                                    ? 'border-2 border-primary-600 shadow-lg shadow-primary-600/10 -translate-y-1 step-active-glow'
                                    : 'border-2 border-slate-100'}
                                ${isCompleted
                                    ? 'border-green-400 shadow-lg shadow-green-500/5'
                                    : ''}
                                ${isLocked
                                    ? 'opacity-50 cursor-not-allowed bg-slate-50/80 border-slate-200 grayscale-[20%]'
                                    : 'cursor-pointer hover:-translate-y-1.5 hover:shadow-xl'}
                            `}
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            {isActive && (
                                <div className="absolute -top-3 left-6 bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10 flex items-center gap-1.5 shadow-md shadow-primary-600/30">
                                    <Sparkles size={10} />
                                    Active Step
                                </div>
                            )}

                            {isCompleted && (
                                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl">
                                    <div className="absolute top-2 -right-3 bg-green-500 text-white text-[8px] font-bold px-5 py-0.5 rotate-45 shadow-sm">
                                        ✓ DONE
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-5">
                                <div className={`
                                    size-12 rounded-xl flex items-center justify-center transition-all duration-500
                                    ${isCompleted ? 'bg-green-100 text-green-600 shadow-sm' : ''}
                                    ${isActive ? 'bg-primary-600/10 text-primary-600 shadow-sm' : ''}
                                    ${isLocked ? 'bg-slate-100 text-slate-300' : ''}
                                `}>
                                    {step.icon && <step.icon size={24} />}
                                </div>

                                <div className={`
                                    text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 transition-all duration-500
                                    ${isCompleted ? 'bg-green-100 text-green-700' : ''}
                                    ${isActive ? 'bg-primary-50 text-primary-700' : ''}
                                    ${isLocked ? 'bg-slate-100 text-slate-400' : ''}
                                `}>
                                    {isCompleted ? (
                                        <><CheckCircle size={12} /> Completed</>
                                    ) : isActive ? (
                                        <><PlayCircle size={12} /> In Progress</>
                                    ) : (
                                        <><Lock size={12} /> Locked</>
                                    )}
                                </div>
                            </div>

                            <h3 className={`text-lg font-bold mb-1 transition-colors duration-300 ${isLocked ? 'text-slate-300' : 'text-slate-900'}`}>
                                {step.id}. {step.title}
                            </h3>
                            <p className={`text-sm mb-6 leading-relaxed transition-colors duration-300 ${isLocked ? 'text-slate-300' : 'text-slate-500'}`}>
                                {step.subtitle}
                            </p>

                            <div className="mt-auto">
                                {isLocked ? (
                                    <div className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-slate-300">
                                        <Lock size={12} />
                                        <span>Complete previous step to unlock</span>
                                    </div>
                                ) : (
                                    <button className={`
                                        w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300
                                        ${isCompleted
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                            : 'bg-primary-600 text-white shadow-md shadow-primary-600/20 hover:bg-primary-700 hover:shadow-lg'
                                        }
                                    `}>
                                        {isCompleted ? 'View / Edit' : 'Continue Application'}
                                        <ArrowRight size={16} className={isCompleted ? '' : 'group-hover:translate-x-0.5 transition-transform'} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Help Card */}
                <div className="group relative flex flex-col bg-primary-600/5 rounded-xl border border-primary-600/20 p-6">
                    <div className="size-12 rounded-xl bg-primary-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-primary-600/20">
                        <LifeBuoy size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Need Help?</h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">Our admission officers are here to assist you with the process.</p>
                    <button 
                        onClick={() => navigate('/admission/support')}
                        className="mt-auto py-2.5 px-4 rounded-lg border border-primary-600 text-primary-600 font-semibold text-sm hover:bg-primary-600 hover:text-white transition-all duration-300"
                    >
                        Contact Support
                    </button>
                </div>
            </div>

            {/* Dynamic Footer */}
            <DashboardFooterInfo closingDateIso={closingDateIso} feeStatusText={feeStatusText} isClosed={isClosed} />
        </div>
    );
};

// ═══════════════════════════════════════════════
//  DYNAMIC DASHBOARD FOOTER INFO COMPONENT
// ═══════════════════════════════════════════════
const DashboardFooterInfo = ({ closingDateIso, feeStatusText, isClosed }) => {
    const handleHandbookDownload = () => {
        window.open('/api/public/handbook', '_blank');
    };

    const formattedClosing = () => {
        if (isClosed) {
            return (
                <span className="text-rose-600 font-black flex items-center gap-1.5">
                    <span className="inline-block size-2 rounded-full bg-rose-600 animate-pulse" />
                    Admissions Closed
                </span>
            );
        }
        if (!closingDateIso) return '31 Aug 2026 • 11:59 PM';
        const d = new Date(closingDateIso);
        if (isNaN(d.getTime())) return '31 Aug 2026 • 11:59 PM';
        const formattedDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const formattedTime = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        return `${formattedDate} • ${formattedTime}`;
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            {/* 1. ADMISSION CLOSING DATE */}
            <div className="flex items-center gap-4 group">
                <div className={`p-3 rounded-full group-hover:scale-110 transition-transform ${isClosed ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                    <Calendar size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {isClosed ? 'Status' : 'Admission Closes'}
                    </p>
                    <p className="text-base font-bold text-slate-900">{formattedClosing()}</p>
                </div>
            </div>

            {/* 2. ADMISSION HANDBOOK */}
            <div className="flex items-center gap-4 group">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admission Handbook</p>
                    <button
                        type="button"
                        onClick={handleHandbookDownload}
                        className="text-base font-bold text-primary-600 hover:underline flex items-center gap-1.5 text-left cursor-pointer"
                    >
                        Download Handbook <Download size={14} />
                    </button>
                </div>
            </div>

            {/* 3. APPLICATION FEE STATUS */}
            <div className="flex items-center gap-4 group">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
                    <CreditCard size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Fee Status</p>
                    <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                        <span className={`inline-block size-2.5 rounded-full ${
                            feeStatusText === 'Paid' ? 'bg-emerald-500' :
                            feeStatusText === 'Payment Verification Pending' ? 'bg-amber-500' :
                            feeStatusText === 'Refund Completed' ? 'bg-purple-500' :
                            'bg-slate-400'
                        }`} />
                        {feeStatusText || 'Pending Payment'}
                    </p>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════
//  SUBMITTED STATUS DASHBOARD (Inner Component)
// ═══════════════════════════════════════════════

const SubmittedDashboard = ({ stepStatus, applicationStatus, timeline, navigate, refetch, closingDateIso, feeStatusText, isClosed }) => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelRemarks, setCancelRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Please upload a PDF, JPG, or PNG file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size exceeds 5MB limit.');
            return;
        }

        setSelectedFile(file);
    };

    const handleUploadReceipt = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        setUploadProgress(20);

        try {
            const formData = new FormData();
            formData.append('admissionFeeReceipt', selectedFile);

            setUploadProgress(60);
            const res = await api.post('/student/upload-fee-receipt', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setUploadProgress(100);
            if (res.data.success) {
                toast.success('Fee receipt uploaded successfully! Admin has been notified.');
                setSelectedFile(null);
                if (refetch) refetch();
            }
        } catch (err) {
            toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to upload fee receipt.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleCancelSubmit = async () => {
        if (!cancelReason) return;
        setIsSubmitting(true);
        try {
            const res = await api.post('/student/cancellation-request', { reason: cancelReason, remarks: cancelRemarks });
            if (res.data.success) {
                toast.success('Admission cancellation request submitted successfully');
                setShowCancelModal(false);
                setCancelReason('');
                setCancelRemarks('');
                if (refetch) refetch();
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to submit cancellation request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusMeta = (status) => {
        switch (status) {
            case 'SUBMITTED':
                return { label: 'Application Submitted', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', desc: 'Your application is being reviewed by the admissions team.' };
            case 'UNDER_REVIEW':
                return { label: 'Under Review', icon: Search, color: 'text-amber-600', bg: 'bg-amber-100', desc: 'An administrator is currently reviewing your application.' };
            case 'DOCUMENT_VERIFIED':
                return { label: 'Documents Verified', icon: ShieldCheck, color: 'text-teal-600', bg: 'bg-teal-100', desc: 'Your documents have been verified. Awaiting fee payment.' };
            case 'APPROVED':
                return { label: 'Admission Approved', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'Your application has been approved! Please pay ₹500 fee at college office and upload official receipt below.' };
            case 'FEE_RECEIPT_UPLOADED':
                return { label: 'Fee Receipt Uploaded', icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-100', desc: 'Fee Receipt Uploaded - Waiting for College Verification.' };
            case 'FEE_VERIFIED':
                return { label: 'Fee Verified & Forwarded', icon: ShieldCheck, color: 'text-sky-600', bg: 'bg-sky-100', desc: 'Your fee receipt has been verified and forwarded to Principal for final sign-off.' };
            case 'ADMISSION_CONFIRMED':
            case 'ENROLLED':
            case 'USN_ASSIGNED':
                return { label: '🎉 Admission Confirmed', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100', desc: 'Congratulations! Your admission has been officially confirmed by the Principal of Jain College of Engineering & Research.' };
            case 'REJECTED':
                return { label: 'Correction Required', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', desc: 'Your application has been returned by the Principal / Admissions Committee for correction. Please review the reason below and click Edit & Resubmit.' };
            case 'CANCELLATION_REQUESTED':
                return { label: 'Cancellation Requested', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', desc: 'Your request for admission cancellation is under review.' };
            case 'CANCELLED':
                return { label: 'Admission Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', desc: 'Your admission has been cancelled.' };
            default:
                return { label: 'Processing', icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100', desc: 'Your application is being processed.' };
        }
    };

    const meta = getStatusMeta(applicationStatus);
    const StatusIcon = meta.icon;
    const isApproved = applicationStatus === 'ADMISSION_CONFIRMED' || applicationStatus === 'APPROVED' || applicationStatus === 'ENROLLED' || applicationStatus === 'USN_ASSIGNED';
    const isRejected = applicationStatus === 'REJECTED';
    const isCancelled = applicationStatus === 'CANCELLED';

    const handleDownloadPDF = async () => {
        await downloadAdmissionPDF(api, toast);
    };

    return (
        <div className="animate-fade-in space-y-8 pb-16 max-w-4xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Application Status</h1>
                <p className="text-slate-500">Track the progress of your admission application in real-time.</p>
            </div>

            {/* Status Hero Card */}
            <div className={`relative overflow-hidden p-8 rounded-2xl border-2 ${
                isRejected || isCancelled ? 'border-red-200 bg-red-50' :
                isApproved ? 'border-emerald-200 bg-emerald-50' :
                'border-slate-200 bg-white'
            }`}>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className={`size-20 rounded-2xl ${meta.bg} ${meta.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <StatusIcon size={40} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl font-black ${meta.color} tracking-tight`}>{meta.label}</h2>
                            <StatusBadge status={applicationStatus} />
                        </div>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-lg">{meta.desc}</p>
                        <p className="text-xs text-slate-400">
                            Admission Number: <span className="font-bold text-slate-700">{stepStatus?.applicationNumber || stepStatus?.studentId}</span>
                        </p>
                    </div>
                </div>

                {/* College ID for approved */}
                {isApproved && stepStatus?.tempCollegeId && (
                    <div className="mt-6 bg-emerald-100 border border-emerald-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Your College ID</p>
                            <p className="text-3xl font-black text-emerald-700 font-mono tracking-wider mt-1">{stepStatus.tempCollegeId}</p>
                        </div>
                        <CheckCircle size={36} className="text-emerald-400" />
                    </div>
                )}
            </div>

            {/* ═════════ ADMISSION APPROVED & FEE RECEIPT UPLOAD CARD ═════════ */}
            {(applicationStatus === 'APPROVED' || applicationStatus === 'FEE_RECEIPT_UPLOADED' || applicationStatus === 'FEE_VERIFIED') && (
                <div className="bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 rounded-2xl border-2 border-amber-300 p-6 md:p-8 shadow-lg space-y-6 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/80 pb-5">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Sparkles size={22} className="text-amber-600" />
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Admission Approved</h2>
                            </div>
                            <p className="text-xs font-extrabold text-amber-700 uppercase tracking-widest">Congratulations!</p>
                        </div>
                        <div className="bg-amber-100 text-amber-900 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-amber-300 flex items-center gap-2">
                            <Clock size={16} className="text-amber-700" />
                            <span>Visit College Office within 7 Days</span>
                        </div>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        Your admission application has been approved. Please visit the <strong>Jain College of Engineering & Research Admission Office</strong> within 7 days and pay the <strong>₹500 Admission Processing Fee</strong>.
                        After receiving the official college fee receipt, upload a clear photo or PDF of the receipt below to continue the admission process.
                    </p>

                    {/* Current Status Banner */}
                    <div className="flex items-center justify-between bg-amber-100/60 border border-amber-200 rounded-xl px-4 py-3">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Current Status</span>
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${
                            applicationStatus === 'FEE_RECEIPT_UPLOADED'
                                ? 'bg-cyan-600 text-white'
                                : applicationStatus === 'FEE_VERIFIED'
                                ? 'bg-sky-600 text-white'
                                : 'bg-amber-600 text-white'
                        }`}>
                            {applicationStatus === 'FEE_RECEIPT_UPLOADED' ? 'Fee Receipt Uploaded - Waiting for College Verification' :
                             applicationStatus === 'FEE_VERIFIED' ? 'Fee Receipt Verified & Forwarded to Principal' :
                             'Waiting for Fee Receipt'}
                        </span>
                    </div>

                    {/* Drag & Drop Upload Zone */}
                    <div className="bg-white rounded-2xl border-2 border-dashed border-amber-300 p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-amber-500 transition-colors">
                        <input
                            type="file"
                            id="fee-receipt-input"
                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isUploading || applicationStatus === 'FEE_VERIFIED'}
                        />

                        {selectedFile ? (
                            <div className="w-full space-y-4">
                                <div className="flex items-center justify-between bg-amber-50 p-4 rounded-xl border border-amber-200 text-left">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <FileText size={32} className="text-amber-600 flex-shrink-0" />
                                        <div className="truncate">
                                            <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedFile(null)}
                                        className="text-xs font-bold text-red-600 hover:underline px-2 py-1"
                                    >
                                        Change File
                                    </button>
                                </div>

                                {isUploading && (
                                    <div className="space-y-1.5">
                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <div className="bg-amber-600 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                        </div>
                                        <p className="text-[10px] font-bold text-amber-700">Uploading receipt... {uploadProgress}%</p>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleUploadReceipt}
                                    disabled={isUploading}
                                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                    {applicationStatus === 'FEE_RECEIPT_UPLOADED' ? 'Replace Receipt' : 'Upload Receipt'}
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="fee-receipt-input"
                                className="cursor-pointer space-y-3 flex flex-col items-center w-full"
                            >
                                <div className="size-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
                                    <Upload size={28} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-900">
                                        Drag & Drop official college fee receipt here, or <span className="text-amber-700 underline">browse</span>
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-medium">
                                        Supported Formats: PDF, JPG, PNG (Max file size: 5MB)
                                    </p>
                                </div>
                                <span className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-colors inline-block mt-2">
                                    {applicationStatus === 'FEE_RECEIPT_UPLOADED' ? 'Replace Receipt' : 'Upload Fee Receipt'}
                                </span>
                            </label>
                        )}
                    </div>
                </div>
            )}

            {/* Correction / Rejection Reason */}
            {isRejected && (stepStatus?.rejectionReason || stepStatus?.adminRemarks) && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle size={20} className="text-red-600" />
                        <h3 className="text-sm font-bold text-red-900">Correction / Rejection Reason</h3>
                    </div>
                    <div className="bg-white rounded-xl border border-red-100 p-4">
                        <p className="text-sm text-red-800 leading-relaxed font-medium italic whitespace-pre-line">
                            {(() => {
                                const isOther = stepStatus.rejectionReasonCode === 'OTHER' || stepStatus.rejectionReason === 'Other' || stepStatus.rejectionReason === 'OTHER';
                                if (isOther) {
                                    return stepStatus.adminRemarks || stepStatus.rejectionReason || 'Other';
                                }
                                return stepStatus.rejectionReason || stepStatus.adminRemarks || '';
                            })()}
                        </p>
                    </div>
                </div>
            )}

            {/* Timeline + Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Timeline */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-slate-400 border-b border-slate-100 pb-4 mb-5">
                        <Award size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Application Progress</span>
                    </div>
                    <ActivityTimeline timeline={timeline} />
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-4">
                    {isCancelled ? (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4 text-slate-900">
                            <div className="flex items-center gap-3 border-b border-red-100 pb-3">
                                <XCircle className="text-red-650" size={20} />
                                <h3 className="text-sm font-bold text-red-950 uppercase tracking-wide">Cancellation Details</h3>
                            </div>
                            <div className="space-y-3.5 text-xs">
                                <div>
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Cancellation Date</p>
                                    <p className="font-bold text-red-800 mt-1">
                                        {stepStatus?.cancellationApprovedAt 
                                            ? new Date(stepStatus.cancellationApprovedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                                            : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Reason</p>
                                    <p className="font-bold text-red-800 mt-1">{stepStatus?.cancellationReason || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Cancelled By</p>
                                    <p className="font-bold text-red-800 mt-1">Administrator</p>
                                </div>
                                {stepStatus?.cancellationRemarks && (
                                    <div>
                                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Student Remarks</p>
                                        <p className="font-bold text-red-800 mt-1 italic">"{stepStatus.cancellationRemarks}"</p>
                                    </div>
                                )}
                                {stepStatus?.cancellationAdminRemarks && (
                                    <div>
                                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Admin Remarks</p>
                                        <p className="font-bold text-red-800 mt-1 italic">"{stepStatus.cancellationAdminRemarks}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/admission/application')}
                                className="w-full bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-primary-200 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    <Eye size={22} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-slate-900 text-sm">View Application</p>
                                    <p className="text-xs text-slate-400">Review your submitted details</p>
                                </div>
                                <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-primary-600 transition-colors" />
                            </button>

                            {(isApproved || !isRejected) && (
                                <button
                                    onClick={handleDownloadPDF}
                                    className="w-full bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-primary-200 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Download size={22} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-900 text-sm">
                                            {isApproved ? 'Download Confirmed Admission' : 'Download PDF'}
                                        </p>
                                        <p className="text-xs text-slate-400">{isApproved ? 'Your confirmed admission as a PDF' : 'Get a copy of your application'}</p>
                                    </div>
                                    <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </button>
                            )}

                            {isRejected && (
                                <button
                                    onClick={() => navigate('/admission/application')}
                                    className="w-full bg-red-650 text-white rounded-2xl p-5 flex items-center gap-4 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                        <Activity size={22} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">Edit & Resubmit</p>
                                        <p className="text-xs text-red-100">Correct your application now</p>
                                    </div>
                                    <ArrowRight size={16} className="ml-auto text-red-200 group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}

                            {applicationStatus === 'ENROLLED' && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="w-full bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-red-300 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-650 group-hover:text-white transition-colors">
                                        <XCircle size={22} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-red-900 text-sm">Request Admission Cancellation</p>
                                        <p className="text-xs text-red-500">Submit a request to cancel your admission</p>
                                    </div>
                                    <ArrowRight size={16} className="ml-auto text-red-300 group-hover:text-red-600 transition-colors" />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => navigate('/admission/support')}
                                className="w-full bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-primary-200 transition-all group text-left cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    <LifeBuoy size={22} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-slate-900 text-sm">Need Help?</p>
                                    <p className="text-xs text-slate-400">Contact admissions office</p>
                                </div>
                                <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-primary-600 transition-colors" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Dynamic Footer */}
            <DashboardFooterInfo closingDateIso={closingDateIso} feeStatusText={feeStatusText} isClosed={isClosed} />

            {/* Cancellation Request Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-6 shadow-2xl animate-fade-in">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-slate-900">Request Admission Cancellation</h3>
                            <p className="text-xs text-slate-500">Please provide the reason for cancelling your admission. This request will be reviewed by the administration.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Reason for Cancellation <span className="text-red-500">*</span></label>
                                <select
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                                >
                                    <option value="">Select a reason</option>
                                    <option value="Joined Another College">Joined Another College</option>
                                    <option value="Financial Reasons">Financial Reasons</option>
                                    <option value="Personal Reasons">Personal Reasons</option>
                                    <option value="Wrong Course Selected">Wrong Course Selected</option>
                                    <option value="Relocation">Relocation</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Remarks / Additional Details</label>
                                <textarea
                                    value={cancelRemarks}
                                    onChange={(e) => setCancelRemarks(e.target.value)}
                                    rows={4}
                                    placeholder="Provide any additional comments here..."
                                    className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason('');
                                    setCancelRemarks('');
                                }}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCancelSubmit}
                                disabled={isSubmitting || !cancelReason}
                                className="px-4 py-2 bg-red-650 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-red-600/10 flex items-center gap-1.5"
                            >
                                {isSubmitting ? (
                                    <>Submitting...</>
                                ) : (
                                    <>Submit Request</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
