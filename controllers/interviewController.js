const InterviewSchedule = require('../models/InterviewSchedule');

exports.getAllInterviews = async (req, res, next) => {
    try {
        const interviews = await InterviewSchedule.find().populate('application');
        res.status(200).json(interviews);
    } catch (err) {
        next(err);
    }
};

exports.createInterview = async (req, res, next) => {
    try {
        const interview = new InterviewSchedule(req.body);
        await interview.save();
        res.status(201).json(interview);
    } catch (err) {
        next(err);
    }
};
