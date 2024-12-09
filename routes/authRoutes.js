const express = require('express');
const { login, register, refreshToken, updateProfile, getUserProfile, deleteAccount } = require('../controllers/authController');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh',refreshToken);
router.put('/update',updateProfile);
// 회원 정보 조회
router.get('/profile', authMiddleware, getUserProfile);
// 회원 탈퇴
router.delete('/delete',authMiddleware, deleteAccount);

module.exports = router;
