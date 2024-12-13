require('dotenv').config();
const express = require('express');
const { connectToDatabase, sequelize } = require('./utils/database');
const authRoutes = require('./routes/authRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const applicationsRoutes = require('./routes/applicationsRoutes');
const bookmarksRoutes = require('./routes/bookmarksRoutes');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./public/swagger/swagger.json');
const { crawlSaramin, crawlSaraminCompanies } = require('./crawlers/saraminCrawler');

const Job = require('./models/Job');
const Company = require('./models/Company');
const companyRoutes = require('./routes/companyRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Express 앱 초기화
const app = express();
app.use(express.json());

// 라우트 설정
app.use('/', require('./routes/index'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRoutes);
app.use('/jobs', jobsRoutes);
app.use('/applications', applicationsRoutes);
app.use('/bookmarks', bookmarksRoutes);
app.use('/companies', companyRoutes);
app.use('/interviews', interviewRoutes);
app.use('/notifications', notificationRoutes);
app.use('/tasks', taskRoutes);

// 에러 핸들러
app.use(errorHandler);

// 데이터 필터링 함수 (Job)
const filterJobFields = (job) => {
    return {
        title: job.title,
        company: job.company,
        link: job.link,
        location: job.location,
        experience: job.experience,
        education: job.education,
        employmentType: job.employmentType,
        deadline: job.deadline,
        sector: job.sector,
    };
};

// 데이터 필터링 함수 (Company)
const filterCompanyFields = (company) => {
    return {
        name: company.name,
        location: company.location,
        website: company.website,
        ceo: company.ceo,
        industry: company.industry,
    };
};

// 데이터 저장 함수 (Job)
const saveJobsToDb = async (jobs) => {
    try {
        const bulkOps = jobs.map((job) => ({
            where: { link: job.link },
            defaults: filterJobFields(job),
        }));

        const results = await Promise.all(
            bulkOps.map(({ where, defaults }) =>
                Job.findOrCreate({ where, defaults })
            )
        );

        console.log(`Jobs saved successfully! Inserted/Updated: ${results.length}`);
    } catch (error) {
        console.error('Error saving jobs to database:', error.message);
    }
};

// 데이터 저장 함수 (Company)
const saveCompaniesToDb = async (companies) => {
    try {
        const bulkOps = companies.map((company) => ({
            where: { name: company.name },
            defaults: filterCompanyFields(company),
        }));

        const results = await Promise.all(
            bulkOps.map(({ where, defaults }) =>
                Company.findOrCreate({ where, defaults })
            )
        );

        console.log(`Companies saved successfully! Inserted/Updated: ${results.length}`);
    } catch (error) {
        console.error('Error saving companies to database:', error.message);
    }
};

// 서버 실행 및 초기화
const PORT = process.env.PORT || 3000;
const DEFAULT_SEARCH_TERM = process.env.DEFAULT_SEARCH_TERM || '개발자';
const DEFAULT_JOB_COUNT = parseInt(process.env.DEFAULT_JOB_COUNT, 10) || 100;
const DEFAULT_COMPANY_COUNT = parseInt(process.env.DEFAULT_COMPANY_COUNT, 10) || 100;

connectToDatabase()
    .then(async () => {
        console.log('Connected to database.');

        // 테이블 동기화
        await sequelize.sync();

        // Saramin 크롤링 및 데이터베이스 저장 (Jobs)
        try {
            console.log(`Crawling jobs for term: "${DEFAULT_SEARCH_TERM}"`);
            const jobs = await crawlSaramin(DEFAULT_SEARCH_TERM, DEFAULT_JOB_COUNT);
            console.log(`${jobs.length} jobs crawled successfully.`);
            await saveJobsToDb(jobs);
        } catch (error) {
            console.error('Error during job crawling or saving:', error.message);
        }

        // Saramin 크롤링 및 데이터베이스 저장 (Companies)
        try {
            console.log(`Crawling companies for term: "${DEFAULT_SEARCH_TERM}"`);
            const companies = await crawlSaraminCompanies(DEFAULT_SEARCH_TERM, DEFAULT_COMPANY_COUNT);
            console.log(`${companies.length} companies crawled successfully.`);
            await saveCompaniesToDb(companies);
        } catch (error) {
            console.error('Error during company crawling or saving:', error.message);
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
