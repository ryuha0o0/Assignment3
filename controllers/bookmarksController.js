const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job');

/**
 * 북마크 목록을 조회합니다. (GET /bookmarks)
 * @param {Object} req - 요청 객체
 * @param {Object} req.query - 쿼리 파라미터 (page, limit)
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 * @returns {void} - 북마크 목록 및 페이지네이션 정보 반환
 * @throws {Error} - 서버 에러 발생 시 예외 처리 미들웨어로 전달
 */
exports.getBookmarks = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query; // 페이지네이션 파라미터 기본값 설정
        const offset = (page - 1) * limit; // 가져올 데이터의 시작 위치 계산

        // 사용자 ID에 따른 북마크와 연관된 Job 데이터를 조회
        const bookmarks = await Bookmark.findAndCountAll({
            where: { userId: req.user.id },
            include: [{ model: Job, as: 'relatedJob' }],
            order: [['createdAt', 'DESC']], // 최신순 정렬
            limit: parseInt(limit),
            offset,
        });

        // 페이지네이션 정보를 포함한 응답 반환
        res.status(200).json({
            total: bookmarks.count,
            page: parseInt(page),
            totalPages: Math.ceil(bookmarks.count / limit),
            bookmarks: bookmarks.rows,
        });
    } catch (error) {
        next(error); // 에러 처리 미들웨어로 전달
    }
};

/**
 * 북마크 추가 또는 제거를 토글합니다. (POST /bookmarks)
 * @param {Object} req - 요청 객체
 * @param {Object} req.body - 요청 바디 (jobId)
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 * @returns {void} - 북마크 추가 또는 제거 결과 반환
 * @throws {Error} - 서버 에러 발생 시 예외 처리 미들웨어로 전달
 */
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
        next(error); // 에러 처리 미들웨어로 전달
    }
};

/**
 * ID를 기반으로 특정 북마크를 조회합니다. (GET /bookmarks/:id)
 * @param {Object} req - 요청 객체
 * @param {Object} req.params - URL 파라미터 (id)
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 * @returns {void} - 특정 북마크 반환
 * @throws {Error} - 북마크가 없거나 서버 에러 발생 시 예외 처리 미들웨어로 전달
 */
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
        next(error); // 에러 처리 미들웨어로 전달
    }
};

/**
 * ID를 기반으로 특정 북마크를 삭제합니다. (DELETE /bookmarks/:id)
 * @param {Object} req - 요청 객체
 * @param {Object} req.params - URL 파라미터 (id)
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 * @returns {void} - 삭제 결과 반환
 * @throws {Error} - 북마크가 없거나 서버 에러 발생 시 예외 처리 미들웨어로 전달
 */
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
        next(error); // 에러 처리 미들웨어로 전달
    }
};
