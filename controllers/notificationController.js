const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user._id });
        res.status(200).json(notifications);
    } catch (err) {
        next(err);
    }
};

exports.createNotification = async (req, res, next) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        next(err);
    }
};
