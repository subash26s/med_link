// Simple AI Triage Model based on mock rules
// In a real app, this would use NLP or LLM API
const TRIAGE_KEYWORDS = {
    HIGH: ['chest pain', 'heart attack', 'stroke', 'difficulty breathing', 'shortness of breath', 'passed out', 'unconscious', 'bleeding heavily', 'head injury'],
    MEDIUM: ['fever', 'abdominal pain', 'vomiting', 'diarrhea', 'dizziness', 'fracture', 'broken bone', 'cut', 'laceration'],
    LOW: ['cough', 'cold', 'rash', 'minor burn', 'sore throat', 'ear ache']
};

const calculateTriageScore = (symptomsText = '', vitals = {}) => {
    let score = 0;
    let category = 'green';
    const text = symptomsText.toLowerCase();

    // 1. Text Analysis (Symptom based)
    TRIAGE_KEYWORDS.HIGH.forEach(keyword => {
        if (text.includes(keyword)) {
            score += 50;
            category = 'red';
        }
    });

    if (category !== 'red') {
        TRIAGE_KEYWORDS.MEDIUM.forEach(keyword => {
            if (text.includes(keyword)) {
                score += 30;
                if (category === 'green') category = 'yellow';
            }
        });

        if (category === 'green') {
            TRIAGE_KEYWORDS.LOW.forEach(keyword => {
                if (text.includes(keyword)) score += 10;
            });
        }
    }

    // 2. Vitals Analysis (if provided)
    // Normal ranges: HR 60-100, BP 120/80, SpO2 > 95, Temp 36.5-37.5
    if (vitals && Object.keys(vitals).length > 0) {
        const { heart_rate, bp_systolic, spo2, temperature } = vitals;

        // Heart Rate Critical
        if (heart_rate > 120 || heart_rate < 40) {
            score += 40;
            category = 'red';
        } else if (heart_rate > 100 || heart_rate < 50) {
            score += 20;
            if (category === 'green') category = 'yellow';
        }

        // BP Critical (Hypertensive Crisis or Hypotension)
        if (bp_systolic > 180 || bp_systolic < 80) {
            score += 40;
            category = 'red';
        } else if (bp_systolic > 140 || bp_systolic < 90) {
            score += 20;
            if (category === 'green') category = 'yellow';
        }

        // SpO2 Critical
        if (spo2 < 90) {
            score += 50;
            category = 'red';
        } else if (spo2 < 95) {
            score += 20;
            if (category === 'green') category = 'yellow';
        }

        // Temperature Critical
        if (temperature > 39.5 || temperature < 35) {
            score += 30;
            category = 'red';
        } else if (temperature > 38) {
            score += 15;
            if (category === 'green') category = 'yellow';
        }
    }

    // Final normalization
    if (score > 60) category = 'red';
    else if (score > 30) category = 'yellow';

    return { score, category };
};

module.exports = { calculateTriageScore };
