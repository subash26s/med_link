import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Import all translation files
import en from '../translations/en.json';
import hi from '../translations/hi.json';
import ta from '../translations/ta.json';
import te from '../translations/te.json';
import ml from '../translations/ml.json';
import kn from '../translations/kn.json';

const dictionaries = { en, hi, ta, te, ml, kn };

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('app_language') || 'en');
    const [dynamicCache, setDynamicCache] = useState({});

    useEffect(() => {
        localStorage.setItem('app_language', language);
    }, [language]);

    const changeLanguage = (lang) => {
        if (dictionaries[lang]) {
            setLanguage(lang);
        }
    };

    // Synchronous translation for UI text (Step 3)
    const t = (key, params = {}) => {
        const dict = dictionaries[language] || dictionaries['en'];
        let text = dict[key] || dictionaries['en'][key] || key;

        // Basic variable replacement
        Object.keys(params).forEach(param => {
            text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
        });

        return text;
    };

    // Asynchronous translation for dynamic content (AI results, patient inputs - IndicTrans2)
    const translateText = async (text, targetLang = language, srcLang = 'en') => {
        if (!text) return '';
        if (targetLang === srcLang) return text;

        const cacheKey = `${targetLang}:${text}`;
        if (dynamicCache[cacheKey]) {
            return dynamicCache[cacheKey];
        }

        try {
            const res = await axios.post('/api/translate', {
                text,
                source_lang: srcLang,
                target_lang: targetLang
            });

            const translatedText = res.data.translated_text;
            setDynamicCache(prev => ({ ...prev, [cacheKey]: translatedText }));
            return translatedText;
        } catch (error) {
            console.error("Dynamic translation failed", error);
            return text;
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, translateText }}>
            {children}
        </LanguageContext.Provider>
    );
};

