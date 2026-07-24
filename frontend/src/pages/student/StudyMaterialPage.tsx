import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Eye, 
  Search, 
  FileText, 
  Calendar, 
  User, 
  CheckCircle2, 
  FolderOpen,
  X,
  ArrowDownToLine,
  ChevronRight
} from 'lucide-react';
import Toast from '../../components/common/Toast';

interface Material {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  category: 'LECTURE_NOTES' | 'LAB_MANUAL' | 'SYLLABUS' | 'REFERENCE_BOOK';
  fileType: 'PDF' | 'PPTX' | 'ZIP' | 'DOCX';
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  downloadsCount: number;
}

const initialMaterials: Material[] = [
  {
    id: 'MAT-301',
    subjectCode: '18CS61',
    subjectName: 'System Software & Compilers',
    title: 'Lexical Analyzer & Syntax Analysis Slides',
    description: 'Complete slide decks covering lexical analysis algorithms, finite automata representations, transition diagrams, and parser design techniques.',
    category: 'LECTURE_NOTES',
    fileType: 'PPTX',
    fileSize: '4.8 MB',
    uploadedBy: 'Dr. Ramesh R. Patil',
    uploadedDate: '2026-06-18',
    downloadsCount: 142
  },
  {
    id: 'MAT-302',
    subjectCode: '18CS61',
    subjectName: 'System Software & Compilers',
    title: 'Lex & Yacc Lab Programming Guide',
    description: 'Reference guide containing standard lab code templates, compiler compilation flags, and common debugging tips for UNIX environment.',
    category: 'LAB_MANUAL',
    fileType: 'PDF',
    fileSize: '1.5 MB',
    uploadedBy: 'Dr. Ramesh R. Patil',
    uploadedDate: '2026-06-15',
    downloadsCount: 98
  },
  {
    id: 'MAT-303',
    subjectCode: '18CS62',
    subjectName: 'Computer Networks',
    title: 'Socket API & Application Protocols Study Notes',
    description: 'In-depth notes on network socket APIs, DNS architecture, HTTP status codes, email protocols (SMTP/POP3), and routing flow diagrams.',
    category: 'LECTURE_NOTES',
    fileType: 'PDF',
    fileSize: '3.2 MB',
    uploadedBy: 'Prof. Sneha K. Belagavi',
    uploadedDate: '2026-06-20',
    downloadsCount: 115
  },
  {
    id: 'MAT-304',
    subjectCode: '18CS63',
    subjectName: 'Database Management Systems',
    title: 'Relational Database Design and Normal Form Reference',
    description: 'Academic reference sheet documenting Functional Dependencies, Multi-valued Dependencies, 1NF, 2NF, 3NF, BCNF, and 4NF normalization rules.',
    category: 'LECTURE_NOTES',
    fileType: 'PDF',
    fileSize: '950 KB',
    uploadedBy: 'Dr. Vinayaka B. Joshi',
    uploadedDate: '2026-06-10',
    downloadsCount: 210
  },
  {
    id: 'MAT-305',
    subjectCode: '18CS64',
    subjectName: 'Web Technology & Applications',
    title: 'React Hooks and State Management Guide',
    description: 'Detailed tutorial on useState, useEffect, useContext, Redux Toolkit configurations, and custom hook implementation best practices.',
    category: 'LECTURE_NOTES',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    uploadedBy: 'Prof. Amit S. Hiremath',
    uploadedDate: '2026-06-22',
    downloadsCount: 167
  },
  {
    id: 'MAT-306',
    subjectCode: '18CS64',
    subjectName: 'Web Technology & Applications',
    title: 'HTML5, CSS3, & Tailwind CSS Cheat Sheet',
    description: 'Quick reference sheet detailing layout flexbox patterns, CSS grid properties, keyframes, transitions, and common Tailwind class names.',
    category: 'REFERENCE_BOOK',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    uploadedBy: 'Prof. Amit S. Hiremath',
    uploadedDate: '2026-06-08',
    downloadsCount: 88
  },
  {
    id: 'MAT-307',
    subjectCode: '18CS65',
    subjectName: 'Operations Research',
    title: 'Simplex and Graphical Optimization Solved Exercises',
    description: 'Step-by-step solutions for linear programming formulation, dual simplex methods, transport optimizations, and network assignment models.',
    category: 'LECTURE_NOTES',
    fileType: 'PDF',
    fileSize: '3.6 MB',
    uploadedBy: 'Prof. Raghavendra Deshpande',
    uploadedDate: '2026-06-12',
    downloadsCount: 75
  },
  {
    id: 'MAT-308',
    subjectCode: 'ALL_SUBJECTS',
    subjectName: '6th Semester Syllabus',
    title: 'VTU 6th Sem CS & IS Syllabus Blueprint',
    description: 'VTU official course blueprint, module splits, textbook lists, marking distribution scheme, and laboratory practical guidelines.',
    category: 'SYLLABUS',
    fileType: 'PDF',
    fileSize: '1.1 MB',
    uploadedBy: 'Academic Registrar',
    uploadedDate: '2026-05-01',
    downloadsCount: 350
  }
];

export const StudyMaterialPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'LECTURE_NOTES' | 'LAB_MANUAL' | 'SYLLABUS' | 'REFERENCE_BOOK'>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Download progress animation simulator
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  // Document preview simulation modal
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  
  // Toast alert status
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // List of unique subject names for filtering
  const subjectsList = Array.from(
    new Set(materials.map(m => JSON.stringify({ code: m.subjectCode, name: m.subjectName })))
  ).map(s => JSON.parse(s));

  // Simulate file download trigger
  const handleDownload = (id: string, fileName: string) => {
    if (downloadingId) return; // Prevent double downloads
    
    setDownloadingId(id);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setToast({ type: 'success', message: `${fileName} downloaded successfully!` });
            
            // Increment local download count
            setMaterials(prevMat => prevMat.map(m => {
              if (m.id === id) return { ...m, downloadsCount: m.downloadsCount + 1 };
              return m;
            }));
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  // Filter and search logic
  const filteredMaterials = materials.filter(mat => {
    const matchesCategory = selectedCategory === 'ALL' || mat.category === selectedCategory;
    const matchesSubject = selectedSubject === 'ALL' || mat.subjectCode === selectedSubject;
    const matchesSearch = 
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubject && matchesSearch;
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

      {/* Title Header panel */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Academic Resource Vault</h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Access, preview, and download syllabus guidelines, lecture notes, lab manuals, and e-books</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
        
        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {(['ALL', 'LECTURE_NOTES', 'LAB_MANUAL', 'SYLLABUS', 'REFERENCE_BOOK'] as const).map((cat) => {
            const colors = {
              ALL: {
                active: 'bg-sky-100 border-sky-400 text-black font-extrabold ring-2 ring-sky-500/20',
                inactive: 'bg-sky-50/60 border-sky-200/50 text-black/70 hover:text-black font-bold hover:bg-sky-100/40'
              },
              LECTURE_NOTES: {
                active: 'bg-amber-100 border-amber-400 text-black font-extrabold ring-2 ring-amber-500/20',
                inactive: 'bg-amber-50/50 border-amber-200/50 text-black/70 hover:text-black font-bold hover:bg-amber-100/40'
              },
              LAB_MANUAL: {
                active: 'bg-rose-100 border-rose-400 text-black font-extrabold ring-2 ring-rose-500/20',
                inactive: 'bg-rose-50/50 border-rose-200/50 text-black/70 hover:text-black font-bold hover:bg-rose-100/40'
              },
              SYLLABUS: {
                active: 'bg-emerald-100 border-emerald-400 text-black font-extrabold ring-2 ring-emerald-500/10',
                inactive: 'bg-emerald-50/50 border-emerald-200/50 text-black/70 hover:text-black font-bold hover:bg-emerald-100/40'
              },
              REFERENCE_BOOK: {
                active: 'bg-violet-100 border-violet-400 text-black font-extrabold ring-2 ring-violet-500/10',
                inactive: 'bg-violet-50/50 border-violet-200/50 text-black/70 hover:text-black font-bold hover:bg-violet-100/40'
              }
            }[cat];

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory === cat ? colors.active : colors.inactive
                }`}
              >
                {cat === 'ALL' ? 'All Resources' : cat.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            );
          })}
        </div>

        {/* Search Input and Subject Select filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Subject Dropdown Selector */}
          <div className="w-full md:w-64">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-200 border border-neutral-200/50 dark:border-neutral-850 focus:ring-2 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-200 rounded-xl py-2 px-3 text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="ALL">All Subjects</option>
              {subjectsList.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code === 'ALL_SUBJECTS' ? '' : `${sub.code} - `}{sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search resource title, notes, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-200 border border-neutral-200/50 dark:border-neutral-850 focus:ring-2 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-200 rounded-xl py-2 px-3 pl-9 text-xs outline-none transition-colors placeholder:text-neutral-400"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((mat) => (
              <div 
                key={mat.id}
                className="group p-5 rounded-[24px] border border-neutral-200/40 dark:border-neutral-850 bg-white/40 dark:bg-neutral-900/25 hover:bg-white/80 dark:hover:bg-neutral-900/60 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category and Type Row */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-200 text-neutral-600 dark:text-neutral-400">
                      {mat.category.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      mat.fileType === 'PDF' 
                        ? 'bg-red-500/10 text-red-500' 
                        : mat.fileType === 'PPTX'
                        ? 'bg-orange-500/10 text-orange-500'
                        : mat.fileType === 'ZIP'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {mat.fileType}
                    </span>
                  </div>

                  {/* Subject Title */}
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    {mat.subjectCode === 'ALL_SUBJECTS' ? 'All Core Subjects' : mat.subjectCode}
                  </div>

                  {/* Material Title */}
                  <h3 className="text-xs font-bold text-neutral-800 dark:text-white leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {mat.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-450 leading-relaxed font-medium line-clamp-3 mb-4">
                    {mat.description}
                  </p>
                </div>

                {/* Card footer details and action */}
                <div className="border-t border-neutral-250/20 dark:border-neutral-850 pt-3 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {mat.uploadedBy.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span>{mat.fileSize}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPreviewMaterial(mat)}
                      className="flex-1 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-750 dark:text-neutral-350 hover:bg-neutral-100 dark:hover:bg-neutral-850 hover:border-neutral-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>

                    <button 
                      onClick={() => handleDownload(mat.id, mat.title)}
                      disabled={downloadingId !== null}
                      className="flex-1 py-2 btn-primary-custom text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {downloadingId === mat.id ? (
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          {downloadProgress}%
                        </span>
                      ) : (
                        <>
                          <Download className="w-3 h-3" />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center flex flex-col items-center justify-center space-y-2">
              <FolderOpen className="w-10 h-10 text-neutral-300 dark:text-neutral-750" />
              <p className="text-sm font-bold text-neutral-400">No resources found</p>
              <p className="text-xs text-neutral-500">Try adjusting your category pills or search input terms.</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal Simulation */}
      {previewMaterial && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-2xl glass-panel rounded-[32px] overflow-hidden shadow-2xl animate-fade-in flex flex-col bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block mb-0.5">
                  {previewMaterial.subjectCode} - Quick Preview
                </span>
                <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white leading-tight">
                  {previewMaterial.title}
                </h3>
              </div>
              <button 
                onClick={() => setPreviewMaterial(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:scale-105 active:scale-95 transition-all text-neutral-600 dark:text-neutral-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Simulated Document Viewer) */}
            <div className="p-6 bg-neutral-200 dark:bg-neutral-200 flex flex-col items-center justify-center min-h-[320px] select-none text-center">
              
              {/* Paper / File Representation */}
              <div className="w-56 h-72 bg-white dark:bg-neutral-500 rounded-lg shadow-lg border border-neutral-250/60 dark:border-neutral-800 p-4 flex flex-col justify-between text-left relative overflow-hidden">
                
                {/* Header */}
                <div className="space-y-1">
                  <div className="w-12 h-3.5 bg-neutral-100 dark:bg-neutral-850 rounded"></div>
                  <div className="w-24 h-2.5 bg-neutral-50 dark:bg-neutral-950 rounded"></div>
                </div>

                {/* Content lines placeholder */}
                <div className="space-y-2 py-4">
                  <div className="h-2.5 bg-neutral-100 dark:bg-neutral-850 rounded w-full"></div>
                  <div className="h-2.5 bg-neutral-100 dark:bg-neutral-850 rounded w-5/6"></div>
                  <div className="h-2.5 bg-neutral-100 dark:bg-neutral-850 rounded w-4/5"></div>
                  <div className="h-2.5 bg-neutral-100 dark:bg-neutral-850 rounded w-11/12"></div>
                  <div className="h-2.5 bg-neutral-100 dark:bg-neutral-850 rounded w-full"></div>
                </div>

                {/* Watermarked JCER logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                  <img src="/jcer.png" alt="watermark" className="w-32 h-32 rounded-full object-cover" />
                </div>

                {/* Footer details */}
                <div className="flex justify-between items-center text-[8px] text-neutral-400 border-t border-neutral-100/50 pt-2">
                  <span>JCER ERP Vault</span>
                  <span>Page 1 of 12</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Quick Document Preview Mode</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">Showing partial view of the {previewMaterial.fileType} document ({previewMaterial.fileSize})</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-neutral-100 dark:border-neutral-850 flex justify-between items-center">
              <span className="text-[10px] font-semibold text-neutral-400">
                Uploaded by {previewMaterial.uploadedBy} on {previewMaterial.uploadedDate}
              </span>
              <button 
                onClick={() => {
                  setPreviewMaterial(null);
                  handleDownload(previewMaterial.id, previewMaterial.title);
                }}
                className="btn-primary-custom text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                Download Original File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialPage;
