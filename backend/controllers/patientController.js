const { pool } = require('../config/db');
const { analyzePatientRisk } = require('../ai/riskModel');

exports.intake = async (req, res) => {
    const { name, age, gender, symptoms, transcribed_text } = req.body;

    // Initial Triage based on voice text alone
    const analysis = analyzePatientRisk({
        name, age, gender,
        symptoms, transcribed_text
    });

    const triageCategory = analysis.risk_level === 'EMERGENCY' || analysis.risk_level === 'HIGH' ? 'red' :
        analysis.risk_level === 'MEDIUM' ? 'yellow' : 'green';

    try {
        const [result] = await pool.query(
            'INSERT INTO patients (name, age, gender, symptoms, transcribed_text, priority_score, triage_category, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, age, gender, symptoms, transcribed_text, analysis.priority_score, triageCategory, 'waiting']
        );
        res.status(201).json({
            id: result.insertId,
            message: 'Patient intake successful',
            triage: triageCategory,
            score: analysis.priority_score,
            analysis
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.updateVitals = async (req, res) => {
    const { id } = req.params;
    const { bp_systolic, bp_diastolic, temperature, heart_rate, spo2 } = req.body;

    try {
        // 1. Save Vitals
        await pool.query(
            'INSERT INTO vitals (patient_id, bp_systolic, bp_diastolic, temperature, heart_rate, spo2) VALUES (?, ?, ?, ?, ?, ?)',
            [id, bp_systolic, bp_diastolic, temperature, heart_rate, spo2]
        );

        // 2. Recalculate Triage Score using AI Risk Model
        const [patientRows] = await pool.query('SELECT * FROM patients WHERE id = ?', [id]);
        const patient = patientRows[0];

        // Prepare data for AI model
        const aiInput = {
            patient_id: id,
            age: patient.age,
            gender: patient.gender,
            symptoms: patient.symptoms, // or transcribed_text
            transcribed_text: patient.transcribed_text,

            // Vitals from request
            blood_pressure_systolic: bp_systolic,
            blood_pressure_diastolic: bp_diastolic,
            temperature: temperature,
            heart_rate: heart_rate,
            spo2: spo2,

            // Parse symptoms from text (Basic keyword matching for MVP)
            symptom_chest_pain: (patient.transcribed_text || "").toLowerCase().includes('chest pain'),
            symptom_breathing_difficulty: (patient.transcribed_text || "").toLowerCase().includes('breath'),
            symptom_fever: (patient.transcribed_text || "").toLowerCase().includes('fever') || temperature > 37.5,
            symptom_cough: (patient.transcribed_text || "").toLowerCase().includes('cough'),
            symptom_headache: (patient.transcribed_text || "").toLowerCase().includes('headache'),
            symptom_dizziness: (patient.transcribed_text || "").toLowerCase().includes('dizzy'),
            pain_level: (patient.transcribed_text || "").match(/pain.*?(\d+)/i) ? parseInt((patient.transcribed_text || "").match(/pain.*?(\d+)/i)[1]) : 0,

            // Mock History (In real app, fetch from history table)
            diabetes: (patient.transcribed_text || "").toLowerCase().includes('diabetes'),
            hypertension: (patient.transcribed_text || "").toLowerCase().includes('pressure'),
            heart_disease: (patient.transcribed_text || "").toLowerCase().includes('heart'),
            smoker: (patient.transcribed_text || "").toLowerCase().includes('smok'),
            pregnant: (patient.transcribed_text || "").toLowerCase().includes('pregnant')
        };

        const analysis = analyzePatientRisk(aiInput);

        const triageCategory = analysis.risk_level === 'EMERGENCY' || analysis.risk_level === 'HIGH' ? 'red' :
            analysis.risk_level === 'MEDIUM' ? 'yellow' : 'green';

        // 3. Update Patient record with new score and status
        await pool.query(
            'UPDATE patients SET priority_score = ?, triage_category = ?, status = ? WHERE id = ?',
            [analysis.priority_score, triageCategory, 'with_nurse', id]
        );

        // Optional: Save AI notes/recommendations to notes table?
        if (analysis.recommendations.length > 0) {
            const aiNote = "AI TRIAGE: " + analysis.recommendations.join("; ");
            await pool.query('INSERT INTO notes (patient_id, note_text, doctor_name) VALUES (?, ?, ?)', [id, aiNote, 'AI System']);
        }

        res.json({ message: 'Vitals updated and triage score recalculated', triage: triageCategory, score: analysis.priority_score, analysis });

        // res.json({ message: 'Vitals updated and triage score recalculated', triage: category, score });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getQueue = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM patients WHERE status != 'discharged' ORDER BY priority_score DESC, created_at ASC");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getPatientDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [patientRows] = await pool.query('SELECT * FROM patients WHERE id = ?', [id]);
        if (patientRows.length === 0) return res.status(404).json({ message: 'Patient not found' });

        const [vitalsRows] = await pool.query('SELECT * FROM vitals WHERE patient_id = ? ORDER BY recorded_at DESC', [id]);
        const [notesRows] = await pool.query('SELECT * FROM notes WHERE patient_id = ? ORDER BY created_at DESC', [id]);

        res.json({
            ...patientRows[0],
            vitals: vitalsRows,
            notes: notesRows
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.addNote = async (req, res) => {
    const { id } = req.params;
    const { note_text, doctor_name } = req.body;
    try {
        await pool.query('INSERT INTO notes (patient_id, note_text, doctor_name) VALUES (?, ?, ?)', [id, note_text, doctor_name]);
        res.status(201).json({ message: 'Note added' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE patients SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getStats = async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN triage_category = 'red' THEN 1 ELSE 0 END) as red,
        SUM(CASE WHEN triage_category = 'yellow' THEN 1 ELSE 0 END) as yellow,
        SUM(CASE WHEN triage_category = 'green' THEN 1 ELSE 0 END) as green,
        AVG(priority_score) as avg_score
      FROM patients
      WHERE created_at >= DATE('now')
    `);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
