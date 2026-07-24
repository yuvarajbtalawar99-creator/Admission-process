import React, { useEffect, useState } from 'react';
import hodService, { HODDashboardData } from '../../services/hod.service';
import { toast } from 'react-toastify';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Sparkles,
  Award
} from 'lucide-react';

export const DepartmentAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<HODDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await hodService.getDashboardData();
      setData(res);
    } catch (err) {
      toast.error('Failed to load analytics details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-[32px]" />
        <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
      </div>
    );
  }

  const { performanceTrends } = data;

  // Student Satisfaction mock
  const satisfaction = [
    { name: 'Infrastructure', rating: 4.2 },
    { name: 'Academics', rating: 4.6 },
    { name: 'Faculty feedback', rating: 4.4 },
    { name: 'Placement Cell', rating: 4.5 },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-sky-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Satisfaction Score</p>
          <h3 className="text-2xl font-black text-neutral-850 dark:text-white mt-1">4.3 / 5</h3>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ 2.5% increase from last year</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Placement Rate</p>
          <h3 className="text-2xl font-black text-neutral-850 dark:text-white mt-1">98% Placed</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Target achieved for Batch 2026</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-violet-500">
          <p className="text-[10px] uppercase font-bold text-neutral-450">Academic index</p>
          <h3 className="text-2xl font-black text-neutral-850 dark:text-white mt-1">Excellent (7.8 CGPA)</h3>
          <span className="text-[10px] text-neutral-400 font-bold block mt-1">Highest among engineering departments</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pass rate and CGPA chart */}
        <div className="lg:col-span-7 glass-panel rounded-[28px] p-6 shadow-ambient">
          <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm mb-4 flex items-center gap-1.5">
            <TrendingUp className="w-4.5 h-4.5 text-sky-500" />
            📈 DEPARTMENT GRADUATION TRENDS
          </h3>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 700 }} />
                <YAxis domain={[50, 100]} tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 700 }} />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="passRate" stroke="#16A34A" strokeWidth={3} name="Pass Rate %" />
                <Line type="monotone" dataKey="placementRate" stroke="#EC4899" strokeWidth={3} name="Placement %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Satisfaction Breakdown */}
        <div className="lg:col-span-5 glass-panel rounded-[28px] p-6 shadow-ambient">
          <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            💡 SATISFACTION INDEX BY CATEGORY
          </h3>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={satisfaction} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#a3a3a3', fontSize: 9, fontWeight: 700 }} />
                <YAxis domain={[0, 5]} tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 700 }} />
                <RechartsTooltip />
                <Bar dataKey="rating" fill="#7C3AED" radius={[10, 10, 0, 0]} name="Rating (1-5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DepartmentAnalyticsPage;
