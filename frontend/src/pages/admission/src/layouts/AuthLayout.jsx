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
        <div className="admission-portal-theme min-h-screen bg-slate-50 font-display flex flex-col">
            {/* Top Navigation Bar */}
            <header className="w-full bg-white border-b border-slate-200 shadow-sm z-50">
              <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-6 px-6 py-4">
                
                {/* Logo */}
                <div 
                  className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm"
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
                <div className="flex flex-col justify-center flex-1 space-y-0.5 sm:space-y-1">
                  
                  {/* College Name */}
                  <h1 
                    className="text-[#0B4F8A] text-base md:text-xl lg:text-2xl font-extrabold leading-tight tracking-tight uppercase"
                    style={{ color: '#0B4F8A', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: '800' }}
                  >
                    JAIN COLLEGE OF ENGINEERING & RESEARCH
                  </h1>
                  
                  {/* Approval Line */}
                  <p 
                    className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-800 font-medium leading-snug"
                    style={{ color: '#1f2937', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                  >
                    (Approved by AICTE, New Delhi, Affiliated to VTU Belagavi & Recognized by Govt. of Karnataka)
                  </p>
                  
                  {/* Accreditation */}
                  <p 
                    className="text-[10px] sm:text-xs md:text-sm lg:text-base font-bold text-indigo-600"
                    style={{ color: '#4f46e5', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                  >
                    NBA Accredited Programs – ECE & ME
                  </p>
                  
                </div>
                
              </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
                <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-3xl overflow-hidden border border-slate-200 min-h-0 lg:min-h-[650px] animate-fade-in text-slate-900">
                    
                    {/* Left Side: Visual/Branding Section (HIDDEN ON MOBILE) */}
                    <div className="hidden lg:block relative overflow-hidden bg-slate-900 border-r border-slate-200">
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
                        <div className="relative h-full flex flex-col justify-end p-12 text-white">
                            <div className="mb-10 space-y-4">
                                <span className="bg-white/20 backdrop-blur-lg px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-[0.2em] mb-6 inline-block border border-white/20">
                                    Welcome Back
                                </span>
                                <h1 className="text-5xl font-extrabold leading-[1.1] mb-5 text-shadow-premium">
                                    Empowering Your <br />
                                    <span className="text-primary-300">Academic Journey.</span>
                                </h1>
                                <p className="text-white/80 text-lg leading-relaxed max-w-md font-medium">
                                    Access your academic records, course registrations, and institutional resources in one secure portal.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-6 pt-10 border-t border-white/10">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="size-11 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden ring-4 ring-white/5">
                                            <img 
                                                src={`https://i.pravatar.cc/100?u=${i}`} 
                                                alt={`Student ${i}`} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-extrabold">Join 5,000+ students today</p>
                                    <p className="text-[11px] text-white/50 font-medium">Trusted by leading academic institutions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form Content (Outlet) */}
                    <div className="p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative z-10">
                        <Outlet />
                    </div>
                </div>
            </main>

            <footer className="py-6 px-10 border-t border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500 font-medium">© 2026 Jain College of Engineering & Research, Belagavi. All rights reserved.</p>
                <div className="flex items-center gap-8">
                    <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors">Terms</a>
                    <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors">Support</a>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;
