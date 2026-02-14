import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, UserRound, Stethoscope,
    Settings, LogOut, Bell, Search, Moon, Sun,
    Menu, X, Activity, ClipboardList, Clipboard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const Sidebar = ({ isOpen, toggle }) => {
    const location = useLocation();
    const { user } = useAuth();
    const { t } = useLanguage();

    const menuItems = [
        { name: t('dashboard'), key: 'dashboard', icon: LayoutDashboard, path: '/admin', roles: ['admin'] },
        { name: t('nurse'), key: 'nurse', icon: Clipboard, path: '/nurse', roles: ['nurse', 'admin'] },
        { name: t('doctor'), key: 'doctor', icon: Stethoscope, path: '/doctor', roles: ['doctor', 'admin'] },
        { name: t('triage_queue'), key: 'triage_queue', icon: Activity, path: '/triage-queue', roles: ['nurse', 'doctor', 'admin'] },
        { name: t('reception'), key: 'reception', icon: ClipboardList, path: '/reception', roles: ['receptionist', 'admin'] },
        { name: t('patients'), key: 'patients', icon: UserRound, path: '/admin/patients', roles: ['admin'] },
        { name: t('reports'), key: 'reports', icon: ClipboardList, path: '/reports', roles: ['admin', 'doctor'] },
        { name: t('settings'), key: 'settings', icon: Settings, path: '/settings', roles: ['admin', 'doctor', 'nurse'] },
    ];

    const filteredItems = menuItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} font-sans`}>
            <div className="h-full flex flex-col p-6">
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="bg-blue-600 p-2 rounded-xl text-white font-sans">
                        <Activity size={28} />
                    </div>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">{t('medicare_ai')}</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {filteredItems.map((item) => (
                        <Link
                            key={item.key}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all group ${location.pathname === item.path
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 text-sm'
                                }`}
                        >
                            <item.icon size={22} className={location.pathname === item.path ? '' : 'text-slate-400 group-hover:text-blue-600'} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-50 space-y-4">
                    {user && (
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 font-sans">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                                {user.username?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-black text-slate-900 truncate">{user.username}</p>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{t(user.role) || user.role}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Header = ({ toggleSidebar }) => {
    const { logout, user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-72 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center px-6 md:px-10 justify-between font-sans">
            <div className="flex items-center gap-6 flex-1">
                <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500">
                    <Menu size={24} />
                </button>
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('search')}
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-5">
                <LanguageSwitcher />
                <div className="flex items-center gap-1 md:gap-2">
                    <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                        <Moon size={20} />
                    </button>
                </div>

                <div className="h-10 w-px bg-slate-100 mx-1 md:mx-2"></div>

                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2.5 rounded-xl transition-all"
                >
                    <LogOut size={18} />
                    <span className="hidden md:inline">{t('logout')}</span>
                </button>
            </div>
        </header>
    );
};

const GlobalLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <main className="lg:ml-72 pt-20 transition-all duration-300">
                <div className="p-6 md:p-10 max-w-[1600px] mx-auto animate-slide-up">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default GlobalLayout;
