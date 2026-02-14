const axios = require('axios');
const IndicTrans2Service = require('../services/IndicTrans2Service');

// Mock dictionary for UI elements to ensure high-quality demonstration
const UI_DICTIONARY = {
    'hi': {
        'Dashboard': 'डैशबोर्ड',
        'Nurse Triage': 'नर्स ट्राइएज',
        'Doctor Panel': 'डॉक्टर पैनल',
        'Check-In': 'चेक-इन',
        'Start Check-In': 'चेक-इन शुरू करें',
        'Welcome': 'स्वागत है',
        'Emergency': 'आपातकालीन',
        'High Risk': 'उच्च जोखिम',
        'Medium Risk': 'मध्यम जोखिम',
        'Low Risk': 'कम जोखिम',
        'Critical': 'गंभीर',
        'Assigned Consultant': 'नियुक्त सलाहकार',
        'General Medicine': 'सामान्य चिकित्सा',
        'Please start your check-in process to see a doctor.': 'डॉक्टर को देखने के लिए कृपया अपनी चेक-इन प्रक्रिया शुरू करें।',
        'Basic Information': 'बुनियादी जानकारी',
        'Symptoms & Vitals': 'लक्षण और महत्वपूर्ण संकेत',
        'AI Analyzing Condition...': 'एआई स्थिति का विश्लेषण कर रहा है...',
        'Submit & Triage': 'जमा करें और ट्राइएज'
    },
    'ta': {
        'Dashboard': 'டாஷ்போர்டு',
        'Nurse Triage': 'செவிலியர் முதலுதவி',
        'Doctor Panel': 'மருத்துவர் குழு',
        'Check-In': 'பதிவு செய்க',
        'Start Check-In': 'பதிவைத் தொடங்கு',
        'Welcome': 'வரவேற்கிறோம்',
        'Emergency': 'அவசரம்',
        'High Risk': 'அதி இடர்',
        'Medium Risk': 'நடுத்தர இடர்',
        'Low Risk': 'குறைந்த இடர்',
        'Critical': 'மிகவும் ஆபத்தான',
        'Assigned Consultant': 'நியமிக்கப்பட்ட நிபுணர்',
        'General Medicine': 'பொது மருத்துவம்',
        'Please start your check-in process to see a doctor.': 'மருத்துவரைப் பார்க்க உங்கள் பதிவு செயல்முறையைத் தொடங்கவும்.',
        'Basic Information': 'அடிப்படை தகவல்',
        'Symptoms & Vitals': 'அறிகுறிகள் மற்றும் முக்கிய அளவீடுகள்',
        'AI Analyzing Condition...': 'AI உடல்நிலையை ஆய்வு செய்கிறது...',
        'Submit & Triage': 'சமர்ப்பி & வகைப்படுத்து'
    },
    'te': {
        'Dashboard': 'డాష్‌బోర్డ్',
        'Start Check-In': 'చెక్-ఇన్ ప్రారంభించండి',
        'High Risk': 'అధిక ప్రమాదం'
    },
    'ml': {
        'Dashboard': 'ഡാഷ്‌ബോർഡ്',
        'Start Check-In': 'ചെക്ക്-ഇన్ ആരംഭിക്കുക',
        'High Risk': 'ഉയർന്ന അപകടസാധ്യത'
    },
    'kn': {
        'Dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        'Start Check-In': 'ಚೆಕ್-ಇನ್ ಪ್ರಾರಂಭಿಸಿ',
        'High Risk': 'ಹೆಚ್ಚಿನ ಅಪಾಯ'
    }
};

exports.translateText = async (req, res) => {
    const { text, source_lang = 'en', target_lang } = req.body;

    try {
        if (!text || target_lang === 'en') {
            return res.json({ translated_text: text });
        }

        // 1. Check UI Dictionary first for perfect UI translation
        if (UI_DICTIONARY[target_lang] && UI_DICTIONARY[target_lang][text]) {
            return res.json({ translated_text: UI_DICTIONARY[target_lang][text] });
        }

        // 2. Call IndicTrans2 Service
        const translatedText = await IndicTrans2Service.translate(text, source_lang, target_lang);

        res.json({ translated_text: translatedText });
    } catch (error) {
        console.error("Translation error:", error);
        res.status(500).json({ translated_text: text, error: "Translation service unavailable" });
    }
};
