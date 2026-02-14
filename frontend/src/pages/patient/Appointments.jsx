import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Calendar, Clock, User, Stethoscope,
    MoreVertical, Plus, Search, Filter,
    ChevronRight, CheckCircle, AlertCircle
} from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';
import { StatusBadge, ModernTable, PrimaryButton } from '../../components/common/UIComponents';
import { useAuth } from '../../contexts/AuthContext';

const Appointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking appointments based on the dummy data requirements
        setAppointments([
            {
                doctor: 'Dr. Arjun Mehta',
                dept: 'Cardiology',
                type: 'Routine Follow-up',
                last_visit: '2026-01-15',
                next_visit: '2026-02-26',
                status: 'Confirmed'
            },
            {
                doctor: 'Dr. Priya Sharma',
                dept: 'General Medicine',
                type: 'Annual Wellness',
                last_visit: '2025-12-01',
                next_visit: '2026-06-01',
                status: 'Scheduled'
            }
        ]);
        setLoading(false);
    }, []);

    return (
        <PatientLayout>
            <div className="space-y-10 animate-slide-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Appointments</h1>
                        <p className="text-slate-500 font-medium">Manage your consultations and medical visits.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <Filter size={18} /> Filters
                        </button>
                        <PrimaryButton icon={Plus}>Book New Appointment</PrimaryButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Visits</p>
                            <p className="text-2xl font-black text-slate-900">12</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            <CheckCircle size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completed</p>
                            <p className="text-2xl font-black text-slate-900">10</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                            <Clock size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
                            <p className="text-2xl font-black text-slate-900">2</p>
                        </div>
                    </div>
                    <div className="bg-blue-600 p-8 rounded-[40px] shadow-2xl shadow-blue-100 flex items-center gap-6 group cursor-pointer text-white">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-all">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Next Visit</p>
                            <p className="text-xl font-black">26 Feb</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-[30px] border border-slate-100 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center gap-4 flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
                        <Search className="text-slate-300" size={20} />
                        <input
                            type="text"
                            placeholder="Search by doctor or department..."
                            className="bg-transparent border-none outline-none font-bold text-slate-900 w-full placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex items-center gap-4 px-4 py-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort By:</span>
                        <select className="bg-transparent border-none outline-none font-bold text-slate-900 text-sm cursor-pointer">
                            <option>Date (Newest)</option>
                            <option>Date (Oldest)</option>
                            <option>Doctor Name</option>
                        </select>
                    </div>
                </div>

                <ModernTable
                    headers={['Assigned Doctor', 'Specialization', 'Visit Type', 'Last Checkup', 'Next Appointment', 'Status']}
                    data={appointments}
                    renderRow={(apt) => (
                        <>
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 overflow-hidden shadow-inner border border-slate-100">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900">{apt.doctor}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consultant Physician</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-sm font-black text-blue-600 uppercase tracking-tight">{apt.dept}</td>
                            <td className="px-6 py-6 font-bold text-slate-600">{apt.type}</td>
                            <td className="px-6 py-6 text-slate-400 font-medium text-xs font-mono">{apt.last_visit}</td>
                            <td className="px-6 py-6 text-slate-900 font-black text-xs font-mono">{apt.next_visit}</td>
                            <td className="px-6 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                    }`}>
                                    {apt.status}
                                </span>
                            </td>
                        </>
                    )}
                />

                <div className="p-10 bg-blue-50 rounded-[50px] border border-blue-100 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-xl shadow-blue-100/50">
                        <Stethoscope size={40} />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Need to see a specialist?</h3>
                        <p className="text-slate-500 font-medium">Our AI can help match you with the right doctor based on your triage history and symptoms.</p>
                    </div>
                    <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                        Match Me with a Doctor
                    </button>
                </div>
            </div>
        </PatientLayout>
    );
};

export default Appointments;
