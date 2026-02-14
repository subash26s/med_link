import React from 'react';
import {
    User, Mail, Phone, MapPin,
    Calendar, Shield, CreditCard, Bell,
    Settings, LogOut, ChevronRight, Activity,
    Smartphone, Heart
} from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();

    return (
        <PatientLayout>
            <div className="space-y-12 animate-slide-up font-sans">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('personal_details')}</h1>
                        <p className="text-slate-500 font-medium mt-1 text-lg">{t('update_profile')}</p>
                    </div>
                    <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-slate-400 hover:text-blue-600 transition-all">
                        <Settings size={22} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Primary Info Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-150 transition-transform"><User size={150} /></div>
                            <div className="w-32 h-32 bg-blue-100 border-4 border-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-8 font-black text-blue-600 text-5xl relative z-10">
                                {user?.username?.[0]?.toUpperCase() || 'P'}
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2 relative z-10">{user?.username || 'Subash'}</h2>
                            <p className="text-blue-600 font-black uppercase tracking-widest text-[10px] mb-8 relative z-10 border border-blue-100 bg-blue-50 px-4 py-1.5 rounded-full inline-block">
                                {t('verified_id')}
                            </p>

                            <div className="space-y-4 pt-8 border-t border-slate-50 relative z-10">
                                <div className="flex items-center gap-3 text-slate-500 font-medium">
                                    <Mail size={18} /> {user?.username || 'user'}@email.com
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 font-medium">
                                    <Smartphone size={18} /> +91 98765-43210
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white p-10 rounded-[50px] shadow-2xl shadow-slate-200">
                            <h3 className="text-xl font-black mb-8">{t('portal_settings')}</h3>
                            <div className="space-y-4">
                                {[
                                    { name: t('notifications'), icon: Bell, status: t('on') },
                                    { name: t('security'), icon: Shield, status: t('optimal') },
                                    { name: t('operational_stats'), icon: Activity, status: t('active') },
                                    { name: t('priority'), icon: Heart, status: t('normal') },
                                ].map((set, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <set.icon size={18} className="text-blue-400" />
                                            <span className="font-bold text-sm">{set.name}</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{set.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Secondary Info / Medical ID */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm">
                            <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                                <div className="bg-blue-600 p-2 rounded-xl text-white"><Shield size={20} /></div>
                                {t('verified_id')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {[
                                    { label: t('blood_group'), value: 'O Positive', icon: Heart, color: 'text-red-600' },
                                    { label: `${t('age')} / ${t('gender')}`, value: '28 Yrs, Male', icon: User, color: 'text-blue-600' },
                                    { label: t('insurance_verification'), value: 'Star Health (Gold Plan)', icon: Shield, color: 'text-emerald-600' },
                                    { label: t('phone_number'), value: '+91 9988-7766', icon: Smartphone, color: 'text-purple-600' },
                                    { label: t('national_id'), value: 'SH-4495-2026', icon: CreditCard, color: 'text-amber-600' },
                                    { label: t('reception'), value: 'City Hospital, Chennai', icon: MapPin, color: 'text-slate-600' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 group">
                                        <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shrink-0`}>
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-xl font-black text-slate-800 leading-tight">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Login Locations */}
                        <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-8">{t('security')}</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                            <Smartphone size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800">iPhone 15 Pro (Chennai, India)</p>
                                            <p className="text-xs font-bold text-slate-400">{t('operational')} • Active Now</p>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">{t('settings')}</button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full bg-red-50 text-red-600 p-8 rounded-[40px] border border-red-100 font-black text-xl flex items-center justify-center gap-4 hover:bg-red-600 hover:text-white transition-all group shadow-sm shadow-red-50"
                        >
                            <LogOut size={28} className="group-hover:-translate-x-1 transition-transform" />
                            {t('sign_out_portal')}
                        </button>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default ProfilePage;
