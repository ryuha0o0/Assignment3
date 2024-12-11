const InterviewSchedule = require('../models/InterviewSchedule');
const Application = require('../models/Application');
const User = require('../models/User'); // User 모델 가져오기

// 모든 인터뷰 스케줄 가져오기
exports.getAllInterviews = async (req, res, next) => {
    try {
        const interviews = await InterviewSchedule.findAll({
            where: { userId: req.user.id }, // 인증된 사용자의 ID 기준으로 필터링
            include: [{ model: Application, as: 'application' }],
        });
        res.status(200).json(interviews);
    } catch (err) {
        next(err);
    }
};

exports.createInterview = async (req, res, next) => {
    try {
        // 사용자 ID를 포함하여 인터뷰 스케줄 생성
        const interview = await InterviewSchedule.create({
            ...req.body,  // 클라이언트에서 보낸 데이터
            userId: req.user.id,  // 현재 사용자 ID로 인터뷰 생성
        });

        res.status(201).json(interview);
    } catch (err) {
        next(err);
    }
};

