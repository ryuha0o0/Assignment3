const jwt = require('jsonwebtoken');

// JWT 생성
exports.generateToken = (user) => {
    if (!user || !user._id) {
        throw new Error('User payload must include _id');
    }

    const payload = { _id: user._id }; // MongoDB의 _id 사용
    const secret = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = process.env.JWT_EXPIRY || '1h';

    return jwt.sign(payload, secret, { expiresIn });
};


exports.verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET || 'default_secret'; // 비밀키
        const decoded = jwt.verify(token, secret);
        console.log('Decoded Token:', decoded); // 디버깅용 로그
        return decoded;
    } catch (error) {
        console.error('Token Verification Error:', error.message);
        throw new Error('Invalid or expired token');
    }
};
