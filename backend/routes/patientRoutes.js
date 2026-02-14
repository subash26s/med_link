const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken, isMedicalStaff, isAdmin } = require('../middleware/authMiddleware');

// Public route for Kiosk - No token required for MVP
router.post('/intake', patientController.intake);
router.post('/:id/vitals', [verifyToken, isMedicalStaff], patientController.updateVitals);
// Doctors see queue
router.get('/queue', [verifyToken, isMedicalStaff], patientController.getQueue);
router.get('/:id', [verifyToken, isMedicalStaff], patientController.getPatientDetails);
router.post('/:id/notes', [verifyToken, isMedicalStaff], patientController.addNote);
router.patch('/:id/status', [verifyToken, isMedicalStaff], patientController.updateStatus);

router.get('/stats', [verifyToken, isAdmin], patientController.getStats);

module.exports = router;
