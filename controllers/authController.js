const jwtUtil = require('../utils/jwt'); // 변수명 통일
const User = require('../models/User');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwtUtil.generateToken({ _id: user._id });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email },
        });
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (await User.findOne({ email })) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const user = new User({ email, password });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, email: user.email },
        });
    } catch (error) {
        next(error);
    }
};
