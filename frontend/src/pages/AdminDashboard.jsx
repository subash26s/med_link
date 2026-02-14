import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, Activity, Clock, AlertTriangle,
    TrendingUp, Calendar, Filter, Download, Plus,
    Search, ShieldAlert, HeartPulse, Stethoscope
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar
} from 'recharts';
import GlobalLayout from '../layouts/GlobalLayout';
import { DashboardCard, StatusBadge, ModernTable, PrimaryButton } from '../components/common/UIComponents';
import { useLanguage } from '../contexts/LanguageContext';

const AdminDashboard = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState({ total: 0, red: 0, yellow: 0, green: 0, avg_score: 0 });
    const [recentPatients, setRecentPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data for charts
    const patientTraffic = [
        { name: '00:00', total: 4, red: 1 },
        { name: '04:00', total: 7, red: 2 },
        { name: '08:00', total: 24, red: 5 },
        { name: '12:00', total: 35, red: 8 },
        { name: '16:00', total: 29, red: 4 },
        { name: '20:00', total: 18, red: 3 },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, queueRes] = await Promise.all([
                    axios.get('/patients/stats'),
                    axios.get('/patients/queue')
                ]);
                setStats(statsRes.data);
                setRecentPatients(queueRes.data.slice(0, 10));
            } catch (error) {
                console.error("Dashboard error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <GlobalLayout>
            <div className="space-y-10 font-sans">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('system_oversight')}</h1>
                        <p className="text-slate-500 font-medium">{t('realtime_analytics')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white px-5 py-3 rounded-xl border border-slate-100 font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
                            <Calendar size={18} /> {t('daily_overview')}
                        </button>
                        <PrimaryButton icon={Plus}>{t('add_staff')}</PrimaryButton>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard title={t('total_patients_today')} value={stats.total} icon={Users} trend={12} />
                    <DashboardCard title={t('emergency_cases')} value={stats.red} icon={ShieldAlert} color="bg-red-50 text-red-600" trend={-5} />
                    <DashboardCard title={t('avg_triage_score')} value={Math.round(stats.avg_score || 0)} icon={Activity} color="bg-emerald-50 text-emerald-600" />
                    <DashboardCard title={t('avg_wait_time')} value={`14 ${t('mins')}`} icon={Clock} color="bg-amber-50 text-amber-600" />
                </div>

                {/* Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-900">{t('patient_traffic_24h')}</h3>
                            <select className="bg-slate-50 border-none rounded-xl text-xs font-black uppercase py-2 px-4 outline-none">
                                <option>{t('today')}</option>
                                <option>{t('yesterday')}</option>
                            </select>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={patientTraffic}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                                    <Area type="monotone" dataKey="red" stroke="#ef4444" strokeWidth={3} fillOpacity={0} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 group-hover:scale-125 transition-transform">
                                <HeartPulse size={120} />
                            </div>
                            <h4 className="text-lg font-bold mb-2">{t('hospital_capacity')}</h4>
                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-5xl font-black">84%</span>
                                <span className="text-blue-200 font-bold text-sm mb-1">{t('operational')}</span>
                            </div>
                            <div className="w-full bg-blue-500 h-3 rounded-full overflow-hidden mb-8">
                                <div className="bg-white h-full transition-all duration-1000" style={{ width: '84%' }}></div>
                            </div>
                            <PrimaryButton className="w-full bg-white text-blue-600 hover:bg-blue-50 shadow-none">{t('review_resources')}</PrimaryButton>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                            <h4 className="text-lg font-black mb-6">{t('staff_on_duty')}</h4>
                            <div className="space-y-4">
                                {[
                                    { name: 'Dr. Sarah Wilson', role: 'Cardiology', icon: Stethoscope },
                                    { name: 'Dr. Mike Chen', role: 'Emergency', icon: Stethoscope },
                                    { name: 'Nurse Jane Doe', role: 'Triage', icon: Activity }
                                ].map((staff, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 rounded-2xl transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <staff.icon size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{staff.name}</p>
                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{staff.role}</p>
                                            </div>
                                        </div>
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Patients Table */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('live_patient_registry')}</h3>
                        <div className="flex gap-2">
                            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-blue-600 transition-all"><Search size={18} /></button>
                            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-blue-600 transition-all"><Download size={18} /></button>
                        </div>
                    </div>

                    <ModernTable
                        headers={['ID', t('patient_name'), t('clinical_status'), t('priority'), t('assigned_doctor'), t('entry_time')]}
                        data={recentPatients}
                        renderRow={(p) => (
                            <>
                                <td className="px-6 py-5 font-black text-slate-400 text-xs">#VT-{p.id.toString().padStart(4, '0')}</td>
                                <td className="px-6 py-5 font-bold text-slate-800">{p.name}</td>
                                <td className="px-6 py-5"><StatusBadge status={p.risk_level || (p.triage_category === 'red' ? 'emergency' : p.triage_category === 'yellow' ? 'waiting' : 'discharged')} /></td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-100 h-2 rounded-full min-w-[60px] max-w-[100px] overflow-hidden">
                                            <div className={`h-full ${p.priority_score > 70 ? 'bg-red-500' : p.priority_score > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${p.priority_score}%` }}></div>
                                        </div>
                                        <span className="font-black text-slate-400 text-[10px]">{p.priority_score}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-bold text-slate-500 text-sm">{p.doctor || t('general_physician')}</td>
                                <td className="px-6 py-5 text-slate-400 font-medium text-xs font-mono">{new Date(p.created_at).toLocaleTimeString()}</td>
                            </>
                        )}
                    />
                </div>
            </div>
        </GlobalLayout>
    );
};

export default AdminDashboard;
