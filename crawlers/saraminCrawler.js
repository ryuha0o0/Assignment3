const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.saramin.co.kr';

const crawlSaramin = async (searchTerm) => {
    try {
        const response = await axios.get(`${BASE_URL}/zf_user/search/recruit`, {
            params: { searchword: searchTerm },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            },
        });

        const $ = cheerio.load(response.data);

        const jobs = [];
        $('.item_recruit').each((_, element) => {
            const title = $(element).find('.area_job .job_tit a').text().trim() || 'No title provided';
            const company = $(element).find('.area_corp .corp_name a').text().trim() || 'No company provided';
            let link = $(element).find('.area_job .job_tit a').attr('href');
            link = link ? (link.startsWith('http') ? link : `${BASE_URL}${link}`) : null;

            const location = $(element).find('.area_job .job_condition span').eq(0).text().trim() || 'No location provided';
            const description = 'N/A'; // 크롤링 페이지에서 제공되지 않음
            const creator = company || 'Unknown'; // 회사명 활용

            jobs.push({ title, company, link, location, description, creator });
        });

        if (jobs.length === 0) {
            console.warn('No jobs found for the search term.');
        }

        return jobs;
    } catch (error) {
        console.error(
            `Error crawling Saramin: ${error.response?.status || 'No status'} - ${error.message}`
        );
        return [];
    }
};

module.exports = crawlSaramin;
