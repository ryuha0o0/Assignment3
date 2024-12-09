const jwtUtil = require('../utils/jwt'); // JWT 유틸리티 모듈
const { User } = require('../models'); // Sequelize User 모델

// 인증 미들웨어
const authMiddleware = async (req, res, next) => {
    try {
        // Authorization 헤더 확인
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Bearer 토큰에서 실제 토큰 추출
        const token = authHeader.split(' ')[1];

        // JWT 토큰 검증 및 디코딩
        const decoded = jwtUtil.verifyToken(token);
        console.log('Decoded Token:', decoded); // 디버깅 로그

        // User 모델에서 사용자 조회
        const user = await User.findByPk(decoded.id); // 기본 키(id)로 사용자 검색
        console.log('Authenticated User:', user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 요청 객체에 사용자 정보 추가
        req.user = user;
        next(); // 다음 미들웨어로 진행
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        res.status(401).json({
            error: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
        });
    }
};

module.exports = authMiddleware;
