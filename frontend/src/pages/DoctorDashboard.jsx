import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Stethoscope, Activity, Clock, User,
    CheckCircle, History, MessageSquare,
    Plus, Search, ShieldAlert, Heart,
    Thermometer, Droplets, Info, ChevronRight,
    Send, Loader2, AlertCircle, Filter
} from 'lucide-react';
import GlobalLayout from '../layouts/GlobalLayout';
import { StatusBadge, ModernTable, PrimaryButton } from '../components/common/UIComponents';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [queue, setQueue] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientDetails, setPatientDetails] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await axios.get('/patients/queue');
            // Filter only waiting/with_nurse for the doctor
            setQueue(res.data.filter(p => ['waiting', 'with_nurse', 'with_doctor'].includes(p.status)));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePatientSelect = async (patient) => {
        setSelectedPatient(patient);
        try {
            const res = await axios.get(`/patients/${patient.id}`);
            setPatientDetails(res.data);
            // Update status to with_doctor when selection is made
            await axios.put(`/patients/${patient.id}/status`, { status: 'with_doctor' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim() || !selectedPatient) return;
        setIsSubmitting(true);
        try {
            await axios.post(`/patients/${selectedPatient.id}/notes`, {
                note_text: newNote,
                doctor_name: user?.username || 'Attending Physician'
            });
            setNewNote('');
            // Refresh details to show new note
            const res = await axios.get(`/patients/${selectedPatient.id}`);
            setPatientDetails(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDischarge = async () => {
        if (!selectedPatient) return;
        try {
            await axios.put(`/patients/${selectedPatient.id}/status`, { status: 'discharged' });
            setSelectedPatient(null);
            setPatientDetails(null);
            fetchQueue();
            alert("Patient marked as treated and discharged.");
        } catch (error) {
            console.error(error);
        }
    };

    const VitalBox = ({ label, value, unit, icon: Icon, color }) => (
        <div className="bg-slate-50 p-6 rounded-[30px] border border-slate-100 flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${color || 'bg-blue-100 text-blue-600'}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t(label.toLowerCase().replace(' ', '_')) || label}</p>
                <p className="text-2xl font-black text-slate-900">{value} <span className="text-sm font-medium text-slate-400">{unit}</span></p>
            </div>
        </div>
    );

    return (
        <GlobalLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
                {/* Left Side: Priority Queue */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('priority_queue')}</h1>
                            <p className="text-slate-500 font-medium">{t('severity_sorted')}</p>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-100 text-blue-600">
                            <Filter size={18} />
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div> : (
                            queue.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => handlePatientSelect(p)}
                                    className={`p-6 rounded-[40px] border-2 transition-all cursor-pointer group flex items-center gap-6 ${selectedPatient?.id === p.id
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-200'
                                        : 'bg-white border-slate-50 hover:border-blue-200'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-xl ${selectedPatient?.id === p.id ? 'bg-white/20' : 'bg-slate-50 text-slate-400'}`}>
                                            {p.name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        {p.triage_category === 'red' && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-4 border-white animate-pulse"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`font-black truncate ${selectedPatient?.id === p.id ? 'text-white' : 'text-slate-900'}`}>{p.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${p.triage_category === 'red' ? 'bg-red-500/20 text-red-200' : 'bg-slate-100 text-slate-400'}`}>
                                                {p.priority_score}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-60">
                                            <span>#VT-{p.id.toString().padStart(4, '0')}</span>
                                            <span>{p.age} {t('yrs')}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className={selectedPatient?.id === p.id ? 'text-white' : 'text-slate-300'} />
                                </div>
                            ))
                        )}
                        {queue.length === 0 && !loading && (
                            <div className="p-12 text-center bg-white rounded-[40px] border border-dashed border-slate-100">
                                <CheckCircle size={40} className="mx-auto text-emerald-400 mb-4" />
                                <h3 className="text-xl font-black text-slate-900">{t('queue_clear')}</h3>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Clinical Panel */}
                <div className="lg:col-span-12 xl:col-span-8">
                    {patientDetails ? (
                        <div className="space-y-8 animate-slide-up">
                            {/* Patient Header */}
                            <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><Stethoscope size={180} /></div>
                                <div className="flex items-center gap-8 relative z-10">
                                    <div className="w-24 h-24 rounded-[35px] bg-blue-50 flex items-center justify-center text-blue-600 font-black text-4xl shadow-inner border border-blue-100">
                                        {patientDetails.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{patientDetails.name}</h2>
                                            <StatusBadge status={patientDetails.triage_category === 'red' ? 'emergency' : 'waiting'} label={t(patientDetails.triage_category === 'red' ? 'emergency' : 'waiting')} />
                                        </div>
                                        <div className="flex gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><User size={16} className="text-blue-500" /> {patientDetails.age} Yrs • {patientDetails.gender}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={16} className="text-blue-500" /> {t('seen_at')} {new Date(patientDetails.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 w-full md:w-auto relative z-10">
                                    <PrimaryButton icon={CheckCircle} onClick={handleDischarge}>{t('complete_treatment')}</PrimaryButton>
                                    <button className="text-slate-400 font-bold hover:text-blue-600 transition-colors flex items-center justify-center gap-2 text-sm px-4">
                                        <History size={16} /> {t('view_lab_reports')}
                                    </button>
                                </div>
                            </div>

                            {/* Vitals & Clinical Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <VitalBox label="Temperature" value={patientDetails.vitals?.[0]?.temperature || '--'} unit="°C" icon={Thermometer} color="bg-red-50 text-red-600" />
                                <VitalBox label="Heart Rate" value={patientDetails.vitals?.[0]?.heart_rate || '--'} unit="BPM" icon={Heart} color="bg-emerald-50 text-emerald-600" />
                                <VitalBox label="Blood Pressure" value={patientDetails.vitals?.[0] ? `${patientDetails.vitals[0].bp_systolic}/${patientDetails.vitals[0].bp_diastolic}` : '--'} unit="mmHg" icon={Droplets} color="bg-amber-50 text-amber-600" />
                                <VitalBox label="Oxygen" value={patientDetails.vitals?.[0]?.spo2 || '--'} unit="%" icon={Activity} color="bg-blue-50 text-blue-600" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Observations & Symptoms */}
                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="bg-slate-100 p-2 rounded-xl text-slate-500"><Info size={20} /></div>
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('patient_complaint')}</h3>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 italic font-medium text-slate-700 leading-relaxed relative">
                                            <span className="absolute -top-3 left-6 text-4xl text-blue-200 font-serif">"</span>
                                            {patientDetails.symptoms || patientDetails.transcribed_text || t('no_complaint')}
                                            <span className="absolute -bottom-10 right-6 text-4xl text-blue-200 font-serif">"</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-6 pt-4">
                                            <div className="bg-red-50 p-2 rounded-xl text-red-600"><AlertCircle size={20} /></div>
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('ai_clinical_markers')}</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase tracking-widest">
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                                <span>{t('respiratory_risk')}</span>
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                                <span>{t('cardiac_stability')}</span>
                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Clinical Notes & Interactions */}
                                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-[600px] overflow-hidden">
                                    <div className="p-8 pb-4 border-b border-slate-50 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><MessageSquare size={20} /></div>
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('diagnosis_notes')}</h3>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{patientDetails.notes?.length || 0} {t('entries')}</span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                                        {patientDetails.notes?.map((note, i) => (
                                            <div key={i} className={`flex flex-col ${note.doctor_name === user?.username ? 'items-end' : 'items-start'}`}>
                                                <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed ${note.doctor_name === user?.username
                                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                                    : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                                                    }`}>
                                                    {note.note_text}
                                                </div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 px-2">
                                                    {note.doctor_name} • {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        ))}
                                        {(!patientDetails.notes || patientDetails.notes.length === 0) && (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                                <MessageSquare size={48} className="mb-4" />
                                                <p className="font-bold">{t('no_notes')}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 pt-4">
                                        <form onSubmit={handleAddNote} className="relative group">
                                            <textarea
                                                value={newNote}
                                                onChange={e => setNewNote(e.target.value)}
                                                placeholder={t('add_observation')}
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[25px] p-6 pr-20 text-sm font-medium outline-none transition-all min-h-[120px] resize-none"
                                            />
                                            <button
                                                disabled={!newNote.trim() || isSubmitting}
                                                className="absolute bottom-6 right-6 p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                                            >
                                                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50/50 p-20 rounded-[80px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center min-h-[800px]">
                            <div className="bg-white p-12 rounded-[50px] shadow-2xl shadow-slate-200/50 mb-10 border border-slate-50">
                                <Stethoscope size={80} className="text-slate-200" strokeWidth={1} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('workspace_title')}</h2>
                            <p className="text-slate-400 font-medium max-w-sm mt-4 text-lg">{t('workspace_subtitle')}</p>
                        </div>
                    )}
                </div>
            </div>
        </GlobalLayout>
    );
};

export default DoctorDashboard;
