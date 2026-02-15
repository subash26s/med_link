const fs = require('fs').promises;
const path = require('path');
const reminderService = require('../services/reminderService');
const smsService = require('../services/smsService');
const notificationService = require('../services/notificationService');
const { pool } = require('../config/db');

const DATA_DIR = path.join(__dirname, '../data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const DOCTORS_FILE = path.join(DATA_DIR, 'doctors.json');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');

// Helper to read JSON
async function readJSON(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${file}:`, err);
        return [];
    }
}

// Helper to write JSON
async function writeJSON(file, data) {
    try {
        await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error(`Error writing ${file}:`, err);
        return false;
    }
}

// Helper: Get Patient Details
async function getPatientDetails(patientId) {
    // Try patients.json first (P001 format)
    const patients = await readJSON(PATIENTS_FILE);
    const p = patients.find(pt => pt.patient_id === patientId || pt.id === patientId || pt.patient_id == patientId); // loose equality for string/int mix
    if (p) return p;

    // Fallback: Check SQLite if available (optional/hybrid)
    // For this specific task, we stick to JSON as requested.
    return { name: "Unknown Patient", patient_id: patientId };
}

// Helper: Get Doctor Details
async function getDoctorDetails(doctorId) {
    const doctors = await readJSON(DOCTORS_FILE);
    return doctors.find(d => d.id === doctorId) || { name: "Unknown Doctor", id: doctorId };
}

// 1. PATIENT BOOKING
exports.bookAppointment = async (req, res) => {
    try {
        const { patient_id, doctor_id, slot_time, branch = "Main Branch" } = req.body;

        if (!patient_id || !doctor_id || !slot_time) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const appointments = await readJSON(APPOINTMENTS_FILE);

        console.log("Incoming slot:", slot_time);

        const slotISO = new Date(slot_time).toISOString();

        // Strict overlap check (ISO String comparison)
        const existing = appointments.find(a =>
            a.doctor_id === doctor_id &&
            new Date(a.slot_time).toISOString() === slotISO &&
            a.status === 'booked'
        );

        if (existing) {
            console.log("Conflict found with:", existing);
            return res.status(409).json({ success: false, message: "Slot already booked" });
        }

        const newAppointment = {
            appointment_id: `APT${Date.now()}`,
            patient_id,
            doctor_id,
            slot_time,
            branch,
            patient_phone: req.body.phone || "+919360733882", // Default for demo matched to request
            status: 'pending',
            created_at: new Date().toISOString()
        };

        appointments.push(newAppointment);
        await writeJSON(APPOINTMENTS_FILE, appointments);

        // Schedule Reminders
        await reminderService.scheduleAppointmentReminders(newAppointment);

        // SEND SMS (Demo Mode)
        try {
            const doctor = await getDoctorDetails(doctor_id);
            const dateStr = new Date(slot_time).toLocaleString();
            const message = `MedHub+: Appointment request sent to ${doctor.name} for ${dateStr}. Pending confirmation.`;

            // Calculate 2 hours prior for "scheduled_for"
            const scheduledTime = new Date(new Date(slot_time).getTime() - 2 * 60 * 60 * 1000).toISOString();

            await smsService.sendSMS({
                to: newAppointment.patient_phone,
                patient_id,
                type: "appointment",
                message,
                scheduled_for: scheduledTime,
                meta: { appointment_id: newAppointment.appointment_id }
            });
            console.log("SMS Logic Executed for:", newAppointment.appointment_id);
        } catch (smsErr) {
            console.error("Failed to send booking SMS:", smsErr);
        }

        // NOTIFY DOCTOR
        await notificationService.addNotification({
            target_role: 'doctor',
            target_id: doctor_id,
            type: 'appointment_request',
            title: 'New Appointment Request',
            message: `New appointment request received for ${new Date(slot_time).toLocaleString()}.`,
            meta: { appointment_id: newAppointment.appointment_id, slot_time, patient_id }
        });

        res.json({ success: true, message: "Appointment request sent to doctor", appointment: newAppointment });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 2. DOCTOR SCHEDULE & REQUESTS
// 2. DOCTOR SCHEDULE & REQUESTS
// 2. DOCTOR SCHEDULE & REQUESTS
exports.getDoctorAppointments = async (req, res) => {
    try {
        const { doctor_id } = req.query;
        if (!doctor_id) return res.status(400).json({ success: false, message: "Doctor ID required" });

        const appointments = await readJSON(APPOINTMENTS_FILE);
        const myAppointments = appointments.filter(a => a.doctor_id === doctor_id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const pendingList = [];
        const todayList = [];
        const upcomingList = [];
        const completedList = [];

        for (const appt of myAppointments) {
            const apptDate = new Date(appt.slot_time);
            const patient = await getPatientDetails(appt.patient_id);

            const detailedAppt = {
                ...appt,
                // Legacy fields for Dashboard compatibility
                patient_name: patient.name,
                patient_age: patient.age,
                patient_gender: patient.gender,
                patient_symptoms: patient.symptoms,
                patient_risk: patient.risk_level || 'Low',

                // New nested structure for Appointments Page
                patient: {
                    name: patient.name,
                    age: patient.age,
                    gender: patient.gender,
                    risk_level: patient.risk_level || 'Low',
                    patient_id: patient.patient_id
                }
            };

            if (appt.status === 'pending') {
                pendingList.push(detailedAppt);
                continue;
            }

            if (appt.status === 'completed') {
                completedList.push(detailedAppt);
                continue;
            }

            if (appt.status === 'booked') {
                if (apptDate >= today && apptDate < tomorrow) {
                    todayList.push(detailedAppt);
                } else if (apptDate >= tomorrow) {
                    upcomingList.push(detailedAppt);
                }
            }
        }

        res.json({
            success: true,
            pending: pendingList,
            today: todayList,
            upcoming: upcomingList,
            completed: completedList
        });

    } catch (error) {
        console.error("Get Schedule Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getDoctorSchedule = async (req, res) => {
    try {
        const { doctor_id, date } = req.query;
        if (!doctor_id || !date) return res.status(400).json({ success: false, message: "Missing params" });

        const appointments = await readJSON(APPOINTMENTS_FILE);

        // Date range for the specific day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const dailyItems = [];

        for (const appt of appointments) {
            if (appt.doctor_id !== doctor_id) continue;
            // Include pending, booked, completed
            if (['cancelled', 'rejected'].includes(appt.status)) continue;

            const apptTime = new Date(appt.slot_time);
            if (apptTime >= startOfDay && apptTime <= endOfDay) {
                const patient = await getPatientDetails(appt.patient_id);
                dailyItems.push({
                    appointment_id: appt.appointment_id,
                    slot_time: appt.slot_time,
                    status: appt.status,
                    patient: {
                        patient_id: patient.patient_id,
                        name: patient.name,
                        age: patient.age,
                        gender: patient.gender,
                        risk_level: patient.risk_level || 'Low'
                    }
                });
            }
        }

        dailyItems.sort((a, b) => new Date(a.slot_time) - new Date(b.slot_time));

        res.json({ success: true, date, items: dailyItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getDoctorWeekSummary = async (req, res) => {
    try {
        const { doctor_id, weekStart } = req.query;
        if (!doctor_id || !weekStart) return res.status(400).json({ success: false, message: "Missing params" });

        const appointments = await readJSON(APPOINTMENTS_FILE);
        const result = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            d.setHours(0, 0, 0, 0);

            const nextD = new Date(d);
            nextD.setDate(d.getDate() + 1);

            const count = appointments.filter(a => {
                const t = new Date(a.slot_time);
                return a.doctor_id === doctor_id &&
                    a.status !== 'cancelled' &&
                    a.status !== 'rejected' &&
                    t >= d && t < nextD;
            }).length;

            result.push({
                date: d.toISOString().split('T')[0],
                count
            });
        }

        res.json({ success: true, weekStart, days: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getDoctorRequests = async (req, res) => {
    try {
        const { doctor_id } = req.query;
        if (!doctor_id) return res.status(400).json({ success: false, message: "Doctor ID required" });

        const appointments = await readJSON(APPOINTMENTS_FILE);
        const pending = appointments.filter(a => a.doctor_id === doctor_id && a.status === 'pending');

        const requests = [];
        for (const appt of pending) {
            const patient = await getPatientDetails(appt.patient_id);
            requests.push({
                ...appt,
                patient: {
                    patient_id: patient.patient_id,
                    name: patient.name,
                    age: patient.age,
                    risk_level: patient.risk_level || 'Low' // Ensure we have this for frontend badge
                }
            });
        }

        // Sort by creation time desc (newest first)
        requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json({ success: true, requests });
    } catch (error) {
        console.error("Get Requests Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 2.5 ACCEPT / REJECT
exports.acceptAppointment = async (req, res) => {
    try {
        const { appointment_id } = req.body;
        const appointments = await readJSON(APPOINTMENTS_FILE);
        const index = appointments.findIndex(a => a.appointment_id === appointment_id);

        if (index === -1) return res.status(404).json({ success: false, message: "Not found" });

        appointments[index].status = 'booked';
        await writeJSON(APPOINTMENTS_FILE, appointments);

        // Notify Patient
        const appt = appointments[index];
        const doctor = await getDoctorDetails(appt.doctor_id);
        // Notify Patient (SMS)
        try {
            await smsService.sendSMS({
                to: appt.patient_phone,
                patient_id: appt.patient_id,
                type: "appointment",
                message: `MedHub+: Appointment with ${doctor.name} on ${new Date(appt.slot_time).toLocaleString()} is CONFIRMED.`,
                scheduled_for: new Date().toISOString()
            });
        } catch (e) { console.error("SMS fail", e); }

        // Notify Patient (System)
        await notificationService.addNotification({
            target_role: 'patient',
            target_id: appt.patient_id,
            type: 'appointment_confirmed',
            title: 'Appointment Confirmed',
            message: `Dr. ${doctor.name} has confirmed your appointment for ${new Date(appt.slot_time).toLocaleString()}.`,
            meta: { appointment_id: appt.appointment_id }
        });

        res.json({ success: true, message: "Appointment Confirmed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.rejectAppointment = async (req, res) => {
    try {
        const { appointment_id } = req.body;
        const appointments = await readJSON(APPOINTMENTS_FILE);
        const index = appointments.findIndex(a => a.appointment_id === appointment_id);

        if (index === -1) return res.status(404).json({ success: false, message: "Not found" });

        appointments[index].status = 'rejected';
        await writeJSON(APPOINTMENTS_FILE, appointments);

        // Notify Patient
        const appt = appointments[index];
        const doctor = await getDoctorDetails(appt.doctor_id);

        await notificationService.addNotification({
            target_role: 'patient',
            target_id: appt.patient_id,
            type: 'appointment_rejected',
            title: 'Appointment Request Rejected',
            message: `Dr. ${doctor.name} has declined your appointment request for ${new Date(appt.slot_time).toLocaleString()}.`,
            meta: { appointment_id: appt.appointment_id }
        });

        res.json({ success: true, message: "Appointment Rejected" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. MARK COMPLETE
exports.completeAppointment = async (req, res) => {
    try {
        const { appointment_id, doctor_id } = req.body;

        const appointments = await readJSON(APPOINTMENTS_FILE);
        const index = appointments.findIndex(a => a.appointment_id === appointment_id && a.doctor_id === doctor_id);

        if (index === -1) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        appointments[index].status = 'completed';
        appointments[index].completed_at = new Date().toISOString();

        await writeJSON(APPOINTMENTS_FILE, appointments);
        res.json({ success: true, message: "Appointment marked as completed" });

    } catch (error) {
        console.error("Complete Appointment Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 4. PATIENT APPOINTMENTS
exports.getPatientAppointments = async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (!patient_id) return res.status(400).json({ success: false, message: "Patient ID required" });

        const appointments = await readJSON(APPOINTMENTS_FILE);
        const myAppointments = appointments.filter(a => a.patient_id == patient_id); // loose eq for safety

        const result = [];
        for (const appt of myAppointments) {
            const doctor = await getDoctorDetails(appt.doctor_id);
            result.push({
                ...appt,
                doctor_name: doctor.name,
                doctor_dept: doctor.department || doctor.specialty
            });
        }

        res.json({ success: true, appointments: result });

    } catch (error) {
        console.error("Patient History Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 5. DOCTOR DASHBOARD STATS
exports.getDoctorDashboard = async (req, res) => {
    try {
        const { doctor_id } = req.query;
        if (!doctor_id) return res.status(400).json({ success: false, message: "Doctor ID required" });

        // 1. Get Appointments Stats (JSON)
        const appointments = await readJSON(APPOINTMENTS_FILE);
        const myAppointments = appointments.filter(a => a.doctor_id === doctor_id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let pendingCount = 0;
        let todayCount = 0;
        let completedTodayCount = 0;
        let nextAppointment = null;

        const recentActivity = []; // Mock activity log from appointments

        for (const appt of myAppointments) {
            const apptDate = new Date(appt.slot_time);

            if (appt.status === 'pending') pendingCount++;

            if (appt.status === 'booked') {
                if (apptDate >= today && apptDate < tomorrow) {
                    todayCount++;
                }
                // Find next upcoming
                if (apptDate > new Date() && (!nextAppointment || apptDate < new Date(nextAppointment.slot_time))) {
                    const pat = await getPatientDetails(appt.patient_id);
                    nextAppointment = { ...appt, patient_name: pat.name, time_str: apptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
                }
            }

            if (appt.status === 'completed') {
                const completedDate = new Date(appt.completed_at || appt.created_at); // fallback
                if (completedDate >= today && completedDate < tomorrow) {
                    completedTodayCount++;
                }
                recentActivity.push({
                    type: 'completed',
                    text: `Completed appointment with patient ${appt.patient_id}`,
                    time: completedDate,
                    id: appt.appointment_id
                });
            } else if (appt.status === 'booked') {
                recentActivity.push({
                    type: 'booked',
                    text: `Confirmed appointment for ${apptDate.toLocaleDateString()}`,
                    time: new Date(appt.created_at), // Approximate
                    id: appt.appointment_id
                });
            }
        }

        // Sort recent activity
        recentActivity.sort((a, b) => b.time - a.time);
        const latestActivity = recentActivity.slice(0, 5);

        // 2. Get Critical Patients Count (SQLite)
        // We need to count patients with triage_category='red' and status='waiting'
        // Since we are mocking hybrid, we try pool query
        let criticalCount = 0;
        try {
            const [rows] = await pool.query("SELECT COUNT(*) as count FROM patients WHERE triage_category = 'red' AND status = 'waiting'"); // Adjusted query
            criticalCount = rows[0]?.count || 0;
        } catch (dbErr) {
            console.warn("SQLite fetch failed for dashboard stats, defaulting to 0", dbErr);
        }

        res.json({
            success: true,
            stats: {
                pending_requests: pendingCount,
                today_appointments: todayCount,
                completed_today: completedTodayCount,
                critical_patients: criticalCount
            },
            next_appointment: nextAppointment,
            recent_activity: latestActivity
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 6. DOCTOR REPORTS (MOCK)
exports.getDoctorReports = async (req, res) => {
    res.json({
        success: true,
        reports: [
            { id: 1, patient_name: "Rahul Verma", type: "X-Ray", date: "2026-02-14", status: "Available" },
            { id: 2, patient_name: "Meena Lakshmi", type: "Blood Test", date: "2026-02-13", status: "Reviewed" },
            { id: 3, patient_name: "Sanjay Patel", type: "MRI Scan", date: "2026-02-12", status: "Pending" }
        ]
    });
};
