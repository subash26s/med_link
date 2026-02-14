import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Thermometer, Heart, Clock, User, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';

const NurseDashboard = () => {
    const [queue, setQueue] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [vitals, setVitals] = useState({
        bp_systolic: '',
        bp_diastolic: '',
        temperature: '',
        heart_rate: '',
        spo2: ''
    });
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchQueue = async () => {
        try {
            const res = await axios.get('/patients/queue');
            setQueue(res.data.filter(p => p.status === 'waiting' || p.status === 'with_nurse'));
        } catch (error) {
            console.error("Error fetching queue", error);
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSelect = (patient) => {
        setSelectedPatient(patient);
        setVitals({ bp_systolic: '', bp_diastolic: '', temperature: '', heart_rate: '', spo2: '' });
    };

    const handleSubmitVitals = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return;

        try {
            const res = await axios.post(`/patients/${selectedPatient.id}/vitals`, vitals);
            setAnalysisResult(res.data.analysis);
            setShowModal(true);
            setSelectedPatient(null);
            fetchQueue();
        } catch (error) {
            console.error("Error updating vitals", error);
            alert('Failed to update vitals');
        }
    };

    return (
        <Layout>
            <div className="grid grid-cols-12 gap-8 h-[calc(100vh-100px)]">
                {/* Left Column: Patient List (4 cols) */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h2 className="font-bold text-gray-700">Waiting Room</h2>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{queue.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                        {queue.map(patient => (
                            <div
                                key={patient.id}
                                onClick={() => handleSelect(patient)}
                                className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900">{patient.name}</h3>
                                    <span className="text-xs font-mono text-gray-400">#{patient.id}</span>
                                </div>
                                <div className="text-xs text-gray-500 mb-2 truncate">{patient.symptoms}</div>
                                <div className="flex items-center text-xs text-gray-400 gap-2">
                                    <Clock size={12} />
                                    <span>{new Date(patient.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        ))}
                        {queue.length === 0 && (
                            <div className="p-8 text-center text-gray-400 italic">
                                No patients in waiting list
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Vitals Form (8 cols) */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9">
                    {selectedPatient ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="border-b pb-6 mb-8 flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedPatient.name}</h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><User size={16} /> {selectedPatient.age} yrs, {selectedPatient.gender}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>ID: #{selectedPatient.id}</span>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-sm ${selectedPatient.triage_category === 'red' ? 'bg-red-100 text-red-700' :
                                    selectedPatient.triage_category === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {selectedPatient.triage_category} Level
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Patient Complaint</h3>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 italic leading-relaxed">
                                        "{selectedPatient.transcribed_text || selectedPatient.symptoms}"
                                    </div>
                                </div>

                                <form onSubmit={handleSubmitVitals} className="space-y-6">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Activity size={18} className="text-blue-500" /> Vitals Entry
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Temperature (°C)</label>
                                            <div className="relative">
                                                <input required type="number" step="0.1" className="w-full p-3 pl-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-mono" placeholder="36.5"
                                                    value={vitals.temperature} onChange={e => setVitals({ ...vitals, temperature: e.target.value })} />
                                                <Thermometer className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heart Rate (BPM)</label>
                                            <div className="relative">
                                                <input required type="number" className="w-full p-3 pl-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-mono" placeholder="72"
                                                    value={vitals.heart_rate} onChange={e => setVitals({ ...vitals, heart_rate: e.target.value })} />
                                                <Heart className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Blood Pressure (Systolic / Diastolic)</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input required type="number" className="w-full p-3 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-mono text-center" placeholder="120"
                                                    value={vitals.bp_systolic} onChange={e => setVitals({ ...vitals, bp_systolic: e.target.value })} />
                                                <input required type="number" className="w-full p-3 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-mono text-center" placeholder="80"
                                                    value={vitals.bp_diastolic} onChange={e => setVitals({ ...vitals, bp_diastolic: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SpO2 (%)</label>
                                            <input required type="number" className="w-full p-3 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-mono" placeholder="98"
                                                value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-end gap-3">
                                        <button type="button" onClick={() => setSelectedPatient(null)} className="px-5 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 font-medium transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                                            <CheckCircle size={18} /> Submit Vitals
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                            <Activity size={48} className="mb-4 opacity-20" />
                            <h3 className="text-lg font-medium text-gray-500">No Patient Selected</h3>
                            <p className="text-sm">Select a patient from the waiting room to begin triage.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Result Modal */}
            {showModal && analysisResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className={`p-8 text-center ${analysisResult.risk_level === 'EMERGENCY' ? 'bg-red-600' :
                                analysisResult.risk_level === 'HIGH' ? 'bg-orange-500' :
                                    analysisResult.risk_level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-600'
                            } text-white`}>
                            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Activity size={40} />
                            </div>
                            <h2 className="text-3xl font-black mb-1">AI Triage Result</h2>
                            <p className="opacity-90 font-medium">Risk Level: {analysisResult.risk_level}</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Score</p>
                                    <p className="text-2xl font-black text-gray-900">{analysisResult.priority_score}/100</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Assigned</p>
                                    <p className="text-lg font-bold text-gray-900 leading-tight">{analysisResult.doctor_assigned}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">AI Recommendations</h3>
                                <ul className="space-y-2">
                                    {analysisResult.recommendations.map((rec, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-600">
                                            <span className="text-blue-500 font-bold">•</span>
                                            {rec}
                                        </li>
                                    ))}
                                    {analysisResult.recommendations.length === 0 && (
                                        <li className="text-sm text-gray-400 italic">No critical issues detected. Regular observation recommended.</li>
                                    )}
                                </ul>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                            >
                                Acknowledge & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default NurseDashboard;
