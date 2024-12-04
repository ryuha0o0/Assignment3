const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    link: { type: String },
    experience: { type: String, enum: ['junior', 'mid', 'senior', 'unknown'] }, // 'unknown' 추가
    techStack: [{ type: String }],
    views: { type: Number, default: 0 },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
