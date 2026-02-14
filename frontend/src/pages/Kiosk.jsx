import React, { useState } from 'react';
import { User, Activity, CheckCircle, ArrowRight, Mic, Globe } from 'lucide-react';
import axios from 'axios';
import VoiceInput from '../components/VoiceInput';
import { useAuth } from '../contexts/AuthContext';

const Kiosk = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        symptoms: '',
        transcribed_text: ''
    });
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [language, setLanguage] = useState('en-US');
    const { user } = useAuth();

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/patients/intake', formData);
            setTicket(res.data);
            setStep(3); // Success step
        } catch (error) {
            console.error(error);
            alert('Error submitting intake form.');
        } finally {
            setLoading(false);
        }
    };

    const handleTranscript = (text) => {
        setFormData(prev => ({ ...prev, transcribed_text: text, symptoms: text }));
    };

    const reset = () => {
        setFormData({ name: '', age: '', gender: 'Male', symptoms: '', transcribed_text: '' });
        setTicket(null);
        setStep(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-4">
            <div className="max-w-3xl mx-auto w-full">
                {/* Progress Bar */}
                <div className="mb-8 flex justify-center items-center gap-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-2 w-20 rounded-full transition-all ${step >= s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col relative w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white grid place-items-center relative overflow-hidden">
                        <div className="relative z-10 text-center">
                            <h1 className="text-3xl font-bold flex items-center justify-center gap-3 mb-2">
                                <Activity className="text-blue-200" size={32} /> Patient Check-In
                            </h1>
                            <p className="text-blue-100 text-lg opacity-90">Please enter your details to proceed</p>
                        </div>

                        {/* Language Selector */}
                        <div className="absolute top-6 right-6 z-20">
                            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                                <Globe size={16} className="text-white mr-2" />
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer appearance-none"
                                >
                                    <option className="text-gray-900" value="en-US">English</option>
                                    <option className="text-gray-900" value="es-ES">Español</option>
                                    <option className="text-gray-900" value="fr-FR">Français</option>
                                    <option className="text-gray-900" value="hi-IN">हिन्दी</option>
                                    <option className="text-gray-900" value="ta-IN">தமிழ்</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                        {step === 1 && (
                            <div className="space-y-8 animate-fade-in w-full max-w-lg mx-auto">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 text-lg font-semibold mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full text-xl p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="e.g. John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 text-lg font-semibold mb-2">Age</label>
                                            <input
                                                type="number"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                className="w-full text-xl p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
                                                placeholder="30"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-lg font-semibold mb-2">Gender</label>
                                            <div className="relative">
                                                <select
                                                    value={formData.gender}
                                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                    className="w-full text-xl p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                                                >
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleNext}
                                    disabled={!formData.name || !formData.age}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg ring-4 ring-blue-50 active:scale-[0.98] transition-all text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue <ArrowRight />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-fade-in w-full max-w-lg mx-auto flex flex-col items-center">
                                <div className="text-center w-full">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Describe Your Symptoms</h2>
                                    <p className="text-gray-500">Tap the microphone and speak clearly</p>
                                </div>

                                <div className="w-full bg-blue-50/50 p-8 rounded-3xl border-2 border-dashed border-blue-200 flex flex-col items-center gap-6">
                                    <VoiceInput onTranscriptChange={handleTranscript} lang={language} />

                                    <div className="w-full relative">
                                        <textarea
                                            className="w-full min-h-[120px] p-4 text-lg border rounded-xl bg-white focus:ring-2 focus:ring-blue-200 outline-none resize-none shadow-sm"
                                            placeholder="Or type here..."
                                            value={formData.transcribed_text}
                                            onChange={(e) => setFormData({ ...formData, transcribed_text: e.target.value, symptoms: e.target.value })}
                                        ></textarea>
                                        <div className="absolute top-4 right-4 text-gray-400 animate-pulse">
                                            <Mic size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <button
                                        onClick={handlePrev}
                                        className="py-4 px-6 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors text-lg"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || !formData.transcribed_text}
                                        className="py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-100 transition-all text-lg flex items-center justify-center gap-2"
                                    >
                                        {loading ? "Submitting..." : "Submit"} <CheckCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && ticket && (
                            <div className="text-center animate-bounce-in max-w-md mx-auto w-full space-y-8">
                                <div className="inline-flex bg-green-100 p-6 rounded-full ring-8 ring-green-50 mb-4">
                                    <CheckCircle className="w-20 h-20 text-green-600" strokeWidth={1.5} />
                                </div>

                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2">You're Checked In!</h2>
                                    <p className="text-gray-500">Please have a seat in the waiting area.</p>
                                </div>

                                <div className={`relative overflow-hidden rounded-2xl p-8 border-2 ${ticket.triage === 'red' ? 'bg-red-50 border-red-200' :
                                        ticket.triage === 'yellow' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
                                    }`}>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Your Token Number</p>
                                    <div className={`text-6xl font-black font-mono tracking-tighter ${ticket.triage === 'red' ? 'text-red-600' :
                                            ticket.triage === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                        #{String(ticket.id).padStart(3, '0')}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200/50 flex justify-between text-sm text-gray-600">
                                        <span>Wait Time: ~15 mins</span>
                                        <span className="font-bold">Zone A</span>
                                    </div>
                                </div>

                                <button
                                    onClick={reset}
                                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-xl"
                                >
                                    Start New Check-In
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center text-gray-400 mt-8 text-sm font-medium">
                    VoiceTriage AI System • v1.0 • Hospital Use Only
                </p>
            </div>
        </div>
    );
};

export default Kiosk;
