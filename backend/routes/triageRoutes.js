const express = require('express');
const router = express.Router();
const triageController = require('../controllers/triageController');

// Define API Endpoints
// POST /api/triage/analyze
router.post('/analyze', triageController.analyzePatient);

// GET /api/triage/history (Optional)
// router.get('/history', triageController.getTriageHistory);

module.exports = router;
