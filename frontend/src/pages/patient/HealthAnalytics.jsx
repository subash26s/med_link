import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
    TrendingUp, Activity, Heart, Thermometer,
    Calendar, Download, Info, Droplets,
    FileText, Search, Clock
} from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ModernTable } from '../../components/common/UIComponents';

const HealthAnalytics = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const res = await axios.get('/patients/queue');
                const p = res.data.find(p => p.name === user?.username) || res.data[0];
                if (p) {
                    const detailRes = await axios.get(`/patients/${p.id}`);
                    setPatientData(detailRes.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [user]);

    const hrData = [
        { hour: '08:00', rate: 72 },
        { hour: '10:00', rate: 75 },
        { hour: '12:00', rate: 82 },
        { hour: '14:00', rate: 78 },
        { hour: '16:00', rate: 74 },
        { hour: '18:00', rate: 76 },
        { hour: '20:00', rate: 70 },
    ];

    if (loading) return null;

    return (
        <PatientLayout>
            <div className="space-y-10 animate-slide-up font-sans">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('clinical_doc') || t('reports')}</h1>
                        <p className="text-slate-500 font-medium mt-1">{t('access_system_reports')}</p>
                    </div>
                    <button className="bg-white px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} /> {t('gen_new_report')}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {[
                        { label: t('blood_pressure'), value: patientData?.vitals?.[0]?.bp_systolic ? `${patientData.vitals[0].bp_systolic}/${patientData.vitals[0].bp_diastolic}` : '120/80', unit: 'mmHg', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: t('heart_rate'), value: '74', unit: 'BPM', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
                        { label: t('oxygen'), value: patientData?.vitals?.[0]?.spo2 || '98', unit: '%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: t('temperature'), value: patientData?.vitals?.[0]?.temperature || '36.6', unit: '°C', icon: Thermometer, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-slate-900">{stat.value}</span>
                                    <span className="text-[10px] font-bold text-slate-400">{stat.unit}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Medical Data Table */}
                <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-600 p-2.5 rounded-xl text-white">
                                <FileText size={20} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('historical_vitals')}</h3>
                        </div>
                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input
                                type="text"
                                placeholder={t('search_reports_placeholder')}
                                className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:ring-2 ring-blue-100 outline-none"
                            />
                        </div>
                    </div>

                    <ModernTable
                        headers={[t('date_gen'), t('blood_pressure'), t('heart_rate'), t('temperature'), t('oxygen'), t('author')]}
                        data={patientData?.vitals || []}
                        renderRow={(v) => (
                            <>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-900 text-sm">{new Date(v.recorded_at).toLocaleDateString()}</span>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                                            <Clock size={10} /> {new Date(v.recorded_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-black text-slate-700 text-sm">
                                    <span className={`${v.bp_systolic > 140 ? 'text-red-500' : 'text-slate-700'}`}>
                                        {v.bp_systolic}/{v.bp_diastolic}
                                    </span>
                                </td>
                                <td className="px-6 py-5 font-black text-slate-700 text-sm">
                                    <span className="flex items-center gap-2">
                                        {v.heart_rate} <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">BPM</span>
                                    </span>
                                </td>
                                <td className="px-6 py-5 font-black text-slate-700 text-sm">{v.temperature}°C</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className={`h-full ${v.spo2 < 95 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${v.spo2}%` }}></div>
                                        </div>
                                        <span className="text-sm font-black text-slate-700">{v.spo2}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                        {t('nurse')} Unit B
                                    </span>
                                </td>
                            </>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-red-50 text-red-600 p-3 rounded-2xl">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('heart_rate')} Activity</h3>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hrData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="hour"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }}
                                    />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="rate" fill="#ef4444" radius={[12, 12, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white p-10 rounded-[50px] shadow-2xl relative overflow-hidden group flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000">
                            <TrendingUp size={240} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-600 p-3 rounded-2xl">
                                    <Activity size={24} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">{t('prognosis_forecast') || 'Long-term Prognosis'}</h3>
                            </div>
                            <p className="text-blue-100 font-medium leading-relaxed opacity-80 text-lg">
                                {t('prognosis_forecast_detail', { action: 'healthy' })}
                            </p>
                        </div>
                        <div className="relative z-10 pt-10">
                            <button className="w-full bg-white text-slate-900 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-50 transition-all">
                                {t('view_full_data')} <TrendingUp size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default HealthAnalytics;
