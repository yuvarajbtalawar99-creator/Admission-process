import React from 'react';
import { Target, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import PerformanceChart from '../../components/charts/PerformanceChart';

export const PerformancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Academic Analytics & Performance</h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">B.Tech Computer Science & Engineering - Semester 3</p>
          </div>
        </div>
      </div>

      {/* KPI Performance Section */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-dark tracking-tight mb-4">SGPA & CGPA Summary</h3>
        <PerformanceChart sgpa={8.10} cgpa={7.85} riskLevel="GOOD" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Subject Indices (col-span-2) */}
        <div className="lg:col-span-2 glass-panel rounded-[32px] p-6 shadow-ambient space-y-5">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Target className="w-5 h-5 text-indigo-500" />
            Subject Index Breakdown
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Advanced Data Structures (Theory & Lab)</span>
                <span className="text-indigo-500">92%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Database Management Systems (Theory & Lab)</span>
                <span className="text-emerald-500">88%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Formal Languages & Automata</span>
                <span className="text-sky-500">76%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Software Engineering Principles</span>
                <span className="text-pink-500">84%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Mentor advisory/remarks */}
        <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neutral-500" />
            Mentor Remarks
          </h3>

          <div className="space-y-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-100 dark:border-neutral-800/80">
              <p className="font-bold text-neutral-900 dark:text-white mb-1">Oct 14, 2026 - Dr. Sarah Jenkins</p>
              <p className="leading-relaxed">John is doing exceptionally well in practical laboratory sessions and team homework challenges. He is encouraged to speak more in the technical seminars to build vocabulary confidence.</p>
            </div>

            <div className="p-4 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">Eligible for Honours course selection starting Semester 4 (Requires minimum CGPA 8.00 at end of Sem 3).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
