const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.role !== 'admin') return res.status(403).send({ message: 'Require Admin Role!' });
    next();
}

const isMedicalStaff = (req, res, next) => {
    if (req.role !== 'doctor' && req.role !== 'nurse' && req.role !== 'admin') {
        return res.status(403).send({ message: 'Require Medical Staff Role!' });
    }
    next();
}

module.exports = { verifyToken, isAdmin, isMedicalStaff };
