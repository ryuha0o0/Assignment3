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

        // 1. 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 기본 이메일 형식 검증
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // 2. 중복 이메일 확인
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // 3. 사용자 생성
        const user = await User.create({ email, password });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        next(error);
    }
};



exports.updateProfile = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByPk(req.user.id); // 인증된 사용자
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 필드 업데이트
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        const decoded = jwtUtil.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newAccessToken = jwtUtil.generateToken({ id: user.id });
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        next(error);
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'createdAt'], // 필요한 필드만 반환
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User profile retrieved successfully',
            user,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteAccount = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy(); // 사용자 계정 삭제

        res.status(200).json({
            message: 'Account deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
