const Application = require('../models/Application');
const Job = require('../models/Job');

// 사용자의 모든 어플리케이션 가져오기
exports.getAllApplications = async (req, res, next) => {
    try {
        const applications = await Application.findAll({
            where: { userId: req.user.id }, // 현재 사용자 ID 기준
            include: [{ model: Job, as: 'relatedJob' }], // alias 설정
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

// 특정 어플리케이션 ID로 조회
exports.getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const application = await Application.findOne({
            where: { id, userId: req.user.id }, // 현재 사용자 ID와 어플리케이션 ID 기준
            include: [{ model: Job, as: 'relatedJob', attributes: ['title'] }], // alias 설정
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

// 새로운 어플리케이션 생성
exports.createApplication = async (req, res, next) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ message: 'jobId is required.' });
        }

        const application = await Application.create({
            userId: req.user.id, // 현재 사용자 ID
            jobId, // 요청에서 받은 Job ID
        });

        res.status(201).json({ message: 'Application created successfully.', application });
    } catch (error) {
        console.error('Error creating application:', error);
        next(error);
    }
};

// 어플리케이션 삭제
exports.deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await Application.destroy({
            where: { id, userId: req.user.id }, // 현재 사용자 ID와 일치하는 어플리케이션만 삭제 가능
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Application not found or access denied.' });
        }

        res.status(200).json({ message: 'Application deleted successfully.' });
    } catch (error) {
        console.error(`Error deleting application with ID ${req.params.id}:`, error);
        next(error);
    }
};
