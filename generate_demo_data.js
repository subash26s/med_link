const fs = require('fs');
const { analyzePatientRisk } = require('./backend/ai/riskModel');

const indianMaleNames = ['Rahul', 'Amit', 'Rajesh', 'Vikram', 'Sanjay', 'Arjun', 'Vijay', 'Sandeep', 'Anil', 'Manoj', 'Ravi', 'Deepak', 'Alok', 'Sunil', 'Kishore', 'Mohan', 'Aditya', 'Suresh', 'Ramesh', 'Kartik', 'Vivek', 'Prateek', 'Sameer', 'Nitin', 'Varun'];
const indianFemaleNames = ['Priya', 'Sunita', 'Lakshmi', 'Anjali', 'Kavita', 'Meena', 'Deepika', 'Sneha', 'Shweta', 'Pooja', 'Neha', 'Ritu', 'Anita', 'Swati', 'Geeta', 'Radha', 'Ishani', 'Divya', 'Komal', 'Maya', 'Nisha', 'Asha', 'Jyoti', 'Preeti', 'Sonia'];
const surnames = ['Sharma', 'Kumar', 'Verma', 'Singh', 'Patel', 'Gupta', 'Reddy', 'Nair', 'Iyer', 'Das', 'Joshi', 'Mishra', 'Yadav', 'Kulkarni', 'Bose', 'Choudhury', 'Rao', 'Desai', 'Saxena', 'Trivedi'];

const doctors = [
    { name: 'Dr. Priya Sharma', dept: 'Cardiology' },
    { name: 'Dr. Rajesh Kumar', dept: 'General Medicine' },
    { name: 'Dr. Naveen Reddy', dept: 'Emergency' },
    { name: 'Dr. Sarah Wilson', dept: 'Neurology' },
    { name: 'Dr. Amit Gupta', dept: 'Pediatrics' },
    { name: 'Dr. Kavita Nair', dept: 'Orthopedics' },
    { name: 'Dr. Sanjay Joshi', dept: 'Cardiology' },
    { name: 'Dr. Anjali Desai', dept: 'General Medicine' }
];

const insuranceProviders = ['Star Health', 'ICICI Lombard', 'Apollo Insurance', 'HDFC Ergo', 'LIC', 'Niva Bupa', 'Reliance General'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const departments = ['Cardiology', 'General Medicine', 'Neurology', 'Pediatrics', 'Orthopedics', 'Emergency', 'Gastroenterology', 'Dermatology'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateData = () => {
    const patients = [];
    for (let i = 1; i <= 50; i++) {
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        const firstName = gender === 'Male' ? getRandom(indianMaleNames) : getRandom(indianFemaleNames);
        const lastName = getRandom(surnames);
        const name = `${firstName} ${lastName}`;
        const patient_id = `P${String(i).padStart(3, '0')}`;
        const age = getRandomInt(18, 85);
        const doctorObj = getRandom(doctors);

        const vitals = {
            blood_pressure_systolic: getRandomInt(110, 170),
            blood_pressure_diastolic: getRandomInt(70, 110),
            heart_rate: getRandomInt(60, 120),
            temperature: (getRandomInt(970, 1020) / 10).toFixed(1),
            spo2: getRandomInt(88, 100),
            pain_level: getRandomInt(0, 10)
        };

        const symptoms = {
            chest_pain: Math.random() > 0.8,
            fever: Math.random() > 0.7,
            cough: Math.random() > 0.6,
            breathing_difficulty: Math.random() > 0.8,
            headache: Math.random() > 0.5,
            dizziness: Math.random() > 0.7,
            vomiting: Math.random() > 0.8
        };

        const conditions = {
            diabetes: Math.random() > 0.7,
            hypertension: Math.random() > 0.7,
            heart_disease: Math.random() > 0.8,
            asthma: Math.random() > 0.8,
            pregnant: gender === 'Female' && age < 45 && Math.random() > 0.9,
            smoker: Math.random() > 0.8
        };

        // Prepare data for AI analysis
        const analysisInput = {
            age,
            ...vitals,
            ...symptoms,
            ...conditions
        };

        const riskAnalysis = analyzePatientRisk(analysisInput);

        // Map risk level to color category
        let category = 'Green';
        if (riskAnalysis.risk_level === 'Critical') category = 'Red';
        else if (riskAnalysis.risk_level === 'High') category = 'Orange';
        else if (riskAnalysis.risk_level === 'Medium') category = 'Yellow';


        patients.push({
            patient_id,
            name,
            age,
            gender,
            blood_group: getRandom(bloodGroups),
            phone: `9${getRandomInt(100000000, 999999999)}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
            vitals,
            symptoms,
            conditions,

            // AI Generated Fields
            risk_level: riskAnalysis.risk_level,
            emergency_score: riskAnalysis.emergency_score,
            triage_category: category,
            recommended_action: riskAnalysis.nurse_actions[0],
            ai_summary: riskAnalysis.ai_summary,

            doctor_assigned: doctorObj.name,
            department: doctorObj.dept,
            hospital_clinic_id: 'H001',
            visit_type: getRandom(['Emergency', 'Routine', 'Follow-up']),
            insurance_provider: getRandom(insuranceProviders),
            last_checkup_date: `2026-0${getRandomInt(1, 2)}-${getRandomInt(1, 28)}`,
            next_appointment_date: `2026-02-${getRandomInt(15, 28)}`,
            recent_diagnosis: getRandom(['Mild Hypertension', 'Type 2 Diabetes', 'Gastritis', 'Vitamin D Deficiency', 'Acute Bronchitis', 'Stable Angina']),
            chronic_disease_history: Math.random() > 0.5 ? 'Diabetes, Hypertension' : 'None',
            family_medical_history: Math.random() > 0.7 ? 'Heart disease, Diabetes' : 'None'
        });
    }

    const appointments = [];
    for (let i = 1; i <= 200; i++) {
        const p = getRandom(patients);
        const d = getRandom(doctors);
        appointments.push({
            appointment_id: `A${String(i).padStart(3, '0')}`,
            patient_id: p.patient_id,
            doctor: d.name,
            department: d.dept,
            date: `2026-0${getRandomInt(2, 3)}-${getRandomInt(1, 28)}`,
            time: `${getRandomInt(9, 17)}:${getRandom(['00', '15', '30', '45'])} ${getRandom(['AM', 'PM'])}`,
            status: getRandom(['Upcoming', 'Completed', 'Cancelled', 'Critical'])
        });
    }

    const reports = [];
    const reportTypes = ['Blood Test', 'X-Ray', 'ECG', 'MRI Scan', 'Lipid Profile', 'Urine Analysis', 'Thyroid Profile'];
    const results = ['Normal', 'Abnormal', 'Requires Review', 'High Cholesterol', 'Mild Infection', 'Trace Glucose Found'];
    for (let i = 1; i <= 100; i++) {
        const p = getRandom(patients);
        reports.push({
            report_id: `R${String(i).padStart(3, '0')}`,
            patient_id: p.patient_id,
            type: getRandom(reportTypes),
            date: `2026-0${getRandomInt(1, 2)}-${getRandomInt(1, 28)}`,
            result: getRandom(results)
        });
    }

    const vitals_history = [];
    for (let i = 1; i <= 200; i++) {
        const p = getRandom(patients);
        vitals_history.push({
            vitals_id: `V${String(i).padStart(3, '0')}`,
            patient_id: p.patient_id,
            systolic: getRandomInt(110, 160),
            diastolic: getRandomInt(70, 100),
            heart_rate: getRandomInt(65, 110),
            temp: (getRandomInt(975, 1010) / 10).toFixed(1),
            spo2: getRandomInt(92, 100),
            recorded_at: `2026-02-${getRandomInt(1, 14)} ${getRandomInt(8, 20)}:00`
        });
    }

    const fullData = { patients, appointments, reports, vitals_history };
    fs.writeFileSync('demo_data.json', JSON.stringify(fullData, null, 2));
    console.log('Successfully generated demo_data.json with AI integration');
};

generateData();
