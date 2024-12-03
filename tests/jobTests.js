const request = require('supertest');
const app = require('../server');
const { connectToDatabase } = require('../utils/database');
const Job = require('../models/Job');

beforeAll(async () => {
    await connectToDatabase();
});

afterAll(async () => {
    await Job.deleteMany(); // 테스트 후 DB 정리
});

describe('Jobs Routes', () => {
    let token;

    beforeAll(async () => {
        const userResponse = await request(app).post('/api/auth/register').send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });
        token = userResponse.body.token;
    });

    it('should create a job posting', async () => {
        const response = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Software Engineer',
                company: 'TechCorp',
                description: 'Develop scalable software applications.',
                location: 'Seoul, South Korea',
                salary: '₩60,000,000',
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('job');
        expect(response.body.job.title).toBe('Software Engineer');
    });

    it('should retrieve all job postings', async () => {
        const response = await request(app).get('/api/jobs');
        expect(response.status).toBe(200);
        expect(response.body.jobs.length).toBeGreaterThan(0);
    });

    it('should delete a job posting', async () => {
        const jobs = await Job.find();
        const jobId = jobs[0]._id;

        const response = await request(app)
            .delete(`/api/jobs/${jobId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Job deleted successfully.');
    });
});
