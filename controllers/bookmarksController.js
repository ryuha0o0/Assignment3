const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job'); // Job 모델 가져오기

exports.getBookmarks = async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.findAll({
            where: { userId: req.user.id }, // 현재 사용자 ID 기준
            include: [{ model: Job, as: 'relatedJob' }], // alias 추가
        });

        res.status(200).json(bookmarks);
    } catch (error) {
        next(error);
    }
};

// 특정 북마크 ID로 조회
exports.getBookmarksById = async (req, res, next) => {
    try {
        const { id } = req.params; // URL에서 북마크 ID 가져오기

        // 해당 ID의 북마크 찾기
        const bookmark = await Bookmark.findOne({
            where: { id, userId: req.user.id }, // 현재 사용자 ID와 북마크 ID 기준으로 찾기
            include: [{ model: Job }], // 북마크와 관련된 Job 모델도 포함
        });

        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.status(200).json(bookmark);
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
