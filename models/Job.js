const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: String, required: true }, // ObjectId -> String으로 수정
    link: { type: String },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
