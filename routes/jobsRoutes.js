const express = require('express');
const { getAllJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// 라우트 정의
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', authMiddleware, createJob);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

module.exports = router;
