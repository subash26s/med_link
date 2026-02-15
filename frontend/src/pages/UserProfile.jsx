import React from 'react';
import GlobalLayout from '../layouts/GlobalLayout';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const UserProfile = () => {
    const { user } = useAuth();

    return (
        <GlobalLayout>
            <div className="max-w-4xl mx-auto font-sans">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-8">My Profile</h1>

                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                    <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-100 dark:border-slate-700 pb-8 mb-8">
                        <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-5xl font-black shadow-inner">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{user?.username}</h2>
                            <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-slate-400 dark:text-slate-300">
                                    <Mail size={20} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800 dark:text-white pl-14">{user?.email || 'user@hospital.com'}</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-slate-400 dark:text-slate-300">
                                    <Shield size={20} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">User ID</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800 dark:text-white pl-14">{user?.id || 'UID-12345'}</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-slate-400 dark:text-slate-300">
                                    <Calendar size={20} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800 dark:text-white pl-14">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default UserProfile;
