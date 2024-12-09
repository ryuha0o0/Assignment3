const express = require('express');
const { getAllJobs, getJobById, searchJobs, filterJobs, sortJobs } = require('../controllers/jobsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// 라우트 정의
router.get('/', getAllJobs);
router.get('/:id', getJobById);
// 채용 공고 검색
router.get('/search', searchJobs);
// 채용 공고 필터링
router.get('/filter', filterJobs);
// 채용 공고 정렬
router.get('/sort', sortJobs);

module.exports = router;
