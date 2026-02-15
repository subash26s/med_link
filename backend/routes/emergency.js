const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

// Emergency endpoints
router.post('/call-nurse', emergencyController.callNurse);
router.post('/call-ambulance', emergencyController.callAmbulance);
router.post('/broadcast-sos', emergencyController.broadcastSOS);
router.post('/triage', emergencyController.triageMode);
router.get('/events', emergencyController.getEmergencyEvents);

module.exports = router;
