const express = require('express');
const {
    getBookmarks,
    createBookmark,
    deleteBookmark,
    getBookmarksById
} = require('../controllers/bookmarksController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getBookmarks);
router.get('/:id', authMiddleware, getBookmarksById);
router.post('/', authMiddleware, createBookmark);
router.delete('/:id', authMiddleware, deleteBookmark);

module.exports = router;
