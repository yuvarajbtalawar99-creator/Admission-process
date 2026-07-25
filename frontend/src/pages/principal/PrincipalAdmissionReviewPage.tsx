import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import admissionService, { AdmissionApplication } from '../../services/admission.service';
import API from '../../services/api';
import { ArrowLeft, User, Users, GraduationCap, CheckCircle2, XCircle, FileText, MapPin, ExternalLink, ShieldCheck, Maximize2, Image, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getDocUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return url;
};

const FormField = ({ label, value }: { label: string; value?: string | number | null | boolean }) => {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80">
      <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{value !== null && value !== undefined && value !== '' ? String(value) : '—'}</p>
    </div>
  );
};

const DocumentThumbnail: React.FC<{ field: string; appId: string; label: string; onClick: () => void }> = ({ field, appId, label, onClick }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchDoc = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await API.get(`/admin/admissions/${appId}/documents/${field}`, { responseType: 'blob' });
        const contentType = String(res.headers['content-type'] || '');
        setIsPdf(contentType.includes('pdf'));

        const url = URL.createObjectURL(res.data);
        if (active) setBlobUrl(url);
      } catch (err) {
        console.error(`Failed to fetch document ${field}:`, err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDoc();
    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [field, appId]);

  if (loading) {
    return (
      <div className="h-40 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 animate-pulse border border-neutral-200 dark:border-neutral-800">
        Loading...
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="h-40 rounded-xl bg-rose-500/5 border border-rose-500/10 flex flex-col items-center justify-center text-center p-4">
        <XCircle className="w-5 h-5 text-rose-500 mb-1" />
        <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">{label}</span>
        <span className="text-[9px] text-rose-400 font-semibold mt-0.5">Not Uploaded or Error</span>
      </div>
    );
  }

  return (
    <div onClick={onClick} className="group relative h-40 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-950 flex flex-col justify-between p-3 cursor-pointer hover:border-amber-500 dark:hover:border-amber-500 transition-all shadow-sm">
      {isPdf ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
          <FileText className="w-12 h-12 text-neutral-600 group-hover:scale-110 transition-transform duration-300" />
        </div>
      ) : (
        <>
          <img src={blobUrl} alt={label} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </>
      )}

      <span className="relative z-10 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-wider self-start border border-white/5">
        {isPdf ? 'PDF file' : 'Image'}
      </span>

      <div className="relative z-10 flex items-end justify-between w-full">
        <div>
          <span className="text-[10px] font-black text-white uppercase tracking-wider block leading-tight">{label}</span>
          <span className="text-[8px] text-white/50 font-bold block mt-0.5">Click to view document</span>
        </div>
        <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const PrincipalAdmissionReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [app, setApp] = useState<AdmissionApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [remarks, setRemarks] = useState('');
  
  // Document preview modal
  const [previewDoc, setPreviewDoc] = useState<{ field: string; label: string } | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewPdf, setPreviewPdf] = useState(false);

  const fetchApplicationDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const details = await admissionService.getApplication(id);
      setApp(details);
      setRemarks(details.approvalRemarks || '');
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to load application details');
      navigate('/principal/admissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (!previewDoc || !id) {
      setPreviewBlobUrl(null);
      return;
    }
    let active = true;
    const fetchBlob = async () => {
      try {
        const res = await API.get(`/admin/admissions/${id}/documents/${previewDoc.field}`, { responseType: 'blob' });
        const contentType = String(res.headers['content-type'] || '');
        setPreviewPdf(contentType.includes('pdf'));
        const url = URL.createObjectURL(res.data);
        if (active) setPreviewBlobUrl(url);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load full size document');
        setPreviewDoc(null);
      }
    };
    fetchBlob();
    return () => {
      active = false;
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
    // eslint-disable-next-line
  }, [previewDoc]);

  const handlePrincipalDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!id || !app) return;
    
    let confirmMsg = '';
    if (decision === 'APPROVED') {
      confirmMsg = 'Are you sure you want to approve and sign-off on this admission?';
    } else {
      if (!remarks.trim()) {
        toast.warn('Please provide rejection/correction remarks in the text field.');
        return;
      }
      confirmMsg = 'Are you sure you want to reject this application? It will be returned to the applicant.';
    }

    if (!window.confirm(confirmMsg)) return;

    setUpdating(true);
    try {
      const res = await API.put(`/principal/admissions/${id}/decide`, {
        decision,
        remarks,
        rejectReasonCode: decision === 'REJECTED' ? 'INCOMPLETE_DOCUMENTS' : undefined
      });
      if (res.data.success) {
        toast.success(`Application has been ${decision.toLowerCase()} successfully.`);
        await fetchApplicationDetails();
      } else {
        toast.error('Failed to submit decision.');
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.error || 'Server error when submitting decision');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !app) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-[32px]" />
        <div className="h-[500px] bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
      </div>
    );
  }

  const pd = app.studentpersonaldetails as any;
  const par = app.studentparentdetails as any;
  const addr = app.studentaddress as any;
  const acad = app.studentacademicdetails as any;
  const isLateral = app.admissionType === 'DCET';

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="h-10 px-4 bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/60 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admissions</span>
        </button>

        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest">
          Principal Review Workspace
        </span>
      </div>

      {/* Hero Overview Header */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-amber-500">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-150 overflow-hidden flex items-center justify-center shadow-md">
            {app.studentdocuments?.photoUrl ? (
              <img src={getDocUrl(app.studentdocuments.photoUrl)!} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-neutral-450" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider leading-none">
                {pd?.firstName} {pd?.lastName}
              </h2>
              <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {app.branch?.code || 'CSE'}
              </span>
            </div>
            <p className="text-xs font-semibold text-neutral-400 mt-1.5 flex items-center gap-3">
              <span>App ID: <span className="font-bold text-neutral-700 dark:text-neutral-300">{app.applicationNumber}</span></span>
              <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
              <span>Quota: <span className="font-bold text-neutral-700 dark:text-neutral-300">{app.admissionType}</span></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Overall Status</p>
            <p className="text-xs font-black text-neutral-700 dark:text-neutral-300 mt-0.5 uppercase tracking-wide">
              {app.applicationStatus === 'APPROVED' ? 'Awaiting Principal Sign-off' : app.applicationStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Main Review Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Student forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Course Selection */}
          <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/40 pb-3">
              <GraduationCap className="w-5 h-5 text-neutral-400" />
              <h3 className="font-bold text-neutral-800 dark:text-neutral-150">Choice of Course & Branch</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Admission Quota Type" value={app.admissionType} />
              <FormField label="Selected Branch / Stream" value={`${app.branch?.code} - ${app.branch?.name}`} />
            </div>
          </div>

          {/* Section 2: Personal Details */}
          <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/40 pb-3">
              <User className="w-5 h-5 text-neutral-400" />
              <h3 className="font-bold text-neutral-800 dark:text-neutral-150">Personal Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="First Name" value={pd?.firstName} />
              <FormField label="Middle Name" value={pd?.middleName} />
              <FormField label="Last Name" value={pd?.lastName} />
              <FormField label="Gender" value={pd?.gender} />
              <FormField label="Date of Birth" value={pd?.dateOfBirth ? format(new Date(pd.dateOfBirth), 'dd MMM yyyy') : '-'} />
              <FormField label="Nationality" value={pd?.nationality} />
              <FormField label="Religion" value={pd?.religion} />
              <FormField label="Caste" value={pd?.caste} />
              <FormField label="Category" value={pd?.category} />
              <FormField label="Candidate Mobile" value={pd?.phone || app.user?.phone} />
              <FormField label="Candidate Email" value={pd?.email || app.user?.email} />
              <FormField label="Aadhaar Card No." value={app.aadhaar} />
            </div>
          </div>

          {/* Section 3: Parent & Contact info */}
          <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/40 pb-3">
              <Users className="w-5 h-5 text-neutral-400" />
              <h3 className="font-bold text-neutral-800 dark:text-neutral-150">Parent & Contact Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Father's Name" value={par?.fatherName} />
              <FormField label="Father's Mobile" value={par?.fatherPhone} />
              <FormField label="Father's Occupation" value={par?.fatherOccupation} />
              <FormField label="Mother's Name" value={par?.motherName} />
              <FormField label="Mother's Mobile" value={par?.motherPhone} />
              <FormField label="Mother's Occupation" value={par?.motherOccupation} />
              <FormField label="Annual Family Income" value={par?.fatherAnnualIncome ? `₹${parseFloat(par.fatherAnnualIncome).toLocaleString()}` : '-'} />
            </div>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/30">
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2">Correspondence Address</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormField label="Address Line" value={addr?.currentAddressLine1} />
                </div>
                <FormField label="City" value={addr?.currentCity} />
                <FormField label="State" value={addr?.currentState} />
                <FormField label="Pincode" value={addr?.currentPincode} />
              </div>
            </div>
          </div>

          {/* Section 4: Academic Details */}
          <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/40 pb-3">
              <FileText className="w-5 h-5 text-neutral-400" />
              <h3 className="font-bold text-neutral-800 dark:text-neutral-150">Academic Qualifications</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2">10th Standard / SSLC Details</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="School Name" value={acad?.tenthSchool} />
                  <FormField label="Board" value={acad?.tenthBoard} />
                  <FormField label="Passing Year" value={acad?.tenthPassingYear} />
                  <FormField label="Registration No." value={acad?.tenthRegisterNumber} />
                  <FormField label="Aggregate Percentage" value={acad?.tenthPercentage ? `${acad.tenthPercentage}%` : '-'} />
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/30">
                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2">
                  {isLateral ? 'Diploma Qualifications' : '12th Standard / PUC Details'}
                </p>
                {isLateral ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Diploma University" value={acad?.diplomaUniversity} />
                    <FormField label="Passing Year" value={acad?.diplomaYear} />
                    <FormField label="Registration No." value={acad?.diplomaRegisterNumber} />
                    <FormField label="Aggregate Percentage" value={acad?.diplomaPercentage ? `${acad.diplomaPercentage}%` : '-'} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="School / College Name" value={acad?.twelfthSchool} />
                    <FormField label="Board" value={acad?.twelfthBoard} />
                    <FormField label="Stream" value={acad?.twelfthStream} />
                    <FormField label="Passing Year" value={acad?.twelfthPassingYear} />
                    <FormField label="Registration No." value={acad?.twelfthRegisterNumber} />
                    <FormField label="Aggregate Percentage" value={acad?.twelfthPercentage ? `${acad.twelfthPercentage}%` : '-'} />
                  </div>
                )}
              </div>
              
              {(app.admissionType === 'KCET' || app.admissionType === 'DCET') && (
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/30">
                  <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2">Entrance Exam Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Entrance Exam Rank" value={acad?.cetRank || app.dcetNumber || '—'} />
                    <FormField label="Entrance Score" value={acad?.cetScore || '—'} />
                    <FormField label="Exam Year" value={acad?.cetYear || '—'} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Documents list */}
          <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/40 pb-3">
              <Image className="w-5 h-5 text-neutral-400" />
              <h3 className="font-bold text-neutral-800 dark:text-neutral-150">Uploaded Documents</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <DocumentThumbnail field="photoUrl" appId={app.id} label="Passport Photo" onClick={() => setPreviewDoc({ field: 'photoUrl', label: 'Passport Photo' })} />
              <DocumentThumbnail field="signatureUrl" appId={app.id} label="Candidate Signature" onClick={() => setPreviewDoc({ field: 'signatureUrl', label: 'Candidate Signature' })} />
              <DocumentThumbnail field="tenthMarksheetUrl" appId={app.id} label="10th Marksheet" onClick={() => setPreviewDoc({ field: 'tenthMarksheetUrl', label: '10th Marksheet' })} />
              <DocumentThumbnail field="twelfthMarksheetUrl" appId={app.id} label={isLateral ? "Diploma Marks Card" : "12th Marksheet"} onClick={() => setPreviewDoc({ field: 'twelfthMarksheetUrl', label: isLateral ? "Diploma Marks Card" : "12th Marksheet" })} />
              <DocumentThumbnail field="aadhaarUrl" appId={app.id} label="Aadhaar Card" onClick={() => setPreviewDoc({ field: 'aadhaarUrl', label: 'Aadhaar Card' })} />
              <DocumentThumbnail field="domicileCertificateUrl" appId={app.id} label="Domicile/Study Cert" onClick={() => setPreviewDoc({ field: 'domicileCertificateUrl', label: 'Domicile/Study Certificate' })} />
              {app.admissionType === 'KCET' && (
                <DocumentThumbnail field="cetScoreCardUrl" appId={app.id} label="KCET Rank Card" onClick={() => setPreviewDoc({ field: 'cetScoreCardUrl', label: 'KCET Rank Card' })} />
              )}
            </div>
          </div>

        </div>

        {/* Right column: Action Audit */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Admin Audit Review */}
          <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Admin Audit Logs</span>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-md text-[9px] font-extrabold uppercase tracking-wider border border-emerald-250/20">
                PASSED AUDIT
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-800 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 select-none">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Docs: Verified
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-800 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 select-none">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Fees: Verified
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-800 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 select-none">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Eligibility: Verified
              </div>
            </div>
            {app.verificationRemarks && (
              <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 block mb-1">Admin Internal Notes</span>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 italic whitespace-pre-wrap leading-relaxed">
                  "{app.verificationRemarks}"
                </p>
              </div>
            )}
          </div>

          {/* Decision panel */}
          <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
            {app.applicationStatus === 'APPROVED' && !app.approvedByAdminId ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-850 pb-3">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <h4 className="font-extrabold text-neutral-800 dark:text-neutral-100 text-xs uppercase tracking-widest">
                    Principal Sign-off
                  </h4>
                </div>
                
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold leading-relaxed">
                  Registrar has verified all documents, eligibility status, and fees. Please authorize final sign-off.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-450 block">Approval/Correction Remarks</label>
                  <textarea 
                    value={remarks} 
                    onChange={e => setRemarks(e.target.value)}
                    className="w-full h-24 p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 resize-none font-semibold leading-relaxed text-neutral-800 dark:text-neutral-200"
                    placeholder="E.g., Approved and signed-off." 
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    disabled={updating} 
                    onClick={() => handlePrincipalDecision('APPROVED')}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> Authorize & Sign-off
                  </button>
                  <button 
                    disabled={updating} 
                    onClick={() => handlePrincipalDecision('REJECTED')}
                    className="w-full h-12 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle size={16} /> Send back (Reject)
                  </button>
                </div>
              </div>
            ) : app.applicationStatus === 'APPROVED' && app.approvedByAdminId ? (
              <div className="text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-extrabold text-neutral-800 dark:text-neutral-100 text-sm">Approved by Principal</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold leading-relaxed">
                  You have authorized and signed off on this application. Registrar is pending final USN assignment.
                </p>
                {remarks && (
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-left border border-neutral-150 dark:border-neutral-800 mt-2">
                    <span className="text-[8px] font-black uppercase text-neutral-400 block mb-0.5">Your Remarks</span>
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 italic">"{remarks}"</p>
                  </div>
                )}
              </div>
            ) : app.applicationStatus === 'ENROLLED' ? (
              <div className="text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" strokeWidth={2.5} />
                <h4 className="font-extrabold text-neutral-800 dark:text-neutral-100 text-sm">Student Enrolled</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold leading-relaxed">
                  Final enrollment completed. Student USN has been allocated and portal access credentials dispatched.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <h4 className="font-extrabold text-neutral-800 dark:text-neutral-100 text-sm">Application Rejected</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold leading-relaxed">
                  This application has been returned to the student for correction or has been cancelled.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Document View Modal */}
      {previewDoc && previewBlobUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl h-[85vh] bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between text-white">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider">{previewDoc.label}</h4>
                <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Application: {app.applicationNumber}</p>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="h-9 w-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 bg-neutral-950 flex items-center justify-center p-4 min-h-0">
              {previewPdf ? (
                <iframe src={previewBlobUrl} className="w-full h-full rounded-2xl" title={previewDoc.label} />
              ) : (
                <img src={previewBlobUrl} alt={previewDoc.label} className="max-w-full max-h-full object-contain rounded-2xl" />
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-900/60">
              <a 
                href={previewBlobUrl} 
                download={`${app.applicationNumber}_${previewDoc.field}.${previewPdf ? 'pdf' : 'jpg'}`}
                className="h-10 px-5 bg-white text-neutral-900 rounded-xl text-xs font-bold transition-all hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> Download Document
              </a>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="h-10 px-5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold border border-neutral-700 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalAdmissionReviewPage;
