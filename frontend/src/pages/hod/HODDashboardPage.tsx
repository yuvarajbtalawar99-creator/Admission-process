import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  Users, 
  GraduationCap, 
  Activity, 
  ClipboardList, 
  ChevronRight, 
  Sparkles,
  AlertTriangle,
  Calendar,
  Award,
  DollarSign,
  TrendingUp
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
import hodService, { HODDashboardData, HODPendingActions } from '../../services/hod.service';
import { toast } from 'react-toastify';

export const HODDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<HODDashboardData | null>(null);
  const [pending, setPending] = useState<HODPendingActions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const dashboard = await hodService.getDashboardData();
      const actions = await hodService.getPendingActions();
      setData(dashboard);
      setPending(actions);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load HOD Dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // auto-refresh 30s
    return () => clearInterval(interval);
  }, []);

  const handleActionClick = (actionName: string) => {
    toast.info(`Action '${actionName}' executed successfully.`);
  };

  if (loading || !data || !pending) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-[32px]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
          <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
        </div>
        <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-[28px]" />
      </div>
    );
  }

  const { department, kpis, ranking, performanceTrends, insights, goals, upcomingEvents } = data;

  const cards = [
    { label: 'Total Students', value: kpis.students, sub: '↑ 5% YoY', color: '#0284C7', icon: Users, link: '/hod/students' },
    { label: 'Total Faculty', value: kpis.faculty, sub: '↑ 2% YoY', color: '#7C3AED', icon: GraduationCap, link: '/hod/faculty' },
    { label: 'Department Pass %', value: `${kpis.passRate}%`, sub: '↑ 2.5% YoY', color: '#16A34A', icon: Activity, link: '/hod/analytics' },
    { label: 'Avg Student CGPA', value: kpis.avgCgpa, sub: '↑ 0.3 grade points', color: '#EC4899', icon: Award, link: '/hod/analytics' },
    { label: 'Budget Utilized', value: `₹${(kpis.budgetUtilized / 100000).toFixed(0)}L/₹${(kpis.budgetAllocated / 100000).toFixed(0)}L`, sub: `${((kpis.budgetUtilized / kpis.budgetAllocated) * 100).toFixed(0)}% Utilized`, color: '#EAB308', icon: DollarSign, link: '/hod/budget' },
    { label: 'Placements Rate', value: `${kpis.placementRate}%`, sub: '↑ 5% Placement YoY', color: '#0EA5E9', icon: TrendingUp, link: '/hod/partnerships' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-[32px] px-6 py-6 shadow-ambient flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop'}
            alt="HOD"
            className="w-16 h-16 rounded-2xl object-cover border border-white/50 shadow-sm"
          />
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">Head of Department (HOD)</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-800 dark:text-white tracking-tight mt-0.5">
              Welcome, {user?.firstName || 'Dr.'} 👋
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-semibold">
              Department of {department.name} |JCER College ERP
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/hod/students" className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all" style={{ backgroundColor: '#0284C7' }}>
            View Students
          </Link>
          <Link to="/hod/analytics" className="px-4 py-2 rounded-xl text-xs font-bold border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            Analytics
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link to={card.link} key={card.label} className="glass-panel rounded-[28px] p-5 shadow-ambient hover:scale-[1.02] transition-all" style={{ borderLeft: `4px solid ${card.color}` }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">{card.label}</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-xl lg:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{card.value}</h3>
                <p className="text-[10px] text-neutral-400 font-semibold mt-1">{card.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Department Ranking Card */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 mb-4">
          <Sparkles className="w-4 h-4 text-amber-500" />
          🎯 JCER DEPARTMENT RANKINGS & METRICS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Academic Pass Rate', value: ranking.passRatePlace, color: '#16A34A' },
            { label: 'Average CGPA Score', value: ranking.cgpaPlace, color: '#0284C7' },
            { label: 'Placement Performance', value: ranking.placementPlace, color: '#EC4899' },
            { label: 'Overall Ranking Position', value: ranking.overallPlace, color: '#7C3AED' },
            { label: 'Department Growth Trend', value: ranking.trend, color: '#0EA5E9' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/40 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">{item.label}</span>
              <span className="text-sm font-extrabold mt-2" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Actions Section */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm">⚡ CRITICAL ACTIONS FOR THIS DEPARTMENT</h3>
          </div>
          <span className="text-xs bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 font-black px-2.5 py-1 rounded-full">
            {pending.leaves.length + pending.budgetRequests.length + pending.grievances.length + 2} Pending Actions
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          
          {/* Leaves action card */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/40 border border-neutral-100/50 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
            <div>
              <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-wide bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">HIGH PRIORITY</span>
              <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 mt-2">{pending.leaves.length} Faculty Leave Requests</h4>
              <p className="text-[10px] text-neutral-400 mt-1 leading-normal">Requires immediate approval or replacement plans.</p>
            </div>
            <Link to="/hod/leave" className="w-full mt-4 py-2 bg-neutral-950 hover:bg-neutral-850 text-white rounded-xl text-[10px] font-bold text-center block transition-colors">
              Approve Leaves
            </Link>
          </div>

          {/* Budgets action card */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/40 border border-neutral-100/50 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
            <div>
              <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-wide bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">HIGH PRIORITY</span>
              <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 mt-2">{pending.budgetRequests.length} Budget Requisitions</h4>
              <p className="text-[10px] text-neutral-400 mt-1 leading-normal">Requisition for GPU lab workstation nodes.</p>
            </div>
            <Link to="/hod/budget" className="w-full mt-4 py-2 bg-neutral-950 hover:bg-neutral-850 text-white rounded-xl text-[10px] font-bold text-center block transition-colors">
              Review Budget
            </Link>
          </div>

          {/* Evaluations action card */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/40 border border-neutral-100/50 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
            <div>
              <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">MEDIUM PRIORITY</span>
              <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 mt-2">2 Faculty Evaluations Due</h4>
              <p className="text-[10px] text-neutral-400 mt-1 leading-normal">Submit Annual Appraisals by February 28.</p>
            </div>
            <Link to="/hod/faculty" className="w-full mt-4 py-2 bg-neutral-950 hover:bg-neutral-850 text-white rounded-xl text-[10px] font-bold text-center block transition-colors">
              Send Reminders
            </Link>
          </div>

          {/* Curriculum action card */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/40 border border-neutral-100/50 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
            <div>
              <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">MEDIUM PRIORITY</span>
              <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 mt-2">Syllabus Proposals pending</h4>
              <p className="text-[10px] text-neutral-400 mt-1 leading-normal">New Artificial Intelligence curriculum module review.</p>
            </div>
            <Link to="/hod/subjects" className="w-full mt-4 py-2 bg-neutral-950 hover:bg-neutral-850 text-white rounded-xl text-[10px] font-bold text-center block transition-colors">
              Review Proposals
            </Link>
          </div>

          {/* Grievances action card */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/40 border border-neutral-100/50 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
            <div>
              <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-wide bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">HIGH PRIORITY</span>
              <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 mt-2">{pending.grievances.length} Grievance Ticket Open</h4>
              <p className="text-[10px] text-neutral-400 mt-1 leading-normal">Academic feedback filed by Student Arjun Sharma.</p>
            </div>
            <Link to="/hod/grievances" className="w-full mt-4 py-2 bg-neutral-950 hover:bg-neutral-850 text-white rounded-xl text-[10px] font-bold text-center block transition-colors">
              Resolve Tickets
            </Link>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Performance trends chart */}
        <div className="lg:col-span-7 glass-panel rounded-[28px] p-6 shadow-ambient">
          <div>
            <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm">📈 SEMESTER-WISE PERFORMANCE TRENDS</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 font-semibold">Continuous monitoring of Average CGPA and Department Pass Rate</p>
          </div>
          <div className="relative w-full h-[280px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 700 }} />
                <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 700 }} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(26, 26, 26, 0.95)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="passRate" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorPass)" name="Pass Rate %" />
                <Area type="monotone" dataKey="placementRate" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorCgpa)" name="Placement %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights & Events */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Insights Box */}
          <div className="glass-panel rounded-[28px] p-5 shadow-ambient space-y-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              💡 INSIGHTS & SYSTEM ALERTS
            </h3>
            <div className="space-y-2">
              {insights.map((insight, idx) => (
                <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-100 dark:border-neutral-800/50 flex items-start gap-2">
                  <span className="text-xs text-neutral-600 dark:text-neutral-350 font-bold leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Box */}
          <div className="glass-panel rounded-[28px] p-5 shadow-ambient space-y-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-violet-500" />
              📅 UPCOMING EVENTS & DEADLINES
            </h3>
            <div className="space-y-2.5">
              {upcomingEvents.map((evt, idx) => (
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

      {/* Goals section */}
      <div className="glass-panel rounded-[28px] p-6 shadow-ambient">
        <h3 className="font-bold text-neutral-900 dark:text-white text-sm mb-4">🎯 DEPARTMENT GOALS & TARGETS</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {goals.map((g) => (
            <div key={g.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/40 border border-neutral-100 dark:border-neutral-800 space-y-2">
              <h4 className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">{g.title}</h4>
              <div className="flex justify-between items-end">
                <span className="text-xl font-black text-neutral-900 dark:text-white">{g.current}%</span>
                <span className="text-[10px] font-bold text-neutral-400">Target: {g.target}%</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${Math.min((g.current / g.target) * 100, 100)}%` }} />
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black inline-block ${
                g.status === 'EXCEEDED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
              }`}>
                {g.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HODDashboardPage;
