const Notification = require('../models/Notification');
const User = require('../models/User'); // User 모델 추가

/**
 * 사용자의 모든 알림을 조회하는 함수
 *
 * @async
 * @function getNotifications
 * @param {Object} req - Express 요청 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {number} req.user.id - 요청을 보낸 사용자의 ID
 * @param {Object} res - Express 응답 객체
 * @param {Object} next - Express next 미들웨어 함수
 * @returns {void}
 * @throws {Error} 데이터베이스 조회 오류 발생 시 예외 처리 미들웨어로 전달
 */
exports.getNotifications = async (req, res, next) => {
    try {
        // 현재 사용자에 대한 알림 데이터를 조회
        const notifications = await Notification.findAll({
            where: { userId: req.user.id }, // Sequelize에서 사용자 ID로 필터링
            include: [{ model: User, as: 'notificationUser' }], // 사용자 정보 포함
        });

        // 조회된 알림 데이터를 클라이언트에 반환
        res.status(200).json(notifications);
    } catch (err) {
        // 에러 발생 시 다음 미들웨어로 예외 전달
        next(err);
    }
};

/**
 * 새로운 알림을 생성하는 함수
 *
 * @async
 * @function createNotification
 * @param {Object} req - Express 요청 객체
 * @param {Object} req.body - 클라이언트에서 전달된 알림 데이터
 * @param {string} req.body.message - 알림 메시지
 * @param {Object} res - Express 응답 객체
 * @param {Object} next - Express next 미들웨어 함수
 * @returns {void}
 * @throws {Error} 데이터베이스 저장 오류 발생 시 예외 처리 미들웨어로 전달
 */
exports.createNotification = async (req, res, next) => {
    try {
        // 요청 본문 데이터를 사용해 새로운 알림 생성
        const notification = await Notification.create({
            ...req.body, // 클라이언트로부터 받은 데이터
            userId: req.user.id, // 인증된 사용자 ID 추가
        });

        // 생성된 알림 데이터를 클라이언트에 반환
        res.status(201).json(notification);
    } catch (err) {
        // 에러 발생 시 다음 미들웨어로 예외 전달
        next(err);
    }
};
