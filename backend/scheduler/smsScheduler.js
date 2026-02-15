const cron = require('node-cron');
const reminderService = require('../services/reminderService');
const twilioService = require('../services/twilioService');

// Run every minute
cron.schedule('* * * * *', async () => {
    console.log(`[Scheduler] Checking for pending SMS reminders...`);
    const pending = await reminderService.getPendingReminders();

    if (pending.length > 0) {
        console.log(`[Scheduler] Found ${pending.length} reminders.`);

        for (const reminder of pending) {
            // Check opt-out logic here if needed
            // For now, proceed

            const result = await twilioService.sendSMS(reminder.phone, reminder.message);

            if (result.success) {
                await reminderService.updateReminderStatus(reminder.reminder_id, 'sent', null, result.messageSid);
            } else {
                await reminderService.updateReminderStatus(reminder.reminder_id, 'failed', result.error);
            }
        }
    }
});
