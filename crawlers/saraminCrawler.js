const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.saramin.co.kr';

const crawlSaramin = async (searchTerm, maxResults = 100) => {
    const jobs = [];
    let page = 1;

    while (jobs.length < maxResults) {
        try {
            const response = await axios.get(`${BASE_URL}/zf_user/search/recruit`, {
                params: { searchword: searchTerm, page },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                },
            });

            const $ = cheerio.load(response.data);
            const currentJobs = [];

            $('.item_recruit').each((_, element) => {
                const title = $(element).find('.area_job .job_tit a').text().trim() || 'No title provided';
                const company = $(element).find('.area_corp .corp_name a').text().trim() || 'No company provided';
                let link = $(element).find('.area_job .job_tit a').attr('href');
                link = link ? (link.startsWith('http') ? link : `${BASE_URL}${link}`) : null;

                const location = $(element).find('.area_job .job_condition span').eq(0).text().trim() || 'No location provided';
                const experienceText = $(element).find('.area_job .job_condition span').eq(1).text().trim();
                let experience = 'unknown';
                if (experienceText.includes('신입')) experience = 'junior';
                else if (experienceText.includes('3~5년')) experience = 'mid';
                else if (experienceText.includes('10년 이상')) experience = 'senior';

                const techStackText = $(element).find('.area_job .job_skill').text().trim();
                const techStack = techStackText ? techStackText.split(',').map(skill => skill.trim()) : [];

                currentJobs.push({ title, company, link, location, experience, techStack });
            });

            if (currentJobs.length === 0) break; // No more jobs available, exit loop
            jobs.push(...currentJobs);
            page++;
        } catch (error) {
            console.error(`Error on page ${page}: ${error.message}`);
            // Retry logic
            if (error.response?.status >= 500 || error.code === 'ECONNABORTED') {
                console.warn(`Retrying page ${page}...`);
                continue;
            } else {
                break;
            }
        }
    }

    return jobs.slice(0, maxResults); // Limit to maxResults
};

module.exports = crawlSaramin;
