import React from 'react';
import Trans from '../common/Trans';

export const ProgressBar = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;
    return (
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-12 border border-slate-200 shadow-inner">
            <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export const CustomCheckbox = ({ label, checked, onChange, icon: Icon }) => (
    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${checked ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white border-slate-100 hover:border-slate-200'
        }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${checked ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
            }`}>
            {Icon ? <Icon size={20} /> : (checked && <div className="w-3 h-3 bg-white rounded-full" />)}
        </div>
        <span className={`text-lg font-bold ${checked ? 'text-blue-700' : 'text-slate-600'}`}><Trans>{label}</Trans></span>
        <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
    </label>
);

export const StepTitle = ({ title, subtitle }) => (
    <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight"><Trans>{title}</Trans></h2>
        {subtitle && <p className="text-xl text-slate-500 font-medium"><Trans>{subtitle}</Trans></p>}
    </div>
);

