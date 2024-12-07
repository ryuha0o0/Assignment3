const Notification = require('../models/Notification');
const User = require('../models/User'); // User 모델 추가

exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id }, // Sequelize에서는 userId를 사용
            include: [{ model: User, as: 'notificationUser' }], // alias 명시
        });

        res.status(200).json(notifications);
    } catch (err) {
        next(err);
    }
};

exports.createNotification = async (req, res, next) => {
    try {
        const notification = await Notification.create({
            ...req.body,
            userId: req.user.id, // 현재 사용자 ID를 포함
        });

        res.status(201).json(notification);
    } catch (err) {
        next(err);
    }
};
