const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Patient Booking: POST /api/appointments/book
router.post('/book', appointmentController.bookAppointment);

// Patient History: GET /api/appointments?patient_id=P001
router.get('/', appointmentController.getPatientAppointments);

// Doctor Actions
router.post('/accept', appointmentController.acceptAppointment);
router.post('/reject', appointmentController.rejectAppointment);

module.exports = router;
