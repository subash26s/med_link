import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Activity, Heart, Thermometer, Droplets,
    ArrowRight, ShieldCheck, Stethoscope,
    Calendar, Brain, ShieldAlert, ChevronRight,
    TrendingUp, AlertTriangle, User, Info,
    Bell, CheckCircle, Pill
} from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const PatientDashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [patientData, setPatientData] = useState(null);
    const [aiReport, setAiReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                // In demo, we fetch all patients and find the one matching the current user's name
                // or just take the first one if it's a generic patient login
                const res = await axios.get('/patients/queue');
                const p = res.data.find(p => p.name === user?.username) || res.data[0];

                if (p) {
                    const detailRes = await axios.get(`/patients/${p.id}`);
                    const data = detailRes.data;
                    setPatientData(data);
                    if (data.ai_analysis_json) {
                        try {
                            setAiReport(JSON.parse(data.ai_analysis_json));
                        } catch (e) {
                            console.error("Failed to parse AI report", e);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching patient data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [user]);

    if (loading) return (
        <PatientLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        </PatientLayout>
    );

    const latestVitals = patientData?.vitals?.[0] || {};
    const riskLevel = aiReport?.risk_level || patientData?.risk_level || 'Low';

    const vitalsCards = [
        { label: t('blood_pressure'), value: latestVitals.bp_systolic ? `${latestVitals.bp_systolic}/${latestVitals.bp_diastolic}` : '120/80', unit: 'mmHg', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: t('heart_rate'), value: latestVitals.heart_rate || '72', unit: 'BPM', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
        { label: t('oxygen'), value: latestVitals.spo2 || '98', unit: '%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: t('temperature'), value: latestVitals.temperature || '36.8', unit: '°C', icon: Thermometer, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <PatientLayout>
            <div className="space-y-8 animate-slide-up font-sans">
                {/* AI Insights Bar */}
                {aiReport && (
                    <div className="bg-slate-900 text-white p-6 rounded-[35px] flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Brain size={120} />
                        </div>
                        <div className="bg-blue-600/20 p-4 rounded-2xl text-blue-400 shrink-0 border border-blue-600/30">
                            <Brain size={24} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{t('medicare_ai')} Assistant</p>
                            <p className="text-sm font-bold opacity-90 leading-relaxed italic md:max-w-3xl">
                                "{aiReport.ai_summary}"
                            </p>
                        </div>
                        <Link to="/patient/portal/ai-risk" className="relative z-10 ml-auto bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all whitespace-nowrap">
                            {t('view_full_data')}
                        </Link>
                    </div>
                )}

                {/* Top Welcome Card */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('welcome_hospital')}, {user?.username}</h1>
                        <p className="text-slate-500 font-medium mt-1">Hospital ID: #VT-{patientData?.id?.toString().padStart(4, '0') || '0021'}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-right px-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('token')}</p>
                            <p className="text-lg font-black text-blue-600">#{patientData?.id || '21'}</p>
                        </div>
                        <div className="h-10 w-px bg-slate-100"></div>
                        <div className="px-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('next')} Checkup</p>
                            <p className="text-sm font-bold text-slate-900">26 Feb 2026</p>
                        </div>
                    </div>
                </div>

                {/* Health Summary Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Hero Stats Card */}
                    <div className="lg:col-span-8 bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] -mr-10 -mt-10">
                            <Activity size={300} strokeWidth={1} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('todayHealth') || t('vitals')}</h3>
                                    <p className="text-slate-400 text-sm font-bold">{t('risk_calc')}</p>
                                </div>
                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${riskLevel.toLowerCase() === 'critical' || riskLevel.toLowerCase() === 'emergency' ? 'bg-red-600 text-white shadow-red-100' :
                                    riskLevel.toLowerCase() === 'high' ? 'bg-orange-500 text-white shadow-orange-100' :
                                        riskLevel.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            'bg-emerald-600 text-white shadow-emerald-100'
                                    }`}>
                                    {t('risk_level')}: {t(riskLevel.toLowerCase()) || riskLevel}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {vitalsCards.map((stat, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <Stethoscope size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('assigned_consultant')}</p>
                                        <p className="text-lg font-black text-slate-900">{patientData?.doctor || 'Dr. Arjun Mehta'}</p>
                                        <p className="text-sm font-bold text-blue-600 uppercase tracking-tight">{t(patientData?.department?.toLowerCase()) || patientData?.department || 'General Medicine'}</p>
                                    </div>
                                </div>
                                <Link to="/patient/portal/health" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2">
                                    {t('history')} <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-blue-600 rounded-[40px] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform">
                                <ShieldCheck size={100} />
                            </div>
                            <h4 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
                                <ShieldCheck size={20} /> {t('protected_ai')}
                            </h4>
                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest mb-1">{t('clinical_status')}</p>
                                    <p className="font-black">{aiReport?.admission_needed ? t('admission_advised') : t('outpatient_treatment')}</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest mb-1">{t('ai_insight')}</p>
                                    <p className="font-bold text-sm italic">"{aiReport?.doctor_alert || t('optimal')}"</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                            <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Calendar size={20} className="text-blue-600" /> {t('appointments')}
                            </h4>
                            <div className="flex gap-4 items-center mb-8">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                                    <span className="text-[10px] font-black text-blue-600 uppercase">Feb</span>
                                    <span className="text-2xl font-black text-slate-900">26</span>
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">{t('follow_up')}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t(aiReport?.department?.toLowerCase()) || t('general')}</p>
                                </div>
                            </div>
                            <button className="w-full py-4 rounded-2xl border-2 border-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                                {t('reports')}
                            </button>
                        </div>

                        {/* Medication Reminders Card */}
                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                            <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Pill size={20} className="text-emerald-600" /> {t('medication') || "Medication"}
                            </h4>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter medication name..."
                                    className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-emerald-100"
                                    id="medicationInput"
                                />
                                <button
                                    onClick={async () => {
                                        const input = document.getElementById('medicationInput');
                                        if (!input.value) return alert("Please enter medication name");
                                        try {
                                            const res = await axios.post('/api/sms/medications/reminder', {
                                                patient_id: patientData?.id || 'P001',
                                                phone: '+919360733882',
                                                medication_name: input.value,
                                                dosage: '1 tab',
                                                times: ["09:00", "20:00"],
                                                start_date: new Date().toISOString()
                                            });
                                            if (res.data.success) {
                                                alert(`✅ Reminders Scheduled!\n${res.data.count} SMS logs created in Demo Mode.`);
                                                input.value = "";
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Failed to schedule reminders");
                                        }
                                    }}
                                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                                >
                                    Set Daily Reminder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Risk & Vitals Detail Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12">
                        <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-blue-600 p-2 rounded-xl text-white"><ShieldAlert size={20} /></div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('ai_clinical_markers')} & {t('symptoms')}</h3>
                                    </div>
                                    <p className="text-slate-400 font-bold text-sm">{t('risk_calc')}</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('diabetes')}: {patientData?.medical_history?.includes('diabetes') ? 'YES' : 'NO'}</span>
                                    <span className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('hypertension')}: {patientData?.medical_history?.includes('hypertension') ? 'YES' : 'NO'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {[
                                    { label: t('chest_pain'), key: 'chest_pain', icon: AlertTriangle, status: patientData?.symptoms?.includes('chest pain') },
                                    { label: t('fever'), key: 'fever', icon: Thermometer, status: patientData?.symptoms?.includes('fever') },
                                    { label: t('cough'), key: 'cough', icon: Activity, status: patientData?.symptoms?.includes('cough') },
                                    { label: t('breathing_difficulty'), key: 'breathing', icon: Activity, status: patientData?.symptoms?.includes('breathing') },
                                    { label: t('dizziness'), key: 'dizziness', icon: Activity, status: patientData?.symptoms?.includes('dizziness') },
                                    { label: t('headache'), key: 'headache', icon: Info, status: patientData?.symptoms?.includes('headache') },
                                ].map((marker, i) => (
                                    <div key={i} className={`p-6 rounded-[35px] border-2 transition-all flex flex-col items-center gap-3 text-center ${marker.status ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-50 text-slate-300'
                                        }`}>
                                        <marker.icon size={28} className={marker.status ? 'animate-pulse' : 'opacity-20'} />
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{marker.label}</p>
                                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${marker.status ? 'text-red-400' : 'text-slate-200'}`}>
                                            {marker.status ? t('completed') : t('optimal')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-slate-50 rounded-[40px] border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('history')}</p>
                                    <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                                        "Patient history of {patientData?.medical_history || 'none'}. Current presentation shows {patientData?.symptoms || 'active health maintenance'}."
                                    </p>
                                </div>
                                <div className="md:border-x border-slate-200 px-8">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('recommendation')}</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> {t('monitor_vitals')}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> {t('record_symptoms')}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('operational_stats')}</p>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div className="bg-blue-600 h-full w-[85%]"></div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-900">85% {t('completed')}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div className="bg-blue-600 h-full w-[92%]"></div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-900">92% {t('optimal')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientDashboard;
