import React from 'react';
import { FileText, Download, ShieldCheck, Eye, Search } from 'lucide-react';

interface DocumentItem {
  name: string;
  category: string;
  size: string;
  date: string;
  status: 'VERIFIED' | 'PENDING';
}

const documents: DocumentItem[] = [
  { name: 'Official Grade Sheet - Semester 2', category: 'Academic Transcript', size: '1.2 MB', date: '15 Jul 2026', status: 'VERIFIED' },
  { name: 'Official Grade Sheet - Semester 1', category: 'Academic Transcript', size: '1.1 MB', date: '20 Jan 2026', status: 'VERIFIED' },
  { name: 'Bonafide Certificate (Tuition Proof)', category: 'Official Certificate', size: '420 KB', date: '04 Oct 2026', status: 'VERIFIED' },
  { name: 'No-Objection Certificate (Internships)', category: 'Advisory Certificate', size: '380 KB', date: '18 Sep 2026', status: 'VERIFIED' },
  { name: 'Student Identity Card Digital Copy', category: 'ID Card Locker', size: '2.4 MB', date: '15 Aug 2025', status: 'VERIFIED' }
];

export const DocumentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Digital Document Locker</h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Verify, view, and securely download academic certificates</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search document name"
                className="bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-200/50 dark:border-neutral-750 focus:border-neutral-400 dark:focus:border-neutral-650 rounded-xl py-2 px-3 pl-8 text-xs outline-none transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-[28px] p-5 shadow-ambient flex items-center justify-between gap-4 hover:scale-[1.01]"
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight truncate">{doc.name}</h4>
                <p className="text-xs text-neutral-400 font-semibold">{doc.category} • {doc.size}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-250/20 dark:border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-indigo-500 transition-all cursor-pointer">
                <Eye className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-250/20 dark:border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-indigo-500 transition-all cursor-pointer">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsPage;
