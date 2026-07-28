import React, { useState, useRef } from 'react';
import api from '../../../api/axios';
import { Loader2, ChevronLeft, ChevronRight, Camera, User } from 'lucide-react';
import toast from 'react-hot-toast';
import SelectDropdown from '../../../components/SelectDropdown';

const Step2Personal = ({ onNext, onPrev, data, updateData, applicationStatus }) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Size check: 2MB limit
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size exceeds 2MB limit.");
            return;
        }

        // Type check
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            toast.error("Only JPG, JPEG, and PNG images are accepted.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await api.post('/student/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.success && res.data.data.photoUrl) {
                updateData({ photoUrl: res.data.data.photoUrl });
                toast.success("Profile photo uploaded successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to upload photo");
        } finally {
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Enforce passport photo upload
        if (!data.photoUrl) {
            toast.error("Please upload a passport-size profile picture.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...data,
                firstName: data.firstName || '',
                middleName: data.middleName || null,
                lastName: data.lastName || '',
                caste: data.caste || '',
                category: data.category ? String(data.category).toUpperCase() : '',
                studiedInKarnataka: data.studiedInKarnataka === 'true' || data.studiedInKarnataka === true
            };

            if (payload.dateOfBirth && payload.dateOfBirth.includes('/')) {
                const parts = payload.dateOfBirth.split('/');
                if (parts.length === 3) {
                    const [d, m, y] = parts;
                    const fullYear = y.length === 2 ? `20${y}` : y;
                    payload.dateOfBirth = `${fullYear}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                }
            }

            const parsedDate = new Date(payload.dateOfBirth);
            if (isNaN(parsedDate.getTime())) {
                setLoading(false);
                return toast.error("Invalid Date of Birth. Please check the format (DD/MM/YYYY).");
            }

            const res = await api.put('/student/personal', payload);
            if (res.data.success) {
                toast.success('Personal details saved!');
                onNext();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to save personal details');
        } finally {
            setLoading(false);
        }
    };

    const getPhotoUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const base = api.defaults.baseURL || 'http://localhost:5000/api';
        const origin = base.replace('/api', '');
        return `${origin}${path}`;
    };

    const formatDOB = (value) => {
        const d = value.replace(/\D/g, '').slice(0, 8);
        if (d.length <= 2) return d;
        if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
        return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    };

    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'dateOfBirth') {
            value = formatDOB(value);
        }
        updateData({ [e.target.name]: value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                    <h2 className="text-lg font-semibold text-slate-900">Step 2: Personal Details</h2>
                </div>
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded text-xs font-semibold">
                    Basic Information
                </span>
            </div>

            {/* Passport Photo Upload Block */}
            <div className="flex flex-col items-center justify-center gap-3 mb-6 bg-slate-50 border border-slate-100 rounded-xl p-5 w-fit mx-auto">
                <div className="relative w-32 h-32 rounded-full border-4 border-slate-200/80 shadow-md group overflow-visible">
                    {uploading && (
                        <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center z-10">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                    
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        {data.photoUrl ? (
                            <img 
                                src={getPhotoUrl(data.photoUrl)} 
                                alt="Profile Preview" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <User size={48} className="stroke-[1.5]" />
                                <span className="text-[10px] font-semibold mt-1 uppercase tracking-wider text-slate-500">Profile</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={triggerFileInput}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all transform hover:scale-105"
                        title="Upload Photo"
                    >
                        <Camera size={18} />
                    </button>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>
                <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500">PASSPORT SIZE PHOTO <span className="text-red-500">*</span></p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">JPEG or PNG, Max 2MB</p>
                    {!data.photoUrl && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1.5 animate-pulse">Please upload your photo mandatorily</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">First Name (As per SSLC) <span className="text-red-500">*</span></label>
                    <input required type="text" name="firstName" className="input-premium h-11 uppercase" value={data.firstName || ''} onChange={handleChange} placeholder="Enter first name" />
                    {!data.firstName && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Middle Name</label>
                    <input type="text" name="middleName" className="input-premium h-11 uppercase" value={data.middleName || ''} onChange={handleChange} placeholder="Enter middle name" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Last Name (As per SSLC) <span className="text-red-500">*</span></label>
                    <input required type="text" name="lastName" className="input-premium h-11 uppercase" value={data.lastName || ''} onChange={handleChange} placeholder="Enter last name" />
                    {!data.lastName && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Caste <span className="text-red-500">*</span></label>
                    <input required type="text" name="caste" className="input-premium h-11 uppercase" value={data.caste || ''} onChange={handleChange} placeholder="Enter caste" />
                    {!data.caste && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Gender <span className="text-red-500">*</span></label>
                    <SelectDropdown
                        id="gender" name="gender" required
                        value={data.gender || ''}
                        onChange={(val) => handleChange({ target: { name: 'gender', value: val } })}
                        placeholder="Select gender..."
                        options={[
                            { value: 'MALE', label: 'Male' },
                            { value: 'FEMALE', label: 'Female' },
                            { value: 'OTHER', label: 'Other' },
                        ]}
                    />
                    {!data.gender && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Date of Birth <span className="text-red-500">*</span></label>
                    <input
                        required
                        type="text"
                        name="dateOfBirth"
                        className="input-premium h-11"
                        value={data.dateOfBirth || ''}
                        onChange={handleChange}
                        placeholder="DD/MM/YYYY"
                        maxLength={10}
                    />
                    {!data.dateOfBirth && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
                    <SelectDropdown
                        id="category" name="category" required
                        value={data.category || ''}
                        onChange={(val) => handleChange({ target: { name: 'category', value: val } })}
                        placeholder="Select category..."
                        options={[
                            { value: 'GEN', label: 'GEN (General Merit)' },
                            { value: 'OBC', label: 'OBC (Other Backward Classes)' },
                            { value: 'C1', label: 'Category 1' },
                            { value: '2A', label: 'Category 2A' },
                            { value: '2B', label: 'Category 2B' },
                            { value: '3A', label: 'Category 3A' },
                            { value: '3B', label: 'Category 3B' },
                            { value: 'SC', label: 'SC (Scheduled Castes)' },
                            { value: 'ST', label: 'ST (Scheduled Tribes)' },
                            { value: 'EWS', label: 'EWS (Economically Weaker Sections)' },
                            { value: 'SEBC', label: 'SEBC (Socially and Educationally Backward Classes)' },
                        ]}
                    />
                    {!data.category && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Religion <span className="text-red-500">*</span></label>
                    <SelectDropdown
                        id="religion" name="religion" required
                        value={data.religion || ''}
                        onChange={(val) => handleChange({ target: { name: 'religion', value: val } })}
                        placeholder="Select religion..."
                        options={['HINDU', 'MUSLIM', 'CHRISTIAN', 'JAIN', 'SIKH', 'BUDDHIST', 'OTHER'].map(r => ({ value: r, label: r }))}
                    />
                    {!data.religion && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Nationality <span className="text-red-500">*</span></label>
                    <SelectDropdown
                        id="nationality" name="nationality" required
                        value={data.nationality || ''}
                        onChange={(val) => handleChange({ target: { name: 'nationality', value: val } })}
                        placeholder="Select nationality..."
                        options={[
                            { value: 'INDIAN', label: 'Indian' },
                            { value: 'NRI', label: 'NRI' },
                            { value: 'FOREIGN', label: 'Foreign' },
                        ]}
                    />
                    {!data.nationality && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Area Type <span className="text-red-500">*</span></label>
                    <SelectDropdown
                        id="areaType" name="areaType" required
                        value={data.areaType || ''}
                        onChange={(val) => handleChange({ target: { name: 'areaType', value: val } })}
                        placeholder="Select area type..."
                        options={[
                            { value: 'URBAN', label: 'Urban' },
                            { value: 'RURAL', label: 'Rural' },
                        ]}
                    />
                    {!data.areaType && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Karnataka Resident (7yrs) <span className="text-red-500">*</span></label>
                    <SelectDropdown
                        id="studiedInKarnataka" name="studiedInKarnataka" required
                        value={data.studiedInKarnataka !== undefined ? String(data.studiedInKarnataka) : ''}
                        onChange={(val) => handleChange({ target: { name: 'studiedInKarnataka', value: val } })}
                        placeholder="Select..."
                        options={[
                            { value: 'true', label: 'Yes' },
                            { value: 'false', label: 'No' },
                        ]}
                    />
                    {!data.studiedInKarnataka && applicationStatus === 'REJECTED' && (
                        <p className="text-red-500 text-[11px] font-bold mt-1">Please fill this field mandatorily</p>
                    )}
                </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mt-4">
                <p className="text-sm text-red-800 font-medium">
                    <strong>Note:</strong> Your application will be rejected if you submit incorrect personal details. Please double-check your name and DOB as per SSLC records.
                </p>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-slate-100 flex items-center justify-between gap-3 sticky bottom-0 bg-white/95 backdrop-blur-md p-3 sm:p-0 -mx-4 -mb-4 sm:mx-0 sm:mb-0 sm:static sm:bg-transparent z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] sm:shadow-none">
                <button
                    type="button"
                    onClick={onPrev}
                    className="btn-secondary min-h-[44px] h-11 px-5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold"
                >
                    <ChevronLeft size={16} />
                    Back
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary min-h-[44px] h-11 px-6 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                        <>Save & Continue <ChevronRight size={16} /></>
                    )}
                </button>
            </div>
        </form>
    );
};

export default Step2Personal;
