import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();

    const languages = [
        { code: 'en', label: 'English', native: 'English' },
        { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
        { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
        { code: 'te', label: 'Telugu', native: 'తెలుగు' },
        { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
        { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    ];

    return (
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest shadow-sm">
            <Globe size={14} className="text-blue-600" />
            <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent outline-none cursor-pointer appearance-none pr-4"
            >
                {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.native}</option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSwitcher;
