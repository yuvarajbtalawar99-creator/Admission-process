import React from 'react';
import { Award, FileText, CheckCircle2, AlertTriangle, Download, Calendar } from 'lucide-react';

interface Exam {
  subject: string;
  code: string;
  type: string;
  date: string;
  time: string;
  room: string;
  status: 'UPCOMING' | 'COMPLETED' | 'ONGOING';
}

const examsData: Exam[] = [
  { subject: 'Advanced Data Structures', code: 'CS-301', type: 'End-Sem Theory', date: '04 Dec 2026', time: '10:00 AM - 01:00 PM', room: 'Exam Hall 2', status: 'UPCOMING' },
  { subject: 'Database Management Systems', code: 'CS-305', type: 'End-Sem Theory', date: '07 Dec 2026', time: '10:00 AM - 01:00 PM', room: 'Exam Hall 2', status: 'UPCOMING' },
  { subject: 'Formal Languages & Automata', code: 'CS-303', type: 'End-Sem Theory', date: '10 Dec 2026', time: '10:00 AM - 01:00 PM', room: 'Exam Hall 3', status: 'UPCOMING' },
  { subject: 'Software Engineering Principles', code: 'CS-307', type: 'End-Sem Practical', date: '25 Nov 2026', time: '09:00 AM - 12:00 PM', room: 'Lab 2, Block A', status: 'UPCOMING' },
  { subject: 'Database Management Systems Lab', code: 'CS-311', type: 'Mid-Sem Practical', date: '12 Oct 2026', time: '01:30 PM - 04:30 PM', room: 'DBMS Lab, Block C', status: 'COMPLETED' },
];

export const ExamsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Welcome/Action Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Examinations & Schedules</h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">B.Tech Computer Science & Engineering - Semester 3</p>
            </div>
          </div>
          
          <button className="flex items-center justify-center gap-2 btn-primary-custom px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm hover:scale-[1.02] cursor-pointer">
            <Download className="w-4 h-4" />
            <span>Download Exam Admit Card</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Exam Schedule List (col-span-2) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mb-2">Upcoming Exam Schedule</h3>
          
          {examsData.map((exam, index) => (
            <div
              key={index}
              className="glass-panel rounded-[28px] p-5 shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    exam.status === 'COMPLETED' 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {exam.type}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">{exam.code}</span>
                </div>
                
                <h4 className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">{exam.subject}</h4>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {exam.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {exam.room}
                  </span>
                </div>
              </div>

              {/* Status and Time */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">{exam.time}</span>
                <span className={`text-xs font-extrabold flex items-center gap-1 ${
                  exam.status === 'COMPLETED' ? 'text-emerald-500' : 'text-neutral-500'
                }`}>
                  {exam.status === 'COMPLETED' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </>
                  ) : (
                    'Scheduled'
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Regulations / Advisory */}
        <div className="space-y-6">
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Exam Guidelines
            </h3>
            
            <ul className="space-y-3.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium list-disc list-inside leading-relaxed">
              <li>Students must report to the exam hall 30 minutes prior to commencement.</li>
              <li>Admit cards and student photo ID cards are strictly mandatory.</li>
              <li>Smart devices, programmable calculators, and phones are strictly prohibited.</li>
              <li>Late entry up to 15 minutes is allowed under exceptional approvals only.</li>
              <li>Ensure all fee dues are cleared to obtain the admit card online.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;
