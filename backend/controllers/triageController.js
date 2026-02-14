const { analyzePatientRisk } = require('../ai/riskModel');
const { pool } = require('../config/db');

exports.analyzePatient = async (req, res) => {
    try {
        const patientData = req.body;

        // Run Advanced AI Analysis
        const analysis = analyzePatientRisk(patientData);

        // Map risk level for internal triage categories (colors)
        const triageCategory = analysis.risk_level === 'Critical' || analysis.risk_level === 'High' ? 'red' :
            analysis.risk_level === 'Medium' ? 'yellow' : 'green';

        // Save new patient record to database with full AI insights
        const [result] = await pool.query(
            `INSERT INTO patients (
                name, age, gender, phone, symptoms, transcribed_text, 
                priority_score, triage_category, status, 
                visit_type, insurance_provider, policy_number, medical_history, 
                vitals_json, doctor, department, risk_level, ai_analysis_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                patientData.name,
                patientData.age,
                patientData.gender,
                patientData.phone,
                patientData.symptoms,
                patientData.transcribed_text || patientData.symptoms,
                analysis.emergency_score,
                triageCategory,
                'waiting',
                patientData.visit_type,
                patientData.insurance_provider,
                patientData.policy_number,
                JSON.stringify({
                    diabetes: patientData.diabetes,
                    hypertension: patientData.hypertension,
                    heart_disease: patientData.heart_disease,
                    asthma: patientData.asthma,
                    pregnant: patientData.pregnant,
                    smoker: patientData.smoker,
                    current_medications: patientData.current_medications
                }),
                JSON.stringify({
                    temp: patientData.temperature,
                    hr: patientData.heart_rate,
                    sys: patientData.blood_pressure_systolic,
                    dia: patientData.blood_pressure_diastolic,
                    spo2: patientData.spo2
                }),
                analysis.doctor_alert.includes("Cardiology") ? "Dr. Arjun Mehta" : "General Physician",
                analysis.department,
                analysis.risk_level,
                JSON.stringify(analysis)
            ]
        );

        // Return the STRICT JSON FORMAT for frontend consumption
        res.json({
            patient_id: `VT-${result.insertId.toString().padStart(4, '0')}`,
            ...analysis
        });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: "Clinical Analysis Engine Offline." });
    }
};

exports.getTriageHistory = async (req, res) => {
    // Placeholder to fetch past analyses if stored in a separate table
    res.json({ message: "Not implemented for MVP" });
};
