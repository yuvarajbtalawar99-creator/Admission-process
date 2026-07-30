import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight } from 'lucide-react';

const AuthLayout = () => {
    const { token, user } = useAuth();
    
    // IMAGE CONFIGURATION:
    // To use your college photo, place 'college-view.jpg' in the 'public/' folder.
    const collegeImgPath = "/college-view.jpg";
    const fallbackImg = "https://images.unsplash.com/photo-1498243639159-414ccead8c51?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

    if (token && user) {
        if (user.role === 'STUDENT') return <Navigate to="/admission/dashboard" replace />;
        if (user.role === 'ADMISSION_OFFICER') return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return (
        <div className="admission-portal-theme min-h-screen bg-slate-50 font-display flex flex-col overflow-y-auto">
            {/* Top Navigation Bar */}
            <header className="w-full bg-white border-b border-slate-200 shadow-sm z-50 flex-shrink-0">
              <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-2.5 sm:py-3">
                
                {/* Logo */}
                <div 
                  className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <img
                    src="/logo.png"
                    alt="JCER Logo"
                    className="w-full h-full object-cover bg-white rounded-full"
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* College Details */}
                <div className="flex flex-col justify-center flex-1 space-y-0.5">
                  
                  {/* College Name */}
                  <h1 
                    className="text-[#0B4F8A] text-sm md:text-lg lg:text-xl font-extrabold leading-tight tracking-tight uppercase"
                    style={{ color: '#0B4F8A', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: '800' }}
                  >
                    JAIN COLLEGE OF ENGINEERING & RESEARCH
                  </h1>
                  
                  {/* Approval Line */}
                  <p 
                    className="text-[9px] sm:text-[10px] md:text-xs text-gray-800 font-medium leading-snug"
                    style={{ color: '#1f2937', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                  >
                    (Approved by AICTE, New Delhi, Affiliated to VTU Belagavi & Recognized by Govt. of Karnataka)
                  </p>
                  
                  {/* Accreditation */}
                  <p 
                    className="text-[10px] sm:text-xs md:text-sm font-bold text-indigo-600"
                    style={{ color: '#4f46e5', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                  >
                    NBA Accredited Programs – ECE & ME
                  </p>
                  
                </div>
                
              </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 lg:p-6 flex flex-col justify-start items-center h-auto min-h-0">
                <div className="w-full max-w-[1050px] grid grid-cols-1 lg:grid-cols-2 items-stretch bg-white rounded-2xl shadow-3xl border border-slate-200 h-auto animate-fade-in text-slate-900">
                    
                    {/* Left Side: Visual/Branding Section (HIDDEN ON MOBILE) */}
                    <div className="hidden lg:flex relative bg-slate-900 border-r border-slate-200 h-full flex-col justify-end rounded-l-2xl overflow-hidden min-h-[440px]">
                        {/* Background Layer with Dual Fallback Logic */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center animate-background-zoom transition-all duration-700" 
                            style={{ 
                                backgroundImage: `url(${collegeImgPath}), url(${fallbackImg})`,
                            }}
                        ></div>

                        {/* Dark Gradient Overlay for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/70 pointer-events-none"></div>
                        
                        {/* Content Overlay */}
                        <div className="relative h-full flex flex-col justify-end p-6 lg:p-8 xl:p-10 text-white">
                            <div className="mb-4 xl:mb-8 space-y-2.5 xl:space-y-3">
                                <span className="bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] mb-3 inline-block border border-white/20">
                                    Welcome Back
                                </span>
                                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold leading-[1.15] mb-3 text-shadow-premium">
                                    Empowering Your <br />
                                    <span className="text-primary-300">Academic Journey.</span>
                                </h1>
                                <p className="text-white/80 text-xs lg:text-sm xl:text-base leading-relaxed max-w-md font-medium">
                                    Access your academic records, course registrations, and institutional resources in one secure portal.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 pt-4 xl:pt-6 border-t border-white/10">
                                <div className="flex -space-x-2.5">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="size-9 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden ring-2 ring-white/10">
                                            <img 
                                                src={`https://i.pravatar.cc/100?u=${i}`} 
                                                alt={`Student ${i}`} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-extrabold">Join 5,000+ students today</p>
                                    <p className="text-[10px] text-white/60 font-medium">Trusted by leading academic institutions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form Content (Outlet) */}
                    <div className="p-5 sm:p-7 lg:p-8 xl:p-9 flex flex-col justify-center bg-white relative z-10 h-full rounded-r-2xl">
                        <Outlet />
                    </div>
                </div>
            </main>

            <footer className="py-2.5 sm:py-3.5 px-6 border-t border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4 flex-shrink-0 mt-auto">
                <p className="text-xs text-slate-500 font-medium text-center md:text-left">© 2026 Jain College of Engineering & Research, Belagavi. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors">Terms</a>
                    <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors">Support</a>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;
