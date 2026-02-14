import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Volume2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const WelcomeScreen = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-12 p-6 md:p-12 items-center justify-center font-sans text-slate-900">
            <div className="max-w-4xl w-full text-center space-y-12">
                {/* Hospital Branding */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-100 ring-1 ring-slate-100">
                        <Activity size={100} className="text-blue-600" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tight">{t('medicare_ai')}</h1>
                        <p className="text-2xl text-slate-500 font-medium mt-2">
                            {t('smart_intake')}
                        </p>
                    </div>
                </div>

                {/* Main Action */}
                <div className="bg-white p-12 rounded-[50px] shadow-xl border border-slate-100 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center space-y-4">
                        <div className="bg-blue-50 text-blue-600 w-fit mx-auto px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <Volume2 size={16} /> {t('welcome_hospital')}
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                            {t('start_process')}
                        </h2>
                    </div>

                    <button
                        onClick={() => navigate('/patient/form')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-8 rounded-[30px] shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                    >
                        <span className="text-3xl font-black">{t('start_checkin')}</span>
                        <ArrowRight size={40} className="group-hover:translate-x-2 transition-transform" />
                    </button>

                    <div className="flex items-center justify-center gap-6 pt-4">
                        <LanguageSwitcher />
                    </div>
                </div>

                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
                    {t('protected_ai')}
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;

