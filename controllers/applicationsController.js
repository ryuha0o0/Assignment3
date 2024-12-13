const Application = require('../models/Application');
const Job = require('../models/Job');

/**
 * 사용자의 모든 어플리케이션 가져오기 (상태별 필터링 및 날짜 정렬 지원)
 * @function getAllApplications
 * @param {Object} req - Express 요청 객체
 * @param {Object} req.query - 요청 쿼리 파라미터
 * @param {string} [req.query.status] - 필터링할 어플리케이션 상태
 * @param {string} [req.query.sortBy='createdAt'] - 정렬 기준 필드
 * @param {string} [req.query.order='DESC'] - 정렬 순서 ('ASC' 또는 'DESC')
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 * @returns {void} 반환값 없음, JSON 형식으로 어플리케이션 목록 응답
 * @throws {Error} 데이터베이스 오류 또는 처리 중 오류
 */
exports.getAllApplications = async (req, res, next) => {
    try {
        const { status, sortBy = 'createdAt', order = 'DESC' } = req.query; // 상태 및 정렬 파라미터

        const whereClause = { userId: req.user.id }; // 현재 사용자 기준
        if (status) {
            whereClause.status = status; // 상태 필터 추가
        }

        const applications = await Application.findAll({
            where: whereClause,
            include: [{ model: Job, as: 'relatedJob', attributes: ['title'] }], // 관련 Job 정보 포함
            order: [[sortBy, order]], // 정렬 조건
        });

        if (!applications.length) {
            return res.status(404).json({ message: 'No applications found for this user.' });
        }

        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        next(error);
    }
};

/**
 * 특정 어플리케이션 ID로 조회
 * @function getApplicationById
 * @param {Object} req - Express 요청 객체
 * @param {string} req.params.id - 어플리케이션 ID
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 * @returns {void} 반환값 없음, JSON 형식으로 어플리케이션 데이터 응답
 * @throws {Error} 데이터베이스 오류 또는 처리 중 오류
 */
exports.getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const application = await Application.findOne({
            where: { id, userId: req.user.id }, // 현재 사용자 ID와 어플리케이션 ID 기준
            include: [{ model: Job, as: 'relatedJob', attributes: ['title'] }], // 관련 Job 제목 포함
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found or access denied.' });
        }

        res.status(200).json(application);
    } catch (error) {
        console.error(`Error fetching application with ID ${req.params.id}:`, error);
        next(error);
    }
};

/**
 * 새로운 어플리케이션 생성
 * @function createApplication
 * @param {Object} req - Express 요청 객체
 * @param {Object} req.body - 요청 본문
 * @param {number} req.body.jobId - 지원할 채용 공고 ID
 * @param {string} [req.body.resumeUrl] - 지원자의 이력서 URL (선택)
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 * @returns {void} 반환값 없음, JSON 형식으로 생성된 어플리케이션 응답
 * @throws {Error} 데이터베이스 오류 또는 처리 중 오류
 */
exports.createApplication = async (req, res, next) => {
    try {
        const { jobId, resumeUrl } = req.body;

        if (!jobId) {
            return res.status(400).json({ message: 'jobId is required.' });
        }

        // 중복 지원 확인
        const existingApplication = await Application.findOne({
            where: {
                userId: req.user.id, // 현재 사용자 ID
                jobId, // 요청에서 받은 Job ID
            },
        });

        if (existingApplication) {
            return res.status(409).json({ message: 'You have already applied for this job.' });
        }

        // 새로운 지원 생성
        const application = await Application.create({
            userId: req.user.id, // 현재 사용자 ID
            jobId,              // 요청에서 받은 Job ID
            resumeUrl: resumeUrl || null, // 이력서 URL (선택)
            status: 'PENDING',  // 초기 상태
        });

        res.status(201).json({ message: 'Application created successfully.', application });
    } catch (error) {
        console.error('Error creating application:', error);
        next(error);
    }
};

/**
 * 어플리케이션 삭제
 * @function deleteApplication
 * @param {Object} req - Express 요청 객체
 * @param {string} req.params.id - 삭제할 어플리케이션 ID
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 * @returns {void} 반환값 없음, JSON 형식으로 삭제 성공 메시지 응답
 * @throws {Error} 데이터베이스 오류 또는 처리 중 오류
 */
exports.deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 삭제 가능한 상태인지 확인 (e.g., PENDING 상태만 삭제 가능)
        const application = await Application.findOne({
            where: { id, userId: req.user.id },
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found or access denied.' });
        }

        if (application.status !== 'PENDING') {
            return res.status(400).json({ message: 'Only applications with PENDING status can be deleted.' });
        }

        await application.destroy(); // 어플리케이션 삭제

        res.status(200).json({ message: 'Application deleted successfully.' });
    } catch (error) {
        console.error(`Error deleting application with ID ${req.params.id}:`, error);
        next(error);
    }
};
