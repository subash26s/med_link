import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import {
    Activity, Lock, User,
    ChevronRight, ShieldAlert, Loader2,
    Stethoscope, UserCog, Clipboard, Info
} from 'lucide-react';

const Login = () => {
    const { t } = useLanguage();
    const [credentials, setCredentials] = useState({ username: '', password: '', role: 'nurse' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const roles = [
        { id: 'nurse', label: t('nurse'), icon: Clipboard, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'doctor', label: t('doctor'), icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'admin', label: t('admin'), icon: UserCog, color: 'text-purple-600', bg: 'bg-purple-50' },
        { id: 'patient', label: t('patient'), icon: User, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await login(credentials.username, credentials.password, credentials.role);
            if (result.success) {
                if (credentials.role === 'admin') navigate('/admin');
                else if (credentials.role === 'doctor') navigate('/doctor');
                else if (credentials.role === 'nurse') navigate('/nurse');
                else if (credentials.role === 'patient') navigate('/patient/portal');
                else navigate('/reception');
            } else {
                setError(t('invalid_credentials'));
            }
        } catch (err) {
            setError('Login failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 p-24 opacity-5 rotate-12 scale-150 text-blue-600 font-sans">
                <Activity size={400} />
            </div>

            <div className="max-w-xl w-full">
                <div className="bg-white rounded-[50px] shadow-2xl p-10 md:p-14 border border-slate-100 relative z-10 animate-slide-up">
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex flex-col">
                            <div className="bg-blue-600 p-4 rounded-3xl text-white mb-6 shadow-xl shadow-blue-100 w-fit">
                                <Activity size={32} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{t('medicare_ai')}</h1>
                            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mt-4">{t('clinical_ecosystem')}</p>
                        </div>
                        <LanguageSwitcher />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setCredentials({ ...credentials, role: role.id })}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${credentials.role === role.id
                                            ? 'border-blue-600 bg-blue-50/50 shadow-md'
                                            : 'border-slate-50 hover:border-slate-100'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-xl ${role.bg} ${role.color}`}>
                                            <role.icon size={18} />
                                        </div>
                                        <span className={`font-black text-[11px] uppercase tracking-widest ${credentials.role === role.id ? 'text-blue-700' : 'text-slate-400'}`}>
                                            {role.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-5 top-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder={t('email')}
                                    required
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-5 pl-14 font-bold outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder={t('password')}
                                    required
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-5 pl-14 font-bold outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100 shadow-sm animate-shake">
                                <ShieldAlert size={20} />
                                <p className="text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-black text-white p-6 rounded-[25px] font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 group"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                <>
                                    <span>{t('access_portal')}</span>
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Info size={14} className="text-blue-600" />
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t('demo_credentials')}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                            <span>{t('nurse')}: <span className="text-slate-900">nurse1@hospital.com</span></span>
                            <span>{t('doctor')}: <span className="text-slate-900">arjun@hospital.com</span></span>
                            <span>{t('admin')}: <span className="text-slate-900">admin@hospital.com</span></span>
                            <span>{t('patient')}: <span className="text-slate-900">patient1@hospital.com</span></span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <button
                        onClick={() => navigate('/patient/start')}
                        className="bg-white border border-slate-200 text-slate-500 font-black hover:text-blue-600 hover:border-blue-200 px-8 py-5 rounded-[25px] transition-all inline-flex items-center gap-3 shadow-sm hover:shadow-lg"
                    >
                        {t('self_checkin')} <ChevronRight size={18} />
                    </button>
                    <p className="mt-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2026 MedHub+</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
