const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job'); // Job 모델 가져오기

exports.getBookmarks = async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.findAll({
            where: { userId: req.user.id }, // 현재 사용자 ID 기준
            include: [{ model: Job }], // Job 모델과 관계 포함
        });

        res.status(200).json(bookmarks);
    } catch (error) {
        next(error);
    }
};
exports.createBookmark = async (req, res, next) => {
    try {
        const { jobId } = req.body;

        const bookmark = await Bookmark.create({
            userId: req.user.id, // 현재 사용자 ID
            jobId, // 요청에서 받은 Job ID
        });

        res.status(201).json(bookmark);
    } catch (error) {
        next(error);
    }
};
exports.deleteBookmark = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await Bookmark.destroy({
            where: { id }, // 북마크 ID 기준 삭제
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.status(200).json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        next(error);
    }
};
