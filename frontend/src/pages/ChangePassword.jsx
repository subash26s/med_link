import React, { useState } from 'react';
import GlobalLayout from '../layouts/GlobalLayout';
import { Lock, Save } from 'lucide-react';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Mock success
        setMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        // Log activity
        const activity = JSON.parse(localStorage.getItem('activity_log') || '[]');
        activity.unshift({
            time: new Date().toISOString(),
            action: 'Password Changed',
            details: 'User successfully updated password'
        });
        localStorage.setItem('activity_log', JSON.stringify(activity));
    };

    return (
        <GlobalLayout>
            <div className="max-w-2xl mx-auto font-sans">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-8">Security Settings</h1>

                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Change Password</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Update your account password regularly.</p>
                        </div>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl border border-green-200 dark:border-green-800 font-bold text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800 font-bold text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm w-full md:w-auto"
                        >
                            <Save size={18} /> Update Password
                        </button>
                    </form>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default ChangePassword;
