require('dotenv').config();
const express = require('express');
const { connectToDatabase } = require('./utils/database');
const authRoutes = require('./routes/authRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const applicationsRoutes = require('./routes/applicationsRoutes');
const bookmarksRoutes = require('./routes/bookmarksRoutes');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./public/swagger/swagger.json');
const crawlSaramin = require('./crawlers/saraminCrawler');
const Job = require('./models/Job');

// Express 앱 초기화
const app = express();
app.use(express.json());

// 라우트 설정
app.use('/', require('./routes/index'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/bookmarks', bookmarksRoutes);

// 에러 핸들러
app.use(errorHandler);

// 데이터 저장 함수 (중복 방지)
const saveJobsToDb = async (jobs) => {
    try {
        for (const job of jobs) {
            const existingJob = await Job.findOne({ link: job.link });
            if (!existingJob) {
                const newJob = new Job(job);
                await newJob.save();
            }
        }
        console.log('Jobs saved to database successfully!');
    } catch (error) {
        console.error('Error saving jobs to database:', error.message);
    }
};

// 서버 실행 및 초기화
const PORT = process.env.PORT || 3000;
connectToDatabase()
    .then(async () => {
        console.log('Connected to database.');

        // Saramin 크롤링 및 데이터베이스 저장
        try {
            const searchTerm = '개발자'; // 검색어
            const jobs = await crawlSaramin(searchTerm, 100); // 최소 100개 데이터
            console.log(`${jobs.length} jobs crawled successfully.`);
            await saveJobsToDb(jobs);
        } catch (error) {
            console.error('Error during job crawling or saving:', error.message);
        }

        // 서버 실행
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        );
    })
    .catch((error) => {
        console.error('Error connecting to database:', error.message);
        process.exit(1); // 데이터베이스 연결 실패 시 종료
    });
