import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import authService from '../../services/auth.service';
import { RootState } from '../../store';
import { getAcademicYear } from '../../utils/date.util';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Megaphone,
  BarChart3,
  FileText,
  User,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  AlertCircle,
  ClipboardList,
} from 'lucide-react';

interface MenuGroup {
  title: string;
  items: { name: string; path: string; icon: React.ElementType }[];
}

export const PrincipalLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    authService.logout();
    dispatch(logout());
    navigate('/login');
  };

  const accentColor = '#D97706';

  const menuGroups: MenuGroup[] = [
    {
      title: 'Dashboard',
      items: [{ name: 'Dashboard', path: '/principal/dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Governance',
      items: [
        { name: 'Admission Queue', path: '/principal/admissions', icon: ClipboardList },
        { name: 'Approval Queue', path: '/principal/approvals', icon: CheckSquare },
        { name: 'Staff Management', path: '/principal/staff', icon: Users },
        { name: 'Announcements', path: '/principal/announcements', icon: Megaphone },
      ],
    },
    {
      title: 'Analytics',
      items: [
        { name: 'College Analytics', path: '/principal/analytics', icon: BarChart3 },
        { name: 'Reports', path: '/principal/reports', icon: FileText },
      ],
    },
    {
      title: 'Settings',
      items: [{ name: 'Profile', path: '/principal/profile', icon: User }],
    },
  ];

  const subNavTabs = [
    { name: 'Dashboard', path: '/principal/dashboard' },
    { name: 'Approvals', path: '/principal/approvals' },
    { name: 'Analytics', path: '/principal/analytics' },
  ];

  const pageTitles: Record<string, string> = {
    '/principal/dashboard': 'Principal Dashboard',
    '/principal/approvals': 'Approval Queue',
    '/principal/admissions': 'Official Student Admission Queue',
    '/principal/admissions/pending': 'Official Student Admission Queue',
    '/principal/admissions/approved': 'Official Student Admission Queue',
    '/principal/admissions/rejected': 'Official Student Admission Queue',
    '/principal/admissions/history': 'Official Student Admission Queue',
    '/principal/staff': 'Staff Management',
    '/principal/announcements': 'Announcements',
    '/principal/analytics': 'College Analytics',
    '/principal/reports': 'Reports',
    '/principal/profile': 'My Profile',
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith('/principal/admissions/review')) {
      return 'Admission Review Workspace';
    }
    return pageTitles[location.pathname] || 'Principal';
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden flex text-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-sans pb-6 pr-6">
      <aside className="fixed left-6 top-6 bottom-6 w-64 flex flex-col justify-between py-6 px-4 rounded-[32px] glass-bar z-40">
        <div className="flex flex-col w-full">
          <Link to="/principal/dashboard" className="flex items-center space-x-3 px-2 mb-6 hover:opacity-95 transition-all">
            <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shadow-md flex-shrink-0 bg-white border border-neutral-200/50 dark:border-neutral-800/40">
              <img src="/jcer.png" alt="JCER Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider uppercase text-neutral-900 dark:text-white">JCER ERP</span>
              <span className="text-[12px] font-extrabold -mt-0.5" style={{ color: accentColor }}>Principal</span>
            </div>
          </Link>

          <nav className="flex flex-col space-y-4 overflow-y-auto max-h-[calc(100vh-290px)] pr-1 select-none">
            {menuGroups.map((group) => (
              <div key={group.title} className="flex flex-col space-y-1">
                <span className="px-3 text-[10px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
                  {group.title}
                </span>
                <div className="flex flex-col space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        style={isActive ? { color: accentColor, backgroundColor: `${accentColor}15` } : {}}
                        className={`w-full px-3 py-2 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                          isActive
                            ? 'font-semibold shadow-sm'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 hover:scale-[1.01]'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2.2} />
                        <span className="text-xs font-semibold">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-200/50 dark:border-neutral-800/40 flex flex-col space-y-3 w-full">
          <div className="rounded-2xl p-3 border text-[10px] space-y-1.5" style={{ backgroundColor: `${accentColor}10`, borderColor: `${accentColor}25` }}>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 font-medium">Role</span>
              <span className="font-extrabold" style={{ color: accentColor }}>PRINCIPAL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 font-medium">Academic Year</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200">{getAcademicYear()}</span>
            </div>
          </div>
          <Link to="/principal/approvals" className="flex items-center space-x-2 text-[11px] font-semibold px-1 py-0.5 hover:underline" style={{ color: accentColor }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>View Pending Approvals</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 pt-6 flex flex-col min-h-screen min-w-0" style={{ paddingLeft: '304px' }}>
        <header className="flex flex-row items-center justify-between py-4 mb-6 z-30 gap-4">
          <div className="flex-shrink-0 min-w-0">
            <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap leading-none">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center glass-bar p-1 rounded-full flex-shrink-0">
            {subNavTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  style={isActive ? { backgroundColor: accentColor, color: '#fff' } : {}}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive ? 'shadow-sm' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <button className="w-9 h-9 rounded-full flex items-center justify-center header-dark-btn shadow-sm hover:scale-[1.05] active:scale-[0.95] cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center header-dark-btn shadow-sm hover:scale-[1.05] active:scale-[0.95] relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
            <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 rounded-full flex items-center justify-center header-dark-btn shadow-sm hover:scale-[1.05] active:scale-[0.95] cursor-pointer">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen((p) => !p)}
                className="flex items-center space-x-2 header-dark-btn h-9 pl-1 pr-3 py-1 rounded-full shadow-sm cursor-pointer hover:scale-[1.02] transition-all select-none"
              >
                <img
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&fit=crop'}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover border border-white/10"
                />
                <span className="text-xs font-semibold pr-0.5 hidden md:block">{user?.name?.split(' ')[0] || 'Principal'}</span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-80 hidden md:block transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown absolute right-0 mt-2 w-52 border border-neutral-200/50 dark:border-neutral-800/40 rounded-2xl py-2 animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/30">
                    <p className="profile-dropdown-label text-[10px] font-extrabold uppercase tracking-widest mb-0.5">Logged in as</p>
                    <p className="profile-dropdown-value text-sm font-extrabold">{user?.name || 'Principal'}</p>
                    <p className="text-[10px] mt-0.5 font-extrabold" style={{ color: accentColor }}>PRINCIPAL</p>
                  </div>
                  <button onClick={handleLogout} className="profile-dropdown-logout w-full text-left px-4 py-3 text-sm font-bold flex items-center space-x-2.5 transition-colors cursor-pointer">
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Logout Session</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrincipalLayout;
