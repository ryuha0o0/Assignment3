const Job = require('../models/Job');

// 모든 구직 정보 조회
exports.getAllJobs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        // 필터링 및 검색 조건
        const filters = {};
        if (req.query.location) filters.location = req.query.location;
        if (req.query.search) {
            filters.$or = [
                { title: { $regex: req.query.search, $options: 'i' } }, // 포지션 검색
                { company: { $regex: req.query.search, $options: 'i' } }, // 회사명 검색
                { description: { $regex: req.query.search, $options: 'i' } }, // 키워드 검색
            ];
        }

        const jobs = await Job.find(filters)
            .skip(skip)
            .limit(limit);

        const totalJobs = await Job.countDocuments(filters);

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



// 특정 구직 정보 조회
exports.getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await Job.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } }, // 조회수 증가
            { new: true }
        );

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // 관련 공고 추천 (같은 지역이나 기술 스택 기준)
        const relatedJobs = await Job.find({
            _id: { $ne: id }, // 현재 공고 제외
            location: job.location,
        }).limit(5); // 추천 개수 제한

        res.status(200).json({
            job,
            relatedJobs,
        });
    } catch (error) {
        next(error);
    }
};


// 구직 정보 추가
exports.createJob = async (req, res, next) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
        next(error);
    }
};

// 구직 정보 업데이트
exports.updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job updated successfully', updatedJob });
    } catch (error) {
        next(error);
    }
};

// 구직 정보 삭제
exports.deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedJob = await Job.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        next(error);
    }
};
