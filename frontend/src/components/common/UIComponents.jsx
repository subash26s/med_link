import React from 'react';
import {
    BarChart3, Users, HeartPulse, Clock,
    ChevronRight
} from 'lucide-react';

export const DashboardCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl ${color || 'bg-blue-50 text-blue-600'}`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div>
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">{title}</h3>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900">{value}</span>
            </div>
        </div>
    </div>
);

export const StatusBadge = ({ status }) => {
    const styles = {
        red: "bg-red-100 text-red-700 border-red-200",
        yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
        green: "bg-green-100 text-green-700 border-green-200",
        emergency: "bg-red-600 text-white shadow-lg shadow-red-200 border-red-600",
        high: "bg-red-100 text-red-600 border-red-200 font-black",
        medium: "bg-amber-100 text-amber-600 border-amber-200 font-black",
        low: "bg-emerald-100 text-emerald-600 border-emerald-200 font-black",
        waiting: "bg-blue-100 text-blue-700 border-blue-200",
        discharged: "bg-slate-100 text-slate-500 border-slate-200"
    };

    const displayStatus = status || 'waiting';
    const styleKey = displayStatus.toLowerCase();

    return (
        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${styles[styleKey] || styles.waiting}`}>
            {displayStatus}
        </span>
    );
};

export const ModernTable = ({ headers, data, renderRow }) => (
    <div className="overflow-x-auto rounded-[30px] border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/50">
                    {headers.map((h, i) => (
                        <th key={i} className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {data.map((item, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                        {renderRow(item)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const PrimaryButton = ({ children, onClick, icon: Icon, className, danger, loading }) => (
    <button
        onClick={onClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 ${danger
            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100'
            } ${className}`}
    >
        {Icon && <Icon size={18} />}
        {loading ? 'Processing...' : children}
    </button>
);
