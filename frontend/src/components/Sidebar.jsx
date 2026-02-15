import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, LogOut, Settings, Calendar, FileText, Bell, Activity, ClipboardList } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const links = [
        { path: '/nurse', label: 'Nurse Dashboard', icon: LayoutDashboard, roles: ['nurse', 'admin'] },
        { path: '/doctor', label: 'Dashboard', icon: LayoutDashboard, roles: ['doctor', 'admin'] },
        { path: '/triage-queue', label: 'Public Triage Queue', icon: Activity, roles: ['doctor', 'nurse', 'admin'] },
        { path: '/doctor/appointments', label: 'Patient Appointments', icon: Calendar, roles: ['doctor'] },
        { path: '/doctor/schedule', label: 'My Schedule', icon: ClipboardList, roles: ['doctor'] },
        { path: '/doctor/reports', label: 'Reports', icon: FileText, roles: ['doctor'] },
        { path: '/patient/portal/notifications', label: 'Notifications', icon: Bell, roles: ['doctor', 'patient', 'admin'] },
        { path: '/profile', label: 'Settings', icon: Settings, roles: ['doctor', 'nurse', 'admin', 'patient'] },
        { path: '/admin', label: 'Admin Panel', icon: Settings, roles: ['admin'] },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col shadow-lg z-20">
            <div className="p-6 border-b border-gray-100 flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3 shadow-md">
                    +
                </div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">VoiceTriage AI</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Menu
                </div>
                {links.filter(link => link.roles.includes(user.role)).map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm ring-1 ring-blue-200'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <link.icon size={20} className={location.pathname === link.path ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-slate-400 uppercase mb-1">Logged in as</p>
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700 capitalize">{user.username}</p>
                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
