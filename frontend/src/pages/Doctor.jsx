import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Activity, AlertCircle, CheckCircle, Search, Filter } from 'lucide-react';
import Layout from '../components/Layout';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [queue, setQueue] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [patientDetails, setPatientDetails] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all', 'red', 'yellow', 'green'

    const fetchQueue = async () => {
        try {
            const res = await axios.get('/patients/queue');
            setQueue(res.data);
        } catch (error) {
            console.error("Error fetching queue", error);
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedPatientId) {
            fetchPatientDetails(selectedPatientId);
        } else {
            setPatientDetails(null);
        }
    }, [selectedPatientId]);

    const fetchPatientDetails = async (id) => {
        setLoadingDetails(true);
        try {
            const res = await axios.get(`/patients/${id}`);
            setPatientDetails(res.data);
        } catch (error) {
            console.error("Error fetching details", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/patients/${selectedPatientId}/notes`, {
                note_text: noteText,
                doctor_name: user?.username || 'Doctor'
            });
            setNoteText('');
            fetchPatientDetails(selectedPatientId);
        } catch (error) {
            console.error("Error adding note", error);
            alert("Failed to add note");
        }
    };

    const handleComplete = async () => {
        if (!confirm('Mark patient as discharged?')) return;
        try {
            await axios.patch(`/patients/${selectedPatientId}/status`, { status: 'discharged' });
            setSelectedPatientId(null);
            fetchQueue();
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status");
        }
    };

    const filteredQueue = queue.filter(p => filter === 'all' || p.triage_category === filter);

    return (
        <Layout>
            <div className="flex flex-col h-full space-y-6">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 w-full md:w-auto mb-4 md:mb-0">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Patient Queue</h1>
                            <p className="text-sm text-gray-500">Live Triage Updates</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                        {['all', 'red', 'yellow', 'green'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${filter === f
                                    ? 'bg-gray-800 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f === 'all' ? 'All Patients' : f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Queue Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQueue.map((patient) => (
                        <div
                            key={patient.id}
                            onClick={() => setSelectedPatientId(patient.id)}
                            className={`group relative bg-white rounded-2xl p-6 cursor-pointer border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${patient.triage_category === 'red' ? 'border-red-100 hover:border-red-500 bg-red-50/10' :
                                patient.triage_category === 'yellow' ? 'border-yellow-100 hover:border-yellow-500 bg-yellow-50/10' :
                                    'border-green-100 hover:border-green-500 bg-green-50/10'
                                }`}
                        >
                            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse ${patient.triage_category === 'red' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' :
                                patient.triage_category === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></div>

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {patient.name}
                                    </h3>
                                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">#{String(patient.id).padStart(3, '0')}</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                                {patient.symptoms || "No symptoms recorded"}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span>{patient.gender}, {patient.age}y</span>
                                <span>Score: {patient.priority_score}</span>
                            </div>
                        </div>
                    ))}
                    {filteredQueue.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                            <CheckCircle size={48} className="mb-4 opacity-20" />
                            <p>No patients found in this category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Patient Details Side Panel (Slide Over) */}
            {selectedPatientId && (
                <>
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedPatientId(null)} />
                    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 flex flex-col">

                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center sticky top-0">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    {loadingDetails ? 'Loading...' : patientDetails?.name}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Patient ID: #{selectedPatientId}</p>
                            </div>
                            <button onClick={() => setSelectedPatientId(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <Activity className="rotate-45" size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {!loadingDetails && patientDetails ? (
                                <>
                                    {/* Triage Badge */}
                                    <div className={`p-4 rounded-xl border flex items-center justify-between ${patientDetails.triage_category === 'red' ? 'bg-red-50 border-red-100 text-red-700' :
                                        patientDetails.triage_category === 'yellow' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' :
                                            'bg-green-50 border-green-100 text-green-700'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <AlertCircle size={24} />
                                            <div>
                                                <p className="font-bold uppercase tracking-wider text-sm">Triage Level: {patientDetails.triage_category}</p>
                                                <p className="text-xs opacity-80">Priority Score: {patientDetails.priority_score}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Symptoms */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Clinical Presentation</h3>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-lg leading-relaxed text-slate-700">
                                            "{patientDetails.transcribed_text || patientDetails.symptoms}"
                                        </div>
                                    </div>

                                    {/* Vitals */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Vitals History</h3>
                                        {patientDetails.vitals && patientDetails.vitals.length > 0 ? (
                                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                                                        <tr>
                                                            <th className="p-4">Time</th>
                                                            <th className="p-4">BP</th>
                                                            <th className="p-4">HR</th>
                                                            <th className="p-4">SpO2</th>
                                                            <th className="p-4">Temp</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 bg-white">
                                                        {patientDetails.vitals.map((v, i) => (
                                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                                <td className="p-4 text-gray-500">{new Date(v.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                                <td className="p-4 font-mono font-medium text-gray-900">{v.bp_systolic}/{v.bp_diastolic}</td>
                                                                <td className="p-4 font-mono text-gray-900">{v.heart_rate}</td>
                                                                <td className="p-4 font-mono text-gray-900">{v.spo2}%</td>
                                                                <td className="p-4 font-mono text-gray-900">{v.temperature}°C</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 italic">
                                                No vitals recorded yet.
                                            </div>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Doctor Notes</h3>
                                        <div className="space-y-4">
                                            {patientDetails.notes && patientDetails.notes.map((note, i) => (
                                                <div key={i} className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 relative">
                                                    <p className="text-gray-800 font-medium mb-2">{note.note_text}</p>
                                                    <div className="text-xs text-yellow-600/70 flex justify-between items-center pt-2 border-t border-yellow-200/50">
                                                        <span>{note.doctor_name}</span>
                                                        <span>{new Date(note.created_at).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ))}

                                            <form onSubmit={handleAddNote} className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                    placeholder="Type a new clinical note..."
                                                    className="flex-1 bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!noteText}
                                                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
                                                >
                                                    Add
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-20 flex justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0">
                            <button
                                onClick={handleComplete}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                            >
                                <CheckCircle /> Discharge Patient
                            </button>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default DoctorDashboard;
