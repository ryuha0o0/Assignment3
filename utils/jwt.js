const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    if (!user || !user.id) {
        throw new Error('User payload must include id');
    }

    const payload = { id: user.id, email: user.email || 'user' };
    const secret = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = process.env.JWT_EXPIRY || '1d';

    return jwt.sign(payload, secret, { expiresIn });
};

exports.verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET || 'default_secret';
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
