const reminderService = require('../services/reminderService');

exports.createMedicationReminder = async (req, res) => {
    try {
        const { patient_id, phone, medication_name, dosage, times_per_day, start_date, end_date } = req.body;

        if (!patient_id || !medication_name || !start_date || !end_date) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const start = new Date(start_date);
        const end = new Date(end_date);
        const now = new Date();
        const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        let createdCount = 0;

        for (let i = 0; i <= durationDays; i++) {
            const currentDay = new Date(start);
            currentDay.setDate(start.getDate() + i);

            // Simple logic: distribute times per day from 9 AM to 9 PM
            // If 1 time: 9 AM
            // If 2 times: 9 AM, 9 PM
            // If 3 times: 9 AM, 3 PM, 9 PM

            const hours = [];
            if (times_per_day === 1) hours.push(9);
            else if (times_per_day === 2) hours.push(9, 21);
            else if (times_per_day === 3) hours.push(9, 15, 21);
            else hours.push(9); // Default fallback

            for (const hour of hours) {
                const sendAt = new Date(currentDay);
                sendAt.setHours(hour, 0, 0, 0);

                if (sendAt > now && sendAt <= end) {
                    const reminder = {
                        reminder_id: `MED-${Date.now()}-${createdCount}`,
                        type: 'medication',
                        patient_id,
                        phone: phone || "+15551234567", // Default
                        message: `MedHub+: Time to take your medication: ${medication_name} (${dosage}). Reply STOP to opt out.`,
                        send_at: sendAt.toISOString(),
                        status: 'scheduled',
                        created_at: new Date().toISOString()
                    };

                    await reminderService.addMedicationReminder(reminder);
                    createdCount++;
                }
            }
        }

        res.json({ success: true, message: `Created ${createdCount} medication reminders.` });

    } catch (error) {
        console.error("Medication Reminder Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.testSMS = async (req, res) => {
    const { to } = req.body;
    const twilioService = require('../services/twilioService');
    const result = await twilioService.sendSMS(to || "+15551234567", "MedHub+ test SMS working.");
    res.json(result);
};
