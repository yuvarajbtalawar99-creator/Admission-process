import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  GraduationCap,
  User,
  Users,
  MapPin,
  BookOpen,
  Upload,
  Send,
  ArrowRight,
  Sun,
  Moon,
  ShieldCheck,
  Globe,
  ChevronRight,
  BookOpenCheck,
  AlertTriangle,
  Mail,
  Phone
} from 'lucide-react';

interface PublicConfig {
  collegeName: string;
  admissionOpen: boolean;
  admissionCycle: string;
  maintenanceMode: boolean;
  supportEmail: string;
  supportPhone: string;
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';
  });

  // Config state with production-grade offline fallbacks
  const [config, setConfig] = useState<PublicConfig>({
    collegeName: "Jain College of Engineering & Research",
    admissionOpen: true,
    admissionCycle: "2026–27",
    maintenanceMode: false,
    supportEmail: "admissions@jcer.org",
    supportPhone: "+91 831 2400400"
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Load public system configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/system/config');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setConfig(json.data);
          }
        }
      } catch (err) {
        console.warn("Could not retrieve system config from backend, using default presets.", err);
      }
    };
    fetchConfig();
  }, []);

  // Session auto-redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard-redirect', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const steps = [
    { label: 'Admission Details', icon: GraduationCap },
    { label: 'Personal Details', icon: User },
    { label: 'Parent Details', icon: Users },
    { label: 'Address Details', icon: MapPin },
    { label: 'Academic Details', icon: BookOpen },
    { label: 'Document Upload', icon: Upload },
    { label: 'Review & Submit', icon: Send }
  ];

  const badges = [
    { text: `Admissions Cycle: ${config.admissionCycle}`, icon: GraduationCap },
    { text: 'UG & PG Programs', icon: BookOpenCheck },
    { text: '100% Online Process', icon: Globe },
    { text: 'Secure Document Upload', icon: ShieldCheck }
  ];

  const handleErpNavigation = () => {
    navigate('/login');
  };

  // ── Maintenance Mode Layout ──
  if (config.maintenanceMode) {
    return (
      <div
        className="min-h-screen w-full flex flex-col justify-between relative bg-[#F8FAFC] dark:bg-[#0b0f19] text-[#1E293B] dark:text-slate-200 transition-colors duration-300 font-sans overflow-x-hidden"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 50%)'
            : 'radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.04) 0%, transparent 50%)',
          backgroundAttachment: 'fixed'
        }}
      >

        <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800/80 z-10 bg-transparent">
          <div className="flex items-center gap-3.5">
            <div className="w-30 h-30 overflow-hidden rounded-full">
              <img
                src="/logo.png"
                alt="JCER Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#0F4C81] dark:text-white font-extrabold text-base sm:text-lg tracking-tight leading-tight uppercase">
                {config.collegeName}
              </h1>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                Belagavi • VTU Affiliated
              </span>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 text-center z-10">
          <div className="max-w-md w-full bg-white dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800/80 rounded-[24px] p-8 shadow-xl backdrop-blur-md space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">Portal Under Maintenance</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                The Jain College of Engineering & Research Portal is currently undergoing scheduled maintenance. We will return shortly.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-left space-y-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Support Desk</span>
              <div className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                <Mail className="w-4 h-4 text-[#0F4C81] dark:text-blue-450" />
                <span>{config.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                <Phone className="w-4 h-4 text-[#0F4C81] dark:text-blue-450" />
                <span>{config.supportPhone}</span>
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#E2E8F0] dark:border-slate-800/80 text-center text-[11px] text-slate-550 dark:text-slate-450">
          <p>© 2026 Jain College of Engineering & Research, Belagavi. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // ── Standard Dashboard Gateway Layout ──
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between relative bg-[#F8FAFC] dark:bg-[#0b0f19] text-[#1E293B] dark:text-slate-200 transition-colors duration-300 font-sans overflow-x-hidden"
      style={{
        backgroundImage: isDark
          ? 'radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.08) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(15, 76, 129, 0.12) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(244, 180, 0, 0.04) 0%, transparent 40%)'
          : 'radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.04) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(15, 76, 129, 0.04) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(244, 180, 0, 0.03) 0%, transparent 40%)',
        backgroundAttachment: 'fixed'
      }}
    >

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800/80 z-10 bg-transparent">
        <div className="flex items-center gap-3.5">
          <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="JCER Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#0F4C81] dark:text-white font-extrabold text-base sm:text-lg tracking-tight leading-tight uppercase">
              {config.collegeName}
            </h1>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
              Belagavi • VTU Affiliated
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={handleErpNavigation}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold border border-[#0F4C81]/80 dark:border-slate-700 text-[#0F4C81] dark:text-slate-200 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 shadow-sm cursor-pointer"
          >
            ERP Portal <ArrowRight className="w-3.5 h-3.5 text-current" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 sm:py-16 z-10">
        <div className="w-full max-w-5xl text-center space-y-5 mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0F4C81] dark:text-white leading-[1.15]">
            Welcome to JCER Digital Portal
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            A single platform for managing admissions and securely accessing the College ERP System.
          </p>

          {/* Minimal visual stats bar */}
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            {badges.map((b, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-tight bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm"
              >
                <b.icon className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                {b.text}
              </span>
            ))}
          </div>

          {/* Abstract education illustration */}
          <div className="flex justify-center pt-4">
            <svg width="180" height="60" viewBox="0 0 180 60" fill="none" className="opacity-80 dark:opacity-90">
              <path d="M90 5L30 25L90 45L140 28.3V46.7H145V26.7L90 5Z" fill="url(#grad1)" />
              <path d="M60 38.3V53.3C60 58.3 73.4 63.3 90 63.3C106.6 63.3 120 58.3 120 53.3V38.3L90 48.3L60 38.3Z" fill="url(#grad2)" />
              <circle cx="90" cy="5" r="3" fill="#F4B400" />
              <defs>
                <linearGradient id="grad1" x1="30" y1="25" x2="145" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0F4C81" />
                  <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="grad2" x1="60" y1="50.8" x2="120" y2="50.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#0F4C81" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Main Admission Glass Card */}
        <div className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/95 border border-[#E2E8F0] dark:border-slate-800/80 rounded-[24px] p-6 sm:p-10 shadow-xl dark:shadow-2xl/40 relative overflow-hidden group hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300">

          {/* Card Top Branding Badge */}
          <div className="absolute top-0 right-0 h-2 w-full bg-gradient-to-r from-[#0F4C81] via-[#2563EB] to-[#F4B400]" />

          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-display" role="img" aria-label="graduation-cap">🎓</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F4C81] dark:text-white tracking-tight">
                Admission Portal
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-semibold">
              Apply for admission online, upload required documents, track your application status, and complete the admission process digitally.
            </p>

            {/* Horizontal steps timeline */}
            <div className="w-full py-6 overflow-x-auto scrollbar-thin">
              <div className="flex items-center justify-between min-w-[700px] px-4 relative">
                {/* Horizontal connection line */}
                <div className="absolute top-5 left-10 right-10 h-[2px] bg-slate-200 dark:bg-slate-800 z-0" />

                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={index} className="flex flex-col items-center space-y-3 z-10 flex-1 relative group/step">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover/step:border-[#2563EB] group-hover/step:text-[#2563EB] dark:group-hover/step:text-blue-400 transition-all duration-300 shadow-sm">
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 max-w-[85px] text-center leading-tight">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Application actions (Apply Now & Login -> inline arrangement) */}
            <div className="flex flex-col items-center space-y-4 pt-4 w-full">
              {config.admissionOpen ? (
                <>
                  <button
                    onClick={() => navigate('/admission/register')}
                    className="px-10 py-4 bg-[#0F4C81] hover:bg-[#2563EB] text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 tracking-wide cursor-pointer w-full sm:w-auto min-w-[200px]"
                  >
                    Apply Now
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Already Applied?
                    <button
                      onClick={() => navigate('/admission/login')}
                      className="flex items-center text-[#2563EB] dark:text-blue-400 font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      Login <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-center max-w-md w-full">
                  <p className="text-xs sm:text-sm font-bold text-rose-500 dark:text-rose-450 uppercase tracking-wide">
                    Admissions Closed
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Applications for the {config.admissionCycle} cycle are currently closed. For details, contact <a href={`mailto:${config.supportEmail}`} className="text-[#2563EB] dark:text-blue-400 font-bold hover:underline">{config.supportEmail}</a>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary ERP Link */}
        <div className="mt-8 flex flex-col items-center space-y-2.5 z-10">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Need access to the College ERP?
          </p>
          <button
            onClick={handleErpNavigation}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#0F4C81] dark:text-blue-400 hover:text-[#2563EB] dark:hover:text-blue-300 transition-colors focus:outline-none uppercase tracking-wider cursor-pointer bg-transparent border-none"
          >
            ERP Portal <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#E2E8F0] dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400 z-10 bg-transparent">
        <p className="font-semibold text-center md:text-left">
          © 2026 Jain College of Engineering & Research, Belagavi. All rights reserved.
        </p>
        <div className="flex items-center gap-6 font-bold uppercase tracking-wider">
          <a href="#" className="hover:text-[#2563EB] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#2563EB] transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-[#2563EB] transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
