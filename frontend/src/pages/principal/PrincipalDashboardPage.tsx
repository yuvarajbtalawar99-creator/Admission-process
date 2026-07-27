import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  Users, 
  GraduationCap, 
  Activity, 
  ClipboardList, 
  Megaphone, 
  BarChart3, 
  FileText, 
  ChevronRight, 
  ArrowUpRight, 
  AlertTriangle, 
  Calendar,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import API from '../../services/api';
import { toast } from 'react-toastify';

interface KPI {
  students: number;
  faculty: number;
  passRate: number;
  avgCgpa: number;
  placementRate: number;
  feeCollectionRate: number;
  revenue: string;
}

interface CriticalAction {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  actionText: string;
  link: string;
  count: number;
}

interface DeptPerformance {
  id: string;
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

interface UpcomingEvent {
  date: string;
  title: string;
}

interface DashboardData {
  kpis: KPI;
  criticalActions: CriticalAction[];
  departmentPerformance: DeptPerformance[];
  insights: string[];
  performanceTrends: TrendPoint[];
  upcomingEvents: UpcomingEvent[];
}

export const PrincipalDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('/principal/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      } else {
        toast.error('Failed to load dashboard data.');
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Error fetching dashboard statistics.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-[32px]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
        </div>
      </div>
    );
  }

  const { kpis, criticalActions, departmentPerformance, insights, performanceTrends, upcomingEvents } = data;

  const cards = [
    { label: 'Total Students', value: kpis.students.toLocaleString(), sub: kpis.students > 0 ? 'Enrolled students' : 'No enrolled students', color: '#D97706', icon: Users },
    { label: 'Total Faculty', value: kpis.faculty.toString(), sub: kpis.faculty > 0 ? 'Active faculty registry' : 'No faculty registered', color: '#7C3AED', icon: GraduationCap },
    { label: 'Overall Pass Rate', value: kpis.passRate > 0 ? `${kpis.passRate}%` : '—', sub: kpis.passRate > 0 ? 'Based on latest results' : 'No exam records yet', color: '#16A34A', icon: Activity },
    { label: 'Average CGPA', value: kpis.avgCgpa > 0 ? kpis.avgCgpa.toString() : '—', sub: kpis.avgCgpa > 0 ? 'Institution-wide average' : 'No performance records', color: '#2563EB', icon: Sparkles },
    { label: 'Placements Rate', value: kpis.placementRate > 0 ? `${kpis.placementRate}%` : '—', sub: kpis.placementRate > 0 ? 'Placement records' : 'No placement records', color: '#EC4899', icon: ArrowUpRight },
    { label: 'Revenue Oversight', value: kpis.revenue !== '₹0' ? kpis.revenue : '—', sub: kpis.revenue !== '₹0' ? 'Fee collection revenue' : 'No fee collections', color: '#059669', icon: DollarSign },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-[32px] px-6 py-6 shadow-ambient flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&fit=crop'}
            alt="Principal"
            className="w-16 h-16 rounded-2xl object-cover border border-white/50 shadow-sm"
          />
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">Dr. Principal's Office</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-800 dark:text-white tracking-tight mt-0.5">
              Welcome, Dr. {user?.lastName || 'Principal'} 🎓
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-semibold">
              Jain College of Engineering and Research | Last synced: Just now
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/principal/admissions" className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 flex items-center gap-1.5" style={{ backgroundColor: '#D97706' }}>
            <ClipboardList className="w-3.5 h-3.5" />
            Approvals Queue
          </Link>
          <Link to="/principal/analytics" className="px-4 py-2 rounded-xl text-xs font-bold border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            Analytics
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-panel rounded-[28px] p-5 shadow-ambient hover:scale-[1.02] transition-all" style={{ borderLeft: `4px solid ${card.color}` }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">{card.label}</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">{card.value}</h3>
                <p className="text-[10px] text-neutral-400 font-semibold mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Actions Required */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="font-extrabold text-neutral-900 dark:text-white text-md">⚡ CRITICAL ACTIONS REQUIRED</h3>
          </div>
          <span className="text-xs bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 font-black px-2.5 py-1 rounded-full">
            {criticalActions.reduce((acc, a) => acc + (a.count ? 1 : 0), 0)} High Attention Items
          </span>
        </div>
        {criticalActions.length === 0 ? (
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-center">
            <p className="text-xs font-semibold text-neutral-400">No critical actions at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {criticalActions.map((action) => (
              <div key={action.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wide ${
                      action.priority === 'HIGH' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {action.priority} PRIORITY
                    </span>
                    {action.count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                        {action.count}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 mt-1">{action.title}</h4>
                  <p className="text-[10px] text-neutral-400 font-medium mt-1 leading-normal">{action.description}</p>
                </div>
                <Link to={action.link} className="w-full mt-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[10px] font-bold text-center block transition-colors">
                  {action.actionText}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Breakdown */}
        <div className="lg:col-span-7 glass-panel rounded-[28px] shadow-ambient overflow-hidden">
          <div className="p-5 border-b border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white">📊 DEPARTMENT PERFORMANCE (Rankings)</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Real-time academic metrics & course evaluations</p>
            </div>
            <Link to="/principal/analytics" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: '#D97706' }}>
              Detailed Rankings <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 text-neutral-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Dept</th>
                  <th className="px-4 py-3 text-center font-bold">Students</th>
                  <th className="px-4 py-3 text-center font-bold">Pass %</th>
                  <th className="px-4 py-3 text-center font-bold">Avg CGPA</th>
                  <th className="px-4 py-3 text-left font-bold">Trend & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
                {departmentPerformance.map((dept) => (
                  <tr key={dept.code} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">{dept.name}</p>
                        <p className="font-mono text-[10px] text-neutral-400">{dept.code}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-bold text-neutral-700 dark:text-neutral-300">{dept.students}</td>
                    <td className="px-4 py-3 text-center text-xs font-bold text-neutral-700 dark:text-neutral-300">{dept.passRate}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {dept.cgpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {dept.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights & Events */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Insights */}
          <div className="glass-panel rounded-[28px] p-5 shadow-ambient space-y-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              💡 INSIGHTS & SYSTEM ALERTS
            </h3>
            <div className="space-y-2">
              {insights.length === 0 ? (
                <p className="text-xs text-neutral-400 font-semibold text-center py-2">No insights available yet.</p>
              ) : insights.map((insight, idx) => (
                <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-100 dark:border-neutral-800/50 flex items-start gap-2">
                  <span className="text-xs text-neutral-600 dark:text-neutral-300 font-bold leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="glass-panel rounded-[28px] p-5 shadow-ambient space-y-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-violet-500" />
              📅 UPCOMING EVENTS & DEADLINES
            </h3>
            <div className="space-y-2.5">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-neutral-400 font-semibold text-center py-2">No upcoming events.</p>
              ) : upcomingEvents.map((evt, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
                  <span className="text-xs font-black text-neutral-800 dark:text-neutral-200">{evt.title}</span>
                  <span className="text-[10px] font-black bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 px-2.5 py-1 rounded-lg">
                    {evt.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends Chart */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <div>
          <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm">📈 PERFORMANCE TRENDS (Last 6 Months)</h3>
          <p className="text-[11px] text-neutral-400 mt-0.5 font-semibold">Continuous evaluation index (Pass Rate, CGPA growth & Placement curve)</p>
        </div>
        {performanceTrends.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-sm text-neutral-400 font-semibold">No performance trend data available yet.</p>
          </div>
        ) : (
          <div className="relative w-full h-[280px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPlacement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 700 }} />
                <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 700 }} tickFormatter={(val) => `${val}%`} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(26, 26, 26, 0.95)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="passRate" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorPass)" name="Pass Rate" />
                <Area type="monotone" dataKey="placementRate" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorPlacement)" name="Placement Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrincipalDashboardPage;
