const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Helper functions to read/write data
const getPatientsData = () => {
    const dataPath = path.join(__dirname, "../data/patients.json");
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
};

const savePatientsData = (patients) => {
    const dataPath = path.join(__dirname, "../data/patients.json");
    fs.writeFileSync(dataPath, JSON.stringify(patients, null, 2));
};

const getDoctorsData = () => {
    const dataPath = path.join(__dirname, "../data/doctors.json");
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
};

const saveDoctorsData = (doctors) => {
    const dataPath = path.join(__dirname, "../data/doctors.json");
    fs.writeFileSync(dataPath, JSON.stringify(doctors, null, 2));
};

// GET /booking/doctors - Get all doctors
router.get("/doctors", (req, res) => {
    try {
        const doctors = getDoctorsData();
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Failed to fetch doctors" });
    }
});

// GET /booking/doctors/:department - Get doctors by department
router.get("/doctors/:department", (req, res) => {
    try {
        const doctors = getDoctorsData();
        const filteredDoctors = doctors.filter(
            d => d.department.toLowerCase() === req.params.department.toLowerCase()
        );
        res.json(filteredDoctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Failed to fetch doctors" });
    }
});

// POST /booking/book - Book a doctor for a patient
router.post("/book", (req, res) => {
    try {
        const { patient_id, doctor_id } = req.body;

        if (!patient_id || !doctor_id) {
            return res.status(400).json({
                error: "Patient ID and Doctor ID are required"
            });
        }

        const patients = getPatientsData();
        const doctors = getDoctorsData();

        const patientIndex = patients.findIndex(p => p.patient_id === patient_id);
        const doctorIndex = doctors.findIndex(d => d.id === doctor_id);

        if (patientIndex === -1) {
            return res.status(404).json({ error: "Patient not found" });
        }

        if (doctorIndex === -1) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        const patient = patients[patientIndex];
        const doctor = doctors[doctorIndex];

        // Check if doctor is available
        if (!doctor.available) {
            return res.status(400).json({
                error: "Doctor is not available",
                message: `${doctor.name} is currently unavailable`
            });
        }

        // Check if doctor has reached max capacity
        if (doctor.current_patients >= doctor.max_patients) {
            return res.status(400).json({
                error: "Doctor at full capacity",
                message: `${doctor.name} has reached maximum patient capacity`
            });
        }

        // Check if patient is already booked
        if (patient.booking_status === "Booked") {
            return res.status(400).json({
                error: "Patient already booked",
                message: `${patient.name} is already assigned to ${patient.doctor_assigned}`
            });
        }

        // Update patient booking
        patients[patientIndex].doctor_assigned = doctor.name;
        patients[patientIndex].booking_status = "Booked";
        patients[patientIndex].booking_time = new Date().toISOString();

        // Update doctor availability
        doctors[doctorIndex].current_patients += 1;
        if (doctors[doctorIndex].current_patients >= doctors[doctorIndex].max_patients) {
            doctors[doctorIndex].available = false;
        }

        // Save updated data
        savePatientsData(patients);
        saveDoctorsData(doctors);

        res.json({
            success: true,
            message: "Booking confirmed successfully",
            booking: {
                patient: {
                    id: patient.patient_id,
                    name: patient.name,
                    risk_level: patient.risk_level
                },
                doctor: {
                    id: doctor.id,
                    name: doctor.name,
                    department: doctor.department
                },
                booking_time: patients[patientIndex].booking_time
            }
        });
    } catch (error) {
        console.error("Error booking doctor:", error);
        res.status(500).json({ error: "Failed to book doctor" });
    }
});

// POST /booking/cancel - Cancel a booking
router.post("/cancel", (req, res) => {
    try {
        const { patient_id } = req.body;

        if (!patient_id) {
            return res.status(400).json({ error: "Patient ID is required" });
        }

        const patients = getPatientsData();
        const doctors = getDoctorsData();

        const patientIndex = patients.findIndex(p => p.patient_id === patient_id);

        if (patientIndex === -1) {
            return res.status(404).json({ error: "Patient not found" });
        }

        const patient = patients[patientIndex];

        if (patient.booking_status !== "Booked") {
            return res.status(400).json({
                error: "No active booking found for this patient"
            });
        }

        // Find the doctor and free up their slot
        const doctorIndex = doctors.findIndex(d => d.name === patient.doctor_assigned);
        if (doctorIndex !== -1) {
            doctors[doctorIndex].current_patients -= 1;
            doctors[doctorIndex].available = true;
            saveDoctorsData(doctors);
        }

        // Clear patient booking
        patients[patientIndex].doctor_assigned = "";
        patients[patientIndex].booking_status = "Not Booked";
        delete patients[patientIndex].booking_time;

        savePatientsData(patients);

        res.json({
            success: true,
            message: "Booking cancelled successfully",
            patient: patients[patientIndex]
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ error: "Failed to cancel booking" });
    }
});

// GET /booking/status/:patient_id - Get booking status for a patient
router.get("/status/:patient_id", (req, res) => {
    try {
        const patients = getPatientsData();
        const patient = patients.find(p => p.patient_id === req.params.patient_id);

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json({
            patient_id: patient.patient_id,
            name: patient.name,
            booking_status: patient.booking_status,
            doctor_assigned: patient.doctor_assigned,
            booking_time: patient.booking_time || null
        });
    } catch (error) {
        console.error("Error fetching booking status:", error);
        res.status(500).json({ error: "Failed to fetch booking status" });
    }
});

module.exports = router;
