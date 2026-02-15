const smsService = require('../services/smsService');

const sendSMS = async (req, res) => {
    try {
        const { to, patient_id, type, message, scheduled_for, meta } = req.body;

        if (!to || !message) {
            return res.status(400).json({ success: false, error: "Missing recipient or message" });
        }

        const result = await smsService.sendSMS({
            to,
            patient_id,
            type,
            message,
            scheduled_for: scheduled_for || new Date().toISOString(),
            meta
        });

        res.json({ success: true, ...result });

    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const getLogs = (req, res) => {
    try {
        const { patient_id, to, type } = req.query;
        const logs = smsService.getLogs({ patient_id, to, type });
        res.json({ logs });
    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSettings = (req, res) => {
    try {
        const settings = smsService.getSettings();
        res.json({ settings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const updateSettings = (req, res) => {
    try {
        const { mode } = req.body;
        const updated = smsService.updateSettings({ mode });
        res.json({ settings: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Medication Reminder specific logic
const sendMedicationReminder = async (req, res) => {
    try {
        const {
            patient_id,
            phone,
            medication_name,
            dosage,
            times, // ["09:00", "21:00"]
            start_date,
            end_date
        } = req.body;

        if (!phone || !medication_name || !times || !times.length) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        // Generate Reminders
        let count = 0;
        const start = new Date(start_date || new Date());
        const end = end_date ? new Date(end_date) : new Date(start);
        // Default to just start date if no end date provided

        // Loop through dates
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];

            for (const time of times) {
                const message = `MedHub+: Reminder - Take ${medication_name} (${dosage}) now.`;
                const scheduledFor = `${dateStr}T${time}:00`;

                await smsService.sendSMS({
                    to: phone,
                    patient_id,
                    type: "medication",
                    message,
                    scheduled_for: scheduledFor,
                    meta: { medication: medication_name, dosage }
                });
                count++;
            }
        }

        console.log(`Scheduled ${count} medication reminders for ${phone}`);
        res.json({ success: true, count, message: "Reminders scheduled successfully" });

    } catch (err) {
        console.error("Medication Reminder Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    sendSMS,
    getLogs,
    getSettings,
    updateSettings,
    sendMedicationReminder
};
