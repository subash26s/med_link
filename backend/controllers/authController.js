const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

exports.login = async (req, res) => {
    const { username: email, password, role: selectedRole } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        // Logic for Patient Auto-Signup
        if (rows.length === 0) {
            if (selectedRole === 'patient') {
                const hashedPassword = await bcrypt.hash(password, 8);
                // Create new patient account automatically
                const [result] = await pool.query(
                    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    [email.split('@')[0], email, hashedPassword, 'patient']
                );

                const token = jwt.sign({ id: result.insertId, role: 'patient' }, process.env.JWT_SECRET || 'secret_key', {
                    expiresIn: 86400 // 24 hours
                });

                return res.status(200).send({
                    auth: true,
                    token: token,
                    role: 'patient',
                    username: email,
                    name: email.split('@')[0]
                });
            } else {
                // Doctors/Nurses/Admin must have predefined accounts
                return res.status(404).send({ auth: false, message: "Account not found" });
            }
        }

        const user = rows[0];
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, message: "Invalid credentials" });

        // Ensure user is logging in with the correct role (optional but safer)
        // If we strictly follow the prompt: "if role is admin/doctor/nurse: only allow login if account exists"
        // and "if patient exists -> login".

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            auth: true,
            token: token,
            role: user.role,
            username: user.email,
            name: user.name
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
