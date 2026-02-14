import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Trans = ({ children }) => {
    const { t } = useLanguage();

    // If children is not a string (e.g. nested elements), don't try to translate
    if (typeof children !== 'string') return <>{children}</>;

    return <>{t(children)}</>;
};

export default Trans;

