const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
// router.post('/register', authController.register); // Login handles auto-registration for MVP
router.get('/users', authController.getUsers);

module.exports = router;
