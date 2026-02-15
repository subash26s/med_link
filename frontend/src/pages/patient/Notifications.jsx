import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, Clock, MessageSquare, Shield, Smartphone } from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';
import GlobalLayout from '../../layouts/GlobalLayout';
import { ModernTable } from '../../components/common/UIComponents';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [smsLogs, setSmsLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const role = localStorage.getItem('role') || 'patient';
    const userId = role === 'doctor'
        ? (localStorage.getItem('doctor_id') || 'D1')
        : (localStorage.getItem('patient_id') || 'P001');

    const Layout = role === 'doctor' ? GlobalLayout : PatientLayout;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch System Notifications
                const notifRes = await axios.get(`/api/notifications?target_role=${role}&target_id=${userId}`);
                setNotifications(notifRes.data.notifications || []);

                // 2. Fetch SMS Logs (Patient Only)
                if (role === 'patient') {
                    const smsRes = await axios.get(`/api/sms/logs?patient_id=${userId}`);
                    setSmsLogs(smsRes.data.logs || []);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [role, userId]);

    return (
        <Layout>
            <div className="space-y-10 animate-slide-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Notifications</h1>
                        <p className="text-slate-500 font-medium">
                            {role === 'doctor' ? 'Appointment requests and system alerts' : 'Real-time alerts and SMS history'}
                        </p>
                    </div>
                    {role === 'patient' && (
                        <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl flex items-center gap-3 font-bold border border-blue-100">
                            <Smartphone size={20} />
                            <span className="text-xs uppercase tracking-widest">SMS Gateway: Active (Demo)</span>
                        </div>
                    )}
                </div>

                {/* System Notifications Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Bell size={20} className="text-blue-600" /> System Alerts
                    </h3>

                    {notifications.length === 0 ? (
                        <div className="p-10 bg-white rounded-[30px] border border-slate-100 text-center text-slate-400 font-bold">
                            No system notifications.
                        </div>
                    ) : (
                        <div className="bg-white rounded-[30px] border border-slate-100 overflow-hidden">
                            {notifications.map((n, i) => (
                                <div key={i} className={`p-6 border-b border-slate-50 flex items-start gap-4 ${n.read ? 'bg-white' : 'bg-blue-50/30'}`}>
                                    <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm border border-slate-100">
                                        <Bell size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-black text-slate-900">{n.title}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(n.created_at).toLocaleString()}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm font-medium">{n.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Patient SMS Logs */}
                {role === 'patient' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mt-8">
                            <MessageSquare size={20} className="text-emerald-600" /> SMS History (Demo)
                        </h3>
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            {smsLogs.length === 0 ? (
                                <div className="p-10 text-center text-slate-400 font-bold">No SMS logs found.</div>
                            ) : (
                                <ModernTable
                                    headers={['Time', 'Message', 'Type', 'Status']}
                                    data={smsLogs}
                                    renderRow={(log) => (
                                        <>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <Clock size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-sm">
                                                            {new Date(log.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {new Date(log.sent_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="max-w-xl">
                                                    <p className="font-medium text-slate-600 leading-relaxed text-sm">
                                                        {log.message}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${log.type === 'appointment' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    log.type === 'medication' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        'bg-slate-50 text-slate-500 border-slate-100'
                                                    }`}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Sent</span>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Notifications;
