import React, { useState } from 'react';
import {
    AlertCircle, Phone, MapPin,
    Share2, Activity, ShieldAlert,
    ChevronRight, Loader2, Zap,
    Truck, UserPlus, Heart
} from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';

const EmergencyPage = () => {
    const [isTriggered, setIsTriggered] = useState(false);

    const handleTrigger = () => {
        setIsTriggered(true);
    };

    return (
        <PatientLayout>
            <div className="min-h-[80vh] py-12 animate-slide-up">
                {!isTriggered ? (
                    <div className="max-w-6xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <div className="bg-red-50 text-red-600 w-fit mx-auto px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-red-100 mb-4 cursor-default">
                                <Zap size={14} className="animate-pulse" /> Critical Response Unit
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">Emergency Assistance</h1>
                            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">One-tap access to life-saving medical services. Use only in actual emergencies.</p>
                        </div>

                        {/* GRID OF ACTIONS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: 'Call Nurse', desc: 'Alert your assigned caretaker immediately', icon: UserPlus, color: 'bg-blue-600', shadow: 'shadow-blue-200' },
                                { title: 'Call Ambulance', desc: 'Dispatch nearest medical vehicle', icon: Truck, color: 'bg-red-600', shadow: 'shadow-red-200' },
                                { title: 'Broadcast SOS', desc: 'Alert hospital and emergency contacts', icon: ShieldAlert, color: 'bg-slate-900', shadow: 'shadow-slate-200' },
                                { title: 'Triage Mode', desc: 'Start quick AI diagnostic flow', icon: Heart, color: 'bg-indigo-600', shadow: 'shadow-indigo-200' }
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={handleTrigger}
                                    className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center text-center group"
                                >
                                    <div className={`w-20 h-20 ${action.color} text-white rounded-[30px] flex items-center justify-center mb-6 shadow-2xl ${action.shadow} group-hover:scale-110 transition-transform duration-500`}>
                                        <action.icon size={36} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">{action.title}</h3>
                                    <p className="text-sm font-medium text-slate-400">{action.desc}</p>
                                </button>
                            ))}
                        </div>

                        {/* MAP PLACEHOLDER */}
                        <div className="bg-white rounded-[60px] border border-slate-100 shadow-xl overflow-hidden relative min-h-[400px]">
                            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                                <MapPin size={100} className="text-blue-100 animate-bounce" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent"></div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900">Nearest MediCare Hubs</h3>
                                    <p className="text-slate-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Tracking your location...
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-white/90 backdrop-blur p-6 rounded-[35px] border border-slate-100 shadow-lg min-w-[240px]">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">City General Branch</p>
                                        <p className="font-black text-slate-900">1.2 KM Away</p>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight mt-2 flex items-center gap-1 cursor-pointer hover:underline">
                                            Navigate Now <ChevronRight size={10} />
                                        </p>
                                    </div>
                                    <div className="bg-white/90 backdrop-blur p-6 rounded-[35px] border border-slate-100 shadow-lg min-w-[240px]">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sunrise Trauma Center</p>
                                        <p className="font-black text-slate-900">3.8 KM Away</p>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight mt-2 flex items-center gap-1 cursor-pointer hover:underline">
                                            Navigate Now <ChevronRight size={10} />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto bg-slate-900 text-white p-14 rounded-[60px] shadow-2xl relative overflow-hidden text-center">
                        <div className="absolute inset-0 bg-red-600/10 animate-pulse"></div>
                        <div className="relative z-10 space-y-12">
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center animate-ping absolute opacity-30"></div>
                                <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center relative shadow-[0_0_80px_rgba(220,38,38,0.5)]">
                                    <Loader2 size={50} className="animate-spin" />
                                </div>
                                <h2 className="text-4xl font-black tracking-tight">SOS Request Dispatched</h2>
                                <p className="text-blue-100 font-medium max-w-sm mx-auto">Hospital protocols have been activated. Emergency responders are being briefed on your clinical profile.</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { step: 'MediCare Hub Tracking Location', done: true },
                                    { step: 'Caretaker Priority Alert Sent', done: true },
                                    { step: 'Syncing Life-critical Vitals Data', done: false },
                                    { step: 'Ambulance Unit Dispatching', done: false }
                                ].map((step, i) => (
                                    <div key={i} className={`flex items-center gap-4 p-5 rounded-3xl border transition-all ${step.done ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 opacity-30'}`}>
                                        <div className={`p-2 rounded-xl ${step.done ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'}`}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span className="font-black text-sm uppercase tracking-widest">{step.step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PatientLayout>
    );
};

export default EmergencyPage;
