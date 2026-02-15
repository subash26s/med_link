const fs = require('fs').promises;
const path = require('path');

const REMINDERS_FILE = path.join(__dirname, '../data/reminders.json');

async function readReminders() {
    try {
        const data = await fs.readFile(REMINDERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

async function writeReminders(reminders) {
    await fs.writeFile(REMINDERS_FILE, JSON.stringify(reminders, null, 2), 'utf8');
}

exports.scheduleAppointmentReminders = async (appointment) => {
    const reminders = await readReminders();
    const slotTime = new Date(appointment.slot_time);

    // 24 hours before
    const time24h = new Date(slotTime.getTime() - 24 * 60 * 60 * 1000);
    if (time24h > new Date()) {
        reminders.push({
            reminder_id: `REM-${Date.now()}-24h`,
            type: 'appointment',
            patient_id: appointment.patient_id,
            phone: appointment.phone || '+1234567890', // Fallback if phone not in appointment
            appointment_id: appointment.appointment_id,
            message: `MedHub+: Reminder—You have an appointment tomorrow at ${slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Reply STOP to opt out.`,
            send_at: time24h.toISOString(),
            status: 'scheduled',
            created_at: new Date().toISOString()
        });
    }

    // 2 hours before
    const time2h = new Date(slotTime.getTime() - 2 * 60 * 60 * 1000);
    if (time2h > new Date()) {
        reminders.push({
            reminder_id: `REM-${Date.now()}-2h`,
            type: 'appointment',
            patient_id: appointment.patient_id,
            phone: appointment.phone || '+1234567890',
            appointment_id: appointment.appointment_id,
            message: `MedHub+: Appointment in 2 hours. Please arrive 10 mins early.`,
            send_at: time2h.toISOString(),
            status: 'scheduled',
            created_at: new Date().toISOString()
        });
    }

    await writeReminders(reminders);
};

exports.addMedicationReminder = async (reminderData) => {
    const reminders = await readReminders();
    reminders.push(reminderData);
    await writeReminders(reminders);
};

exports.getPendingReminders = async () => {
    const reminders = await readReminders();
    const now = new Date();
    return reminders.filter(r => r.status === 'scheduled' && new Date(r.send_at) <= now);
};

exports.updateReminderStatus = async (reminderId, status, error = null, messageSid = null) => {
    const reminders = await readReminders();
    const index = reminders.findIndex(r => r.reminder_id === reminderId);
    if (index !== -1) {
        reminders[index].status = status;
        if (status === 'sent') {
            reminders[index].sent_at = new Date().toISOString();
            reminders[index].messageSid = messageSid;
        }
        if (error) {
            reminders[index].error = error;
        }
        await writeReminders(reminders);
    }
};
