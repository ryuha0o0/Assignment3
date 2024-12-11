const express = require('express');
const { getAllInterviews, createInterview } = require('../controllers/interviewController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAllInterviews);
router.post('/', authMiddleware, createInterview);

module.exports = router;
