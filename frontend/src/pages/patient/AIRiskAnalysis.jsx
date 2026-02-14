import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Brain, ShieldAlert, Activity, TrendingUp,
    Zap, Info, CheckCircle2, AlertCircle,
    ChevronRight, ArrowUpRight
} from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AIRiskAnalysis = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [patientData, setPatientData] = useState(null);
    const [aiReport, setAiReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
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
                console.error(err);
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

    const riskScore = aiReport?.emergency_score || patientData?.priority_score || 0;
    const riskLevel = aiReport?.risk_level || patientData?.risk_level || 'LOW';

    return (
        <PatientLayout>
            <div className="space-y-10 animate-slide-up font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('ai_clinical_int')}</h1>
                        <p className="text-slate-500 font-medium pt-2">{t('advanced_predictive')}</p>
                    </div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-blue-100">
                        <Zap size={18} className="animate-pulse" /> {t('diag_engine_active')}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Risk Meter */}
                    <div className="lg:col-span-12 bg-white p-12 rounded-[70px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-20 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                            <Brain size={400} />
                        </div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black text-slate-900 leading-tight">{t('emergency_severity')}</h3>
                                    <p className="text-slate-400 font-bold max-w-md leading-relaxed">{t('risk_calc')}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('risk_profile')}</p>
                                        <div className="text-right">
                                            <p className={`text-5xl font-black leading-none ${riskScore > 75 ? 'text-red-600' : riskScore > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                {riskScore}<span className="text-lg opacity-30">/100</span>
                                            </p>
                                            <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mt-1">{t('severity_rank')}</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-50 h-8 rounded-full overflow-hidden border border-slate-100 shadow-inner flex p-1">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${riskScore > 75 ? 'bg-red-600' : riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                                                }`}
                                            style={{ width: `${riskScore}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                                        <span>{t('optimal')}</span>
                                        <span className="text-amber-500 font-black">{t('elevated')}</span>
                                        <span className="text-red-500 font-black">{t('clinical_alarm')}</span>
                                    </div>
                                </div>

                                <div className="flex gap-6 pt-4">
                                    <div className={`flex-1 p-8 rounded-[40px] border-2 shadow-sm ${riskLevel.toUpperCase() === 'CRITICAL' || riskLevel.toUpperCase() === 'EMERGENCY' ? 'bg-red-600 text-white border-red-600' :
                                        riskLevel.toUpperCase() === 'HIGH' ? 'bg-orange-500 text-white border-orange-500' :
                                            riskLevel.toUpperCase() === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        }`}>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${riskLevel.toUpperCase() === 'CRITICAL' ? 'opacity-70' : 'opacity-50'}`}>{t('triage_class')}</p>
                                        <p className="text-2xl font-black uppercase tracking-tight">{t(riskLevel.toLowerCase())}</p>
                                    </div>
                                    <div className="flex-1 p-8 rounded-[40px] bg-slate-900 text-white border-2 border-slate-900 shadow-xl">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">{t('priority_level')}</p>
                                        <p className="text-2xl font-black uppercase tracking-tight">{t(aiReport?.priority?.toLowerCase() || 'normal')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-600 rounded-[60px] p-12 text-white space-y-10 relative shadow-2xl overflow-hidden">
                                <div className="absolute bottom-0 right-0 p-10 opacity-10">
                                    <Activity size={120} />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-4 rounded-3xl"><Brain size={28} /></div>
                                    <h4 className="text-2xl font-black">{t('ai_insight')}</h4>
                                </div>

                                <p className="text-xl font-bold leading-relaxed opacity-90 italic">
                                    "{aiReport?.ai_summary || t('ai_analyzing')}"
                                </p>

                                <div className="space-y-6 pt-4">
                                    <div className="flex items-center gap-4 p-5 bg-white/10 rounded-[30px] border border-white/10">
                                        <div className="bg-emerald-400 p-2 rounded-xl text-white"><CheckCircle2 size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('status_routing')}</p>
                                            <p className="font-black text-white">{aiReport?.admission_needed ? t('admission_advised') : t('outpatient_treatment')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 bg-white/10 rounded-[30px] border border-white/10">
                                        <div className="bg-amber-400 p-2 rounded-xl text-white"><AlertCircle size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('icu_req')}</p>
                                            <p className="font-black text-white">{aiReport?.icu_needed ? t('icu_standby') : t('no_icu')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="lg:col-span-8 bg-white p-12 rounded-[60px] border border-slate-100 shadow-sm space-y-12">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-red-50 text-red-600 p-4 rounded-3xl border border-red-100"><ShieldAlert size={28} /></div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t('clinical_action')}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> {t('nurse_instructions')}
                                </h4>
                                <div className="space-y-4">
                                    {(aiReport?.nurse_actions || [t('monitor_vitals'), t('record_symptoms')]).map((action, i) => (
                                        <div key={i} className="flex gap-4 items-start group">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all font-black text-xs">{i + 1}</div>
                                            <p className="text-sm font-bold text-slate-600 pt-1 group-hover:text-slate-900 transition-all">{action}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> {t('recommended_tests')}
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {(aiReport?.recommended_tests || ["CBC", "General Checkup"]).map((test, i) => (
                                        <span key={i} className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-black text-slate-700 hover:bg-slate-100 transition-all cursor-default">
                                            {test}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-50">
                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-6">{t('possible_conditions')}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(aiReport?.possible_conditions || ["Stable"]).map((condition, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                        <p className="text-xs font-black text-slate-900">{condition}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Alerts & Forecast */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                                <ShieldAlert size={100} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">{t('physician_warning')}</p>
                            <h3 className="text-2xl font-black mb-6 leading-tight">{t('allocation_protocol')}</h3>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-[35px] space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">{t('target_dept')}</p>
                                    <p className="text-xl font-black text-white">{aiReport?.department || t('general')}</p>
                                </div>
                                <div className="h-px bg-white/10"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">{t('physician_warning')}</p>
                                    <p className="text-sm font-bold text-red-400 leading-relaxed italic">"{aiReport?.doctor_alert}"</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-600 p-10 rounded-[60px] text-white shadow-2xl shadow-emerald-100 flex flex-col justify-center space-y-6 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 p-6 opacity-20">
                                <TrendingUp size={80} />
                            </div>
                            <h3 className="text-3xl font-black leading-tight">{t('prognosis_forecast')}</h3>
                            <p className="text-emerald-100 font-medium opacity-80 leading-relaxed">
                                {t('prognosis_forecast_detail', { action: (aiReport?.nurse_actions?.[0] || 'treatment').toLowerCase() })}
                            </p>
                            <button className="w-fit bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                                {t('view_full_data')} <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default AIRiskAnalysis;
