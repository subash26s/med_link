const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Helper function to read patients data
const getPatientsData = () => {
    const dataPath = path.join(__dirname, "../data/patients.json");
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
};

// Helper function to save patients data
const savePatientsData = (patients) => {
    const dataPath = path.join(__dirname, "../data/patients.json");
    fs.writeFileSync(dataPath, JSON.stringify(patients, null, 2));
};

// GET /triage/queue - Get all patients sorted by priority
router.get("/queue", (req, res) => {
    try {
        const patients = getPatientsData();

        // Sort by priority score (highest first)
        const sortedPatients = patients.sort((a, b) => b.priority_score - a.priority_score);

        // Categorize by risk level
        const critical = sortedPatients.filter(p => p.risk_level === "Critical");
        const medium = sortedPatients.filter(p => p.risk_level === "Medium");
        const low = sortedPatients.filter(p => p.risk_level === "Low");

        res.json({
            total: patients.length,
            critical,
            medium,
            low,
            all: sortedPatients
        });
    } catch (error) {
        console.error("Error fetching queue:", error);
        res.status(500).json({ error: "Failed to fetch triage queue" });
    }
});

// GET /triage/patient/:id - Get specific patient details
router.get("/patient/:id", (req, res) => {
    try {
        const patients = getPatientsData();
        const patient = patients.find(p => p.patient_id === req.params.id);

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ error: "Failed to fetch patient details" });
    }
});

// POST /triage/add - Add new patient to queue
router.post("/add", (req, res) => {
    try {
        const patients = getPatientsData();
        const newPatient = {
            patient_id: `P${String(patients.length + 1).padStart(3, '0')}`,
            ...req.body,
            doctor_assigned: "",
            booking_status: "Not Booked",
            arrival_time: new Date().toISOString()
        };

        patients.push(newPatient);
        savePatientsData(patients);

        res.status(201).json({
            message: "Patient added to triage queue",
            patient: newPatient
        });
    } catch (error) {
        console.error("Error adding patient:", error);
        res.status(500).json({ error: "Failed to add patient" });
    }
});

// PUT /triage/update/:id - Update patient status
router.put("/update/:id", (req, res) => {
    try {
        const patients = getPatientsData();
        const patientIndex = patients.findIndex(p => p.patient_id === req.params.id);

        if (patientIndex === -1) {
            return res.status(404).json({ error: "Patient not found" });
        }

        patients[patientIndex] = {
            ...patients[patientIndex],
            ...req.body
        };

        savePatientsData(patients);

        res.json({
            message: "Patient updated successfully",
            patient: patients[patientIndex]
        });
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ error: "Failed to update patient" });
    }
});

// DELETE /triage/remove/:id - Remove patient from queue (after discharge)
router.delete("/remove/:id", (req, res) => {
    try {
        const patients = getPatientsData();
        const filteredPatients = patients.filter(p => p.patient_id !== req.params.id);

        if (filteredPatients.length === patients.length) {
            return res.status(404).json({ error: "Patient not found" });
        }

        savePatientsData(filteredPatients);

        res.json({ message: "Patient removed from queue" });
    } catch (error) {
        console.error("Error removing patient:", error);
        res.status(500).json({ error: "Failed to remove patient" });
    }
});

module.exports = router;
