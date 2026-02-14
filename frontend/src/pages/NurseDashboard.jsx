import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Activity, Thermometer, Heart, Clock, User,
    CheckCircle, ArrowRight, ShieldAlert, HeartPulse,
    Droplets, FileText, Search, Loader2
} from 'lucide-react';
import GlobalLayout from '../layouts/GlobalLayout';
import { StatusBadge, ModernTable, PrimaryButton } from '../components/common/UIComponents';
import { useLanguage } from '../contexts/LanguageContext';

const NurseDashboard = () => {
    const { t } = useLanguage();
    const [queue, setQueue] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [vitals, setVitals] = useState({
        bp_systolic: '',
        bp_diastolic: '',
        temperature: '',
        heart_rate: '',
        spo2: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await axios.get('/patients/queue');
            setQueue(res.data.filter(p => p.status === 'waiting' || p.status === 'with_nurse'));
        } catch (error) {
            console.error("Queue fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePatientSelect = async (patient) => {
        setSelectedPatient(patient);
        setVitals({
            bp_systolic: '',
            bp_diastolic: '',
            temperature: '',
            heart_rate: '',
            spo2: ''
        });
    };

    const handleSubmitVitals = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return;
        setIsSubmitting(true);
        try {
            await axios.post(`/patients/${selectedPatient.id}/vitals`, vitals);
            await fetchQueue();
            setSelectedPatient(null);
            alert("Vitals submitted and AI triage updated.");
        } catch (error) {
            console.error("Submit vitals error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GlobalLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
                {/* Left Side: Queue */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('triage_queue')}</h1>
                            <p className="text-slate-500 font-medium">{t('capture_vitals_subtitle')}</p>
                        </div>
                        <div className="bg-white p-2 rounded-2xl border border-slate-100 flex gap-1">
                            <button className="px-5 py-2 rounded-xl text-sm font-black bg-blue-600 text-white shadow-lg shadow-blue-100">{t('pending')}</button>
                            <button className="px-5 py-2 rounded-xl text-sm font-black text-slate-400 hover:bg-slate-50">{t('completed')}</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div> : (
                            queue.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => handlePatientSelect(p)}
                                    className={`p-6 rounded-[35px] border-2 transition-all cursor-pointer group flex flex-col md:flex-row items-center gap-8 ${selectedPatient?.id === p.id
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-200'
                                        : 'bg-white border-slate-50 hover:border-blue-200 hover:shadow-xl'
                                        }`}
                                >
                                    <div className="flex-1 flex items-center gap-6">
                                        <div className={`p-4 rounded-3xl ${selectedPatient?.id === p.id ? 'bg-white/20' : 'bg-slate-50'}`}>
                                            <User size={30} className={selectedPatient?.id === p.id ? 'text-white' : 'text-slate-400'} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className={`text-xl font-black ${selectedPatient?.id === p.id ? 'text-white' : 'text-slate-900'}`}>{p.name}</h3>
                                                <StatusBadge status={p.triage_category === 'red' ? 'emergency' : p.triage_category === 'yellow' ? 'waiting' : 'discharged'} label={t(p.triage_category === 'red' ? 'emergency' : p.triage_category === 'yellow' ? 'waiting' : 'discharged')} />
                                            </div>
                                            <div className="flex items-center gap-4 text-sm font-bold opacity-70">
                                                <span>{p.age} Yrs • {p.gender}</span>
                                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 max-w-sm">
                                        <div className={`p-4 rounded-2xl ${selectedPatient?.id === p.id ? 'bg-white/10' : 'bg-slate-50'} text-xs overflow-hidden`}>
                                            <p className="uppercase font-black tracking-widest opacity-40 mb-1 italic">{t('symptom_summary')}</p>
                                            <p className="line-clamp-2 font-medium italic">"{p.symptoms || p.transcribed_text || 'No description provided'}"</p>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-3xl ${selectedPatient?.id === p.id ? 'bg-white/20' : 'bg-blue-50'} group-hover:bg-blue-600 group-hover:text-white transition-all`}>
                                        <ArrowRight size={24} />
                                    </div>
                                </div>
                            ))
                        )}
                        {queue.length === 0 && !loading && (
                            <div className="p-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                                <CheckCircle size={60} className="mx-auto text-emerald-400 mb-6" />
                                <h3 className="text-2xl font-black text-slate-900">{t('queue_empty')}</h3>
                                <p className="text-slate-500">{t('all_triaged')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Vitals Form */}
                <div className="lg:col-span-12 xl:col-span-4 sticky top-24">
                    {selectedPatient ? (
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl animate-slide-up">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                                    <HeartPulse size={24} />
                                </div>
                                <div className="">
                                    <h3 className="text-xl font-black text-slate-900">{t('clinical_intake')}</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('selected_patient')} {selectedPatient.name}</p>
                                </div>
                            </div>

                            {/* Patient Info Summary */}
                            <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                                    <span>{t('risk_assessment')}</span>
                                    <StatusBadge status={selectedPatient.risk_level || (selectedPatient.triage_category === 'red' ? 'EMERGENCY' : 'LOW')} label={t((selectedPatient.risk_level || (selectedPatient.triage_category === 'red' ? 'EMERGENCY' : 'LOW')).toLowerCase())} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('primary_symptoms')}</p>
                                    <p className="text-sm font-bold text-slate-700 italic">"{selectedPatient.symptoms || selectedPatient.transcribed_text}"</p>
                                </div>
                                <div className="pt-2 border-t border-slate-200/50 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('assigned_doctor')}</p>
                                        <p className="text-sm font-black text-blue-600">{selectedPatient.doctor || t('awaiting_triage')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('department')}</p>
                                        <p className="text-sm font-black text-slate-700">{selectedPatient.department || 'General'}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitVitals} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-1"><Droplets size={12} /> {t('blood_pressure_sys_dia')}</label>
                                        <div className="flex items-center gap-2">
                                            <input required placeholder="120" type="number" value={vitals.bp_systolic} onChange={e => setVitals({ ...vitals, bp_systolic: e.target.value })} className="flex-1 bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 transition-all outline-none font-black text-xl text-center" />
                                            <span className="text-2xl text-slate-300">/</span>
                                            <input required placeholder="80" type="number" value={vitals.bp_diastolic} onChange={e => setVitals({ ...vitals, bp_diastolic: e.target.value })} className="flex-1 bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 transition-all outline-none font-black text-xl text-center" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-1"><Thermometer size={12} /> {t('temperature')} (°C)</label>
                                        <input required placeholder="36.5" type="number" step="0.1" value={vitals.temperature} onChange={e => setVitals({ ...vitals, temperature: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 transition-all outline-none font-black text-xl text-center" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-1"><Heart size={12} /> {t('heart_rate')} (BPM)</label>
                                        <input required placeholder="72" type="number" value={vitals.heart_rate} onChange={e => setVitals({ ...vitals, heart_rate: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 transition-all outline-none font-black text-xl text-center" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-1"><Activity size={12} /> {t('oxygen')} (%)</label>
                                        <div className="relative">
                                            <input required placeholder="98" type="number" value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 transition-all outline-none font-black text-3xl text-center text-blue-600" />
                                            <div className="absolute inset-0 pointer-events-none border-4 border-blue-500/10 rounded-2xl"></div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-5 rounded-[25px] font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (
                                        <>
                                            <CheckCircle size={24} />
                                            <span>{t('run_analysis')}</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedPatient(null)}
                                    className="w-full text-slate-400 font-bold hover:text-slate-600 transition-colors"
                                >
                                    {t('cancel_select_another')}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-slate-100/50 p-12 rounded-[40px] border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center min-h-[500px]">
                            <div className="bg-white p-6 rounded-full text-slate-300 mb-6 border border-slate-100 shadow-xl shadow-slate-100">
                                <Search size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-400">{t('no_patient_selected')}</h3>
                            <p className="text-slate-400 text-sm font-medium mt-2 max-w-[200px]">{t('no_patient_subtitle')}</p>
                        </div>
                    )}

                    <div className="mt-8 bg-amber-50 rounded-[40px] p-8 border border-amber-100">
                        <div className="flex items-start gap-4 text-amber-600">
                            <ShieldAlert className="shrink-0" size={24} />
                            <div>
                                <p className="font-black text-lg">{t('priority_alert_title')}</p>
                                <p className="text-sm font-medium opacity-80 leading-relaxed italic">{t('priority_alert_detail')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default NurseDashboard;
