const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Tables
initDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/triage', require('./routes/triageRoutes')); // AI Analysis Route
app.post('/api/analyze-patient', require('./controllers/triageController').analyzePatient); // Specific requirement alias
app.post('/api/translate', require('./controllers/translateController').translateText); // Multilingual Translation Route

// NEW: Triage Queue & Booking Routes
app.use('/triage', require('./routes/triage')); // Triage Queue Management
app.use('/booking', require('./routes/booking')); // Doctor Booking System

app.get('/', (req, res) => {
    res.send('VoiceTriage AI API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
