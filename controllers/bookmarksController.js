const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job');

// 북마크 목록 조회 (GET /bookmarks)
exports.getBookmarks = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query; // 페이지네이션 파라미터
        const offset = (page - 1) * limit;

        const bookmarks = await Bookmark.findAndCountAll({
            where: { userId: req.user.id },
            include: [{ model: Job, as: 'relatedJob' }],
            order: [['createdAt', 'DESC']], // 최신순 정렬
            limit: parseInt(limit),
            offset,
        });

        res.status(200).json({
            total: bookmarks.count,
            page: parseInt(page),
            totalPages: Math.ceil(bookmarks.count / limit),
            bookmarks: bookmarks.rows,
        });
    } catch (error) {
        next(error);
    }
};

// 북마크 추가/제거 (POST /bookmarks)
exports.toggleBookmark = async (req, res, next) => {
    try {
        const { jobId } = req.body;

        // Job 유효성 확인
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // 기존 북마크 존재 여부 확인
        const existingBookmark = await Bookmark.findOne({
            where: { userId: req.user.id, jobId },
        });

        if (existingBookmark) {
            // 북마크 삭제
            await existingBookmark.destroy();
            return res.status(200).json({ message: 'Bookmark removed' });
        }

        // 북마크 추가
        const newBookmark = await Bookmark.create({
            userId: req.user.id,
            jobId,
        });

        res.status(201).json({
            message: 'Bookmark added',
            bookmark: newBookmark,
        });
    } catch (error) {
        next(error);
    }
};

// 북마크 조회 by ID (GET /bookmarks/:id)
exports.getBookmarkById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const bookmark = await Bookmark.findOne({
            where: { id, userId: req.user.id },
            include: [{ model: Job, as: 'relatedJob' }],
        });

        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.status(200).json(bookmark);
    } catch (error) {
        next(error);
    }
};

// 북마크 삭제 (DELETE /bookmarks/:id)
exports.deleteBookmark = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await Bookmark.destroy({
            where: { id, userId: req.user.id },
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.status(200).json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        next(error);
    }
};
