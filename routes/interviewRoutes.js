const express = require('express');
const { getAllInterviews, createInterview } = require('../controllers/interviewController');

const router = express.Router();

router.get('/', getAllInterviews);
router.post('/', createInterview);

module.exports = router;
