const jwtUtil = require('../utils/jwt');
const User = require('../models/User'); // Sequelize User 모델

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. 이메일로 사용자 검색
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. 비밀번호 비교
        const isPasswordMatch = await user.comparePassword(password); // 모델에 메서드 구현 필요
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. JWT 토큰 생성
        const token = jwtUtil.generateToken({ id: user.id }); // MySQL의 기본 키 id 사용

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email }, // 응답 데이터
        });
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. 중복 이메일 확인
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // 2. 사용자 생성
        const user = await User.create({ email, password });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        next(error);
    }
};
