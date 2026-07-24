import React from 'react';
import { toast } from 'react-toastify';
import { 
  Briefcase, 
  Handshake, 
  MapPin, 
  GraduationCap, 
  CheckCircle,
  Plus
} from 'lucide-react';

export const IndustryPartnershipPage: React.FC = () => {
  const partners = [
    { company: 'Infosys Co-create Lab', domain: 'Cloud & AI Systems', status: 'ACTIVE', since: '2024' },
    { company: 'Cognizant Technology Solutions', domain: 'Full Stack Development', status: 'ACTIVE', since: '2023' },
    { company: 'Wipro TalentNext', domain: 'Java Full Stack & Cyber', status: 'ACTIVE', since: '2025' },
  ];

  const placements = [
    { company: 'TCS Digital', count: 18, avgLpa: '7.5 LPA' },
    { company: 'Accenture ASE', count: 25, avgLpa: '4.5 LPA' },
    { company: 'Infosys Specialist Programmer', count: 5, avgLpa: '9.0 LPA' },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-sky-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Active MOUs</p>
          <h3 className="text-xl font-black text-neutral-850 dark:text-white mt-1">4 Industry Partners</h3>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">✓ Collaborations & training labs</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-violet-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Placement Rate</p>
          <h3 className="text-xl font-black text-neutral-850 dark:text-white mt-1">98% Placed</h3>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">210 students placed</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Average Package</p>
          <h3 className="text-xl font-black text-neutral-850 dark:text-white mt-1">6.2 LPA</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Highest package: 18 LPA</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-amber-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Internships Secured</p>
          <h3 className="text-xl font-black text-neutral-850 dark:text-white mt-1">45 Students</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Paid stipend placements</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MOUs & Partnerships */}
        <div className="lg:col-span-7 glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <Handshake className="w-4.5 h-4.5 text-sky-500" />
              🤝 DEPT COLLABORATIONS & MOUS
            </h3>
            <button onClick={() => toast.success('Add partner dialog launched.')} className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-[10px] font-bold cursor-pointer">
              Add Partner
            </button>
          </div>
          <div className="space-y-3">
            {partners.map((p, idx) => (
              <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-855/40 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    MOU
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-neutral-850 dark:text-neutral-200">{p.company}</h4>
                    <p className="text-[10px] text-neutral-450 font-semibold mt-0.5">{p.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <span className="flex items-center gap-1">
                    Since: {p.since}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-100 text-emerald-700">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placements breakdown */}
        <div className="lg:col-span-5 glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm border-b border-neutral-100 dark:border-neutral-800/50 pb-3 flex items-center gap-1.5">
            <Briefcase className="w-4.5 h-4.5 text-violet-500" />
            📊 PLACEMENTS BREAKDOWN
          </h3>
          <div className="space-y-3">
            {placements.map((p, idx) => (
              <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-855/40 rounded-2xl border flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-extrabold text-neutral-855 dark:text-neutral-200">{p.company}</h4>
                  <span className="text-[10px] text-neutral-450 font-bold">Placed count: {p.count} students</span>
                </div>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-lg text-xs font-black">{p.avgLpa}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default IndustryPartnershipPage;
