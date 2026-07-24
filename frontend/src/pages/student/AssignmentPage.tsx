import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UploadCloud, 
  X, 
  Search, 
  FileCheck, 
  Calendar, 
  Download, 
  BookOpen,
  Filter
} from 'lucide-react';
import Toast from '../../components/common/Toast';

interface Assignment {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  maxPoints: number;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';
  submittedAt?: string;
  submittedFile?: string;
  grade?: string;
  obtainedPoints?: number;
  feedback?: string;
  attachmentName?: string;
  attachmentSize?: string;
}

const initialAssignments: Assignment[] = [
  {
    id: 'ASN-201',
    subjectCode: '18CS61',
    subjectName: 'System Software & Compilers',
    title: 'Lexical Analyzer Implementation',
    description: 'Write a Lexical Analyzer program in C/C++ or Python to identify tokens (keywords, identifiers, operators, constants) for a subset of C language. The program should read input source code from a file and produce a clean list of identified tokens alongside line numbers.',
    dueDate: '2026-06-30',
    dueTime: '23:59',
    maxPoints: 50,
    status: 'PENDING',
    attachmentName: 'Lexical_Analysis_Guidelines.pdf',
    attachmentSize: '420 KB'
  },
  {
    id: 'ASN-202',
    subjectCode: '18CS62',
    subjectName: 'Computer Networks',
    title: 'Socket Programming Lab Exercise',
    description: 'Implement a Multi-threaded Client-Server Chat Application using TCP Sockets. The server should be capable of handling multiple concurrent clients, broadcasting messages, and logging timestamps of active sessions.',
    dueDate: '2026-06-28',
    dueTime: '17:00',
    maxPoints: 40,
    status: 'PENDING',
    attachmentName: 'Socket_Programming_Sample.zip',
    attachmentSize: '1.2 MB'
  },
  {
    id: 'ASN-203',
    subjectCode: '18CS63',
    subjectName: 'Database Management Systems',
    title: 'Relational Schema Design & Normalization',
    description: 'Design a relational database schema for a university ERP portal. Perform normalization up to Boyce-Codd Normal Form (BCNF). Submit the Entity-Relationship (ER) diagram along with functional dependency tables.',
    dueDate: '2026-06-20',
    dueTime: '23:59',
    maxPoints: 30,
    status: 'GRADED',
    submittedAt: '19 Jun 2026, 14:32',
    submittedFile: 'DBMS_Normalization_Report.pdf',
    grade: 'A+',
    obtainedPoints: 29,
    feedback: 'Exceptional relational schemas. ER diagram is extremely clean and correctly models all cardinality constraints. Good work!'
  },
  {
    id: 'ASN-204',
    subjectCode: '18CS64',
    subjectName: 'Web Technology & Applications',
    title: 'Interactive Dashboard Front-end Prototype',
    description: 'Develop a responsive frontend layout for an admin workspace using React. Use local state to manage active menus, forms, and render dynamic lists. Ensure styling is clean and follows modern UI design guidelines.',
    dueDate: '2026-06-15',
    dueTime: '23:59',
    maxPoints: 100,
    status: 'GRADED',
    submittedAt: '15 Jun 2026, 21:05',
    submittedFile: 'React_Dashboard_Code.zip',
    grade: 'A',
    obtainedPoints: 92,
    feedback: 'Very creative use of CSS custom variables and glassmorphism cards. Minor padding issue on mobile layouts but code structure is excellent.'
  },
  {
    id: 'ASN-205',
    subjectCode: '18CS65',
    subjectName: 'Operations Research',
    title: 'Linear Programming Simplex Method Formulation',
    description: 'Solve the given optimization problems using the Simplex and Dual Simplex algorithms. Formulate objective functions and display intermediate step tables.',
    dueDate: '2026-06-22',
    dueTime: '23:59',
    maxPoints: 30,
    status: 'SUBMITTED',
    submittedAt: '21 Jun 2026, 18:40',
    submittedFile: 'Simplex_Method_Solutions.pdf'
  },
  {
    id: 'ASN-206',
    subjectCode: '18CS66',
    subjectName: 'Software Engineering',
    title: 'SRS Document - Hospital Management Portal',
    description: 'Draft a comprehensive Software Requirements Specification (SRS) document for a clinic portal. Include functional requirements, system use case diagram, and non-functional scalability matrices.',
    dueDate: '2026-06-10',
    dueTime: '12:00',
    maxPoints: 50,
    status: 'OVERDUE'
  }
];

export const AssignmentPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  // Submit modal states
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Statistics
  const totalCount = assignments.length;
  const pendingCount = assignments.filter(a => a.status === 'PENDING').length;
  const submittedCount = assignments.filter(a => a.status === 'SUBMITTED' || a.status === 'GRADED').length;
  const gradedCount = assignments.filter(a => a.status === 'GRADED').length;
  const overdueCount = assignments.filter(a => a.status === 'OVERDUE').length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setToast({ type: 'error', message: 'Please attach a document to submit.' });
      return;
    }
    if (!selectedAssignment) return;

    setSubmitting(true);
    setTimeout(() => {
      // Update state
      setAssignments(prev => prev.map(a => {
        if (a.id === selectedAssignment.id) {
          return {
            ...a,
            status: 'SUBMITTED',
            submittedAt: new Date().toLocaleString('en-GB', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            submittedFile: selectedFile.name
          };
        }
        return a;
      }));

      setSubmitting(false);
      setToast({ type: 'success', message: 'Assignment uploaded and marked as submitted!' });
      setSelectedAssignment(null);
      setSelectedFile(null);
      setComment('');
    }, 1500);
  };

  // Filter & Search Logic
  const filteredAssignments = assignments.filter(a => {
    const matchesFilter = selectedFilter === 'ALL' || a.status === selectedFilter;
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Panel */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Coursework Assignments</h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Track deadlines, upload lab files, and review instructor grades & feedback</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Stat Cards */}
        <div className="glass-panel rounded-[24px] p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">Total Tasks</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{totalCount}</p>
          </div>
        </div>

        <div className="glass-panel rounded-[24px] p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">Pending</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{pendingCount}</p>
          </div>
        </div>

        <div className="glass-panel rounded-[24px] p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">Submitted</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{submittedCount}</p>
          </div>
        </div>

        <div className="glass-panel rounded-[24px] p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">Overdue</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{overdueCount}</p>
          </div>
        </div>
      </div>

      {/* Control Actions & Filter Bar */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Navigation Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {(['ALL', 'PENDING', 'SUBMITTED', 'GRADED', 'OVERDUE'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-neutral-900 dark:bg-neutral-200 text-white dark:text-neutral-950 shadow-sm'
                    : 'bg-neutral-900/60 dark:bg-neutral-900/30 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                {filter === 'ALL' ? 'All Assignments' : filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-200 border border-neutral-200/50 dark:border-neutral-850 focus:ring-2 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-200 rounded-xl py-2 px-3 pl-9 text-xs outline-none transition-colors placeholder:text-neutral-400"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
          </div>
        </div>

        {/* List of Assignments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((asn) => (
              <div 
                key={asn.id}
                className="group p-5 rounded-[24px] border border-neutral-200/40 dark:border-neutral-850 bg-white/40 dark:bg-neutral-900/25 flex flex-col justify-between hover:border-indigo-500/40 hover:bg-white/80 dark:hover:bg-neutral-900/60 transition-all duration-300"
              >
                <div>
                  {/* Subject and Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-md">
                      {asn.subjectCode} - {asn.subjectName}
                    </span>
                    
                    {/* Status Badge */}
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      asn.status === 'GRADED' 
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : asn.status === 'SUBMITTED'
                        ? 'bg-blue-500/10 text-blue-500'
                        : asn.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {asn.status === 'GRADED' && <CheckCircle2 className="w-3 h-3" />}
                      {asn.status === 'SUBMITTED' && <FileCheck className="w-3 h-3" />}
                      {asn.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {asn.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
                      {asn.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-white leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {asn.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-450 line-clamp-3 mb-4 leading-relaxed">
                    {asn.description}
                  </p>
                </div>

                {/* Footer Details */}
                <div className="border-t border-neutral-200/40 dark:border-neutral-850 pt-3 flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-450 dark:text-neutral-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {asn.dueDate} ({asn.dueTime})
                    </span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-300">
                      Points: {asn.status === 'GRADED' ? `${asn.obtainedPoints}/` : ''}{asn.maxPoints}
                    </span>
                  </div>

                  {/* Submit / View Button */}
                  <button 
                    onClick={() => setSelectedAssignment(asn)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                      asn.status === 'PENDING' || asn.status === 'OVERDUE'
                        ? 'btn-primary-custom text-white'
                        : 'bg-neutral-100/80 dark:bg-neutral-800/40 text-neutral-750 dark:text-neutral-300 hover:bg-neutral-200/80 dark:hover:bg-neutral-800/80'
                    }`}
                  >
                    {asn.status === 'PENDING' || asn.status === 'OVERDUE' ? 'Submit Assignment' : 'View Submission & Grade'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center flex flex-col items-center justify-center space-y-2">
              <FileText className="w-10 h-10 text-neutral-300 dark:text-neutral-700" />
              <p className="text-sm font-bold text-neutral-400">No assignments found</p>
              <p className="text-xs text-neutral-500">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal Drawer */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg glass-panel rounded-[32px] overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block mb-0.5">
                  {selectedAssignment.subjectCode} - {selectedAssignment.id}
                </span>
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white leading-tight">
                  {selectedAssignment.title}
                </h3>
              </div>
              <button 
                onClick={() => { setSelectedAssignment(null); setSelectedFile(null); }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:scale-105 active:scale-95 transition-all text-neutral-600 dark:text-neutral-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Guidelines & Task</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed font-medium">
                  {selectedAssignment.description}
                </p>
              </div>

              {/* Reference Attachment if any */}
              {selectedAssignment.attachmentName && (
                <div className="bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl p-3.5 border border-neutral-200/50 dark:border-neutral-850 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 leading-none">{selectedAssignment.attachmentName}</p>
                      <p className="text-[9px] text-neutral-400 font-semibold mt-1">{selectedAssignment.attachmentSize}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/40 dark:border-neutral-800 flex items-center justify-center hover:scale-105 text-indigo-500 shadow-sm cursor-pointer">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Status Info Row */}
              <div className="grid grid-cols-2 gap-3.5 bg-neutral-50 dark:bg-neutral-950/20 rounded-2xl p-4 border border-neutral-200/40 dark:border-neutral-850 text-xs">
                <div>
                  <span className="text-neutral-400 font-bold block text-[10px] uppercase tracking-wider">Due By</span>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200 block mt-0.5">
                    {selectedAssignment.dueDate} at {selectedAssignment.dueTime}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block text-[10px] uppercase tracking-wider">Weightage</span>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200 block mt-0.5">
                    {selectedAssignment.maxPoints} Total Points
                  </span>
                </div>
              </div>

              {/* Submitted / Graded details */}
              {(selectedAssignment.status === 'SUBMITTED' || selectedAssignment.status === 'GRADED') && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                    <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4" />
                      Uploaded Work
                    </h4>
                    <div className="flex justify-between items-center text-xs font-medium text-neutral-700 dark:text-neutral-350">
                      <span>{selectedAssignment.submittedFile}</span>
                      <span className="text-[10px] text-neutral-400">On: {selectedAssignment.submittedAt}</span>
                    </div>
                  </div>

                  {selectedAssignment.status === 'GRADED' && (
                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          Evaluation Results
                        </h4>
                        <span className="text-xs font-extrabold px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full">
                          Grade: {selectedAssignment.grade} ({selectedAssignment.obtainedPoints} / {selectedAssignment.maxPoints})
                        </span>
                      </div>
                      {selectedAssignment.feedback && (
                        <div className="text-xs font-semibold leading-relaxed text-neutral-750 dark:text-neutral-300">
                          <span className="font-bold text-neutral-400 block mb-0.5 uppercase tracking-widest text-[9px]">Professor's Remarks</span>
                          "{selectedAssignment.feedback}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Submission Area (Only for pending / overdue) */}
              {(selectedAssignment.status === 'PENDING' || selectedAssignment.status === 'OVERDUE') && (
                <form onSubmit={handleSubmissionSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block">Attach Document / Source Code</label>
                    
                    {/* Simulated Dropzone */}
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-all relative group cursor-pointer"
                    >
                      <input 
                        type="file" 
                        id="assignment-file"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/5 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        {selectedFile ? (
                          <div>
                            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{selectedFile.name}</p>
                            <p className="text-[10px] text-neutral-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Drag & Drop file here or <span className="text-indigo-500 hover:underline">browse</span></p>
                            <p className="text-[9px] text-neutral-400 mt-1">Accepts PDF, ZIP, DOCX, TXT (Max 10MB)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submission Comments */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block">Submission Remarks (Optional)</label>
                    <textarea 
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="e.g. Please find my lexical analyzer code attached..."
                      className="w-full bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-200"
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary-custom font-extrabold text-xs py-3.5 rounded-2xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Uploading Submission...' : 'Confirm Submission'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;
