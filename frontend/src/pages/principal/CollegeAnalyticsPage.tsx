import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Award, 
  Bookmark, 
  ArrowUpRight, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface DeptRow {
  name: string;
  code: string;
  students: number;
  passRate: number;
  cgpa: number;
  trend: string;
}

interface TrendPoint {
  month: string;
  passRate: number;
  cgpa: number;
  placementRate: number;
}

interface KPI {
  students: number;
  faculty: number;
  passRate: number;
  avgCgpa: number;
  placementRate: number;
  feeCollectionRate: number;
}

interface AnalyticsData {
  kpis: KPI;
  departmentPerformance: DeptRow[];
  performanceTrends: TrendPoint[];
}

export const CollegeAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await API.get('/principal/dashboard');
      if (res.data.success) {
        setData({
          kpis: res.data.data.kpis,
          departmentPerformance: res.data.data.departmentPerformance,
          performanceTrends: res.data.data.performanceTrends
        });
      }
    } catch (err: any) {
      toast.error('Failed to load college analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-80 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
        </div>
        <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
      </div>
    );
  }

  const { kpis, departmentPerformance, performanceTrends } = data;

  const COLORS = ['#D97706', '#7C3AED', '#16A34A', '#2563EB', '#EC4899'];

  const feeData = [
    { name: 'Collected', value: kpis.feeCollectionRate, fill: '#16A34A' },
    { name: 'Pending', value: 100 - kpis.feeCollectionRate, fill: 'rgba(0,0,0,0.06)' },
  ];

  return (
    <div className="space-y-6 pb-8">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Academic Standings Card */}
        <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-[10px] uppercase font-black text-neutral-400">Academic Standing</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h4 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">A+ Rated</h4>
            <p className="text-xs text-neutral-400 font-semibold leading-normal">
              Based on overall pass rate of <strong className="text-neutral-700 dark:text-neutral-200">{kpis.passRate}%</strong> and an institution CGPA of <strong className="text-neutral-700 dark:text-neutral-200">{kpis.avgCgpa}</strong>.
            </p>
          </div>
        </div>

        {/* Fee Collection Overview */}
        <div className="glass-panel rounded-[28px] p-6 shadow-ambient flex items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black text-neutral-400 block">Fee Collection Rate</span>
            <h4 className="text-3xl font-black text-neutral-900 dark:text-white">{kpis.feeCollectionRate}%</h4>
            <p className="text-[10px] text-emerald-600 font-bold">Target: 95% collection index</p>
          </div>
          <div className="w-24 h-24 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={26}
                  outerRadius={38}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {feeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <span className="absolute text-[10px] font-black text-neutral-600 dark:text-neutral-200">
              {kpis.feeCollectionRate}%
            </span>
          </div>
        </div>

        {/* Career placement */}
        <div className="glass-panel rounded-[28px] p-6 shadow-ambient space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-[10px] uppercase font-black text-neutral-400">Campus Placements</span>
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h4 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">{kpis.placementRate}%</h4>
            <p className="text-xs text-neutral-400 font-semibold leading-normal">
              Placement offers secured for eligible students. CS/IS leading with 96% offers.
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department CGPA Comparison Bar Chart */}
        <div className="lg:col-span-6 glass-panel rounded-[28px] p-6 shadow-ambient">
          <div className="mb-4">
            <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm">📊 DEPARTMENT CGPA COMPARISON</h3>
            <p className="text-[10px] text-neutral-400 mt-0.5 font-bold">Comparison of average CGPA scores across departments</p>
          </div>
          <div className="relative w-full h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="code" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 700 }} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 700 }} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(26, 26, 26, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none',
                    color: '#fff',
                    fontSize: 11
                  }} 
                />
                <Bar dataKey="cgpa" radius={[6, 6, 0, 0]} maxBarSize={30}>
                  {departmentPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Pass Rate comparison */}
        <div className="lg:col-span-6 glass-panel rounded-[28px] p-6 shadow-ambient">
          <div className="mb-4">
            <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm">📈 DEPARTMENT PASS RATE INDEX</h3>
            <p className="text-[10px] text-neutral-400 mt-0.5 font-bold">Pass percentage rankings across departments</p>
          </div>
          <div className="relative w-full h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" horizontal={false} stroke="rgba(0,0,0,0.04)" />
                <XAxis type="number" domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 700 }} />
                <YAxis dataKey="code" type="category" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 700 }} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(26, 26, 26, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none',
                    color: '#fff',
                    fontSize: 11
                  }} 
                />
                <Bar dataKey="passRate" fill="#3b82f6" radius={[0, 6, 6, 0]} maxBarSize={20}>
                  {departmentPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`${COLORS[(index + 2) % COLORS.length]}88`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 6 Month Performance Index Curve */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <div>
          <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm">📈 6-MONTH ACADEMIC TREND ANALYSIS</h3>
          <p className="text-[11px] text-neutral-400 mt-0.5 font-bold">Institution-wide KPIs tracking</p>
        </div>
        <div className="relative w-full h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 700 }} />
              <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 700 }} tickFormatter={(val) => `${val}%`} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26, 26, 26, 0.95)', 
                  borderRadius: '16px', 
                  border: 'none',
                  color: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line type="monotone" dataKey="passRate" stroke="#16A34A" strokeWidth={3.5} dot={{ r: 4 }} name="Pass Rate" />
              <Line type="monotone" dataKey="placementRate" stroke="#EC4899" strokeWidth={3.5} dot={{ r: 4 }} name="Placement Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default CollegeAnalyticsPage;
