const express = require('express');
const { getAllResumes, createResume, deleteResume } = require('../controllers/resumeController');

const router = express.Router();

router.get('/', getAllResumes);
router.post('/', createResume);
router.delete('/:id', deleteResume);

module.exports = router;
