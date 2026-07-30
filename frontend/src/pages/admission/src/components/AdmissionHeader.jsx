import React, { useState } from 'react';
import { Menu, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdmissionHeader = ({ toggleSidebar, isSidebarOpen }) => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm flex-shrink-0 transition-none">
            <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5">
                
                {/* ─── 1. DESKTOP / LAPTOP LAYOUT (Unified Branding Block centered as ONE unit) ─── */}
                <div className="hidden lg:flex items-center justify-between gap-4 py-1 w-full">
                    
                    {/* LEFT: Hamburger Menu Icon */}
                    <div className="flex items-center shrink-0">
                        {toggleSidebar ? (
                            <button
                                onClick={toggleSidebar}
                                className="p-2 text-slate-800 hover:text-primary-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                                aria-label="Toggle Navigation Menu"
                                type="button"
                            >
                                <Menu className="w-7 h-7" />
                            </button>
                        ) : (
                            <div className="w-7 h-7" />
                        )}
                    </div>

                    {/* CENTER: UNIFIED BRANDING BLOCK (Logo + College Details aligned LEFT after menu) */}
                    <div className="flex items-center justify-start gap-3.5 xl:gap-4 flex-1 min-w-0">
                        {/* College Logo (Placed immediately beside title) */}
                        <div 
                            className="shrink-0 w-14 h-14 xl:w-16 xl:h-16 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-xs border border-slate-200"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <img 
                                src="/logo.png" 
                                alt="JCER Logo" 
                                className="w-full h-full object-cover bg-white rounded-full" 
                                style={{ backgroundColor: '#ffffff' }}
                            />
                        </div>

                        {/* Text Stack (Title begins directly after logo) */}
                        <div className="flex flex-col text-left justify-center min-w-0">
                            {/* Title */}
                            <h1 
                                className="text-[#0B4F8A] text-base lg:text-lg xl:text-xl font-extrabold leading-tight uppercase font-sans tracking-tight"
                                style={{ color: '#0B4F8A', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: '800' }}
                            >
                                JAIN COLLEGE OF ENGINEERING & RESEARCH
                            </h1>

                            {/* Approval Line */}
                            <p 
                                className="text-xs text-slate-700 font-medium leading-snug mt-0.5"
                                style={{ color: '#1f2937', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                            >
                                (Approved by AICTE, New Delhi, Affiliated to VTU Belagavi)
                            </p>

                            {/* Accreditation Line */}
                            <p 
                                className="text-xs font-bold text-indigo-700 leading-tight mt-0.5"
                                style={{ color: '#4f46e5', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                            >
                                Recognized by Govt. of Karnataka • NBA Accredited Programs – ECE & ME
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: User Profile Avatar & Dropdown */}
                    <div className="flex items-center justify-end shrink-0 relative">
                        {user ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                                >
                                    <div className="w-11 h-11 rounded-full bg-[#0B4F8A] text-white flex items-center justify-center text-sm font-bold ring-2 ring-[#0B4F8A]/20 shadow-sm shrink-0">
                                        {user?.name?.[0]?.toUpperCase() || 'S'}
                                    </div>
                                    <div className="flex flex-col text-left pr-1">
                                        <span className="text-xs font-bold text-slate-900 leading-tight max-w-[140px] truncate">{user?.name || 'Student User'}</span>
                                        <span className="text-[9.5px] text-slate-500 font-semibold uppercase tracking-wider">ID: {user?.id?.substring(0,8) || 'ADM-2026'}</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-500" />
                                </button>

                                {/* Profile Dropdown Menu */}
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Student User'}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{user?.email || `ID: ${user?.id?.substring(0,8)}`}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                logout();
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 shrink-0">
                                <User size={18} />
                            </div>
                        )}
                    </div>

                </div>

                {/* ─── 2. MOBILE / TABLET LAYOUT (lg:hidden, current mobile design) ─── */}
                <div className="flex lg:hidden items-center justify-between gap-1.5 sm:gap-3 h-auto min-h-[60px]">
                    
                    {/* LEFT: Hamburger Menu Icon */}
                    <div className="flex items-center shrink-0">
                        {toggleSidebar ? (
                            <button
                                onClick={toggleSidebar}
                                className="p-1.5 sm:p-2 text-slate-800 hover:text-primary-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                                aria-label="Toggle Navigation Menu"
                                type="button"
                            >
                                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
                            </button>
                        ) : (
                            <div className="w-6 h-6 sm:w-7 sm:h-7" />
                        )}
                    </div>

                    {/* CENTER: College Logo & Details */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-start sm:justify-center">
                        {/* College Logo (44px Mobile) */}
                        <div 
                            className="shrink-0 w-[44px] h-[44px] sm:w-12 sm:h-12 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-xs border border-slate-200"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <img 
                                src="/logo.png" 
                                alt="JCER Logo" 
                                className="w-full h-full object-cover bg-white rounded-full" 
                                style={{ backgroundColor: '#ffffff' }}
                            />
                        </div>

                        {/* Text Stack */}
                        <div className="flex flex-col text-left sm:text-center justify-center min-w-0 flex-1">
                            <h1 
                                className="text-[#0B4F8A] text-[11px] xs:text-xs sm:text-base font-extrabold leading-tight uppercase font-sans tracking-normal"
                                style={{ color: '#0B4F8A', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: '800' }}
                            >
                                JAIN COLLEGE OF ENGINEERING & RESEARCH
                            </h1>
                            <p 
                                className="text-[8.5px] xs:text-[9px] sm:text-[10px] text-slate-700 font-medium leading-snug mt-0.5"
                                style={{ color: '#1f2937', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                            >
                                (Approved by AICTE, New Delhi, Affiliated to VTU Belagavi & Recognized by Govt. of Karnataka)
                            </p>
                            <p 
                                className="text-[9px] xs:text-[9.5px] sm:text-[10.5px] font-bold text-indigo-600 leading-tight mt-0.5"
                                style={{ color: '#4f46e5', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                            >
                                NBA Accredited Programs – ECE & ME
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: User Profile Avatar (40px Mobile) */}
                    <div className="flex items-center justify-end shrink-0 relative">
                        {user ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-1.5 p-0.5 sm:p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                                >
                                    <div className="w-[40px] h-[40px] sm:w-11 sm:h-11 rounded-full bg-[#0B4F8A] text-white flex items-center justify-center text-sm font-bold ring-2 ring-[#0B4F8A]/20 shadow-sm shrink-0">
                                        {user?.name?.[0]?.toUpperCase() || 'S'}
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                                </button>

                                {/* Dropdown Menu */}
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Student User'}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{user?.email || `ID: ${user?.id?.substring(0,8)}`}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                logout();
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-[40px] h-[40px] sm:w-11 sm:h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 shrink-0">
                                <User size={18} />
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </header>
    );
};

export default AdmissionHeader;
