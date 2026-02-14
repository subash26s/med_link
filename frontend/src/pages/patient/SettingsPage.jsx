import React, { useState } from 'react';
import {
    User, Lock, Bell, Shield,
    Smartphone, Globe, Moon, CreditCard,
    ChevronRight, Save, LogOut
} from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const SettingsPage = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: t('clinical_profile'), icon: User },
        { id: 'security', label: t('security'), icon: Lock },
        { id: 'notifications', label: t('notifications'), icon: Bell },
        { id: 'privacy', label: t('privacy'), icon: Shield },
    ];

    return (
        <PatientLayout>
            <div className="space-y-10 animate-slide-up font-sans">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('portal_settings')}</h1>
                    <p className="text-slate-500 font-medium">{t('manage_identity')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-4 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                                    }`}
                            >
                                <tab.icon size={20} />
                                {tab.label}
                            </button>
                        ))}
                        <div className="pt-8">
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                            >
                                <LogOut size={20} />
                                {t('sign_out_portal')}
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm space-y-10">
                            {activeTab === 'profile' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-[35px] bg-blue-50 border-4 border-white shadow-xl flex items-center justify-center text-blue-600 font-black text-3xl">
                                            {user?.username?.[0] || 'P'}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900">{user?.username || t('anonymous')}</h3>
                                            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{t('verified_id')}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('full_name')}</label>
                                            <input type="text" defaultValue={user?.username} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 outline-none focus:ring-2 ring-blue-100" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('email_address')}</label>
                                            <input type="email" defaultValue={`${user?.username?.toLowerCase().replace(' ', '.')}@example.com`} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 outline-none focus:ring-2 ring-blue-100" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('phone_number')}</label>
                                            <input type="text" defaultValue="+91 98765 43210" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 outline-none focus:ring-2 ring-blue-100" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('national_id')}</label>
                                            <input type="text" defaultValue="XXXX-XXXX-4432" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 outline-none focus:ring-2 ring-blue-100" />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50 flex justify-end">
                                        <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3">
                                            <Save size={18} /> {t('update_profile')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6">
                                        <Lock size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900">{t('encryption_title')}</h3>
                                    <p className="text-slate-500 font-medium max-w-sm">{t('encryption_detail')}</p>
                                    <button className="text-blue-600 font-black text-xs uppercase tracking-widest pt-6 hover:underline">{t('manage_keys')}</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default SettingsPage;
