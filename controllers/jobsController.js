const Job = require('../models/Job');

exports.getAllJobs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        // 필터링 및 검색 조건
        const where = {};
        if (req.query.location) where.location = req.query.location;

        if (req.query.search) {
            where[Sequelize.Op.or] = [
                { title: { [Sequelize.Op.like]: `%${req.query.search}%` } }, // 포지션 검색
                { company: { [Sequelize.Op.like]: `%${req.query.search}%` } }, // 회사명 검색
                { description: { [Sequelize.Op.like]: `%${req.query.search}%` } }, // 키워드 검색
            ];
        }

        const { rows: jobs, count: totalJobs } = await Job.findAndCountAll({
            where,
            offset,
            limit,
        });

        res.status(200).json({
            page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs,
            jobs,
        });
    } catch (error) {
        next(error);
    }
};

exports.getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findOne({
            where: { id },
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // 조회수 증가
        await job.increment('views', { by: 1 });

        // 관련 공고 추천 (같은 지역 기준)
        const relatedJobs = await Job.findAll({
            where: {
                id: { [Sequelize.Op.ne]: id }, // 현재 공고 제외
                location: job.location,
            },
            limit: 5,
        });

        res.status(200).json({
            job,
            relatedJobs,
        });
    } catch (error) {
        next(error);
    }
};

exports.createJob = async (req, res, next) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
        next(error);
    }
};

exports.updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [updated] = await Job.update(req.body, {
            where: { id },
        });

        if (!updated) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const updatedJob = await Job.findOne({ where: { id } });

        res.status(200).json({ message: 'Job updated successfully', updatedJob });
    } catch (error) {
        next(error);
    }
};

exports.deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await Job.destroy({
            where: { id },
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        next(error);
    }
};
