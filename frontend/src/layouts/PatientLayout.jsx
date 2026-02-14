import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Activity, FileText, Calendar,
    User, Bell, Search, AlertCircle,
    Stethoscope, ShieldCheck, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const PatientLayout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { t } = useLanguage();

    const navItems = [
        { name: t('dashboard'), icon: Home, path: '/patient/portal' },
        { name: t('myHealth') || t('vitals'), icon: Activity, path: '/patient/portal/health' },
        { name: t('appointments'), icon: Calendar, path: '/patient/portal/appointments' },
        { name: t('reports'), icon: FileText, path: '/patient/portal/reports' },
        { name: t('risk_assessment'), icon: ShieldCheck, path: '/patient/portal/ai-risk' },
        { name: t('doctors'), icon: Stethoscope, path: '/patient/portal/doctors' },
        { name: t('emergency'), icon: AlertCircle, path: '/patient/portal/emergency' },
        { name: t('settings'), icon: Settings, path: '/patient/portal/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 flex-col p-6 z-50">
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="bg-blue-600 p-2 rounded-xl text-white">
                        <Activity size={28} />
                    </div>
                    <div>
                        <span className="text-xl font-black text-slate-900 leading-tight block">{t('medicare_ai')}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('clinical_ecosystem')}</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all group ${location.pathname === item.path
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600 text-sm'
                                }`}
                        >
                            <item.icon size={20} className={location.pathname === item.path ? '' : 'text-slate-400 group-hover:text-blue-600'} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-100 mt-6 space-y-4">
                    <div className="flex justify-center">
                        <LanguageSwitcher />
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-sm group"
                    >
                        <LogOut size={20} className="group-hover:text-red-500" />
                        {t('logout')}
                    </button>
                </div>
            </div>

            {/* Header */}
            <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 flex items-center px-6 md:px-10 justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="bg-blue-600 p-2 rounded-lg text-white lg:hidden">
                        <Activity size={20} />
                    </div>
                    <div className="relative max-w-sm w-full hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                            type="text"
                            placeholder={t('search')}
                            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:ring-2 ring-blue-100 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <div className="hidden sm:block">
                        <LanguageSwitcher />
                    </div>
                    <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="h-8 w-px bg-slate-100 mx-1"></div>
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">{user?.username || t('anonymous')}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('verified_id')}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-600 group-hover:shadow-md transition-all uppercase">
                            {user?.username?.[0] || 'P'}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 pt-20 pb-24 lg:pb-0 transition-all duration-300">
                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-3 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                {navItems.slice(0, 5).map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex flex-col items-center gap-1 transition-all ${location.pathname === item.path ? 'text-blue-600' : 'text-slate-300'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="text-[8px] font-black uppercase tracking-tighter">{item.name}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default PatientLayout;
