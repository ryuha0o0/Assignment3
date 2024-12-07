const jwtUtil = require('../utils/jwt');
const { User } = require('../models'); // Sequelize 모델 가져오기

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwtUtil.verifyToken(token);

        console.log('Decoded Token:', decoded); // 디버깅 로그
        console.log('User Model:', User); // User 모델 확인

        const user = await User.findByPk(decoded.id); // 기본 키(id)로 사용자 검색
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        res.status(401).json({
            error: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
        });
    }
};

module.exports = authMiddleware;
