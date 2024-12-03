const jwtUtil = require('../utils/jwt');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwtUtil.verifyToken(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ error: `User not found for ID: ${decoded._id}` });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
    }
};

module.exports = authMiddleware;
