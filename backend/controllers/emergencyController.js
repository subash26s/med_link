const fs = require('fs').promises;
const path = require('path');

// Data file paths
const DATA_DIR = path.join(__dirname, '../data');
const STAFF_FILE = path.join(DATA_DIR, 'staff.json');
const AMBULANCE_FILE = path.join(DATA_DIR, 'ambulance_contacts.json');
const EMERGENCY_CONTACTS_FILE = path.join(DATA_DIR, 'emergency_contacts.json');
const EMERGENCY_EVENTS_FILE = path.join(DATA_DIR, 'emergency_events.json');
const TRIAGE_QUEUE_FILE = path.join(DATA_DIR, 'triage_queue.json');

// Helper function to read JSON file
async function readJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
}

// Helper function to write JSON file
async function writeJSONFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// Generate unique event ID
function generateEventId() {
    return `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 1. CALL NURSE
exports.callNurse = async (req, res) => {
    try {
        const { patient_id, hospital_clinic_id = 'H001', message = '' } = req.body;

        if (!patient_id) {
            return res.status(400).json({ success: false, message: 'Patient ID is required' });
        }

        // Read staff data
        const staff = await readJSONFile(STAFF_FILE);

        // Find available nurse in the same hospital
        const availableNurse = staff.find(
            s => s.role === 'nurse' && s.available === true && s.hospital_clinic_id === hospital_clinic_id
        );

        const event_id = generateEventId();
        const timestamp = new Date().toISOString();

        // Create emergency event
        const event = {
            event_id,
            type: 'call_nurse',
            patient_id,
            hospital_clinic_id,
            message,
            timestamp,
            status: availableNurse ? 'assigned' : 'pending',
            assigned_staff: availableNurse ? availableNurse.id : null
        };

        // Save event
        const events = await readJSONFile(EMERGENCY_EVENTS_FILE);
        events.push(event);
        await writeJSONFile(EMERGENCY_EVENTS_FILE, events);

        if (availableNurse) {
            // Mark nurse as busy temporarily (in real app, would use timeout or manual resolution)
            const staffIndex = staff.findIndex(s => s.id === availableNurse.id);
            if (staffIndex !== -1) {
                staff[staffIndex].available = false;
                await writeJSONFile(STAFF_FILE, staff);

                // Auto-release after 10 minutes (simulation)
                setTimeout(async () => {
                    const currentStaff = await readJSONFile(STAFF_FILE);
                    const idx = currentStaff.findIndex(s => s.id === availableNurse.id);
                    if (idx !== -1) {
                        currentStaff[idx].available = true;
                        await writeJSONFile(STAFF_FILE, currentStaff);
                    }
                }, 10 * 60 * 1000); // 10 minutes
            }

            return res.json({
                success: true,
                nurse: {
                    id: availableNurse.id,
                    name: availableNurse.name,
                    phone: availableNurse.phone
                },
                event_id,
                message: `Nurse ${availableNurse.name} has been notified. ETA: 3-5 minutes`,
                simulation_mode: true
            });
        } else {
            return res.json({
                success: false,
                message: 'No nurse available at the moment. Escalating to front desk.',
                event_id,
                simulation_mode: true
            });
        }
    } catch (error) {
        console.error('Call Nurse Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// 2. CALL AMBULANCE
exports.callAmbulance = async (req, res) => {
    try {
        const { patient_id, pickup_location = 'Hospital Main Entrance', hospital_clinic_id = 'H001' } = req.body;

        if (!patient_id) {
            return res.status(400).json({ success: false, message: 'Patient ID is required' });
        }

        // Read ambulance contacts
        const ambulances = await readJSONFile(AMBULANCE_FILE);

        // Find available ambulance
        const availableAmbulance = ambulances.find(a => a.available === true);

        const event_id = generateEventId();
        const timestamp = new Date().toISOString();

        // Create emergency event
        const event = {
            event_id,
            type: 'call_ambulance',
            patient_id,
            hospital_clinic_id,
            pickup_location,
            timestamp,
            status: availableAmbulance ? 'dispatched' : 'pending',
            ambulance_id: availableAmbulance ? availableAmbulance.id : null
        };

        // Save event
        const events = await readJSONFile(EMERGENCY_EVENTS_FILE);
        events.push(event);
        await writeJSONFile(EMERGENCY_EVENTS_FILE, events);

        if (availableAmbulance) {
            return res.json({
                success: true,
                ambulance: {
                    provider: availableAmbulance.provider,
                    phone: availableAmbulance.phone,
                    id: availableAmbulance.id
                },
                event_id,
                message: `Ambulance dispatched from ${availableAmbulance.provider}. ETA: 10-15 minutes`,
                pickup_location,
                simulation_mode: true
            });
        } else {
            return res.json({
                success: false,
                message: 'All ambulances are currently busy. Request has been queued.',
                event_id,
                simulation_mode: true
            });
        }
    } catch (error) {
        console.error('Call Ambulance Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// 3. BROADCAST SOS
exports.broadcastSOS = async (req, res) => {
    try {
        const { patient_id, hospital_clinic_id = 'H001', alert_level = 'critical', note = '' } = req.body;

        if (!patient_id) {
            return res.status(400).json({ success: false, message: 'Patient ID is required' });
        }

        // Read emergency contacts
        const contacts = await readJSONFile(EMERGENCY_CONTACTS_FILE);

        const event_id = generateEventId();
        const timestamp = new Date().toISOString();

        // Create emergency event
        const event = {
            event_id,
            type: 'broadcast_sos',
            patient_id,
            hospital_clinic_id,
            alert_level,
            note,
            timestamp,
            status: 'broadcast',
            notified_contacts: contacts.map(c => ({ type: c.type, name: c.name, phone: c.phone }))
        };

        // Save event
        const events = await readJSONFile(EMERGENCY_EVENTS_FILE);
        events.push(event);
        await writeJSONFile(EMERGENCY_EVENTS_FILE, events);

        return res.json({
            success: true,
            notified: contacts.map(c => ({ type: c.type, name: c.name, phone: c.phone })),
            event_id,
            message: `SOS broadcast sent to ${contacts.length} emergency contacts`,
            alert_level,
            simulation_mode: true
        });
    } catch (error) {
        console.error('Broadcast SOS Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// 4. TRIAGE MODE
exports.triageMode = async (req, res) => {
    try {
        const { patient_id } = req.body;

        if (!patient_id) {
            return res.status(400).json({ success: false, message: 'Patient ID is required' });
        }

        // In a real app, fetch patient data from database
        // For demo, we'll use mock patient data or check if patient exists
        const db = req.app.get('db');

        let patient;
        try {
            patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(patient_id);
        } catch (error) {
            console.error('Database error:', error);
        }

        // If no patient found, create mock data for demo
        if (!patient) {
            patient = {
                id: patient_id,
                name: 'Demo Patient',
                age: 35,
                gender: 'Male',
                symptoms: 'chest_pain,breathing_difficulty',
                vitals_json: JSON.stringify({
                    temperature: 98.6,
                    heart_rate: 95,
                    spo2: 88,
                    bp_systolic: 145,
                    bp_diastolic: 92
                })
            };
        }

        // Parse vitals
        let vitals = {};
        try {
            vitals = patient.vitals_json ? JSON.parse(patient.vitals_json) : {};
        } catch (e) {
            vitals = {};
        }

        // Parse symptoms
        const symptoms = patient.symptoms ? patient.symptoms.split(',') : [];

        // TRIAGE LOGIC
        let risk_level = 'LOW';
        let urgency_score = 30;
        let recommended_action = 'Standard consultation';
        let recommended_department = 'General Medicine';

        // Critical conditions
        if (
            (vitals.spo2 && vitals.spo2 < 90) ||
            symptoms.includes('breathing_difficulty') ||
            (symptoms.includes('chest_pain') && vitals.bp_systolic > 140)
        ) {
            risk_level = 'CRITICAL';
            urgency_score = 95;
            recommended_action = 'Immediate medical attention required';
            recommended_department = 'Emergency / Cardiology';
        }
        // Medium risk
        else if (
            symptoms.includes('fever') ||
            (vitals.temperature && vitals.temperature > 101) ||
            symptoms.includes('cough') ||
            (vitals.heart_rate && vitals.heart_rate > 100)
        ) {
            risk_level = 'MEDIUM';
            urgency_score = 65;
            recommended_action = 'Priority consultation recommended';
            recommended_department = 'General Medicine';
        }

        const event_id = generateEventId();
        const timestamp = new Date().toISOString();

        // Create triage result
        const triageResult = {
            event_id,
            patient_id,
            patient_name: patient.name || 'Unknown',
            risk_level,
            urgency_score,
            recommended_action,
            recommended_department,
            vitals,
            symptoms,
            timestamp,
            status: 'active'
        };

        // Save to triage queue
        const triageQueue = await readJSONFile(TRIAGE_QUEUE_FILE);
        triageQueue.push(triageResult);
        await writeJSONFile(TRIAGE_QUEUE_FILE, triageQueue);

        // Also log as emergency event
        const event = {
            event_id,
            type: 'triage_mode',
            patient_id,
            risk_level,
            urgency_score,
            timestamp,
            status: 'completed'
        };

        const events = await readJSONFile(EMERGENCY_EVENTS_FILE);
        events.push(event);
        await writeJSONFile(EMERGENCY_EVENTS_FILE, events);

        return res.json({
            success: true,
            event_id,
            risk_level,
            urgency_score,
            recommended_action,
            recommended_department,
            vitals,
            symptoms,
            message: 'Triage assessment completed'
        });
    } catch (error) {
        console.error('Triage Mode Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// GET EMERGENCY EVENTS
exports.getEmergencyEvents = async (req, res) => {
    try {
        const { patient_id } = req.query;

        const events = await readJSONFile(EMERGENCY_EVENTS_FILE);

        if (patient_id) {
            const patientEvents = events.filter(e => e.patient_id === patient_id);
            return res.json({ success: true, events: patientEvents });
        }

        return res.json({ success: true, events });
    } catch (error) {
        console.error('Get Events Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
