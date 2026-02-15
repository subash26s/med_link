const path = require('path');
const { readJson, writeJson, ensureFile } = require('../utils/jsonStore');

const LOGS_FILE = path.join(__dirname, '../data/sms_logs.json');
const SETTINGS_FILE = path.join(__dirname, '../data/sms_settings.json');

// Ensure files exist on load
ensureFile(LOGS_FILE, []);
ensureFile(SETTINGS_FILE, { mode: "demo" });

const sendSMS = async ({ to, message, type, scheduled_for, patient_id, meta = {} }) => {
    try {
        const settings = readJson(SETTINGS_FILE);
        const mode = settings.mode || 'demo';

        if (mode === 'demo') {
            console.log(`[SMS-DEMO] To: ${to} | Msg: ${message}`);

            const logs = readJson(LOGS_FILE);

            const newLog = {
                id: `SMS${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                to,
                patient_id,
                type, // 'appointment', 'medication', 'emergency'
                message,
                scheduled_for: scheduled_for || new Date().toISOString(),
                sent_at: new Date().toISOString(),
                status: "sent", // In demo mode, it's always "sent"
                provider: "demo",
                meta // Any extra data like doctor_id, medication_id
            };

            logs.unshift(newLog); // Add to start
            writeJson(LOGS_FILE, logs);

            return { success: true, provider: "demo", log_id: newLog.id };
        } else if (mode === 'twilio') {
            // Future Twilio implementation
            // const client = require('twilio')(accountSid, authToken);
            // ...
            console.log("Twilio mode not fully configured yet. Falling back to log.");
            return { success: false, error: "Twilio not configured" };
        }

        return { success: false, error: "Unknown mode" };
    } catch (error) {
        console.error("SMS Service Error:", error);
        return { success: false, error: error.message };
    }
};

const getLogs = (filters = {}) => {
    const logs = readJson(LOGS_FILE);

    // Filter logic
    return logs.filter(log => {
        let match = true;
        if (filters.patient_id && log.patient_id !== filters.patient_id) match = false;
        if (filters.to && log.to !== filters.to) match = false;
        if (filters.type && log.type !== filters.type) match = false;
        return match;
    });
};

const getSettings = () => {
    return readJson(SETTINGS_FILE);
};

const updateSettings = (newSettings) => {
    const current = readJson(SETTINGS_FILE);
    const updated = { ...current, ...newSettings };
    writeJson(SETTINGS_FILE, updated);
    return updated;
};

module.exports = {
    sendSMS,
    getLogs,
    getSettings,
    updateSettings
};
