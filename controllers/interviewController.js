const InterviewSchedule = require('../models/InterviewSchedule');
const Application = require('../models/Application');

/**
 * 모든 인터뷰 스케줄을 조회합니다. (GET /interviews)
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 * @returns {void} - 인터뷰 스케줄 배열 반환
 * @throws {Error} - 서버 에러 발생 시 예외 처리 미들웨어로 전달
 */
exports.getAllInterviews = async (req, res, next) => {
    try {
        // 인증된 사용자 ID 기준으로 인터뷰 스케줄 조회
        const interviews = await InterviewSchedule.findAll({
            where: { userId: req.user.id },
            include: [{ model: Application, as: 'application' }], // 관련 애플리케이션 데이터 포함
        });

        // 조회된 인터뷰 데이터를 클라이언트에 반환
        res.status(200).json(interviews);
    } catch (err) {
        next(err); // 에러 처리 미들웨어로 전달
    }
};

/**
 * 새로운 인터뷰 스케줄을 생성합니다. (POST /interviews)
 * @param {Object} req - 요청 객체
 * @param {Object} req.body - 생성할 인터뷰 스케줄 데이터
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 * @returns {void} - 생성된 인터뷰 스케줄 데이터 반환
 * @throws {Error} - 유효성 검사 실패 또는 서버 에러 발생 시 예외 처리 미들웨어로 전달
 */
exports.createInterview = async (req, res, next) => {
    try {
        // 클라이언트에서 전달된 데이터를 기반으로 새로운 인터뷰 스케줄 생성
        const interview = await InterviewSchedule.create({
            ...req.body,
            userId: req.user.id, // 현재 사용자 ID 추가
        });

        // 생성된 인터뷰 스케줄 반환
        res.status(201).json(interview);
    } catch (err) {
        next(err); // 에러 처리 미들웨어로 전달
    }
};
