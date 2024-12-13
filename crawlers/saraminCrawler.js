const axios = require('axios');
const cheerio = require('cheerio');
const Job = require('../models/Job'); // Sequelize Job 모델
const Company = require('../models/Company'); // Sequelize Job 모델


const BASE_URL = 'https://www.saramin.co.kr';

// DB에서 최신 날짜 가져오기
const getLatestJobDate = async () => {
    try {
        const latestJob = await Job.findOne({
            order: [['postedDate', 'DESC']], // 최신 날짜 기준 내림차순 정렬
        });
        return latestJob ? new Date(latestJob.postedDate) : null;
    } catch (error) {
        console.error('Error fetching the latest job date:', error);
        return null;
    }
};

const crawlSaramin = async (searchTerm, maxResults = 100) => {
    const jobs = [];
    const seenEntries = new Set();
    let page = 1;

    // DB에서 최신 날짜 가져오기
    const latestDate = await getLatestJobDate();

    while (jobs.length < maxResults) {
        try {
            // 페이지가 5개를 넘으면 중단
            if (page > 5) {
                console.log("Reached the page limit: 5. Stopping crawl.");
                break;
            }
            const response = await axios.get(`${BASE_URL}/zf_user/search/recruit`, {
                params: {
                    searchword: searchTerm,
                    recruitPage: page,
                    recruitSort: 'edit_dt', // 등록일 순 정렬
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                },
            });

            const $ = cheerio.load(response.data);

            $('.item_recruit').each(async (_, element) => {
                const title = $(element).find('.job_tit a').text().trim() || 'No title provided';
                const company = $(element).find('.corp_name a').text().trim() || 'No company provided';
                let link = $(element).find('.job_tit a').attr('href');
                link = link ? (link.startsWith('http') ? link : `${BASE_URL}${link}`) : null;

                // 고유 키로 중복 체크
                if (seenEntries.has(link)) return;

                const conditions = $(element).find('.job_condition span');
                const location = conditions.eq(0).text().trim() || 'No location provided';
                const experience = conditions.eq(1).text().trim() || 'No experience provided';
                const education = conditions.eq(2).text().trim() || 'No education provided';
                const employmentType = conditions.eq(3).text().trim() || 'No employment type provided';
                const deadline = $(element).find('.job_date .date').text().trim() || 'No deadline provided';
                const sector = $(element).find('.job_sector').text().trim() || 'No sector provided';

                // 등록일 파싱
                const postedDateText = $(element).find('span.job_day').text().trim();
                let postedDate = null;

                if (postedDateText) {
                    const dateMatch = postedDateText.match(/(?:등록일|수정일)\s(\d{2})\/(\d{2})\/(\d{2})/);
                    if (dateMatch) {
                        const [_, year, month, day] = dateMatch;
                        const formattedDate = `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        postedDate = new Date(formattedDate);
                    } else {
                        postedDate = new Date();
                    }
                } else {
                    postedDate = new Date();
                }

                // 최신 날짜 기준으로 필터링
                if (latestDate && postedDate <= latestDate) {
                    console.log(`Skipping job posted on ${postedDate.toISOString()}: ${title}`);
                    return;
                }

                // 중복 여부를 DB에서 확인
                const exists = await Job.findOne({ where: { link } });
                if (exists) {
                    console.log(`Duplicate entry found: ${title} (${company})`);
                    return;
                }

                // 새 데이터 저장
                const newJob = await Job.create({
                    title,
                    company,
                    link,
                    location,
                    experience,
                    education,
                    employmentType,
                    deadline,
                    sector,
                    postedDate,
                });

                jobs.push(newJob);
                seenEntries.add(link);
            });

            if ($('.item_recruit').length === 0) break;
            console.log(`Page ${page} crawled successfully.`);
            page++;
        } catch (error) {
            console.error(`Error on page ${page}: ${error.message}`);
            if (error.response?.status >= 500 || error.code === 'ECONNABORTED') {
                console.warn(`Retrying page ${page}...`);
                continue;
            } else {
                break;
            }
        }
    }

    return jobs.slice(0, maxResults);
};

const crawlSaraminCompanies = async (searchTerm, maxResults = 100) => {
    const companies = [];
    const seenEntries = new Set();
    let page = 1;

    while (companies.length < maxResults) {
        try {
            if (page > 5) {
                console.log('Reached the page limit: 5. Stopping company crawl.');
                break;
            }

            const response = await axios.get(`${BASE_URL}/zf_user/search/company`, {
                params: {
                    searchword: searchTerm,
                    page,
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                },
            });

            const $ = cheerio.load(response.data);

            $('.item_corp').each((_, element) => {
                const name = $(element).find('.corp_name a').text().trim();
                const link = $(element).find('.corp_name a').attr('href')
                    ? `${BASE_URL}${$(element).find('.corp_name a').attr('href')}`
                    : null;
                const location = $(element).find('dl:contains("기업주소") dd').text().trim();
                const industry = $(element).find('dl:contains("업종") dd').text().trim();
                const ceo = $(element).find('dl:contains("대표자명") dd').text().trim();

                // 메모리 중복 체크
                const uniqueKey = `${name}-${link}`;
                if (seenEntries.has(uniqueKey)) return;

                companies.push({
                    name,
                    location,
                    website: link,
                    industry,
                    ceo,
                });

                seenEntries.add(uniqueKey);
            });

            if ($('.item_corp').length === 0) break;
            console.log(`Company page ${page} crawled successfully.`);
            page++;
        } catch (error) {
            console.error(`Error on company page ${page}: ${error.message}`);
            break;
        }
    }

    // 중복 데이터 확인 후 데이터베이스 저장
    const uniqueCompanies = [];
    for (const company of companies) {
        try {
            const exists = await Company.findOne({ where: { name: company.name } });
            if (!exists) {
                uniqueCompanies.push(company);
            } else {
                console.log(`Duplicate company found in DB: ${company.name}`);
            }
        } catch (error) {
            console.error(`Error checking company: ${company.name}. ${error.message}`);
        }
    }

    try {
        if (uniqueCompanies.length > 0) {
            await Company.bulkCreate(uniqueCompanies, { ignoreDuplicates: true });
            console.log(`Successfully saved ${uniqueCompanies.length} new companies.`);
        } else {
            console.log('No new companies to save.');
        }
    } catch (error) {
        console.error(`Error saving companies: ${error.message}`);
    }

    return uniqueCompanies.slice(0, maxResults);
};

module.exports = { crawlSaramin, crawlSaraminCompanies };
