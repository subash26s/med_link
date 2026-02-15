import React, { useState, useEffect } from 'react';
import GlobalLayout from '../layouts/GlobalLayout';
import { Activity, Clock, CheckCircle } from 'lucide-react';

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Mock data + Local Storage
        const savedLogs = JSON.parse(localStorage.getItem('activity_log') || '[]');
        if (savedLogs.length === 0) {
            // Add some demo logs if empty
            const demoLogs = [
                { time: new Date().toISOString(), action: 'Logged In', details: 'User signed in successfully' },
                { time: new Date(Date.now() - 3600000).toISOString(), action: 'Viewed Dashboard', details: 'Accessed Doctor Dashboard' },
                { time: new Date(Date.now() - 7200000).toISOString(), action: 'Updated Profile', details: 'Changed email preferences' },
            ];
            setLogs(demoLogs);
            localStorage.setItem('activity_log', JSON.stringify(demoLogs));
        } else {
            setLogs(savedLogs);
        }
    }, []);

    return (
        <GlobalLayout>
            <div className="max-w-4xl mx-auto font-sans">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-8">Activity Log</h1>

                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                        {logs.map((log, index) => (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <Clock size={16} className="text-blue-500 dark:text-blue-400" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-slate-900 dark:text-white">{log.action}</div>
                                        <time className="font-mono text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </time>
                                    </div>
                                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                        {log.details}
                                    </div>
                                    <div className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                                        {new Date(log.time).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default ActivityLog;
