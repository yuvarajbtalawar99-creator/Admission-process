import React, { useState } from 'react';
import api from '../../../api/axios';
import { Loader2, UploadCloud, CheckCircle, FileText, User, Image, ClipboardIcon, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { compressDocumentImage, validateImageType } from '../../../utils/imageCompressor';

const ACCEPTED_MIME = 'image/jpeg,image/jpg,image/png';

const Step6Documents = ({ onNext, onPrev, data, onUploadSuccess, applicationStatus }) => {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState({});
    const [compressing, setCompressing] = useState({});

    const DOCS = [
        { name: 'photo',           label: 'Recent Passport Photo',            icon: User,         note: 'JPG/PNG, max 500 KB' },
        { name: 'signature',       label: 'E-Signature / Scanned Sign',        icon: ClipboardIcon, note: 'JPG/PNG, max 200 KB' },
        { name: 'sslcMarkscard',   label: 'SSLC / 10th Marks Card',            icon: FileText,     note: 'JPG/PNG, max 1 MB' },
        {
            name: 'pucMarkscard',
            label: data?.qualification === 'DIPLOMA' ? 'Diploma Marks Card' : 'PUC / 12th Marks Card',
            icon: GraduationCap,
            note: 'JPG/PNG, max 1 MB',
        },
        { name: 'aadhaar',          label: 'Aadhaar Card Copy',               icon: FileText,     note: 'JPG/PNG, max 1 MB' },
        {
            name: 'cetScoreCard',
            label: 'Entrance Score Card (CET/DCET)',
            icon: FileText,
            note: data?.admissionType === 'MANAGEMENT' ? 'JPG/PNG (Optional for Management)' : 'JPG/PNG, max 1 MB',
        },
        { name: 'feesPaidReceipt',  label: 'Fees Paid Receipt',               icon: FileText,     note: 'JPG/PNG, max 1 MB' },
        { name: 'casteCertificate',  label: 'Caste Certificate',              icon: Image,        note: 'JPG/PNG (Optional)' },
        { name: 'incomeCertificate', label: 'Income Certificate',             icon: Image,        note: 'JPG/PNG (Optional)' },
        { name: 'studyCertificate',  label: '7 Years Study Certificate',       icon: FileText,     note: 'JPG/PNG, max 1 MB' },
    ];

    const handleFileChange = async (e, docName) => {
        const file = e.target.files[0];
        // Reset input so same file can be re-selected after error
        e.target.value = '';

        if (!file) return;

        // 1. Validate image type (no PDFs)
        const typeCheck = validateImageType(file);
        if (!typeCheck.valid) {
            toast.error(typeCheck.error);
            return;
        }

        // 2. Compress automatically in the background
        setCompressing(prev => ({ ...prev, [docName]: true }));
        try {
            const compressed = await compressDocumentImage(file, docName);
            setFiles(prev => ({ ...prev, [docName]: compressed }));
            toast.success(`${file.name} compressed & ready`, { duration: 2000 });
        } catch (err) {
            toast.error(err.message || 'Compression failed. Please try a different image.');
        } finally {
            setCompressing(prev => ({ ...prev, [docName]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isPhotoPresent     = files.photo        || data?.photo        || data?.photoUrl;
        const isSignaturePresent = files.signature    || data?.signature    || data?.signatureUrl;
        const isSslcPresent      = files.sslcMarkscard || data?.sslcMarkscard || data?.tenthMarksheetUrl;
        const isAadhaarPresent   = files.aadhaar      || data?.aadhaarUrl;
        const isCetPresent       = files.cetScoreCard || data?.cetScoreCard || data?.cetScoreCardUrl;
        const isFeesPaidPresent  = files.feesPaidReceipt || data?.feesPaidReceiptUrl;

        if (!isPhotoPresent || !isSignaturePresent || !isSslcPresent) {
            toast.error('Photo, Signature, and SSLC marks card are required');
            return;
        }
        if (!isAadhaarPresent) {
            toast.error('Aadhaar Card is required');
            return;
        }
        if (data?.admissionType !== 'MANAGEMENT' && !isCetPresent) {
            toast.error('Entrance Score Card (CET/DCET) is required');
            return;
        }
        if (!isFeesPaidPresent) {
            toast.error('Fees Paid Receipt is required');
            return;
        }
        if (Object.keys(files).length === 0) {
            onNext();
            return;
        }

        setLoading(true);
        const API_FIELDS = {
            photo:             'photo',
            signature:         'signature',
            sslcMarkscard:     'tenthMarksheet',
            pucMarkscard:      'twelfthMarksheet',
            aadhaar:           'aadhaar',
            cetScoreCard:      'cetScoreCard',
            casteCertificate:  'casteCertificate',
            incomeCertificate: 'gapCertificate',
            studyCertificate:  'domicileCertificate',
            feesPaidReceipt:   'feesPaidReceipt',
        };

        const formData = new FormData();
        Object.keys(files).forEach(key => {
            formData.append(API_FIELDS[key] || key, files[key]);
        });

        try {
            const res = await api.post('/student/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.success) {
                toast.success('Documents uploaded successfully!');
                if (onUploadSuccess) await onUploadSuccess();
                onNext();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to upload documents');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                    <h2 className="text-lg font-semibold text-slate-900">Step 6: Document Upload</h2>
                </div>
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded text-xs font-semibold">
                    Document Verification
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DOCS.map(doc => {
                    const DB_MAP = {
                        photo:             'photoUrl',
                        signature:         'signatureUrl',
                        sslcMarkscard:     'tenthMarksheetUrl',
                        pucMarkscard:      'twelfthMarksheetUrl',
                        aadhaar:           'aadhaarUrl',
                        cetScoreCard:      'cetScoreCardUrl',
                        casteCertificate:  'casteCertificateUrl',
                        incomeCertificate: 'gapCertificateUrl',
                        studyCertificate:  'domicileCertificateUrl',
                        feesPaidReceipt:   'feesPaidReceiptUrl',
                    };
                    const isFileSelected  = !!files[doc.name];
                    const isFileInDb      = doc.name === 'aadhaar'
                        ? !!data?.aadhaarUrl
                        : !!(data?.[doc.name] || data?.[DB_MAP[doc.name]]);
                    const isComplete      = isFileSelected || isFileInDb;
                    const isCompressing   = !!compressing[doc.name];
                    const isRequired      = ['photo', 'signature', 'sslcMarkscard', 'aadhaar', 'feesPaidReceipt'].includes(doc.name) ||
                        (doc.name === 'cetScoreCard' && data?.admissionType !== 'MANAGEMENT');

                    return (
                        <div
                            key={doc.name}
                            className={`p-4 rounded-lg border transition-all ${
                                isComplete
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-white border-slate-200 hover:border-primary-300'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                    isComplete ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {isComplete ? <CheckCircle size={18} /> : <doc.icon size={18} />}
                                </div>
                                {isRequired && (
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                        isComplete ? 'bg-green-100 text-green-700' : 'bg-slate-900 text-white'
                                    }`}>
                                        {isComplete ? 'Uploaded' : 'Required'}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-sm font-semibold text-slate-900 mb-0.5">{doc.label}</h3>
                            <p className="text-xs text-slate-500 mb-3">{doc.note}</p>

                            <label className={`block w-full ${isCompressing ? 'cursor-wait' : 'cursor-pointer'}`}>
                                <div className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-colors text-sm ${
                                    isCompressing
                                        ? 'bg-slate-200 border-slate-200 text-slate-500 cursor-wait'
                                        : isComplete
                                        ? 'border-dashed bg-white border-green-200 text-green-600 font-medium'
                                        : 'border-solid bg-slate-800 border-slate-800 text-white hover:bg-slate-900 hover:border-slate-900 font-medium'
                                }`}>
                                    {isCompressing
                                        ? <><Loader2 size={16} className="animate-spin" /> Compressing…</>
                                        : <><UploadCloud size={16} /> {isComplete ? 'Update File' : 'Choose File'}</>
                                    }
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept={ACCEPTED_MIME}
                                    disabled={isCompressing}
                                    onChange={(e) => handleFileChange(e, doc.name)}
                                />
                            </label>

                            {!isComplete && isRequired && applicationStatus === 'REJECTED' && (
                                <p className="text-red-500 text-[11px] font-bold mt-2 animate-pulse text-center">
                                    Please upload this document mandatorily
                                </p>
                            )}

                            {(isFileSelected || isFileInDb) && (
                                <div className="mt-2 flex items-center gap-1.5 px-2 py-1.5 bg-white rounded border border-slate-100">
                                    <FileText size={12} className="text-primary-600" />
                                    <p className="text-[11px] font-medium text-slate-600 truncate">
                                        {isFileSelected ? files[doc.name].name : 'Previously uploaded'}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="pt-4 sm:pt-6 border-t border-slate-100 flex items-center justify-between gap-3 sticky bottom-0 bg-white/95 backdrop-blur-md p-3 sm:p-0 -mx-4 -mb-4 sm:mx-0 sm:mb-0 sm:static sm:bg-transparent z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] sm:shadow-none">
                <button type="button" onClick={onPrev} className="btn-secondary min-h-[44px] h-11 px-5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold">
                    <ChevronLeft size={16} /> Back
                </button>
                <button
                    type="submit"
                    disabled={loading || Object.values(compressing).some(Boolean)}
                    className="btn-primary min-h-[44px] h-11 px-6 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold"
                >
                    {loading
                        ? <Loader2 size={18} className="animate-spin" />
                        : <>Upload & Continue <ChevronRight size={16} /></>
                    }
                </button>
            </div>
        </form>
    );
};

export default Step6Documents;
