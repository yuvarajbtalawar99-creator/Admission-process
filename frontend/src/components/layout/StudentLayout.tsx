import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import authService from '../../services/auth.service';
import { RootState } from '../../store';
import { getAcademicYear } from '../../utils/date.util';
import { 
  Calendar, 
  GraduationCap, 
  CreditCard, 
  MessageSquare, 
  User, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  LogOut,
  ChevronDown,
  Clock,
  BookOpen,
  TrendingUp,
  History,
  Megaphone,
  FolderOpen,
  AlertCircle,
  CalendarDays,
  Sliders,
  Settings,
  HelpCircle,
  FileText
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Theme state (system preferences default)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // Profile dropdown click-toggle state
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

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    authService.logout();
    dispatch(logout());
    navigate('/login');
  };

  const menuGroups = [
    {
      title: 'Academics',
      items: [
        { name: 'Attendance', path: '/student/attendance', icon: Calendar },
        { name: 'Marks/Results', path: '/student/marks', icon: GraduationCap },
        { name: 'Timetable', path: '/student/timetable', icon: Clock },
        { name: 'Exams', path: '/student/exams', icon: BookOpen },
        { name: 'Assignments', path: '/student/assignments', icon: FileText },
        { name: 'Study Material', path: '/student/study-material', icon: BookOpen },
        { name: 'Performance', path: '/student/performance', icon: TrendingUp },
      ]
    },
    {
      title: 'Finance',
      items: [
        { name: 'Fees', path: '/student/fees', icon: CreditCard },
        { name: 'Payments', path: '/student/payments', icon: History },
      ]
    },
    {
      title: 'Communication',
      items: [
        { name: 'Messages', path: '/student/messages', icon: MessageSquare },
        { name: 'Contact Teacher', path: '/student/contact-teacher', icon: User },
        { name: 'Announcements', path: '/student/announcements', icon: Megaphone },
        { name: 'Notifications', path: '/student/notifications', icon: Bell },
      ]
    },
    {
      title: 'Administrative',
      items: [
        { name: 'Documents', path: '/student/documents', icon: FolderOpen },
        { name: 'Grievances', path: '/student/grievances', icon: AlertCircle },
        { name: 'Leave', path: '/student/leave', icon: CalendarDays },
      ]
    },
    {
      title: 'Settings',
      items: [
        { name: 'Profile', path: '/student/profile', icon: User },
        { name: 'Preferences', path: '/student/preferences', icon: Sliders },
        { name: 'Account', path: '/student/account', icon: Settings },
      ]
    }
  ];

  // Map route names to top tab structure
  const subNavTabs = [
    { name: 'Dashboard', path: '/student/dashboard' },
    { name: 'Attendance', path: '/student/attendance' },
    { name: 'Marks', path: '/student/marks' },
    { name: 'Fees & Dues', path: '/student/fees' },
    { name: 'Grievances', path: '/student/grievances' },
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/student/dashboard':
        return 'Dashboard';
      case '/student/attendance':
        return 'Attendance';
      case '/student/marks':
        return 'Marks & Results';
      case '/student/timetable':
        return 'Class Timetable';
      case '/student/exams':
        return 'Exams & Schedule';
      case '/student/performance':
        return 'Academic Performance';
      case '/student/fees':
        return 'Fees & Dues';
      case '/student/payments':
        return 'Payment Ledger';
      case '/student/messages':
        return 'Messages & Chats';
      case '/student/announcements':
        return 'Circulars & Announcements';
      case '/student/notifications':
        return 'System Notifications';
      case '/student/documents':
        return 'Document Locker';
      case '/student/grievances':
        return 'Grievance Desk';
      case '/student/leave':
        return 'Leave Applications';
      case '/student/profile':
        return 'Student Profile';
      case '/student/preferences':
        return 'Portal Preferences';
      case '/student/account':
        return 'Account Security';
      case '/student/assignments':
        return 'Coursework Assignments';
      case '/student/study-material':
        return 'Academic Resource Vault';
      case '/student/contact-teacher':
        return 'Faculty Directory';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden flex text-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-sans selection:bg-[#1A1A1A] selection:text-white pb-6 pr-6">
      {/* 1. FLOATING SIDEBAR NAVIGATION */}
      <aside className="fixed left-6 top-6 bottom-6 w-64 flex flex-col justify-between py-6 px-4 rounded-[32px] glass-bar z-40">
        
        {/* Top: Custom ERP Logo & Title */}
        <div className="flex flex-col w-full">
          <Link to="/student/dashboard" className="flex items-center space-x-3 px-2 mb-6 hover:opacity-95 transition-all">
            <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shadow-md flex-shrink-0 bg-white border border-neutral-200/50 dark:border-neutral-800/40">
              <img 
                src="/jcer.png" 
                alt="JCER Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider uppercase text-neutral-900 dark:text-white">JCER ERP</span>
              <span className="text-[12px] text-neutral-400 dark:text-neutral-500 font-semibold -mt-0.5">Student Portal</span>
            </div>
          </Link>

          {/* Scrollable Grouped Navigation */}
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
                        className={`w-full px-3 py-2 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                          isActive 
                            ? 'sidebar-icon-active shadow-sm' 
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

        {/* Bottom Footer: Academics info, Help link, Theme toggler */}
        <div className="pt-4 border-t border-neutral-200/50 dark:border-neutral-800/40 flex flex-col space-y-3 w-full bg-transparent">
          {/* Academic Info Grid */}
          <div className="bg-neutral-100/60 dark:bg-neutral-800/30 rounded-2xl p-3 border border-neutral-200/30 dark:border-neutral-800/30 text-[10px] space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 dark:text-neutral-500 font-medium text-[10px]">Semester</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200 text-[10px]">Semester 6</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 dark:text-neutral-500 font-medium text-[10px]">Academic Year</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200 text-[10px]">{getAcademicYear()}</span>
            </div>
          </div>

          {/* Need Help Link */}
          <Link 
            to="/student/grievances" 
            className="flex items-center space-x-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-1 py-0.5"
          >
            <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-[11px]">Need Help? Support Desk</span>
          </Link>


        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-[304px] pt-6 flex flex-col min-h-screen min-w-0">
        
        {/* 2. HEADER NAVIGATION */}
        <header className="flex flex-row items-center justify-between py-4 mb-6 z-30 gap-4">
          {/* Left: Dynamic Header Page Title */}
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
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive 
                      ? 'nav-pill-active shadow-sm' 
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Search, Alerts, & Profile Dropdown */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            {/* Search Icon Button */}
            <button className="w-9 h-9 rounded-full flex items-center justify-center header-dark-btn shadow-sm hover:scale-[1.05] active:scale-[0.95] cursor-pointer">
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Icon Button with Dot */}
            <button className="w-9 h-9 rounded-full flex items-center justify-center header-dark-btn shadow-sm hover:scale-[1.05] active:scale-[0.95] relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>

            {/* Dark/Light Mode Toggler Button */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 rounded-full flex items-center justify-center header-dark-btn shadow-sm hover:scale-[1.05] active:scale-[0.95] cursor-pointer text-neutral-600 dark:text-neutral-300"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Avatar Card with click-toggle logout dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center space-x-2 header-dark-btn h-9 pl-1 pr-3 py-1 rounded-full shadow-sm cursor-pointer hover:scale-[1.02] transition-all select-none"
              >
                <img
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&fit=crop'}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover border border-white/10"
                />
                <span className="text-xs font-semibold pr-0.5 hidden md:block">
                  {user?.name?.split(' ')[0] || 'Student'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-80 hidden md:block transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Click-Toggled Logout Menu */}
              {profileMenuOpen && (
                <div className="profile-dropdown absolute right-0 mt-2 w-52 border border-neutral-200/50 dark:border-neutral-800/40 rounded-2xl py-2 animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/30">
                    <p className="profile-dropdown-label text-[10px] font-extrabold uppercase tracking-widest mb-0.5">Logged in as</p>
                    <p className="profile-dropdown-value text-sm font-extrabold">{user?.name || 'Student'}</p>
                    <p className="profile-dropdown-label text-[10px] mt-0.5">{user?.role || 'STUDENT'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="profile-dropdown-logout w-full text-left px-4 py-3 text-sm font-bold flex items-center space-x-2.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Logout Session</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. PAGE BODY ROUTER (OUTLET) */}
        <main className="flex-1 flex flex-col relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
