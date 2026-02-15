const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');

// Medication Reminders
router.post('/medication', reminderController.createMedicationReminder);

// Test SMS
router.post('/test-sms', reminderController.testSMS);

// Handle STOP/Opt-out
router.post('/incoming', (req, res) => {
    const { Body, From } = req.body;
    console.log(`Incoming SMS from ${From}: ${Body}`);
    if (Body && Body.toUpperCase().includes('STOP')) {
        // Logic to update patient opt-out status (mocked for now)
        console.log(`Patient ${From} opted out.`);
    }
    res.set('Content-Type', 'text/xml');
    res.send('<Response></Response>');
});

module.exports = router;
