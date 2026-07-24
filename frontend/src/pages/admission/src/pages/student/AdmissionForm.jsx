import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    HelpCircle, 
    ExternalLink, 
    ChevronLeft, 
    Loader2, 
    GraduationCap, 
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import StepIndicator from '../../components/StepIndicator';
import useApplicationStatus from '../../hooks/useApplicationStatus';
import Step1Admission from './form-steps/Step1Admission';
import Step2Personal from './form-steps/Step2Personal';
import Step3Parent from './form-steps/Step3Parent';
import Step4Address from './form-steps/Step4Address';
import Step5Academic from './form-steps/Step5Academic';
import Step6Documents from './form-steps/Step6Documents';
import Step7Review from './form-steps/Step7Review';
import SubmittedView from './components/SubmittedView';
import LoadingContainer from '../../components/LoadingContainer';
import { FormSkeleton } from '../../components/Skeleton';

const STEPS = [
    { id: 1, label: 'Admission' },
    { id: 2, label: 'Personal' },
    { id: 3, label: 'Parent' },
    { id: 4, label: 'Address' },
    { id: 5, label: 'Academic' },
    { id: 6, label: 'Documents' },
    { id: 7, label: 'Review' },
];

const AdmissionForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [formLoading, setFormLoading] = useState(true);
    const [stepTransition, setStepTransition] = useState(false);
    const [fullDetails, setFullDetails] = useState(null);
    const isNavigating = useRef(false); // Prevents step-reset effect from overriding handleNext
    const navigate = useNavigate();

    const {
        stepStatus,
        loading: statusLoading,
        getStepState,
        isStepAccessible,
        refetch: refetchStatus,
    } = useApplicationStatus();

    // Re-fetch form data from API and merge fresh URL fields into formData
    const refreshFormData = async () => {
        try {
            const res = await api.get('/student/my-admission');
            if (res.data.success && res.data.data) {
                const student = res.data.data;
                const flattenedData = {
                    ...student,
                    ...student.studentpersonaldetails,
                    ...student.studentparentdetails,
                    ...student.studentaddress,
                    ...student.studentacademicdetails,
                    ...student.studentdocuments
                };
                // Only update URL fields so we don't overwrite user-typed draft data
                const urlFields = Object.fromEntries(
                    Object.entries(flattenedData).filter(([k]) => k.toLowerCase().includes('url'))
                );
                setFormData(prev => ({ ...prev, ...urlFields }));
            }
        } catch (e) {
            console.error('Failed to refresh form data after upload:', e);
        }
    };

    // Fetch existing form data and full details if submitted
    useEffect(() => {
        const fetchData = async () => {
            try {
                // If application is already submitted, fetch everything for the dashboard
                if (stepStatus?.applicationStatus && stepStatus.applicationStatus !== 'DRAFT') {
                    const detailRes = await api.get('/application/full-details');
                    if (detailRes.data.success) {
                        setFullDetails(detailRes.data.data);
                    }
                }

                const res = await api.get('/student/my-admission');
                if (res.data.success && res.data.data) {
                    const student = res.data.data;
                    const flattenedData = {
                        ...student,
                        ...student.studentpersonaldetails,
                        ...student.studentparentdetails,
                        ...student.studentaddress,
                        ...student.studentacademicdetails,
                        ...student.studentdocuments
                    };
                    
                    if (flattenedData.tenthSubjectMarks) {
                        if (typeof flattenedData.tenthSubjectMarks === 'string') {
                            try {
                                flattenedData.sslcSubjectMarks = JSON.parse(flattenedData.tenthSubjectMarks);
                            } catch (e) {}
                        } else {
                            flattenedData.sslcSubjectMarks = flattenedData.tenthSubjectMarks;
                        }
                    }

                    if (flattenedData.dateOfBirth) {
                        try {
                            const dateObj = new Date(flattenedData.dateOfBirth);
                            if (!isNaN(dateObj.getTime())) {
                                const d = String(dateObj.getDate()).padStart(2, '0');
                                const m = String(dateObj.getMonth() + 1).padStart(2, '0');
                                const y = dateObj.getFullYear();
                                flattenedData.dateOfBirth = `${d}/${m}/${y}`;
                            }
                        } catch (e) {}
                    }

                    const draft = localStorage.getItem('admission_form_draft');
                    if (draft) {
                        const parsedDraft = JSON.parse(draft);
                        if (parsedDraft.id && parsedDraft.id !== flattenedData.id) {
                            localStorage.removeItem('admission_form_draft');
                            localStorage.removeItem('admission_form_step');
                            setFormData(flattenedData);
                        } else {
                            const urlFields = Object.fromEntries(
                                Object.entries(flattenedData).filter(([k]) => k.toLowerCase().includes('url'))
                            );
                            setFormData({ ...flattenedData, ...parsedDraft, ...urlFields });
                        }
                    } else {
                        setFormData(flattenedData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch admission data:", error);
            } finally {
                setFormLoading(false);
            }
        };

        if (!statusLoading) {
            fetchData();
        }
    }, [statusLoading, stepStatus?.applicationStatus]);

    // Set initial step based on status or saved step
    useEffect(() => {
        const isEditable = !statusLoading && stepStatus && 
            (stepStatus.applicationStatus === 'DRAFT' || stepStatus.applicationStatus === 'REJECTED');

        if (isEditable && !isNavigating.current) {
            const savedStep = localStorage.getItem('admission_form_step');
            if (savedStep && parseInt(savedStep) >= 1) {
                const target = parseInt(savedStep);
                if (isStepAccessible(target)) {
                    setCurrentStep(target);
                } else {
                    setCurrentStep(stepStatus.activeStepIndex || 1);
                }
            } else if (formData.id) {
                setCurrentStep(stepStatus.activeStepIndex || 2);
            }
        }
    }, [statusLoading, stepStatus, formData.id, isStepAccessible]);

    // Save draft to localStorage 
    useEffect(() => {
        const isEditable = !formLoading && stepStatus && 
            (stepStatus.applicationStatus === 'DRAFT' || stepStatus.applicationStatus === 'REJECTED');

        if (isEditable) {
            localStorage.setItem('admission_form_draft', JSON.stringify(formData));
            localStorage.setItem('admission_form_step', currentStep.toString());
        }
    }, [formData, currentStep, formLoading, stepStatus]);

    const handleNext = async () => {
        if (currentStep >= 7) return;
        isNavigating.current = true;
        setStepTransition(true);
        // Update localStorage immediately so the step-reset effect reads the correct step
        const nextStep = currentStep + 1;
        localStorage.setItem('admission_form_step', nextStep.toString());
        await refetchStatus();
        setTimeout(() => {
            setCurrentStep(nextStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setStepTransition(false);
            // Release the navigation lock after the step has settled
            setTimeout(() => { isNavigating.current = false; }, 500);
        }, 300);
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setStepTransition(true);
            setTimeout(() => {
                const prevStep = currentStep - 1;
                setCurrentStep(prevStep);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setStepTransition(false);
            }, 200);
        }
    };

    const updateFormData = (newData) => {
        const processed = { ...newData };
        for (const key in processed) {
            const val = processed[key];
            if (typeof val === 'string') {
                const lowerKey = key.toLowerCase();
                if (
                    lowerKey.includes('email') ||
                    lowerKey.includes('url') ||
                    lowerKey.endsWith('id') ||
                    lowerKey.includes('studied') ||
                    lowerKey.includes('same') ||
                    lowerKey.includes('dob') ||
                    lowerKey.includes('dateofbirth')
                ) {
                    if (lowerKey.includes('email')) {
                        processed[key] = val.toLowerCase();
                    }
                } else {
                    processed[key] = val.toUpperCase();
                }
            }
        }
        setFormData((prev) => ({ ...prev, ...processed }));
    };

    const handleDownloadPDF = async () => {
        try {
            const response = await api.get('/application/download-pdf', {
                responseType: 'blob',
            });
            const textContent = await response.data.text();
            
            // Dynamic import of jsPDF to avoid initial bundle bloat
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();
            doc.setFont("courier", "normal");
            doc.setFontSize(10);
            
            const lines = doc.splitTextToSize(textContent, 180);
            doc.text(lines, 15, 20);
            
            doc.save(`Admission_Acknowledgment_${stepStatus?.applicationNumber || stepStatus?.studentId}.pdf`);
        } catch (error) {
            toast.error("Failed to download PDF acknowledgment.");
        }
    };

    const renderStep = () => {
        const stepProps = {
            onNext: handleNext,
            onPrev: handlePrev,
            data: formData,
            updateData: updateFormData,
            applicationStatus: stepStatus?.applicationStatus,
        };

        switch (currentStep) {
            case 1: return <Step1Admission {...stepProps} />;
            case 2: return <Step2Personal {...stepProps} />;
            case 3: return <Step3Parent {...stepProps} />;
            case 4: return <Step4Address {...stepProps} />;
            case 5: return <Step5Academic {...stepProps} />;
            case 6: return <Step6Documents onNext={handleNext} onPrev={handlePrev} data={formData} onUploadSuccess={refreshFormData} applicationStatus={stepStatus?.applicationStatus} />;
            case 7: return <Step7Review data={formData} onPrev={handlePrev} />;
            default: return null;
        }
    };

    const applicationStatus = stepStatus?.applicationStatus;
    const isSubmitted = applicationStatus && 
        applicationStatus !== 'DRAFT' && 
        applicationStatus !== 'REJECTED';

    if (statusLoading || (isSubmitted && !fullDetails)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 animate-fade-in bg-slate-50">
                <div className="relative">
                    <div className="size-16 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"></div>
                    <GraduationCap className="absolute inset-0 m-auto text-primary-600" size={24} />
                </div>
                <p className="text-slate-500 font-bold tracking-tight">Verifying entrance credentials...</p>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="animate-fade-in pb-12">
                <SubmittedView 
                    statusData={stepStatus} 
                    fullDetails={fullDetails} 
                    onDownloadPDF={handleDownloadPDF} 
                />
            </div>
        );
    }

    const loading = formLoading || statusLoading;
    const completedCount = stepStatus?.completedCount || 0;
    const totalSteps = stepStatus?.totalSteps || 7;
    const progressPercent = stepStatus?.progressPercent || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
            {stepStatus?.applicationStatus === 'REJECTED' && (
                <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-r-xl shadow-sm space-y-2 no-print">
                    <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wide">⚠️ Action Required: Application Returned for Correction</h3>
                    {stepStatus?.rejectionReason && (
                        <p className="text-xs font-bold text-rose-800">
                            <strong>Reason for Rejection:</strong> {stepStatus.rejectionReason}
                        </p>
                    )}
                    {stepStatus?.adminRemarks && (
                        <p className="text-xs font-medium text-rose-700">
                            <strong>Correction Requests:</strong> {stepStatus.adminRemarks}
                        </p>
                    )}
                    <p className="text-[11px] text-rose-600">
                        Please navigate through the form steps below, modify the incorrect or missing details, and resubmit the application.
                    </p>
                </div>
            )}

            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-5 no-print">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                        <GraduationCap className="text-primary-600" size={24} />
                        Admission Form
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-semibold">Admission Session 2024-25</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="btn-secondary text-sm flex items-center gap-1.5 py-2 px-3"
                    >
                        <ChevronLeft size={16} />
                        Back to Portal
                    </button>
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Admission Progress</p>
                        <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${progressPercent}%`,
                                        background: progressPercent === 100
                                            ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                                             : 'linear-gradient(90deg, #1241a1, #3b82f6)'
                                    }}
                                ></div>
                            </div>
                            <p className="text-sm font-bold text-primary-700">{completedCount}/{totalSteps}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="no-print">
                <StepIndicator steps={STEPS} currentStep={currentStep} getStepState={getStepState} />
            </div>

            {/* Step Status Bar */}
            <div className="flex items-center justify-center gap-6 text-xs no-print">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-500 font-medium">Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-primary-600 step-pulse"></div>
                    <span className="text-slate-500 font-medium">In Progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <span className="text-slate-500 font-medium">Locked</span>
                </div>
            </div>

            {/* Form Content Card */}
            <div className="bg-white rounded-lg border border-slate-200 min-h-[400px] relative overflow-hidden print-no-border">
                <div className={`h-1 w-full transition-colors duration-500 no-print ${
                    getStepState(currentStep) === 'COMPLETED' ? 'bg-green-500' : 'bg-primary-600'
                }`}></div>

                <div className={`p-6 lg:p-8 transition-all duration-300 ${stepTransition ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                    <LoadingContainer
                        isLoading={loading}
                        skeleton={<FormSkeleton fields={6} />}
                        hintText="Preparing admission details..."
                    >
                        {renderStep()}
                    </LoadingContainer>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-slate-50 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200 no-print">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white text-primary-600 border border-slate-200 flex items-center justify-center">
                        <HelpCircle size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-800 mb-0.5">Need help?</h4>
                        <p className="text-sm text-slate-500">Our admissions team is ready to guide you through the process.</p>
                    </div>
                </div>
                <button className="btn-secondary text-sm flex items-center gap-2 py-2 px-4 whitespace-nowrap">
                    Contact Support
                    <ExternalLink size={14} />
                </button>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-400">
                © 2024 University Admission Cell. All rights reserved.
            </div>
        </div>
    );
};

export default AdmissionForm;
