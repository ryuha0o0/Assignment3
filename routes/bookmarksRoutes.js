const express = require('express');
const {
    getBookmarks,
    toggleBookmark,
    deleteBookmark,
    getBookmarkById
} = require('../controllers/bookmarksController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getBookmarks);
router.get('/:id', authMiddleware, getBookmarkById);
router.post('/', authMiddleware, toggleBookmark);
router.delete('/:id', authMiddleware, deleteBookmark);

module.exports = router;
