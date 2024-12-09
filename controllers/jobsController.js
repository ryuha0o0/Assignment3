const { Op } = require('sequelize');
const Job = require('../models/Job');

// 채용 공고 전체 조회 (페이징 포함)
exports.getAllJobs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20; // 페이지당 항목 수
        const offset = (page - 1) * limit;

        const { rows: jobs, count: totalJobs } = await Job.findAndCountAll({
            offset,
            limit,
            order: [['postedDate', 'DESC']], // 최신순 정렬
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

// ID로 채용 공고 조회
exports.getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findByPk(id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // 조회수 증가
        await job.increment('views');

        // 추천 공고 (같은 지역 기준)
        const relatedJobs = await Job.findAll({
            where: {
                id: { [Op.ne]: id },
                location: job.location,
            },
            limit: 5,
        });

        res.status(200).json({ job, relatedJobs });
    } catch (error) {
        next(error);
    }
};

// 채용 공고 검색
exports.searchJobs = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required.' });
        }

        const jobs = await Job.findAll({
            where: {
                title: { [Op.like]: `%${query}%` },
            },
            order: [['postedDate', 'DESC']], // 최신순 정렬
        });

        res.status(200).json(jobs);
    } catch (error) {
        next(error);
    }
};

// 채용 공고 필터링
exports.filterJobs = async (req, res, next) => {
    try {
        const { company, location, sector, employmentType } = req.query;

        const whereClause = {};
        if (location) whereClause.location = { [Op.eq]: location };
        if (sector) whereClause.sector = { [Op.eq]: sector };
        if (employmentType) whereClause.employmentType = { [Op.eq]: employmentType };

        const jobs = await Job.findAll({
            where: whereClause,
            order: [['postedDate', 'DESC']],
        });

        res.status(200).json(jobs);
    } catch (error) {
        next(error);
    }
};

// 채용 공고 정렬
exports.sortJobs = async (req, res, next) => {
    try {
        const { sortBy, order = 'ASC' } = req.query;

        const validSortFields = ['title', 'company', 'postedDate', 'views'];
        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({
                message: `Invalid sort field. Valid options: ${validSortFields.join(', ')}`,
            });
        }

        const jobs = await Job.findAll({
            order: [[sortBy, order.toUpperCase()]], // 정렬 순서
        });

        res.status(200).json(jobs);
    } catch (error) {
        next(error);
    }
};
