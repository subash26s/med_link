const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET /api/notifications
router.get('/', notificationController.getNotifications);

// POST /api/notifications/read
router.post('/read', notificationController.markAsRead);

module.exports = router;
