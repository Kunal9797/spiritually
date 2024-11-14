const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { authenticateToken };