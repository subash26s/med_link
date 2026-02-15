import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import {
    Activity, User, Stethoscope, Clipboard, UserCog,
    ShieldAlert, Calendar, ArrowRight, CheckCircle2,
    HeartPulse, Clock, Globe, Lock
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigateToRole = (role) => {
        navigate(`/login?role=${role}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

            {/* 1. TOP NAVBAR */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 py-3' : 'bg-transparent py-5'
                }`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
                            <Activity size={20} strokeWidth={3} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900">MedHub+</span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>
                        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-slate-500 font-bold text-sm hover:text-blue-600 transition-colors px-2 hidden sm:block"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                        >
                            <span>Get Started</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* 2. HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-5 text-blue-600 pointer-events-none">
                    <Activity size={600} strokeWidth={0.5} />
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">

                    {/* Left Content */}
                    <div className="space-y-8 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                            Live System v2.0
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900">
                            Welcome to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">MedHub+</span>
                        </h1>

                        <div className="space-y-6">
                            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                                AI-powered triage, instant doctor appointments & emergency support. Experience the future of clinical care management.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: Activity, text: "AI Risk Scoring" },
                                    { icon: Calendar, text: "Doctor Booking" },
                                    { icon: HeartPulse, text: "Emergency SOS" }
                                ].map((pill, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-bold text-slate-600">
                                        <pill.icon size={12} className="text-blue-500" />
                                        {pill.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wide shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Login Portal
                            </button>
                            <button
                                onClick={() => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}
                                className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-100 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wide transition-all hover:border-slate-200 flex items-center justify-center gap-2"
                            >
                                Explore Portal
                            </button>
                        </div>

                        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4">
                            <span className="flex items-center gap-1"><ShieldAlert size={12} /> Secure HIPAA</span>
                            <span className="flex items-center gap-1"><Lock size={12} /> Role-Based</span>
                            <span className="flex items-center gap-1"><Globe size={12} /> Multilingual</span>
                        </div>
                    </div>

                    {/* Right Visual (Dashboard Mock) */}
                    <div className="relative hidden md:block animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="relative w-full max-w-md mx-auto aspect-[4/5] perspective-1000">

                            {/* Card Stack Effect */}
                            {/* Back Card */}
                            <div className="absolute top-0 left-8 right-8 bottom-16 bg-white rounded-3xl shadow-xl border border-slate-100 opacity-60 scale-90 translate-y-8"></div>
                            {/* Middle Card */}
                            <div className="absolute top-4 left-4 right-4 bottom-8 bg-white rounded-3xl shadow-xl border border-slate-100 opacity-80 scale-95 translate-y-4"></div>

                            {/* Front Card (Main Interface) */}
                            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
                                {/* Header Mock */}
                                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">JD</div>
                                        <div>
                                            <div className="h-2 w-24 bg-slate-200 rounded mb-1.5"></div>
                                            <div className="h-1.5 w-16 bg-slate-100 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                        <Activity size={16} className="text-slate-400" />
                                    </div>
                                </div>

                                {/* Body Mock */}
                                <div className="p-6 space-y-6 flex-1 bg-slate-50/30">
                                    {/* Risk Card */}
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all cursor-default">
                                        <div className="absolute top-0 right-0 p-3 opacity-10">
                                            <ShieldAlert size={80} className="text-red-500" />
                                        </div>
                                        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                            High Risk
                                        </div>
                                        <div className="h-2 w-3/4 bg-slate-100 rounded mb-4"></div>
                                        <div className="flex gap-2">
                                            <div className="h-8 w-20 bg-red-50 rounded-lg"></div>
                                            <div className="h-8 w-20 bg-slate-50 rounded-lg"></div>
                                        </div>
                                    </div>

                                    {/* Appointment Card */}
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                                        <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                                            <Calendar size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-2 w-24 bg-slate-200 rounded mb-2"></div>
                                            <div className="h-1.5 w-12 bg-slate-100 rounded"></div>
                                        </div>
                                        <div className="bg-slate-50 px-3 py-1 rounded-lg text-xs font-bold text-slate-400">09:30</div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                            <div className="h-1.5 w-12 bg-slate-100 rounded mb-3"></div>
                                            <div className="h-6 w-16 bg-blue-50 rounded-lg"></div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                            <div className="h-1.5 w-12 bg-slate-100 rounded mb-3"></div>
                                            <div className="h-6 w-16 bg-purple-50 rounded-lg"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. QUICK ENTRY CARDS */}
            <section id="roles" className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em]">Select Portal</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">Choose Your Role</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Patient Card */}
                        <div
                            onClick={() => navigateToRole('patient')}
                            className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="bg-white w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <User size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Patient</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                Access health records, book appointments, and check triage status.
                            </p>
                            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 group-hover:gap-3 transition-all">
                                Continue <ArrowRight size={14} />
                            </span>
                        </div>

                        {/* Doctor Card */}
                        <div
                            onClick={() => navigateToRole('doctor')}
                            className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="bg-white w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <Stethoscope size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Doctor</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                Manage appointments, view patient risks, and update records.
                            </p>
                            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 group-hover:gap-3 transition-all">
                                Continue <ArrowRight size={14} />
                            </span>
                        </div>

                        {/* Nurse Card */}
                        <div
                            onClick={() => navigateToRole('nurse')}
                            className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-purple-200 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="bg-white w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Clipboard size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Nurse</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                Triage patients, monitor vitals, and handle emergency queues.
                            </p>
                            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-600 group-hover:gap-3 transition-all">
                                Continue <ArrowRight size={14} />
                            </span>
                        </div>

                        {/* Admin Card */}
                        <div
                            onClick={() => navigateToRole('admin')}
                            className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="bg-white w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-slate-600 mb-6 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                <UserCog size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Admin</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                System configuration, user management, and hospital analytics.
                            </p>
                            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 group-hover:gap-3 transition-all">
                                Continue <ArrowRight size={14} />
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FEATURE STRIP */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: ShieldAlert, title: "Real-time Triage", desc: "Automatic priority queueing based on AI risk analysis." },
                            { icon: Calendar, title: "Smart Scheduling", desc: "Instant booking with availability tracking and reminders." },
                            { icon: Globe, title: "Multilingual", desc: "Full support for 6+ languages for better accessibility." }
                        ].map((feat, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 cursor-default">
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0">
                                    <feat.icon size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">{feat.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. FOOTER */}
            <footer className="bg-white border-t border-slate-100 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-900 font-black">
                        <div className="bg-slate-900 p-1.5 rounded-lg text-white">
                            <Activity size={14} />
                        </div>
                        <span className="tracking-tight">MedHub+</span>
                    </div>

                    <div className="flex items-center gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
                    </div>

                    <div className="text-[10px] text-slate-400 font-medium">
                        © 2026 MedHub+. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
