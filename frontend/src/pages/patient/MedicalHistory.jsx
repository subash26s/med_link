import React from 'react';
import {
    History, Clock, CheckCircle, AlertTriangle,
    Stethoscope, Activity, FileText, ChevronRight
} from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';
import { useLanguage } from '../../contexts/LanguageContext';

const MedicalHistory = () => {
    const { t } = useLanguage();

    const historyData = [
        { date: 'Oct 2025', title: t('allergy_flare'), hospital: 'City General', doctor: 'Dr. Sarah Wilson', type: 'Outpatient' },
        { date: 'Aug 2025', title: t('annual_checkup'), hospital: 'Apollo Hospital', doctor: 'Dr. Mike Ross', type: 'Checkup' },
        { date: 'May 2024', title: t('injury_sprain'), hospital: 'Wellness Center', doctor: 'Dr. Jane Doe', type: 'Injury' },
        { date: 'Jan 2024', title: t('covid_recovery'), hospital: 'Home Care', doctor: 'Self Monitor', type: 'Infection' },
    ];

    return (
        <PatientLayout>
            <div className="space-y-10 animate-slide-up font-sans">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('history')}</h1>
                    <p className="text-slate-500 font-medium mt-1 text-lg">{t('access_system_reports')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Timeline View */}
                    <div className="lg:col-span-8 space-y-8">
                        {historyData.map((item, i) => (
                            <div key={i} className="relative pl-12 group">
                                {/* Timeline Line */}
                                {i !== historyData.length - 1 && (
                                    <div className="absolute left-[23px] top-10 bottom-[-40px] w-0.5 bg-slate-100 group-last:hidden"></div>
                                )}

                                {/* Timeline Dot */}
                                <div className="absolute left-0 top-1 w-12 h-12 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-blue-600 group-hover:text-blue-600 transition-all z-10 shadow-sm">
                                    <Clock size={20} />
                                </div>

                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group-hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest leading-none mb-2 inline-block">
                                                {item.date}
                                            </span>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{item.title}</h3>
                                        </div>
                                        <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            {item.type}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Stethoscope size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">{item.doctor}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Activity size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-400">{item.hospital}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Quick Reference */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <AlertTriangle className="text-amber-500" size={24} /> {t('history')}
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: t('diabetes'), status: t('completed'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { name: t('asthma'), status: t('pending'), color: 'text-amber-600', bg: 'bg-amber-50' },
                                ].map((cond, i) => (
                                    <div key={i} className="p-5 rounded-3xl border border-slate-50 flex items-center justify-between group hover:border-blue-100 transition-all">
                                        <span className="font-bold text-slate-700">{cond.name}</span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cond.bg} ${cond.color}`}>
                                            {cond.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-600 p-10 rounded-[50px] shadow-2xl shadow-blue-100 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><FileText size={100} /></div>
                            <h4 className="text-xl font-black mb-4">{t('reports')}</h4>
                            <p className="text-blue-100 font-medium text-sm mb-8 opacity-90 leading-relaxed">
                                {t('view_full_data')}
                            </p>
                            <button className="w-full bg-white text-blue-600 p-5 rounded-[25px] font-black text-sm uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                {t('gen_new_report')} <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default MedicalHistory;
