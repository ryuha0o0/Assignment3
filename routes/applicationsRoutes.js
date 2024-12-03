const express = require('express');
const {
    getAllApplications,
    getApplicationById,
    createApplication,
    deleteApplication,
} = require('../controllers/applicationsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// 라우트 정의
router.get('/', authMiddleware, getAllApplications);
router.get('/:id', authMiddleware, getApplicationById);
router.post('/', authMiddleware, createApplication);
router.delete('/:id', authMiddleware, deleteApplication);

module.exports = router;
