const Job = require('../models/Job');

// 모든 구직 정보 조회
exports.getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        next(error);
    }
};

// 특정 구직 정보 조회
exports.getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(job);
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
