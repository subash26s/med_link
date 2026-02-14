import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, Search, Filter,
    Plus, Download, UserRound,
    Calendar, Phone, Info, MoreVertical
} from 'lucide-react';
import GlobalLayout from '../layouts/GlobalLayout';
import { StatusBadge, ModernTable, PrimaryButton } from '../components/common/UIComponents';
import { useLanguage } from '../contexts/LanguageContext';

const PatientList = () => {
    const { t } = useLanguage();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axios.get('/patients/queue');
            setPatients(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlobalLayout>
            <div className="space-y-10 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('patient_registry')}</h1>
                        <p className="text-slate-500 font-medium">{t('manage_records')}</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <Filter size={18} /> {t('filters')}
                        </button>
                        <PrimaryButton icon={Plus}>{t('register_new')}</PrimaryButton>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-[30px] border border-slate-100 flex items-center gap-4">
                    <Search className="text-slate-400 ml-4" size={20} />
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        className="flex-1 bg-transparent border-none outline-none font-bold text-slate-900 text-lg placeholder:text-slate-300"
                    />
                </div>

                <ModernTable
                    headers={[t('patient'), t('contact_info'), t('status'), t('last_visit'), t('priority_score'), t('actions')]}
                    data={patients}
                    renderRow={(p) => (
                        <>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black">
                                        {p.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{p.name}</p>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">#VT-{p.id.toString().padStart(4, '0')}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-600 flex items-center gap-2"><Phone size={14} /> {p.phone || 'N/A'}</p>
                                    <p className="text-xs font-medium text-slate-400">{t(p.gender?.toLowerCase() || 'other')} • {p.age} {t('yrs')}</p>
                                </div>
                            </td>
                            <td className="px-6 py-5"><StatusBadge status={p.risk_level || p.status} /></td>
                            <td className="px-6 py-5 font-bold text-slate-500 text-xs">
                                <Calendar size={14} className="inline mr-2 text-blue-500" />
                                {new Date(p.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <span className={`font-black ${p.priority_score > 70 ? 'text-red-600' : p.priority_score > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {p.priority_score}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{p.doctor || t('unassigned')}</span>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900">
                                    <MoreVertical size={18} />
                                </button>
                            </td>
                        </>
                    )}
                />
            </div>
        </GlobalLayout>
    );
};

export default PatientList;
