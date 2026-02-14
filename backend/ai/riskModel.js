/**
 * MEDI-CARE AI CLINICAL DECISION SUPPORT ENGINE
 * Advanced Weighted Risk Scoring & Pattern Recognition
 */

const analyzePatientRisk = (data) => {
    // 1. EXTRACT DATA
    const age = parseInt(data.age) || 30;
    const sys = parseInt(data.blood_pressure_systolic || data.bp_sys) || 120;
    const dia = parseInt(data.blood_pressure_diastolic || data.bp_dia) || 80;
    const hr = parseInt(data.heart_rate || data.hr) || 72;
    const temp = parseFloat(data.temperature || data.temp) || 37.0;
    const spo2 = parseInt(data.spo2) || 98;

    const symptoms = {
        chest_pain: !!(data.symptom_chest_pain || data.chest_pain),
        breathing: !!(data.symptom_breathing_difficulty || data.breathing),
        fever: !!(data.symptom_fever || data.fever),
        cough: !!(data.symptom_cough || data.cough),
        dizziness: !!(data.symptom_dizziness || data.dizziness),
        headache: !!(data.symptom_headache || data.headache),
        vomiting: !!(data.symptom_vomiting || data.vomiting)
    };

    const history = {
        diabetes: !!data.diabetes,
        hypertension: !!data.hypertension,
        heart_disease: !!data.heart_disease,
        asthma: !!data.asthma,
        pregnant: !!data.pregnant,
        smoker: !!data.smoker
    };

    // 2. SCORING ENGINE (0 - 100)
    let score = 0;

    // A. Vitals Scoring
    if (spo2 < 90) score += 40;
    else if (spo2 < 94) score += 20;

    if (sys > 180 || sys < 90) score += 30;
    else if (sys > 160 || sys < 100) score += 15;

    if (hr > 120 || hr < 50) score += 20;
    else if (hr > 100 || hr < 60) score += 10;

    if (temp > 39.5 || temp < 35.5) score += 20;
    else if (temp > 38.0) score += 10;

    // B. Symptom Severity
    if (symptoms.chest_pain) score += 25;
    if (symptoms.breathing) score += 25;
    if (symptoms.dizziness) score += 10;

    // C. Comorbidity Multiplier
    let multiplier = 1.0;
    if (history.heart_disease) multiplier += 0.3;
    if (history.diabetes) multiplier += 0.15;
    if (history.hypertension) multiplier += 0.15;
    if (history.pregnant && (sys > 140 || symptoms.dizziness)) multiplier += 0.5;

    let finalScore = Math.min(Math.round(score * multiplier), 100);

    // 3. CLASSIFICATION
    let riskLevel = "Low";
    let priority = "Routine";
    let admission = false;
    let icu = false;

    if (finalScore >= 85) {
        riskLevel = "Critical";
        priority = "Immediate";
        admission = true;
        icu = true;
    } else if (finalScore >= 60) {
        riskLevel = "High";
        priority = "Urgent";
        admission = true;
    } else if (finalScore >= 35) {
        riskLevel = "Medium";
        priority = "Semi-Urgent";
    }

    // 4. DEPARTMENT ROUTING & LOGIC
    let dept = "General Medicine";
    let docAlert = "Routine checkup";
    let nurseActions = ["Record base vitals", "Aquire medical history"];
    let tests = ["General Wellness Panel"];
    let conditions = ["Under Investigation"];

    if (symptoms.chest_pain || history.heart_disease || sys > 160) {
        dept = "Cardiology";
        docAlert = "Suspected Cardiac Event - Immediate Review";
        nurseActions = ["Continuous ECG monitoring", "Bed rest", "Ready emergency cart"];
        tests = ["ECG", "Troponin Test", "Echocardiogram", "Chest X-Ray"];
        conditions = ["Myocardial Infarction Risk", "Angina", "Hypertensive Crisis"];
    } else if (symptoms.breathing || history.asthma || spo2 < 94) {
        dept = "Pulmonology";
        docAlert = "Respiratory Distress - Check SpO2 Levels";
        nurseActions = ["Monitor SpO2 hourly", "Nebulization if prescribed", "Upright position"];
        tests = ["Pulse Oximetry", "ABG Analysis", "Chest X-Ray", "Lung Function Test"];
        conditions = ["Acute Asthma", "Pneumonia", "Hypoxia"];
    } else if (temp > 38.0 || symptoms.cough) {
        dept = "Infectious Disease";
        docAlert = "Febrile Illness - Review for Sepsis markers";
        nurseActions = ["Tepid sponging", "Increase fluid intake", "Monitor temperature q2h"];
        tests = ["Complete Blood Count (CBC)", "CRP Test", "Urine Culture"];
        conditions = ["Viral Infection", "Bacterial Sepsis Risk", "Gastroenteritis"];
    }

    if (finalScore > 80) {
        nurseActions.unshift("Notify attending physician IMMEDIATELY");
        nurseActions.push("Establish IV access");
    }

    // 5. SUMMARY GENERATION
    let summary = `Patient shows ${riskLevel.toLowerCase()} clinical risk. `;
    if (finalScore > 50) {
        summary += `Primary concern is ${conditions[0]} due to ${symptoms.chest_pain ? 'chest pain' : 'abnormal vitals'}. `;
    } else {
        summary += `Vitals are stable, focusing on symptomatic management. `;
    }
    if (history.diabetes || history.hypertension) {
        summary += `Chronic conditions (${history.diabetes ? 'Diabetes' : ''} ${history.hypertension ? 'Hypertension' : ''}) are complicating factors.`;
    }

    return {
        risk_level: riskLevel,
        emergency_score: finalScore,
        priority: priority,
        admission_needed: admission,
        icu_needed: icu,
        department: dept,
        doctor_alert: docAlert,
        nurse_actions: nurseActions,
        recommended_tests: tests,
        possible_conditions: conditions,
        followup_days: finalScore > 70 ? 1 : 7,
        ai_summary: summary
    };
};

module.exports = { analyzePatientRisk };
