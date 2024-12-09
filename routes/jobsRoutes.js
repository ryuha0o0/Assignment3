const express = require('express');
const { getAllJobs, getJobById, searchJobs, filterJobs, sortJobs } = require('../controllers/jobsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/search', searchJobs); // 검색 라우트 먼저
router.get('/filter', filterJobs); // 필터 라우트
router.get('/sort', sortJobs);     // 정렬 라우트
router.get('/', getAllJobs);       // 전체 조회
router.get('/:id', getJobById);    // 동적 ID 조회


module.exports = router;
