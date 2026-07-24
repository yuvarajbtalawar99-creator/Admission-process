import React from 'react';
import { toast } from 'react-toastify';
import { 
  Award, 
  BookOpen, 
  Globe, 
  DollarSign, 
  CheckCircle,
  Plus
} from 'lucide-react';

export const ResearchInnovationPage: React.FC = () => {
  const publications = [
    { title: 'Secure Decentralized Identity Management on Blockchain Networks', author: 'Dr. Smith', journal: 'IEEE Transactions on Dependable and Secure Computing', year: 2026, status: 'PUBLISHED' },
    { title: 'Optimized Real-time Object Tracking using Deep CNN Models', author: 'Prof. John', journal: 'Elsevier Pattern Recognition Letters', year: 2025, status: 'PUBLISHED' },
    { title: 'Edge Computing Load Balancing Algorithms: A Comparative Study', author: 'Mr. Raj', journal: 'Springer Wireless Personal Communications', year: 2026, status: 'UNDER_REVIEW' },
  ];

  const funding = [
    { agency: 'AICTE-RPS', amount: '₹12.5 Lakhs', project: 'Modernization of CSE High Performance Computing Lab', status: 'SANCTIONED' },
    { agency: 'DST-SERB', amount: '₹22.0 Lakhs', project: 'Autonomous Drone Navigation using Deep Reinforcement Learning', status: 'PENDING' },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-sky-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Publications YTD</p>
          <h3 className="text-xl font-black text-neutral-850 dark:text-white mt-1">18 Papers</h3>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">✓ Exceeded AICTE target (12)</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-violet-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Active Projects</p>
          <h3 className="text-xl font-black text-neutral-850 dark:text-white mt-1">3 Projects</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">DST & AICTE Sponsored</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Research Funding</p>
          <h3 className="text-xl font-black text-neutral-850 dark:text-white mt-1">₹34.5 Lakhs</h3>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Sanctioned research grants</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-amber-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Patent Filings</p>
          <h3 className="text-xl font-black text-neutral-850 dark:text-white mt-1">2 Patents</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Under review by IPO</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Publications tracking */}
        <div className="lg:col-span-7 glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-sky-500" />
              📚 FACULTY PUBLICATIONS TRACKING
            </h3>
            <button onClick={() => toast.success('Add publication dialog launched.')} className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-[10px] font-bold cursor-pointer">
              Add Record
            </button>
          </div>
          <div className="space-y-3">
            {publications.map((pub, idx) => (
              <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-850/40 rounded-2xl border space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-extrabold text-neutral-850 dark:text-neutral-200">{pub.title}</h4>
                    <span className="text-[9px] text-neutral-450 font-bold mt-0.5">Author: {pub.author}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                    pub.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{pub.status}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold border-t pt-2">
                  <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-neutral-400" /> {pub.journal}</span>
                  <span>Year: {pub.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grants & Projects */}
        <div className="lg:col-span-5 glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <DollarSign className="w-4.5 h-4.5 text-emerald-500" />
              💰 RESEARCH SPONSORSHIP GRANTS
            </h3>
            <button onClick={() => toast.success('New funding application submitted.')} className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-[10px] font-bold cursor-pointer">
              Apply Grant
            </button>
          </div>
          <div className="space-y-3">
            {funding.map((fund, idx) => (
              <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-850/40 rounded-2xl border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-neutral-850 dark:text-neutral-200">{fund.agency}</span>
                  <span className="text-xs font-black text-emerald-600">{fund.amount}</span>
                </div>
                <p className="text-[10px] text-neutral-455 font-semibold leading-normal">{fund.project}</p>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black inline-block ${
                  fund.status === 'SANCTIONED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{fund.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ResearchInnovationPage;
