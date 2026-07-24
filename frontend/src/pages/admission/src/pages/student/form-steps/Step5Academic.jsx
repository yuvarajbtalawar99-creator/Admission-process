import React, { useState } from 'react';
import api from '../../../api/axios';
import { Loader2, ChevronLeft, ChevronRight, School, GraduationCap, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { BOARD_CONFIG } from '../../../config/boardConfig';
import { calculatePercentage } from '../../../utils/calculatePercentage';

const Step5Academic = ({ onNext, onPrev, data, updateData, applicationStatus }) => {
    const [loading, setLoading] = useState(false);

    const calculateSSLC = (updatedData = data) => {
        const obtained = parseFloat(updatedData.sslcMarksObtained) || 0;
        const max = parseFloat(updatedData.sslcMaxMarks) || 0;
        if (max > 0) {
            const perc = (obtained / max) * 100;
            updateData({ sslcPercentage: perc.toFixed(2) });
        }
    };

    const calculatePUC = (updatedData = data) => {
        const phys = parseFloat(updatedData.physicsMarks) || 0;
        const math = parseFloat(updatedData.mathsMarks) || 0;
        const chem = parseFloat(updatedData.chemistryMarks) || 0;
        const opt = parseFloat(updatedData.optionalMarks) || 0;
        const max = 400;

        const agg = phys + math + chem + opt;
        const perc = (agg / max) * 100;
        updateData({
            pucAggregate: agg,
            pucPercentage: perc.toFixed(2),
            pucMaxMarks: max
        });
    };

    const calculateDiploma = (updatedData = data) => {
        const obtained = parseFloat(updatedData.diplomaFinalYearObtained) || 0;
        const max = parseFloat(updatedData.diplomaFinalYearMaxMarks) || 0;
        if (max > 0) {
            const perc = (obtained / max) * 100;
            updateData({ diplomaPercentage: perc.toFixed(2) });
        }
    };

    const getBoardValidation = () => {
        const board = data.sslcBoard;
        if (!board || board === 'OTHER') {
            const obtained = parseFloat(data.sslcMarksObtained);
            const max = parseFloat(data.sslcMaxMarks);
            if (isNaN(obtained) || isNaN(max)) return { passed: false, error: "" };
            if (obtained > max) return { passed: false, error: "Obtained marks cannot exceed maximum marks" };
            return { passed: true, error: "" };
        }
        return calculatePercentage(board, data.sslcSubjectMarks || {});
    };

    const valResult = getBoardValidation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Enforce board validation before submitting
        const val = getBoardValidation();
        if (!val.passed && data.sslcBoard !== 'OTHER') {
            toast.error(val.error || "Cannot save: board passing requirements not met.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                sslcSchool: data.sslcSchool,
                sslcBoard: data.sslcBoard,
                sslcYear: parseInt(data.sslcYear),
                sslcRegisterNumber: data.sslcRegisterNumber,
                sslcMarksObtained: parseFloat(data.sslcMarksObtained),
                sslcMaxMarks: parseFloat(data.sslcMaxMarks),
                sslcPercentage: parseFloat(data.sslcPercentage),
                sslcAttempts: parseInt(data.sslcAttempts),
                sslcSubjectMarks: data.sslcSubjectMarks || null,
                pucSchool: data.pucSchool || undefined,
                pucBoard: data.pucBoard || undefined,
                pucYear: data.pucYear ? parseInt(data.pucYear) : undefined,
                pucRegisterNumber: data.pucRegisterNumber || undefined,
                pucStream: data.pucStream || undefined,
                physicsMarks: data.physicsMarks ? parseFloat(data.physicsMarks) : undefined,
                mathsMarks: data.mathsMarks ? parseFloat(data.mathsMarks) : undefined,
                optionalSubject: data.optionalSubject || undefined,
                optionalMarks: data.optionalMarks ? parseFloat(data.optionalMarks) : undefined,
                pucMaxMarks: data.pucMaxMarks ? parseFloat(data.pucMaxMarks) : undefined,
                pucAggregate: data.pucAggregate ? parseFloat(data.pucAggregate) : undefined,
                pucPercentage: data.pucPercentage ? parseFloat(data.pucPercentage) : undefined,
                pucAttempts: data.pucAttempts ? parseInt(data.pucAttempts) : undefined,
                diplomaUniversity: data.diplomaUniversity || undefined,
                diplomaYear: data.diplomaYear ? parseInt(data.diplomaYear) : undefined,
                diplomaRegisterNumber: data.diplomaRegisterNumber || undefined,
                diplomaFinalYearMaxMarks: data.diplomaFinalYearMaxMarks ? parseFloat(data.diplomaFinalYearMaxMarks) : undefined,
                diplomaFinalYearObtained: data.diplomaFinalYearObtained ? parseFloat(data.diplomaFinalYearObtained) : undefined,
                diplomaPercentage: data.diplomaPercentage ? parseFloat(data.diplomaPercentage) : undefined,
                diplomaAttempts: data.diplomaAttempts ? parseInt(data.diplomaAttempts) : undefined,
            };

            const res = await api.put('/student/academic', payload);
            if (res.data.success) {
                toast.success('Academic details saved!');
                onNext();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to save academic details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFields = { [name]: value };
        updateData(updatedFields);

        const combinedData = { ...data, ...updatedFields };
        if (name === 'sslcMarksObtained' || name === 'sslcMaxMarks') {
            calculateSSLC(combinedData);
        } else if (name === 'diplomaFinalYearObtained' || name === 'diplomaFinalYearMaxMarks') {
            calculateDiploma(combinedData);
        }
    };

    const handleBoardChange = (e) => {
        const board = e.target.value;
        updateData({
            sslcBoard: board,
            sslcSubjectMarks: {},
            sslcMarksObtained: '',
            sslcMaxMarks: '',
            sslcPercentage: ''
        });
    };

    const handleSubjectChange = (e) => {
        const { name, value } = e.target;
        const updatedMarks = {
            ...(data.sslcSubjectMarks || {}),
            [name]: value
        };

        const result = calculatePercentage(data.sslcBoard, updatedMarks);

        updateData({
            sslcSubjectMarks: updatedMarks,
            sslcMarksObtained: result.obtained || 0,
            sslcMaxMarks: result.max || 0,
            sslcPercentage: result.percentage ? result.percentage.toFixed(2) : '0.00'
        });
    };

    const handlePucChange = (e) => {
        const { name, value } = e.target;
        const updatedFields = { [name]: value };
        updateData(updatedFields);
        calculatePUC({ ...data, ...updatedFields });
    };

    const SectionHeader = ({ icon: Icon, title, subtitle }) => (
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5 mt-8 first:mt-0">
            <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                <Icon size={18} />
            </div>
            <div>
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
        </div>
    );

    const renderBoardFields = () => {
        const board = data.sslcBoard;
        if (!board || board === 'OTHER') {
            return (
                <>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Max Marks <span className="text-red-500">*</span></label>
                        <input required type="number" name="sslcMaxMarks" className="input-premium h-11" value={data.sslcMaxMarks || ''} onChange={handleChange} placeholder="Enter max marks" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Marks Obtained <span className="text-red-500">*</span></label>
                        <input required type="number" name="sslcMarksObtained" className="input-premium h-11" value={data.sslcMarksObtained || ''} onChange={handleChange} placeholder="Enter marks obtained" />
                    </div>
                </>
            );
        }

        const config = BOARD_CONFIG[board];
        if (!config) return null;

        const subjectMarks = data.sslcSubjectMarks || {};

        return config.fields.map((field) => {
            if (field.type === "grade") {
                return (
                    <div key={field.name} className="space-y-1.5 animate-fade-in">
                        <label className="text-sm font-medium text-slate-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <select
                            required={field.required}
                            name={field.name}
                            className="input-premium h-11 uppercase"
                            value={subjectMarks[field.name] || ""}
                            onChange={handleSubjectChange}
                        >
                            <option value="" disabled>Select grade...</option>
                            {field.options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                );
            }

            return (
                <div key={field.name} className="space-y-1.5 animate-fade-in">
                    <label className="text-sm font-medium text-slate-700">
                        {field.label} (Max {field.max}) {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        required={field.required}
                        type="number"
                        min={field.min}
                        max={field.max}
                        name={field.name}
                        className="input-premium h-11"
                        value={subjectMarks[field.name] || ""}
                        onChange={handleSubjectChange}
                        placeholder={`Enter marks (max ${field.max})`}
                    />
                </div>
            );
        });
    };

    const sslcRegProps = data.sslcBoard === 'CBSE' 
        ? { minLength: 6, maxLength: 6, pattern: "\\d{6}", title: "Must be exactly 6 digits (Numeric only)" }
        : data.sslcBoard === 'STATE' 
        ? { minLength: 9, maxLength: 9, pattern: "\\d{9}", title: "Must be exactly 9 digits (Numeric only)" }
        : { minLength: 4, maxLength: 20, title: "Enter valid register number" };

    const pucRegProps = data.pucBoard === 'STATE' 
        ? { minLength: 7, maxLength: 10, title: "Usually 7-10 characters" }
        : data.pucBoard === 'CBSE' 
        ? { minLength: 6, maxLength: 8, title: "Usually 6-8 characters" }
        : { minLength: 4, maxLength: 20, title: "Enter valid register number" };

    const isSslcRegInvalid = data.sslcRegisterNumber && data.sslcBoard && (
        sslcRegProps.pattern 
            ? !new RegExp(`^${sslcRegProps.pattern}$`).test(data.sslcRegisterNumber)
            : data.sslcRegisterNumber.length < sslcRegProps.minLength || data.sslcRegisterNumber.length > sslcRegProps.maxLength
    );

    const isPucRegInvalid = data.pucRegisterNumber && data.pucBoard && (
        pucRegProps.pattern 
            ? !new RegExp(`^${pucRegProps.pattern}$`).test(data.pucRegisterNumber)
            : data.pucRegisterNumber.length < pucRegProps.minLength || data.pucRegisterNumber.length > pucRegProps.maxLength
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in flex flex-col">
            {/* SSLC Section */}
            <div>
                <SectionHeader icon={School} title="SSLC (10th Standard) Details" subtitle="Secondary education academic records" />
                
                {/* Core Board details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 pb-5 border-b border-slate-100">
                    <div className="space-y-1.5 col-span-1 md:col-span-2 lg:col-span-4">
                        <label className="text-sm font-medium text-slate-700">School Name (As per SSLC) <span className="text-red-500">*</span></label>
                        <input required type="text" name="sslcSchool" className="input-premium h-11 uppercase" value={data.sslcSchool || ''} onChange={handleChange} placeholder="Enter your 10th standard school name" />
                        {!data.sslcSchool && applicationStatus === 'REJECTED' && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Board <span className="text-red-500">*</span></label>
                        <select required name="sslcBoard" className="input-premium h-11 uppercase" value={data.sslcBoard || ''} onChange={handleBoardChange}>
                            <option value="" disabled>Select board...</option>
                            <option value="STATE">State Board</option>
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE">ICSE</option>
                            <option value="OTHER">Other</option>
                        </select>
                        {!data.sslcBoard && applicationStatus === 'REJECTED' && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                        )}
                        {data.sslcBoard === 'CBSE' && (
                            <p className="text-[11px] text-primary-600 font-medium mt-1">ℹ️ CBSE: Best of 5 subjects rule applied.</p>
                        )}
                        {data.sslcBoard === 'ICSE' && (
                            <p className="text-[11px] text-primary-600 font-medium mt-1">ℹ️ ICSE: English compulsory + best of 4 others.</p>
                        )}
                        {data.sslcBoard === 'STATE' && (
                            <p className="text-[11px] text-primary-600 font-medium mt-1">ℹ️ State: Out of 525 (Third language graded).</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Year of Passing <span className="text-red-500">*</span></label>
                        <input required type="number" name="sslcYear" className="input-premium h-11" value={data.sslcYear || ''} onChange={handleChange} placeholder="Enter year of passing" />
                        {!data.sslcYear && applicationStatus === 'REJECTED' && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Register Number <span className="text-red-500">*</span></label>
                        <input required type="text" name="sslcRegisterNumber" className="input-premium h-11 uppercase" value={data.sslcRegisterNumber || ''} onChange={handleChange} placeholder="Enter register number" {...sslcRegProps} />
                        {!data.sslcRegisterNumber && applicationStatus === 'REJECTED' && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                        )}
                        {isSslcRegInvalid && <p className="text-[10px] text-red-500 font-medium mt-1">⚠️ {sslcRegProps.title}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">No. of Attempts <span className="text-red-500">*</span></label>
                        <input required type="number" min="1" name="sslcAttempts" className="input-premium h-11" value={data.sslcAttempts || ''} onChange={handleChange} placeholder="1" />
                        {!data.sslcAttempts && applicationStatus === 'REJECTED' && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                        )}
                    </div>
                </div>

                {/* Dynamic Board-specific Subject details */}
                {data.sslcBoard && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6">
                        <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <GraduationCap size={16} className="text-primary-500" />
                            Subject-Wise Mark Sheet (10th Standard)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {renderBoardFields()}
                        </div>

                        {/* Inline Board Validation Notice Cards */}
                        {data.sslcBoard !== 'OTHER' && (
                            <div className="mt-5">
                                {valResult.error && valResult.error.includes("Please enter all required marks") ? (
                                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
                                        <p className="text-xs text-amber-700 font-medium">⚠️ Enter all subject marks to calculate final percentage.</p>
                                    </div>
                                ) : valResult.error ? (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg animate-fade-in">
                                        <p className="text-xs font-semibold text-red-700">{valResult.error}</p>
                                    </div>
                                ) : !valResult.passed ? (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg animate-fade-in">
                                        <p className="text-xs font-semibold text-red-700">
                                            ⚠️ Passing Requirements Not Met: 
                                            {data.sslcBoard === 'STATE' && " Minimum 30% per subject, 33% overall aggregate, and minimum 206 aggregate marks required to pass."}
                                            {data.sslcBoard === 'CBSE' && " Minimum 33% per subject required to pass."}
                                            {data.sslcBoard === 'ICSE' && " Minimum 35% per subject and 33% overall aggregate required to pass."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-lg animate-fade-in">
                                        <p className="text-xs font-semibold text-emerald-700">
                                            ✅ Passing requirements met! (Total evaluated marks: {data.sslcMarksObtained} / {data.sslcMaxMarks})
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Readonly Evaluated Aggregates */}
                {data.sslcBoard && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Total Max Marks</label>
                            <input readOnly type="number" className="input-premium h-11 text-slate-700 bg-slate-50 border-slate-200 cursor-not-allowed font-semibold" value={data.sslcMaxMarks || ''} placeholder="0" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Total Marks Obtained</label>
                            <input readOnly type="number" className="input-premium h-11 text-slate-700 bg-slate-50 border-slate-200 cursor-not-allowed font-semibold" value={data.sslcMarksObtained || ''} placeholder="0" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Percentage (%)</label>
                            <input readOnly type="number" step="0.01" name="sslcPercentage" className="input-premium h-11 text-primary-700 font-semibold bg-primary-50 border-primary-100 cursor-not-allowed" value={data.sslcPercentage || ''} placeholder="0.00" />
                        </div>
                    </div>
                )}
            </div>

            {/* PUC Details (For Fresh Admissions) */}
            {data.admissionType !== 'DCET' && (
            <div>
                <SectionHeader icon={GraduationCap} title="PUC (12th Standard) Details" subtitle="Required — Senior secondary records" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                        <label className="text-sm font-medium text-slate-700">School / College Name <span className="text-red-500">*</span></label>
                        <input required type="text" name="pucSchool" className="input-premium h-11 uppercase" value={data.pucSchool || ''} onChange={handleChange} placeholder="Enter your 12th standard school/college name" />
                        {!data.pucSchool && applicationStatus === 'REJECTED' && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Stream <span className="text-red-500">*</span></label>
                        <select required name="pucStream" className="input-premium h-11" value={data.pucStream || ''} onChange={handleChange}>
                            <option value="" disabled>Select stream...</option>
                            <option value="SCIENCE">Science</option>
                            <option value="COMMERCE">Commerce</option>
                            <option value="ARTS">Arts</option>
                        </select>
                        {!data.pucStream && applicationStatus === 'REJECTED' && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Board</label>
                        <select name="pucBoard" className="input-premium h-11 uppercase" value={data.pucBoard || ''} onChange={handleChange}>
                            <option value="" disabled>Select board...</option>
                            <option value="STATE">State Board</option>
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE">ICSE</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Year of Passing</label>
                        <input type="number" name="pucYear" className="input-premium h-11" value={data.pucYear || ''} onChange={handleChange} placeholder="Enter year of passing" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Register Number</label>
                        <input type="text" name="pucRegisterNumber" className="input-premium h-11 uppercase" value={data.pucRegisterNumber || ''} onChange={handleChange} placeholder="Enter register number" {...pucRegProps} />
                        {isPucRegInvalid && <p className="text-[10px] text-red-500 font-medium mt-1">⚠️ {pucRegProps.title}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Physics Marks</label>
                        <input type="number" name="physicsMarks" className="input-premium h-11" value={data.physicsMarks || ''} onChange={handlePucChange} placeholder="Enter physics marks" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Maths Marks</label>
                        <input type="number" name="mathsMarks" className="input-premium h-11" value={data.mathsMarks || ''} onChange={handlePucChange} placeholder="Enter maths marks" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Chemistry</label>
                        <input type="number" name="chemistryMarks" className="input-premium h-11" value={data.chemistryMarks || ''} onChange={handlePucChange} placeholder="Enter chemistry marks" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Biology/Computer Science</label>
                        <input type="number" name="optionalMarks" className="input-premium h-11" value={data.optionalMarks || ''} onChange={handlePucChange} placeholder="Enter optional marks" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Percentage (%)</label>
                        <input readOnly type="number" step="0.01" name="pucPercentage" className="input-premium h-11 text-primary-700 font-semibold bg-primary-50 border-primary-100 cursor-not-allowed" value={data.pucPercentage || ''} placeholder="0.00" />
                    </div>
                </div>
            </div>
            )}

            {/* Diploma Details (For Lateral Entry) */}
            {data.admissionType === 'DCET' && (
            <div>
                <SectionHeader icon={BookOpen} title="Diploma Details" subtitle="Required — Vocational education records" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">University</label>
                        <input type="text" name="diplomaUniversity" className="input-premium h-11 uppercase" value={data.diplomaUniversity || ''} onChange={handleChange} placeholder="Enter university" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Year of Passing</label>
                        <input type="number" name="diplomaYear" className="input-premium h-11" value={data.diplomaYear || ''} onChange={handleChange} placeholder="Enter year of passing" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Register Number</label>
                        <input type="text" name="diplomaRegisterNumber" className="input-premium h-11 uppercase" value={data.diplomaRegisterNumber || ''} onChange={handleChange} placeholder="Enter register number" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Final Year Max Marks</label>
                        <input type="number" name="diplomaFinalYearMaxMarks" className="input-premium h-11" value={data.diplomaFinalYearMaxMarks || ''} onChange={handleChange} placeholder="Enter final year max marks" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Final Year Obtained</label>
                        <input type="number" name="diplomaFinalYearObtained" className="input-premium h-11" value={data.diplomaFinalYearObtained || ''} onChange={handleChange} placeholder="Enter final year marks obtained" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Percentage (%)</label>
                        <input readOnly type="number" step="0.01" name="diplomaPercentage" className="input-premium h-11 text-primary-700 font-semibold bg-primary-50 border-primary-100 cursor-not-allowed" value={data.diplomaPercentage || ''} placeholder="0.00" />
                    </div>
                </div>
            </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex justify-between gap-4">
                <button type="button" onClick={onPrev} className="btn-secondary h-10 px-5 flex items-center gap-2">
                    <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary h-10 px-6 flex items-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                        <>Save & Continue <ChevronRight size={16} /></>
                    )}
                </button>
            </div>
        </form>
    );
};

export default Step5Academic;
