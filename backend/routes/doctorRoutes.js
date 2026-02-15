const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Doctor Schedule: GET /api/doctor/appointments?doctor_id=D1
router.get('/dashboard', appointmentController.getDoctorDashboard);
router.get('/reports', appointmentController.getDoctorReports);
router.get('/requests', appointmentController.getDoctorRequests);
router.get('/appointments', appointmentController.getDoctorAppointments);
router.get('/schedule', appointmentController.getDoctorSchedule);
router.get('/schedule/week', appointmentController.getDoctorWeekSummary);

// Actions
router.post('/requests/accept', appointmentController.acceptAppointment);
router.post('/requests/reject', appointmentController.rejectAppointment);
router.post('/appointments/complete', appointmentController.completeAppointment);

module.exports = router;
