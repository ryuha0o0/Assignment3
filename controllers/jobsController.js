const { Op } = require('sequelize');
const Job = require('../models/Job');

/**
 * 채용 공고 전체 조회 (페이징 포함, 제한된 필드만 반환)
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 에러 처리 미들웨어
 * @returns {void} - 페이징된 공고 목록 반환
 * @throws {Error} - 데이터베이스 에러 발생 시
 */
exports.getAllJobs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; // 현재 페이지
        const limit = parseInt(req.query.limit, 10) || 20; // 페이지당 공고 수
        const offset = (page - 1) * limit; // 스킵할 공고 수

        // 데이터베이스에서 공고 조회
        const { rows: jobs, count: totalJobs } = await Job.findAndCountAll({
            attributes: ['id', 'title', 'views', 'postedDate'], // 반환할 필드 지정
            offset,
            limit,
            order: [['postedDate', 'DESC']], // 최신순 정렬
        });

        // 결과 반환
        res.status(200).json({
            page,
            totalPages: Math.ceil(totalJobs / limit), // 총 페이지 수 계산
            totalJobs,
            jobs,
        });
    } catch (error) {
        next(error); // 에러 처리 미들웨어로 전달
    }
};

/**
 * ID로 채용 공고 조회 (모든 필드 반환)
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 에러 처리 미들웨어
 * @returns {void} - 공고 세부 정보 및 관련 공고 반환
 * @throws {Error} - 공고가 없거나 데이터베이스 에러 발생 시
 */
exports.getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // ID로 공고 상세 조회
        const job = await Job.findByPk(id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // 조회수 증가
        await job.increment('views');

        // 관련 공고 조회 (같은 지역 및 비슷한 직무명)
        const relatedJobs = await Job.findAll({
            attributes: ['id', 'title', 'location', 'company'],
            where: {
                id: { [Op.ne]: id }, // 현재 공고 제외
                location: job.location,
                title: { [Op.like]: `%${job.title}%` },
            },
            limit: 5, // 최대 5개
        });

        // 결과 반환
        res.status(200).json({
            job,
            relatedJobs,
        });
    } catch (error) {
        console.error('Error fetching job details:', error);
        next(error);
    }
};

/**
 * 채용 공고 검색
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 에러 처리 미들웨어
 * @returns {void} - 검색된 공고 목록 반환
 * @throws {Error} - 검색어가 없거나 데이터베이스 에러 발생 시
 */
exports.searchJobs = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required.' });
        }

        // 공고 제목으로 검색
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

/**
 * 채용 공고 필터링
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 에러 처리 미들웨어
 * @returns {void} - 필터링된 공고 목록 반환
 * @throws {Error} - 데이터베이스 에러 발생 시
 */
exports.filterJobs = async (req, res, next) => {
    try {
        const { company, location, sector, employmentType } = req.query;

        // 필터 조건 설정
        const whereClause = {};
        if (location) whereClause.location = { [Op.like]: `%${location}%` };
        if (sector) whereClause.sector = { [Op.like]: `%${sector}%` };
        if (employmentType) whereClause.employmentType = { [Op.like]: `%${employmentType}%` };

        // 조건에 맞는 공고 조회
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

// 채용 공고 등록 API
exports.createJob = async (req, res, next) => {
    try {
        // 로그인 여부 확인
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const { title, experience, education, deadline, link, description, location, company, sector, employmentType, postedDate } = req.body;

        if (!title || !description || !location || !company) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }

        const newJob = await Job.create({
            title,
            location,
            company,
            sector,
            employmentType,
            experience,
            education,
            deadline,
            link,
            postedDate: postedDate || new Date(),
            views: 0, // 초기 조회수는 0
        });

        res.status(201).json({ message: 'Job created successfully.', job: newJob });
    } catch (error) {
        next(error);
    }
};

// 채용 공고 수정 API
exports.updateJob = async (req, res, next) => {
    try {
        // 로그인 여부 확인
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const { id } = req.params;
        const { title, description, location, company, sector, employmentType } = req.body;

        const job = await Job.findByPk(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // 수정 가능한 필드만 업데이트
        job.title = title || job.title;
        job.location = location || job.location;
        job.company = company || job.company;
        job.sector = sector || job.sector;
        job.employmentType = employmentType || job.employmentType;

        await job.save();

        res.status(200).json({ message: 'Job updated successfully.', job });
    } catch (error) {
        next(error);
    }
};

// 채용 공고 삭제 API
exports.deleteJob = async (req, res, next) => {
    try {
        // 로그인 여부 확인
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const { id } = req.params;

        const job = await Job.findByPk(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        await job.destroy();

        res.status(200).json({ message: 'Job deleted successfully.' });
    } catch (error) {
        next(error);
    }
};