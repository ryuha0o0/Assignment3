const jwtUtil = require('../utils/jwt');
const { User } = require('../models/User'); // Sequelize User 모델 불러오기

const authMiddleware = async (req, res, next) => {
    try {
        // Authorization 헤더 확인
        const authHeader = req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // 토큰 분리 및 검증
        const token = authHeader.split(' ')[1];
        const decoded = jwtUtil.verifyToken(token, process.env.JWT_SECRET);

        // Sequelize를 사용하여 사용자 검색
        const user = await User.findByPk(decoded._id); // 기본 키(_id)로 검색
        if (!user) {
            return res.status(404).json({ error: `User not found for ID: ${decoded._id}` });
        }

        // 사용자 정보를 요청 객체에 추가
        req.user = user;
        next(); // 다음 미들웨어 또는 라우터로 진행
    } catch (error) {
        // JWT 관련 오류 처리
        res.status(401).json({
            error: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
        });
    }
};

module.exports = authMiddleware;
