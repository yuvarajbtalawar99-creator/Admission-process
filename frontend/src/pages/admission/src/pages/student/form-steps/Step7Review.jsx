import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/axios';
import {
    Loader2,
    CheckCircle,
    ChevronLeft,
    ShieldCheck,
    User,
    Users,
    MapPin,
    GraduationCap,
    Edit3,
    FileText,
    Download,
    AlertCircle,
    ArrowRight,
    Camera,
    Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Step7Review = ({ onPrev, readOnly = false, details: externalDetails = null }) => {
    const [loading, setLoading] = useState(!externalDetails);
    const [submitting, setSubmitting] = useState(false);
    const [details, setDetails] = useState(externalDetails);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const printFrameRef = useRef();

    useEffect(() => {
        if (externalDetails) {
            setDetails(externalDetails);
            setLoading(false);
            return;
        }

        const fetchDetails = async () => {
            try {
                const res = await api.get('/application/full-details');
                if (res.data.success) {
                    setDetails(res.data.data);
                }
            } catch (error) {
                toast.error("Failed to load application details for review.", { id: 'fetch-details-error' });
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, []);

    const handleSubmit = async () => {
        if (!isConfirmed) {
            toast.error("Please confirm your details before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/student/submit');
            if (res.data.success) {
                toast.success('Application Submitted Successfully!');
                setIsSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const response = await api.get('/application/download-pdf', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Acknowledgment_${details.applicationNumber || details.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error("Failed to download PDF acknowledgment.");
        }
    };

    const handleEdit = (stepNumber) => {
        localStorage.setItem('admission_form_step', stepNumber.toString());
        setTimeout(() => window.location.reload(), 50);
    };

    const getPhotoUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const base = api.defaults.baseURL || '/api';
        return `${base.replace('/api', '')}${path}`;
    };

    const generatePrintHTML = () => {
        const pd = details?.studentpersonaldetails || {};
        const par = details?.studentparentdetails || {};
        const addr = details?.studentaddress || {};
        const acad = details?.studentacademicdetails || {};
        const docs = details?.studentdocuments || {};
        const branch = details?.branch || {};
        const user = details?.user || {};
        const applicantName = pd.firstName
            ? `${pd.firstName} ${pd.lastName || ''}`.trim()
            : `${user.firstName || ''} ${user.lastName || ''}`.trim();

        const photoUrl = docs.photoUrl ? getPhotoUrl(docs.photoUrl) : '';
        const signatureUrl = docs.signatureUrl ? getPhotoUrl(docs.signatureUrl) : '';

        // Standardize base URL to resolve public assets correctly in popup windows
        const absoluteLogoUrl = window.location.origin + '/logo.png';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Admission Application Form</title>
                <style>
                    @page {
                        size: A4;
                        margin: 10mm 15mm;
                    }
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body {
                        font-family: 'Times New Roman', Times, serif;
                        background: white;
                        padding: 10px;
                        color: #000;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .application-form {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 auto;
                        padding: 0;
                        background: white;
                    }
                    
                    /* Header */
                    .header {
                        border-bottom: 3px solid #1a3c6e;
                        padding-bottom: 12px;
                        margin-bottom: 15px;
                    }
                    .header-top {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 15px;
                        width: 100%;
                    }
                    .logo-box {
                        width: 80px;
                        height: 80px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: transparent;
                        border-radius: 50%;
                        overflow: hidden;
                        flex-shrink: 0;
                    }
                    .logo-box img {
                        display: block !important;
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: contain !important;
                    }
                    /* Watermark */
                    .watermark {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 400px;
                        height: 400px;
                        opacity: 0.08;
                        pointer-events: none;
                        z-index: 0;
                    }
                    .watermark img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                    @media print {
                        .watermark {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                    }
                    .header-text {
                        flex: 1;
                        text-align: center;
                        padding: 0 10px;
                    }
                    .header-text h1 {
                        font-size: 14pt;
                        font-weight: bold;
                        color: #1a3c6e;
                        margin: 0;
                        letter-spacing: 0.5px;
                        white-space: normal;
                    }
                    .header-text h2 {
                        font-size: 11pt;
                        font-weight: bold;
                        color: #1a3c6e;
                        margin: 4px 0;
                        border: 1.5px solid #1a3c6e;
                        display: inline-block;
                        padding: 1px 12px;
                    }
                    .header-text p {
                        font-size: 9.5pt;
                        color: #333;
                        margin: 2px 0 0;
                    }
                    .photo-box {
                        flex-shrink: 0;
                        width: 80px;
                        height: 100px;
                        border: 2px solid #1a3c6e;
                        overflow: hidden;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fafafa;
                    }
                    .photo-box img {
                        display: block !important;
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: cover !important;
                    }
                    .photo-placeholder {
                        font-size: 10px;
                        color: #999;
                        text-align: center;
                    }
                    .header-bottom {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 10px;
                        padding: 6px 12px;
                        background: #f5f7fa;
                        border: 1px solid #dde1e8;
                        font-size: 10pt;
                    }
                    
                    /* Body */
                    .body {
                        margin: 10px 0 15px;
                    }
                    .section {
                        margin-bottom: 12px;
                    }
                    .section-title {
                        background: #000000;
                        color: white;
                        padding: 5px 12px;
                        font-size: 11pt;
                        font-weight: bold;
                        letter-spacing: 0.5px;
                        page-break-after: avoid;
                        break-after: avoid;
                    }
                    .section-content {
                        border: 1px solid #dde1e8;
                        border-top: none;
                    }
                    .section-content tr {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .section-content table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .section-content td {
                        padding: 4px 10px;
                        border-bottom: 1px dotted #e0e4eb;
                        font-size: 10pt;
                    }
                    .section-content tr:last-child td {
                        border-bottom: none;
                    }
                    .label {
                        width: 160px;
                        font-weight: 600;
                        color: #333;
                    }
                    .value {
                        font-weight: 500;
                        color: #000;
                    }
                    .subheader {
                        background: #f5f7fa;
                        font-weight: bold;
                        color: #1a3c6e;
                        padding: 3px 10px !important;
                    }
                    .same-address {
                        font-style: italic;
                        color: #555;
                        padding: 4px 10px !important;
                    }
                    
                    /* Declaration */
                    .declaration {
                        margin: 15px 0 12px;
                        border: 2px solid #1a3c6e;
                        padding: 10px 14px;
                        background: #f8faff;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .declaration-title {
                        font-size: 11pt;
                        font-weight: bold;
                        color: #1a3c6e;
                        text-align: center;
                        margin-bottom: 4px;
                    }
                    .declaration-text {
                        font-size: 10pt;
                        line-height: 1.5;
                        text-align: justify;
                    }
                    
                    /* Signature */
                    .signature {
                        display: flex;
                        justify-content: space-between;
                        margin: 25px 0 10px;
                        padding: 0 20px;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .signature-item {
                        text-align: center;
                        width: 200px;
                    }
                    .signature-line {
                        border-top: 1px solid black;
                        padding-top: 3px;
                        margin-bottom: 3px;
                        height: 25px;
                    }
                    .signature-img {
                        height: 35px;
                        object-fit: contain;
                        display: block;
                        margin: 0 auto 3px;
                    }
                    .signature-label {
                        font-size: 9pt;
                        color: #333;
                        font-weight: 600;
                    }
                    
                    /* Footer */
                    .footer {
                        margin-top: 20px;
                        border-top: 2px solid #1a3c6e;
                        padding-top: 10px;
                        text-align: center;
                    }
                    .footer p {
                        font-size: 9pt;
                        color: #555;
                        margin: 2px 0;
                    }
                    .footer-divider {
                        border-top: 1px solid #dde1e8;
                        margin: 5px 0;
                    }
                    .footer-contact {
                        font-weight: 500;
                        color: #333 !important;
                    }
                </style>
            </head>
            <body>
                <div class="watermark"><img src="${absoluteLogoUrl}" alt="" /></div>
                <div class="application-form">
                    <div class="header">
                        <div class="header-top">
                            <div class="logo-box"><img src="${absoluteLogoUrl}" alt="JCER Logo" /></div>
                            <div class="header-text">
                                <h1>JAIN COLLEGE OF ENGINEERING AND RESEARCH</h1>
                                <p style="font-size: 8px; font-weight: 500; margin: 1px 0; color: #475569;">(Approved by AICTE, New Delhi, Affiliated to VTU Belagavi & Recognized by Govt. of Karnataka)</p>
                                <p style="font-size: 8px; font-weight: bold; margin: 1px 0 4px; color: #4f46e5;">NBA Accredited Programs - ECE & ME</p>
                                <h2>ADMISSION APPLICATION FORM</h2>
                                <p>Academic Session 2026-2027</p>
                            </div>
                            <div class="photo-box">
                                ${photoUrl ? `<img src="${photoUrl}" alt="Passport Photo" />` : `<span class="photo-placeholder">PASSPORT<br>PHOTO</span>`}
                            </div>
                        </div>
                        <div class="header-bottom">
                            <span><strong>Application No:</strong> ${details?.applicationNumber || details?.id || 'PENDING'}</span>
                            <span><strong>Status:</strong> ${details?.applicationStatus === 'REJECTED' ? 'RESUBMITTED' : (details?.applicationStatus || 'APPLIED')}</span>
                            <span><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    <div class="body">
                        <div class="section">
                            <div class="section-title">1. COURSE PREFERENCE</div>
                            <div class="section-content">
                                <table>
                                    <tbody>
                                        <tr><td class="label">Admission Type</td><td class="value">${details?.admissionType || '—'}</td></tr>
                                        <tr><td class="label">Preferred Branch</td><td class="value">${branch?.name ? `${branch.name} (${branch.code || ''})` : '—'}</td></tr>
                                        ${details?.cetNumber ? `<tr><td class="label">CET Number</td><td class="value">${details.cetNumber}</td></tr>` : ''}
                                        ${details?.dcetNumber ? `<tr><td class="label">DCET Number</td><td class="value">${details.dcetNumber}</td></tr>` : ''}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">2. PERSONAL DETAILS</div>
                            <div class="section-content">
                                <table>
                                    <tbody>
                                        <tr><td class="label">Full Name</td><td class="value">${applicantName || '—'}</td></tr>
                                        <tr><td class="label">Date of Birth</td><td class="value">${pd.dateOfBirth || '—'}</td></tr>
                                        <tr><td class="label">Gender</td><td class="value">${pd.gender || '—'}</td></tr>
                                        <tr><td class="label">Category</td><td class="value">${pd.category || '—'}</td></tr>
                                        <tr><td class="label">Religion</td><td class="value">${pd.religion || '—'}</td></tr>
                                        <tr><td class="label">Nationality</td><td class="value">${pd.nationality || '—'}</td></tr>
                                        <tr><td class="label">Studied in Karnataka</td><td class="value">${pd.studiedInKarnataka ? 'Yes' : 'No'}</td></tr>
                                        <tr><td class="label">Area Type</td><td class="value">${pd.areaType || '—'}</td></tr>
                                        <tr><td class="label">Mobile</td><td class="value">${pd.phone || user.phone || '—'}</td></tr>
                                        <tr><td class="label">Email</td><td class="value">${user.email || '—'}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">3. PARENT / GUARDIAN DETAILS</div>
                            <div class="section-content">
                                <table>
                                    <tbody>
                                        <tr><td class="label">Father's Name</td><td class="value">${par.fatherName || '—'}</td></tr>
                                        <tr><td class="label">Father's Occupation</td><td class="value">${par.fatherOccupation || '—'}</td></tr>
                                        <tr><td class="label">Father's Mobile</td><td class="value">${par.fatherPhone || '—'}</td></tr>
                                        <tr><td class="label">Father's Email</td><td class="value">${par.fatherEmail || '—'}</td></tr>
                                        <tr><td class="label">Annual Income</td><td class="value">${par.fatherAnnualIncome ? `₹${Number(par.fatherAnnualIncome).toLocaleString('en-IN')}` : '—'}</td></tr>
                                        <tr><td class="label">Mother's Name</td><td class="value">${par.motherName || '—'}</td></tr>
                                        <tr><td class="label">Mother's Occupation</td><td class="value">${par.motherOccupation || '—'}</td></tr>
                                        <tr><td class="label">Mother's Mobile</td><td class="value">${par.motherPhone || '—'}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">4. ADDRESS DETAILS</div>
                            <div class="section-content">
                                <table>
                                    <tbody>
                                        <tr><td colspan="2" class="subheader">Current Address</td></tr>
                                        <tr><td class="label">Address</td><td class="value">${addr.currentAddressLine1 || '—'}</td></tr>
                                        <tr><td class="label">City</td><td class="value">${addr.currentCity || '—'}</td></tr>
                                        <tr><td class="label">State</td><td class="value">${addr.currentState || '—'}</td></tr>
                                        <tr><td class="label">Pincode</td><td class="value">${addr.currentPincode || '—'}</td></tr>
                                        <tr><td colspan="2" class="subheader">Permanent Address</td></tr>
                                        ${addr.sameAsCurrent ? 
                                            `<tr><td colspan="2" class="same-address">Same as Current Address</td></tr>` :
                                            `
                                            <tr><td class="label">Address</td><td class="value">${addr.permanentAddressLine1 || '—'}</td></tr>
                                            <tr><td class="label">City</td><td class="value">${addr.permanentCity || '—'}</td></tr>
                                            <tr><td class="label">State</td><td class="value">${addr.permanentState || '—'}</td></tr>
                                            <tr><td class="label">Pincode</td><td class="value">${addr.permanentPincode || '—'}</td></tr>
                                            `
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">5. ACADEMIC RECORD</div>
                            <div class="section-content">
                                <table>
                                    <tbody>
                                        <tr><td colspan="2" class="subheader">SSLC / 10th Standard</td></tr>
                                        <tr><td class="label">Board</td><td class="value">${acad.tenthBoard || '—'}</td></tr>
                                        <tr><td class="label">Register No.</td><td class="value">${acad.tenthRegisterNumber || '—'}</td></tr>
                                        <tr><td class="label">Year of Passing</td><td class="value">${acad.tenthPassingYear || '—'}</td></tr>
                                        <tr><td class="label">Marks Obtained</td><td class="value">${acad.tenthMarksObtained ? `${acad.tenthMarksObtained} / ${acad.tenthMaxMarks || ''}` : '—'}</td></tr>
                                        <tr><td class="label">Percentage</td><td class="value">${acad.tenthPercentage ? `${acad.tenthPercentage}%` : '—'}</td></tr>
                                        ${acad.twelfthBoard ? `
                                            <tr><td colspan="2" class="subheader">PUC / 12th Standard</td></tr>
                                            <tr><td class="label">Board</td><td class="value">${acad.twelfthBoard || '—'}</td></tr>
                                            <tr><td class="label">Register No.</td><td class="value">${acad.twelfthRegisterNumber || '—'}</td></tr>
                                            <tr><td class="label">Year of Passing</td><td class="value">${acad.twelfthPassingYear || '—'}</td></tr>
                                            <tr><td class="label">Percentage</td><td class="value">${acad.twelfthPercentage ? `${acad.twelfthPercentage}%` : '—'}</td></tr>
                                        ` : ''}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">6. DOCUMENT CHECKLIST</div>
                            <div class="section-content">
                                <table>
                                    <tbody>
                                        <tr><td class="label">Passport Photo</td><td class="value">${docs.photoUrl ? '✓ Uploaded' : '✗ Not Uploaded'}</td></tr>
                                        <tr><td class="label">Signature</td><td class="value">${docs.signatureUrl ? '✓ Uploaded' : '✗ Not Uploaded'}</td></tr>
                                        <tr><td class="label">10th Marksheet</td><td class="value">${docs.tenthMarksheetUrl ? '✓ Uploaded' : '✗ Not Uploaded'}</td></tr>
                                        <tr><td class="label">12th Marksheet</td><td class="value">${docs.twelfthMarksheetUrl ? '✓ Uploaded' : '✗ Not Uploaded'}</td></tr>
                                        <tr><td class="label">Domicile Certificate</td><td class="value">${docs.domicileCertificateUrl ? '✓ Uploaded' : '✗ Not Uploaded'}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="declaration">
                            <div class="declaration-title">DECLARATION</div>
                            <div class="declaration-text">
                                I hereby declare that the information furnished above is true, complete and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect, my application is liable to be rejected/cancelled.
                            </div>
                        </div>

                        <div class="signature">
                            <div class="signature-item">
                                <div class="signature-line"></div>
                                <div class="signature-label">Date &amp; Place</div>
                            </div>
                            <div class="signature-item">
                                ${signatureUrl ? `<img src="${signatureUrl}" alt="Signature" class="signature-img" />` : `<div class="signature-line"></div>`}
                                <div class="signature-label">Applicant Signature</div>
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <p>This is a draft copy. Application No: ${details?.applicationNumber || 'PENDING'} · Printed on: ${new Date().toLocaleString('en-IN')}</p>
                        <div class="footer-divider"></div>
                        <p>Need help? Our admissions team is ready to guide you through the process.</p>
                        <p class="footer-contact">Contact: 099448693987 | principal@jcer.in</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(generatePrintHTML());
            printWindow.document.close();
            printWindow.focus();
            
            // Print immediately and close the window afterwards
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 50);
        } else {
            toast.error('Please allow popups to print the application.');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 size={40} className="animate-spin text-primary-600" />
                <p className="text-slate-500 font-medium">Preparing application review...</p>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="space-y-8 animate-fade-in py-8 text-center max-w-2xl mx-auto">
                <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/10">
                    <CheckCircle size={40} />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-slate-900">Application Submitted!</h2>
                    <p className="text-slate-500">Your application (ID: <span className="font-bold text-slate-800">{details.applicationNumber || details.id}</span>) has been successfully recorded and is now under review.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 space-y-6 mt-10">
                    <div className="flex flex-col sm:flex-row items-center justify-around gap-8 text-left">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Application Number</p>
                            <p className="text-lg font-bold text-slate-900">{details.applicationNumber || details.id}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Submitted</p>
                            <p className="text-lg font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-lg font-bold text-green-600 flex items-center gap-1.5">
                                <ShieldCheck size={20} /> SUBMITTED
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleDownloadPDF}
                            className="flex-1 bg-primary-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-[0.98]"
                        >
                            <Download size={20} />
                            Download Acknowledgment PDF
                        </button>
                        <button
                            onClick={() => navigate('/admission/dashboard')}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                        >
                            <ArrowRight size={20} />
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                <p className="text-sm text-slate-400">
                    A confirmation email has been sent to your registered email address.
                </p>
            </div>
        );
    }

    const pd = details?.studentpersonaldetails || {};
    const par = details?.studentparentdetails || {};
    const addr = details?.studentaddress || {};
    const acad = details?.studentacademicdetails || {};
    const docs = details?.studentdocuments || {};
    const branch = details?.branch || {};
    const user = details?.user || {};
    const applicantName = pd.firstName
        ? `${pd.firstName} ${pd.lastName || ''}`.trim()
        : `${user.firstName || ''} ${user.lastName || ''}`.trim();

    const ReviewSection = ({ icon: Icon, title, step, children }) => (
        <div className="review-card group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm text-primary-600 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
                </div>
                {!readOnly && (
                    <button
                        onClick={() => handleEdit(step)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold"
                    >
                        <Edit3 size={14} />
                        Edit
                    </button>
                )}
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                    {children}
                </div>
            </div>
        </div>
    );

    const DataItem = ({ label, value, highlight = false }) => (
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className={`text-sm font-semibold break-words transition-colors duration-300 ${highlight ? 'text-primary-700 font-bold' : 'text-slate-700'}`}>
                {value || <span className="text-slate-300 font-medium italic">Not provided</span>}
            </p>
        </div>
    );

    return (
        <>
            {/* Screen Layout */}
            <div className="space-y-8 animate-fade-in">
                <div className="bg-gradient-to-br from-slate-900 to-primary-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                <ShieldCheck size={12} className="text-blue-300" />
                                Application Review Phase
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight">Verify Your Information</h2>
                            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                                Please conduct a final review of all entered details. Your application will be locked for editing once submitted.
                            </p>
                        </div>

                        <div className="flex items-center gap-5 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <div className="relative group">
                                <div className="size-20 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-primary-400 shadow-xl">
                                    {docs.photoUrl ? (
                                        <img
                                            src={getPhotoUrl(docs.photoUrl)}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User size={32} className="text-white/40" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white p-1.5 rounded-full shadow-lg">
                                    <Camera size={12} />
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold leading-tight uppercase tracking-tight">
                                    {applicantName || 'Guest Applicant'}
                                </p>
                                <p className="text-xs font-medium text-slate-400 mt-1">
                                    App ID: <span className="text-primary-300 font-bold tracking-wider">{details.applicationNumber || details.id}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <ReviewSection icon={GraduationCap} title="Choice of Course" step={1}>
                        <DataItem label="Admission Type" value={details.admissionType} highlight={true} />
                        <DataItem label="Preferred Branch" value={details.branch?.name} highlight={true} />
                        {details.cetNumber && <DataItem label="CET/Rank No." value={details.cetNumber} />}
                        {details.dcetNumber && <DataItem label="DCET/Rank No." value={details.dcetNumber} />}
                    </ReviewSection>

                    <ReviewSection icon={User} title="Personal Details" step={2}>
                        <DataItem label="First Name" value={pd.firstName} />
                        <DataItem label="Middle Name" value={pd.middleName} />
                        <DataItem label="Last Name" value={pd.lastName} />
                        <DataItem label="Caste" value={pd.caste} />
                        <DataItem label="Date of Birth" value={pd.dateOfBirth ? new Date(pd.dateOfBirth.split('/').reverse().join('-')).toLocaleDateString() : null} />
                        <DataItem label="Gender" value={pd.gender} />
                        <DataItem label="Category" value={pd.category} />
                        <DataItem label="Religion" value={pd.religion} />
                        <DataItem label="Nationality" value={pd.nationality} />
                        <DataItem label="Studied in Karnataka" value={pd.studiedInKarnataka === true ? 'Yes' : 'No'}/>
                        <DataItem label="Area Type" value={pd.areaType} />
                    </ReviewSection>
                    <ReviewSection icon={Users} title="Parent Details" step={3}>
                        <DataItem label="Father's Name" value={par.fatherName} />
                        <DataItem label="Father's Occupation" value={par.fatherOccupation} />
                        <DataItem label="Father's Mobile" value={par.fatherPhone} />
                        <DataItem label="Father's Email" value={par.fatherEmail || 'N/A'} />
                        <DataItem label="Father's Annual Income" value={par.fatherAnnualIncome ? `₹${Number(par.fatherAnnualIncome).toLocaleString()}` : null} />
                        <DataItem label="Mother's Name" value={par.motherName} />
                        <DataItem label="Mother's Occupation" value={par.motherOccupation} />
                        <DataItem label="Mother's Mobile" value={par.motherPhone} />
                    </ReviewSection>

                    <ReviewSection icon={MapPin} title="Address Details" step={4}>
                        <div className="col-span-full border-b border-slate-50 pb-2 mb-2">
                            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Current Address</p>
                        </div>
                        <DataItem label="Address" value={addr.currentAddressLine1} />
                        <DataItem label="City" value={addr.currentCity} />
                        <DataItem label="State / Pincode" value={addr ? `${addr.currentState || ''} - ${addr.currentPincode || ''}` : null} />

                        <div className="col-span-full border-b border-slate-50 pb-2 mb-2 mt-4">
                            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Permanent Address</p>
                        </div>
                        <DataItem label="Address" value={addr.permanentAddressLine1} />
                        <DataItem label="City" value={addr.permanentCity} />
                        <DataItem label="State / Pincode" value={addr ? `${addr.permanentState || ''} - ${addr.permanentPincode || ''}` : null} />
                    </ReviewSection>

                    <ReviewSection icon={GraduationCap} title="Academic Record" step={5}>
                        <div className="col-span-full border-b border-slate-50 pb-2 mb-2">
                            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">SSLC / 10th Standard</p>
                        </div>
                        <DataItem label="School Name" value={acad.tenthSchool} />
                        <DataItem label="Board" value={acad.tenthBoard} />
                        <DataItem label="Year" value={acad.tenthPassingYear} />
                        <DataItem label="Percentage" value={acad.tenthPercentage ? `${acad.tenthPercentage}%` : null} />

                        {acad.twelfthBoard && (
                            <>
                                <div className="col-span-full border-b border-slate-50 pb-2 mb-2 mt-4">
                                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">PUC / 12th Standard</p>
                                </div>
                                <DataItem label="School Name" value={acad.twelfthSchool} />
                                <DataItem label="Stream" value={acad.twelfthStream} />
                                <DataItem label="Board" value={acad.twelfthBoard} />
                                <DataItem label="Year" value={acad.twelfthPassingYear} />
                                <DataItem label="Percentage" value={acad.twelfthPercentage ? `${acad.twelfthPercentage}%` : null} />
                            </>
                        )}
                        {acad.diplomaUniversity && (
                            <>
                                <div className="col-span-full border-b border-slate-50 pb-2 mb-2 mt-4">
                                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Diploma (Lateral Entry)</p>
                                </div>
                                <DataItem label="University Name" value={acad.diplomaUniversity} />
                                <DataItem label="Year" value={acad.diplomaYear} />
                                <DataItem label="Percentage" value={acad.diplomaPercentage ? `${acad.diplomaPercentage}%` : null} />
                            </>
                        )}
                    </ReviewSection>

                    <ReviewSection icon={FileText} title="Attached Documents" step={6}>
                        <DataItem label="Photo" value={docs.photoUrl ? '✅ Uploaded' : '❌ Missing'} />
                        <DataItem label="Signature" value={docs.signatureUrl ? '✅ Uploaded' : '❌ Missing'} />
                        <DataItem label="10th Marksheet" value={docs.tenthMarksheetUrl ? '✅ Uploaded' : '❌ Missing'} />
                        <DataItem label="12th Marksheet" value={docs.twelfthMarksheetUrl ? '✅ Uploaded' : '❌ Missing'} />
                        <DataItem label="Domicile Certificate" value={docs.domicileCertificateUrl ? '✅ Uploaded' : '❌ Missing'} />
                    </ReviewSection>
                </div>

                {!readOnly && (
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl mt-12 mb-8">
                        <div className="bg-amber-50 p-6 flex items-start gap-4 border-b border-amber-100">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                                <AlertCircle size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-amber-900">Final Declaration</h4>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    I hereby declare that the information provided above is true and accurate to the best of my knowledge.
                                    I understand that any misleading information may lead to the cancellation of my admission application.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <label className="flex items-center gap-4 cursor-pointer p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isConfirmed}
                                        onChange={(e) => setIsConfirmed(e.target.checked)}
                                        className="peer size-6 rounded-lg border-2 border-slate-300 text-primary-600 focus:ring-primary-600/20 transition-all checked:bg-primary-600 appearance-none"
                                    />
                                    <CheckCircle size={14} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                                <span className="text-sm font-bold text-slate-700 select-none">
                                    I have reviewed all the details and confirm they are correct.
                                </span>
                            </label>

                            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(1)}
                                    className="btn-secondary h-14 px-8 flex items-center justify-center gap-3 text-sm font-bold rounded-2xl"
                                >
                                    <ChevronLeft size={20} />
                                    Discard & Edit
                                </button>

                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <button
                                        onClick={handlePrint}
                                        className="w-full sm:w-auto h-14 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Printer size={20} />
                                        Print Draft
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !isConfirmed}
                                        className={`
                                            w-full sm:w-auto h-14 px-12 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl
                                            ${!isConfirmed ? 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale' : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] shadow-primary-600/30'}
                                        `}
                                    >
                                        {submitting ? (
                                            <Loader2 size={22} className="animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldCheck size={20} />
                                                Finalize & Submit
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Step7Review;