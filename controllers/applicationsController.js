const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

exports.getAllApplications = async (req, res, next) => {
    try {
        const applications = await Application.findAll({
            include: [
                { model: Job, attributes: ['title'] }, // Job 관계에서 'title'만 포함
                { model: User, as: 'applicant', attributes: ['name'] }, // User 관계에서 'name'만 포함
            ],
        });

        res.status(200).json(applications);
    } catch (error) {
        next(error);
    }
};
exports.getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const application = await Application.findOne({
            where: { id },
            include: [
                { model: Job, attributes: ['title'] }, // Job 관계에서 'title'만 포함
                { model: User, as: 'applicant', attributes: ['name'] }, // User 관계에서 'name'만 포함
            ],
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json(application);
    } catch (error) {
        next(error);
    }
};
exports.createApplication = async (req, res, next) => {
    try {
        const { jobId } = req.body;

        const application = await Application.create({
            jobId,
            applicantId: req.user.id, // 현재 로그인된 사용자
        });

        res.status(201).json({ message: 'Application created successfully', application });
    } catch (error) {
        next(error);
    }
};
exports.deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await Application.destroy({
            where: { id },
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        next(error);
    }
};
