const express = require('express');
const {
    getBookmarks,
    createBookmark,
    deleteBookmark,
} = require('../controllers/bookmarksController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getBookmarks);
router.post('/', authMiddleware, createBookmark);
router.delete('/:id', authMiddleware, deleteBookmark);

module.exports = router;
