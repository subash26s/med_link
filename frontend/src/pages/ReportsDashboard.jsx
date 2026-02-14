import React from 'react';
import {
    FileText, Download, Filter,
    Search, Eye, FileUp,
    Calendar, Clock, User
} from 'lucide-react';
import GlobalLayout from '../layouts/GlobalLayout';
import { ModernTable, PrimaryButton } from '../components/common/UIComponents';
import { useLanguage } from '../contexts/LanguageContext';

const ReportsDashboard = () => {
    const { t } = useLanguage();
    const reports = [
        { id: 'REP-001', name: 'Triage Summary - Morning Shift', author: 'Dr. Sarah Wilson', date: '2026-02-14', type: 'Clinical' },
        { id: 'REP-002', name: 'Patient Throughput Analysis', author: 'Admin System', date: '2026-02-14', type: 'Analytics' },
        { id: 'REP-003', name: 'Critical Incident Log', author: 'Nurse Jane Doe', date: '2026-02-13', type: 'Security' },
        { id: 'REP-004', name: 'Insurance Verification Batch', author: 'Reception Desk', date: '2026-02-13', type: 'Financial' },
    ];

    return (
        <GlobalLayout>
            <div className="space-y-10 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('clinical_doc')}</h1>
                        <p className="text-slate-500 font-medium">{t('access_system_reports')}</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <Filter size={18} /> {t('adv_filters')}
                        </button>
                        <PrimaryButton icon={FileUp}>{t('gen_new_report')}</PrimaryButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: t('total_reports'), val: '142', color: 'bg-blue-50 text-blue-600' },
                        { label: t('pending_review'), val: '8', color: 'bg-amber-50 text-amber-600' },
                        { label: t('recent_downloads'), val: '31', color: 'bg-emerald-50 text-emerald-600' },
                        { label: t('system_health'), val: '99%', color: 'bg-purple-50 text-purple-600' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                            <p className={`text-4xl font-black ${stat.color.split(' ')[1]}`}>{stat.val}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-[30px] border border-slate-100 flex items-center gap-4">
                        <Search className="text-slate-400 ml-4" size={20} />
                        <input
                            type="text"
                            placeholder={t('search_reports_placeholder')}
                            className="flex-1 bg-transparent border-none outline-none font-bold text-slate-900 text-lg placeholder:text-slate-300"
                        />
                    </div>

                    <ModernTable
                        headers={[t('report_id'), t('doc_name'), t('author'), t('category'), t('date_gen'), t('actions')]}
                        data={reports}
                        renderRow={(r) => (
                            <>
                                <td className="px-6 py-5 font-black text-slate-400 text-xs">#{r.id}</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3 font-bold text-slate-800">
                                        <FileText size={18} className="text-blue-500" />
                                        {r.name}
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-bold text-slate-500 text-sm">
                                    <div className="flex items-center gap-2"><User size={14} /> {r.author}</div>
                                </td>
                                <td className="px-6 py-5 text-[10px] font-black uppercase text-slate-400">
                                    <span className="bg-slate-100 px-3 py-1 rounded-full">{r.type}</span>
                                </td>
                                <td className="px-6 py-5 text-slate-400 font-bold text-xs"><Clock size={12} className="inline mr-1" /> {r.date}</td>
                                <td className="px-6 py-5">
                                    <div className="flex gap-2">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={18} /></button>
                                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Download size={18} /></button>
                                    </div>
                                </td>
                            </>
                        )}
                    />
                </div>
            </div>
        </GlobalLayout>
    );
};

export default ReportsDashboard;
