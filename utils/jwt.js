const jwt = require('jsonwebtoken');

// JWT 생성 함수
exports.generateToken = (user) => {
    if (!user || !user.id) { // MySQL에서는 Primary Key를 `id`로 사용
        throw new Error('User payload must include id');
    }

    const payload = { id: user.id }; // MySQL Primary Key 사용
    const secret = process.env.JWT_SECRET || 'default_secret'; // 비밀키
    const expiresIn = process.env.JWT_EXPIRY || '1d'; // 만료 시간

    // JWT 토큰 생성
    return jwt.sign(payload, secret, { expiresIn });
};

// JWT 검증 함수
exports.verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET || 'default_secret'; // 비밀키
        const decoded = jwt.verify(token, secret); // 토큰 검증
        console.log('Decoded Token:', decoded); // 디버깅용 로그
        return decoded; // 검증된 payload 반환
    } catch (error) {
        console.error('Token Verification Error:', error.message);
        throw new Error('Invalid or expired token'); // 검증 실패 시 에러 반환
    }
};
