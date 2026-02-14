import React from 'react';
import {
    FileText, Download, Eye,
    Search, Filter, FileUp,
    Calendar, User, Activity, ShieldCheck
} from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';

const reportsData = [
    { title: 'Complete Blood Count (CBC)', date: 'Feb 12, 2026', lab: 'Central Diagnostics', status: 'Final', values: 'Abnormal (Low Hb)', category: 'Laboratory' },
    { title: 'Chest X-Ray PA View', date: 'Jan 28, 2026', lab: 'City Hospital Radiology', status: 'Final', values: 'Normal', category: 'Radiology' },
    { title: 'Urinalysis Report', date: 'Jan 15, 2026', lab: 'Central Diagnostics', status: 'Final', values: 'Normal', category: 'Laboratory' },
    { title: 'Cardiac Stress Test', date: 'Dec 05, 2025', lab: 'Heart Care Center', status: 'Final', values: 'Good Tolerance', category: 'Cardiology' },
];

const MedicalReports = () => {
    return (
        <PatientLayout>
            <div className="space-y-10 animate-slide-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Reports</h1>
                        <p className="text-slate-500 font-medium mt-1">Access your secure clinical results and medical documentation.</p>
                    </div>
                    <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black shadow-xl shadow-slate-100 hover:bg-black transition-all hover:-translate-y-1 text-xs uppercase tracking-widest">
                        <FileUp size={18} /> Upload Records
                    </button>
                </div>

                {/* AI Insights Bar */}
                <div className="bg-blue-600 p-8 rounded-[40px] flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-blue-100 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 -mr-8 -mt-8">
                        <ShieldCheck size={140} />
                    </div>
                    <div className="bg-white/20 p-4 rounded-3xl text-white shrink-0">
                        <Activity size={32} />
                    </div>
                    <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">MediCare AI Intelligence</span>
                        </div>
                        <p className="text-white font-bold text-lg leading-tight md:max-w-xl">
                            "I've analyzed your CBC from Feb 12. Your hemoglobin is 11.2 g/dL. No immediate alarm, but we recommend increasing dietary iron."
                        </p>
                    </div>
                    <button className="relative z-10 bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all whitespace-nowrap">
                        Discuss with AI
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="bg-white p-4 rounded-[30px] border border-slate-100 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center gap-4 flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
                        <Search className="text-slate-300" size={20} />
                        <input
                            type="text"
                            placeholder="Search clinical records..."
                            className="bg-transparent border-none outline-none font-bold text-slate-900 w-full placeholder:text-slate-200"
                        />
                    </div>
                    <div className="flex items-center gap-4 px-4 h-full">
                        <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">
                            <Filter size={16} /> Filter Results
                        </button>
                        <div className="h-4 w-px bg-slate-100 mx-2"></div>
                        <button className="text-sm font-black text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">Lab</button>
                        <button className="text-sm font-black text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">X-Ray</button>
                    </div>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reportsData.map((report, i) => (
                        <div key={i} className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-150 transition-transform duration-700 text-blue-600"><FileText size={120} /></div>

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{report.category}</span>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight pt-2">{report.title}</h3>
                                </div>
                                <div className="flex gap-3">
                                    <button className="p-3 bg-slate-50 text-slate-300 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                        <Eye size={18} />
                                    </button>
                                    <button className="p-3 bg-slate-50 text-slate-300 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 relative z-10 pt-6 border-t border-slate-50">
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Clinic / Lab</p>
                                    <p className="text-sm font-black text-slate-700">{report.lab}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Date Issued</p>
                                    <p className="text-sm font-black text-slate-700">{report.date}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between relative z-10">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${report.values.includes('Abnormal') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <ShieldCheck size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{report.values}</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Secure</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PatientLayout>
    );
};

export default MedicalReports;
