import React, { useState } from 'react';
import { X, UploadCloud, Download, CheckCircle, AlertTriangle, FileText, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import * as xlsx from 'xlsx';
import onboardingService from '../../services/onboarding.service';

interface BulkOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkOnboardingModal: React.FC<BulkOnboardingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'PHASE1' | 'PHASE2'>('PHASE1');
  const [phase1Completed, setPhase1Completed] = useState(false);
  
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [phase1Result, setPhase1Result] = useState<any>(null);
  const [phase2Preview, setPhase2Preview] = useState<any>(null);

  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const downloadTemplate1 = () => {
    const data = [
      { USN: '1RV21CS001', Semester: 5, Department: 'CSE', 'Admission Year': 2021, Section: 'A' },
      { USN: '1RV21CS002', Semester: 5, Department: 'CSE', 'Admission Year': 2021, Section: 'A' }
    ];
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "USN_Master");
    xlsx.writeFile(wb, "usn_master_template.xlsx");
  };

  const downloadTemplate2 = () => {
    const data = [
      { USN: '1RV21CS001', Name: 'Rahul Kumar', Email: 'rahul@xyz.com', Phone: '9876543210', DOB: '2002-03-01', Gender: 'Male' },
      { USN: '1RV21CS002', Name: 'Priya Sharma', Email: 'priya@xyz.com', Phone: '9876543211', DOB: '2002-05-12', Gender: 'Female' }
    ];
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Student_Details");
    xlsx.writeFile(wb, "student_details_template.xlsx");
  };

  const handleUploadPhase1 = async () => {
    if (!file1) return toast.error('Please select an Excel/CSV file.');
    setLoading(true);
    try {
      const res = await onboardingService.uploadUSNRegistry(file1);
      if (res.success) {
        setPhase1Result(res.data);
        toast.success(`Successfully validated and stored USNs.`);
        setPhase1Completed(true);
      } else {
        toast.error(res.message || 'Failed to process registry.');
      }
    } catch (err: any) {
      toast.error('Error uploading USN registry.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPhase2 = async () => {
    if (!file2) return toast.error('Please select the Student Details file.');
    setLoading(true);
    try {
      const res = await onboardingService.bulkUploadStudents(file2, true);
      if (res.success) {
        setPhase2Preview(res.data);
      } else {
        toast.error(res.message || 'Failed to preview student details.');
      }
    } catch (err: any) {
      toast.error('Error previewing students.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPhase2 = async () => {
    if (!file2) return;
    if (!confirmed) return toast.error('Please confirm institutional approval.');
    setLoading(true);
    try {
      const res = await onboardingService.bulkUploadStudents(file2, false);
      if (res.success) {
        toast.success(`Successfully created ${res.data?.created} students!`);
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || 'Failed to create students.');
      }
    } catch (err: any) {
      toast.error('Error creating students. Rollback executed.');
    } finally {
      setLoading(false);
    }
  };

  const downloadErrors = (errors: any[], filename: string) => {
    if (!errors || errors.length === 0) return;
    const header = "Error Details\n";
    const rows = errors.map(e => typeof e === 'string' ? e : `${e.usn || ''},${e.name || ''},${e.reason || ''}`).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + header + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="text-emerald-500" size={20} />
              USN-Verified Bulk Onboarding
            </h3>
            <p className="text-xs text-neutral-500 mt-1">2-Phase secure student provisioning flow</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center hover:bg-neutral-300 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-6 pt-4">
          <button 
            className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-colors ${activeTab === 'PHASE1' ? 'border-violet-600 text-violet-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('PHASE1')}
          >
            1. USN Registry Master
          </button>
          <button 
            className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'PHASE2' ? 'border-violet-600 text-violet-600' : 'border-transparent text-neutral-500'} ${!phase1Completed ? 'opacity-50 cursor-not-allowed' : 'hover:text-neutral-700'}`}
            onClick={() => phase1Completed && setActiveTab('PHASE2')}
            disabled={!phase1Completed}
          >
            2. Match & Create Students {!phase1Completed && <AlertTriangle size={14} />}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-neutral-900">
          
          {/* PHASE 1 */}
          {activeTab === 'PHASE1' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30 rounded-xl">
                <h4 className="font-bold text-violet-800 dark:text-violet-300 flex items-center gap-2 text-sm mb-1">
                  Step 1: Upload Official USN Registry
                </h4>
                <p className="text-xs text-violet-600/80 dark:text-violet-400">
                  Upload the officially verified list of USNs from the university. This locks the Semester and Department. No students can be created without being present in this registry.
                </p>
                <button onClick={downloadTemplate1} className="mt-3 text-xs font-bold text-violet-700 dark:text-violet-400 flex items-center gap-1.5 hover:underline bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-violet-200 dark:border-violet-700/50 w-max shadow-sm">
                  <Download size={14} /> Download Template
                </button>
              </div>

              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-800/20">
                <UploadCloud size={40} className="text-neutral-400 mb-3" />
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Select USN_Master.xlsx / .csv</p>
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  className="mt-4 text-xs"
                  onChange={e => setFile1(e.target.files?.[0] || null)}
                />
                {file1 && (
                  <button 
                    onClick={handleUploadPhase1}
                    disabled={loading}
                    className="mt-6 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Validate & Lock USNs'}
                  </button>
                )}
              </div>

              {phase1Result && (
                <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl shadow-sm">
                  <h5 className="font-bold text-sm mb-3">Validation Summary</h5>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-center">
                      <p className="text-xs text-neutral-500 uppercase font-bold">Total Rows</p>
                      <p className="text-lg font-black">{phase1Result.total}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center">
                      <p className="text-xs text-emerald-600 uppercase font-bold">Valid & Locked</p>
                      <p className="text-lg font-black text-emerald-600">{phase1Result.valid}</p>
                    </div>
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-center">
                      <p className="text-xs text-rose-600 uppercase font-bold">Errors/Duplicates</p>
                      <p className="text-lg font-black text-rose-600">{phase1Result.invalid}</p>
                    </div>
                  </div>
                  {phase1Result.errors?.length > 0 && (
                    <div className="mt-4 border border-rose-200 dark:border-rose-900/50 rounded-lg overflow-hidden">
                      <div className="bg-rose-50 dark:bg-rose-900/30 px-4 py-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Errors Detected</span>
                        <button onClick={() => downloadErrors(phase1Result.errors, 'usn_errors.csv')} className="text-[10px] bg-white dark:bg-neutral-900 px-2 py-1 rounded shadow-sm text-rose-600 font-bold hover:underline">Download Report</button>
                      </div>
                      <ul className="text-[10px] text-rose-600/80 p-3 max-h-32 overflow-y-auto bg-white dark:bg-neutral-900 font-mono space-y-1">
                        {phase1Result.errors.map((e: string, i: number) => <li key={i}>• {e}</li>)}
                      </ul>
                    </div>
                  )}
                  {phase1Result.valid > 0 && (
                     <div className="mt-5 flex justify-end">
                       <button onClick={() => setActiveTab('PHASE2')} className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 flex items-center gap-2">
                         Proceed to Phase 2 <ArrowRight size={16} />
                       </button>
                     </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PHASE 2 */}
          {activeTab === 'PHASE2' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-sm mb-1">
                  Step 2: Match & Create Students
                </h4>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400">
                  Upload the student personal details. The system will strictly match the USN against the registry. Matched students will be created and granted ERP access.
                </p>
                <button onClick={downloadTemplate2} className="mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 hover:underline bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-700/50 w-max shadow-sm">
                  <Download size={14} /> Download Template
                </button>
              </div>

              {!phase2Preview ? (
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-800/20">
                  <FileText size={40} className="text-neutral-400 mb-3" />
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Select Student_Details.xlsx / .csv</p>
                  <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    className="mt-4 text-xs"
                    onChange={e => setFile2(e.target.files?.[0] || null)}
                  />
                  {file2 && (
                    <button 
                      onClick={handlePreviewPhase2}
                      disabled={loading}
                      className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : 'Run USN Matching Engine'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-5 rounded-xl shadow-sm">
                  <h5 className="font-bold text-sm mb-3">Matching Engine Results</h5>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-between border border-emerald-100 dark:border-emerald-900/50">
                      <div>
                        <p className="text-xs text-emerald-600 uppercase font-bold">Ready To Create</p>
                        <p className="text-2xl font-black text-emerald-600">{phase2Preview.readyToCreate}</p>
                      </div>
                      <CheckCircle className="text-emerald-500 opacity-50" size={32} />
                    </div>
                    <div className={`p-4 rounded-xl flex items-center justify-between border ${phase2Preview.rejected > 0 ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/50' : 'bg-neutral-50 dark:bg-neutral-800/20 border-neutral-200 dark:border-neutral-800'}`}>
                      <div>
                        <p className={`text-xs uppercase font-bold ${phase2Preview.rejected > 0 ? 'text-rose-600' : 'text-neutral-500'}`}>Rejected</p>
                        <p className={`text-2xl font-black ${phase2Preview.rejected > 0 ? 'text-rose-600' : 'text-neutral-700 dark:text-neutral-300'}`}>{phase2Preview.rejected}</p>
                      </div>
                      <AlertTriangle className={`${phase2Preview.rejected > 0 ? 'text-rose-500' : 'text-neutral-400'} opacity-50`} size={32} />
                    </div>
                  </div>
                  
                  {/* Validation Block Alert */}
                  {phase2Preview.errors?.length > 0 && (
                    <div className="mb-4 p-3 bg-rose-100/50 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-800 rounded-lg flex items-start gap-2">
                      <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-rose-800 dark:text-rose-300">Strict Validation Block Active</p>
                        <p className="text-xs text-rose-700 dark:text-rose-400">You must fix all errors in the uploaded file before you can proceed. Ensure no USNs are invalid, duplicated, or missing from the Master Registry.</p>
                      </div>
                    </div>
                  )}

                  {/* Derived Values Notice */}
                  {phase2Preview.readyToCreate > 0 && (
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-start gap-2">
                       <FileText size={16} className="mt-0.5 flex-shrink-0" />
                       <p>Note: Department, Semester, and Admission Year are strictly derived from the USN Master Registry. Any mismatched values in this Excel upload will be ignored to preserve institutional integrity.</p>
                    </div>
                  )}

                  {phase2Preview.errors?.length > 0 && (
                    <div className="mb-6 border border-rose-200 dark:border-rose-900/50 rounded-xl overflow-hidden">
                      <div className="bg-rose-50 dark:bg-rose-900/30 px-4 py-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Rejected Rows</span>
                        <button onClick={() => downloadErrors(phase2Preview.errors, 'student_rejections.csv')} className="text-xs bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-lg shadow-sm text-rose-600 font-bold hover:underline">Download Errors</button>
                      </div>
                      <div className="overflow-x-auto max-h-48 overflow-y-auto">
                        <table className="w-full text-left text-[10px] whitespace-nowrap bg-white dark:bg-neutral-900">
                           <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 uppercase">
                             <tr>
                               <th className="px-3 py-2 font-bold">USN</th>
                               <th className="px-3 py-2 font-bold">Name</th>
                               <th className="px-3 py-2 font-bold text-rose-600">Rejection Reason</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                             {phase2Preview.errors.map((err: any, idx: number) => (
                               <tr key={idx} className="bg-rose-50/30 dark:bg-rose-900/10">
                                 <td className="px-3 py-2 font-mono font-bold">{err.usn || 'N/A'}</td>
                                 <td className="px-3 py-2">{err.name || 'N/A'}</td>
                                 <td className="px-3 py-2 font-bold text-rose-600">{err.reason}</td>
                               </tr>
                             ))}
                           </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {phase2Preview.readyToCreate > 0 && (
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl mb-4">
                        <input 
                          type="checkbox" 
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                          className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" 
                        />
                        <span className="text-sm font-bold text-amber-900 dark:text-amber-400">
                          I confirm these students are institutionally approved and ready for ERP access.
                        </span>
                      </label>
                      
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setPhase2Preview(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                          Cancel / Re-upload
                        </button>
                        <button 
                          onClick={handleConfirmPhase2}
                          disabled={!confirmed || loading || (phase2Preview.errors && phase2Preview.errors.length > 0)}
                          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                           {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm & Create Students'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
