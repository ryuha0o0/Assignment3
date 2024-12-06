const Application = require('../models/Application');

// 모든 신청 조회
exports.getAllApplications = async (req, res, next) => {
    try {
        const applications = await Application.find().populate('job applicant', 'title name');
        res.status(200).json(applications);
    } catch (error) {
        next(error);
    }
};

// 특정 신청 조회
exports.getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id).populate('job applicant', 'title name');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json(application);
    } catch (error) {
        next(error);
    }
};

// 신청 생성
exports.createApplication = async (req, res, next) => {
    try {
        const { job } = req.body;

        const application = new Application({
            job: job,
            applicant: req.user.id,
        });

        await application.save();
        res.status(201).json({ message: 'Application created successfully', application });
    } catch (error) {
        next(error);
    }
};

// 신청 삭제
exports.deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedApplication = await Application.findByIdAndDelete(id);

        if (!deletedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        next(error);
    }
};
