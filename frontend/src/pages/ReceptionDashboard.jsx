import React, { useState } from 'react';
import axios from 'axios';
import {
    ClipboardList, UserPlus, Search,
    Settings, CreditCard, Clock,
    Activity, ArrowRight, UserCheck, CheckCircle2,
    Phone, Calendar, Mail, MapPin, Loader2, ChevronRight
} from 'lucide-react';
import GlobalLayout from '../layouts/GlobalLayout';
import { PrimaryButton } from '../components/common/UIComponents';
import { useLanguage } from '../contexts/LanguageContext';

const ReceptionDashboard = () => {
    const { t } = useLanguage();
    const [patient, setPatient] = useState({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        visit_type: 'OPD'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successId, setSuccessId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await axios.post('/patients/intake', {
                ...patient,
                symptoms: "Registered at front desk."
            });
            setSuccessId(res.data.id);
            setPatient({ name: '', age: '', gender: 'Male', phone: '', visit_type: 'OPD' });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GlobalLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 font-sans">
                {/* Header */}
                <div className="lg:col-span-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('reception_desk')}</h1>
                    <p className="text-slate-500 font-medium">{t('register_manage_lobby')}</p>
                </div>

                {/* Left Side: Registration Form */}
                <div className="lg:col-span-12 xl:col-span-8 bg-white p-10 md:p-14 rounded-[50px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5"><UserPlus size={150} /></div>

                    <div className="flex items-center gap-4 mb-12 relative z-10">
                        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                            <ClipboardList size={28} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('new_registration')}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{t('full_legal_name')}</label>
                                <div className="relative group">
                                    <Search className="absolute left-5 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        required
                                        value={patient.name}
                                        onChange={e => setPatient({ ...patient, name: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-5 pl-14 font-bold outline-none transition-all"
                                        placeholder={t('enter_name')}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{t('phone_number')}</label>
                                <div className="relative group">
                                    <Phone className="absolute left-5 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        required
                                        value={patient.phone}
                                        onChange={e => setPatient({ ...patient, phone: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-5 pl-14 font-bold outline-none transition-all"
                                        placeholder="+1 (000) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{t('age')}</label>
                                    <input
                                        required
                                        type="number"
                                        value={patient.age}
                                        onChange={e => setPatient({ ...patient, age: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-5 font-bold outline-none"
                                        placeholder="00"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{t('gender')}</label>
                                    <select
                                        value={patient.gender}
                                        onChange={e => setPatient({ ...patient, gender: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-5 font-bold outline-none appearance-none"
                                    >
                                        <option value="Male">{t('male')}</option>
                                        <option value="Female">{t('female')}</option>
                                        <option value="Other">{t('other')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{t('department')} / {t('visit_purpose')}</label>
                                <div className="flex bg-slate-50 p-2 rounded-2xl border-2 border-transparent gap-1">
                                    {['OPD', 'Emergency', 'Follow-up'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setPatient({ ...patient, visit_type: type })}
                                            className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${patient.visit_type === type
                                                ? 'bg-white text-blue-600 shadow-md ring-1 ring-blue-100'
                                                : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            {type === 'OPD' ? t('opd') : type === 'Emergency' ? t('emergency_short') : t('follow_up')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col md:flex-row gap-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl p-6 rounded-[30px] shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-4 group active:scale-95"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={28} /> : (
                                    <>
                                        <span>{t('generate_token')}</span>
                                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                            <button type="reset" className="px-10 font-bold text-slate-400 hover:text-slate-600" onClick={() => setPatient({ name: '', age: '', gender: 'Male', phone: '', visit_type: 'OPD' })}>{t('clear_fields')}</button>
                        </div>
                    </form>

                    {successId && (
                        <div className="mt-12 bg-emerald-50 p-8 rounded-[40px] border border-emerald-100 flex items-center justify-between animate-slide-up">
                            <div className="flex items-center gap-4">
                                <CheckCircle2 className="text-emerald-500" size={32} />
                                <div>
                                    <p className="font-black text-xl text-emerald-900 tracking-tight">{t('reg_success')}</p>
                                    <p className="text-emerald-600 font-bold text-sm">{t('token_id')}: #{successId.toString().padStart(4, '0')}</p>
                                </div>
                            </div>
                            <PrimaryButton onClick={() => setSuccessId(null)}>{t('completed')}</PrimaryButton>
                        </div>
                    )}
                </div>

                {/* Right Side: Quick Links */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                    <div className="bg-slate-900 text-white p-10 rounded-[50px] shadow-2xl shadow-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Activity size={100} /></div>
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Clock size={20} className="text-blue-400" /> {t('operational_stats')}</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-slate-400 font-bold">{t('lobby_traffic')}</span>
                                <span className="text-2xl font-black">{t('medium')}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-slate-400 font-bold">{t('waiting_patients')}</span>
                                <span className="text-2xl font-black">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold">{t('avg_checkin_time')}</span>
                                <span className="text-2xl font-black">4{t('mins').toLowerCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3"><CreditCard className="text-blue-600" size={20} /> {t('payment_portal')}</h3>
                        <div className="space-y-4">
                            {[
                                { name: t('insurance_verification'), status: t('pending'), icon: UserCheck },
                                { name: t('generate_invoice'), status: t('action_required'), icon: ClipboardList }
                            ].map((item, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-blue-50 rounded-3xl transition-all border border-transparent hover:border-blue-100 text-left group">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-2 rounded-xl text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm"><item.icon size={20} /></div>
                                        <div>
                                            <p className="font-bold text-slate-800">{item.name}</p>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.status}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default ReceptionDashboard;
