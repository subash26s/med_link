const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.post('/send', smsController.sendSMS);
router.get('/logs', smsController.getLogs);

router.get('/settings', smsController.getSettings);
router.post('/settings', smsController.updateSettings);

router.post('/medications/reminder', smsController.sendMedicationReminder);

module.exports = router;
