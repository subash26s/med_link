import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Activity, HeartPulse, Clock, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, red: 0, yellow: 0, green: 0, avg_score: 0 });
    const [users, setUsers] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'doctor' });

    const fetchStats = async () => {
        try {
            const res = await axios.get('/patients/stats');
            if (res.data) setStats(res.data);
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/auth/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/login', newUser); // Using login endpoint as it auto-registers
            setShowUserModal(false);
            setNewUser({ username: '', password: '', role: 'doctor' });
            fetchUsers();
        } catch (error) {
            alert("Failed to create user");
        }
    };

    const data = [
        { name: 'Red', count: stats.red || 0, fill: '#EF4444' },
        { name: 'Yellow', count: stats.yellow || 0, fill: '#F59E0B' },
        { name: 'Green', count: stats.green || 0, fill: '#10B981' },
    ];

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hospital Analytics</h1>
                        <p className="text-gray-500 mt-2">Real-time overview of system performance and patient flow.</p>
                    </div>
                    <button
                        onClick={() => setShowUserModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                    >
                        <Users size={20} /> Add Staff Member
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-shadow">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Patients</p>
                            <h3 className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{stats.total || 0}</h3>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-shadow">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Critical Cases</p>
                            <h3 className="text-3xl font-black text-red-600 group-hover:text-red-700 transition-colors">{stats.red || 0}</h3>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <AlertTriangle size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-shadow">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Urgent Cases</p>
                            <h3 className="text-3xl font-black text-yellow-600 group-hover:text-yellow-700 transition-colors">{stats.yellow || 0}</h3>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-xl text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                            <Clock size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-shadow">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Triage Score</p>
                            <h3 className="text-3xl font-black text-gray-900 group-hover:text-green-600 transition-colors">{Number(stats.avg_score).toFixed(1)}</h3>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <Activity size={24} />
                        </div>
                    </div>
                </div>

                {/* Charts & Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Access Control Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-96">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Users size={18} className="text-blue-500" /> Authorized Personnel
                            </h3>
                            <button className="text-sm text-blue-600 font-bold hover:underline">Manage Rules</button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-0">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold sticky top-0">
                                    <tr>
                                        <th className="p-4">Staff ID</th>
                                        <th className="p-4">Username/Role</th>
                                        <th className="p-4 text-right">Access Level</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-gray-400 font-mono text-xs">#{String(user.id).padStart(4, '0')}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-800">{user.username}</div>
                                                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96 flex flex-col">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <HeartPulse size={18} className="text-red-500" /> Triage Distribution
                            </h3>
                            <select className="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-lg p-2 outline-none">
                                <option>Last 24 Hours</option>
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} barSize={60}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f9fafb' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-black text-gray-900">Add New Staff Member</h2>
                            <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. dr_smith"
                                    value={newUser.username}
                                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Staff Role</label>
                                <select
                                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all bg-white"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="doctor">Doctor</option>
                                    <option value="nurse">Nurse</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg">
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminDashboard;
