const express = require('express');
const { getNotifications, createNotification } = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.post('/', createNotification);

module.exports = router;
