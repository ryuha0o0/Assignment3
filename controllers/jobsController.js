const Job = require('../models/Job');
const { Op } = require('sequelize'); // Sequelize의 Operator 가져오기


exports.getAllJobs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        // 필터링 및 검색 조건
        const where = {};
        if (req.query.location) where.location = req.query.location;

        if (req.query.search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${req.query.search}%` } }, // 포지션 검색
                { company: { [Op.like]: `%${req.query.search}%` } }, // 회사명 검색
                { description: { [Op.like]: `%${req.query.search}%` } }, // 키워드 검색
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
                id: { [Op.ne]: id }, // 현재 공고 제외
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

exports.searchJobs = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        if (!keyword) {
            return res.status(400).json({ message: 'Keyword is required for search' });
        }

        const { rows: jobs, count: totalJobs } = await Job.findAndCountAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { company: { [Op.like]: `%${keyword}%` } },
                    { sector: { [Op.like]: `%${keyword}%` } },
                ],
            },
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

exports.filterJobs = async (req, res, next) => {
    try {
        const { location, employmentType, experience, education, sector } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        const where = {};
        if (location) where.location = location;
        if (employmentType) where.employmentType = employmentType;
        if (experience) where.experience = experience;
        if (education) where.education = education;
        if (sector) where.sector = sector;

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

exports.sortJobs = async (req, res, next) => {
    try {
        const { sortBy } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        let order = [['postedDate', 'DESC']]; // 기본값: 최신순

        if (sortBy === 'postedDate') {
            order = [['postedDate', 'DESC']];
        } else if (sortBy === 'deadline') {
            order = [['deadline', 'ASC']];
        }

        const { rows: jobs, count: totalJobs } = await Job.findAndCountAll({
            order,
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
