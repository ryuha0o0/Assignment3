const InterviewSchedule = require('../models/InterviewSchedule');

exports.getAllInterviews = async (req, res, next) => {
    try {
        const interviews = await InterviewSchedule.findAll({
            include: [{ model: Application, as: 'application' }], // 연관된 Application 데이터를 포함
        });
        res.status(200).json(interviews);
    } catch (err) {
        next(err);
    }
};
exports.createInterview = async (req, res, next) => {
    try {
        const interview = await InterviewSchedule.create(req.body); // 인터뷰 생성
        res.status(201).json(interview);
    } catch (err) {
        next(err);
    }
};
