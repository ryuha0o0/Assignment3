const Resume = require('../models/Resume');

exports.getAllResumes = async (req, res, next) => {
    try {
        const resumes = await Resume.find().populate('user', 'name email');
        res.status(200).json(resumes);
    } catch (err) {
        next(err);
    }
};

exports.createResume = async (req, res, next) => {
    try {
        const resume = new Resume(req.body);
        await resume.save();
        res.status(201).json(resume);
    } catch (err) {
        next(err);
    }
};

exports.deleteResume = async (req, res, next) => {
    try {
        await Resume.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (err) {
        next(err);
    }
};
