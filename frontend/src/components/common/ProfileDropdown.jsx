import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Activity, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileDropdown = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="relative font-sans" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 group"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black shadow-sm ring-2 ring-white dark:ring-slate-700 group-hover:scale-105 transition-transform">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.username}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.role}</span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 py-2 z-50 animate-slide-up origin-top-right">
                    <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-700 mb-1 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Signed in as</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium mt-0.5">{user.email || `${user.username}@hospital.com`}</p>
                    </div>

                    <div className="space-y-1 p-1.5">
                        <button onClick={() => { setIsOpen(false); navigate('/profile'); }} className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 rounded-xl transition-colors">
                            <User size={18} className="text-slate-400 group-hover:text-blue-500" /> My Profile
                        </button>
                        <button onClick={() => { setIsOpen(false); navigate('/change-password'); }} className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 rounded-xl transition-colors">
                            <Lock size={18} className="text-slate-400 group-hover:text-blue-500" /> Change Password
                        </button>
                        <button onClick={() => { setIsOpen(false); navigate('/activity'); }} className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 rounded-xl transition-colors">
                            <Activity size={18} className="text-slate-400 group-hover:text-blue-500" /> Activity Log
                        </button>
                    </div>

                    <div className="mt-1 border-t border-slate-50 dark:border-slate-700 p-1.5">
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group">
                            <LogOut size={18} className="hidden group-hover:block animate-pulse" />
                            <LogOut size={18} className="block group-hover:hidden" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
