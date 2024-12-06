const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.saramin.co.kr';

const crawlSaramin = async (searchTerm, maxResults = 100) => {
    const jobs = [];
    const seenEntries = new Set(); // 중복 확인용 Set
    let page = 1;

    while (jobs.length < maxResults) {
        try {
            const response = await axios.get(`${BASE_URL}/zf_user/search/recruit`, {
                params: { searchword: searchTerm, recruitPage: page }, // recruitPage로 수정
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                },
            });

            const $ = cheerio.load(response.data);

            // 채용공고 데이터 추출
            $('.item_recruit').each((_, element) => {
                const title = $(element).find('.job_tit a').text().trim() || 'No title provided';
                const company = $(element).find('.corp_name a').text().trim() || 'No company provided';
                let link = $(element).find('.job_tit a').attr('href');
                link = link ? (link.startsWith('http') ? link : `${BASE_URL}${link}`) : null;

                // 고유 키 생성: title, company, link를 조합
                const uniqueKey = `${title}-${company}-${link}`;

                // 이미 처리한 데이터라면 건너뛰기
                if (seenEntries.has(uniqueKey)) return;

                const conditions = $(element).find('.job_condition span');
                const location = conditions.eq(0).text().trim() || 'No location provided';
                const experience = conditions.eq(1).text().trim() || 'No experience provided';
                const education = conditions.eq(2).text().trim() || 'No education provided';
                const employmentType = conditions.eq(3).text().trim() || 'No employment type provided';

                const deadline = $(element).find('.job_date .date').text().trim() || 'No deadline provided';

                // 추가 정보 - 직무 분야 및 연봉 정보
                const sector = $(element).find('.job_sector').text().trim() || 'No sector provided';
                const salaryBadge = $(element).find('.area_badge .badge').text().trim() || 'No salary info';


                // 중복되지 않은 데이터만 저장
                jobs.push({
                    title,
                    company,
                    link,
                    location,
                    experience,
                    education,
                    employmentType,
                    deadline,
                    sector,
                    salary: salaryBadge,
                });

                // 고유 키를 Set에 추가
                seenEntries.add(uniqueKey);
            });

            if ($('.item_recruit').length === 0) break; // 더 이상 데이터가 없을 경우 종료
            console.log(`Page ${page} crawled successfully.`);
            page++;
        } catch (error) {
            console.error(`Error on page ${page}: ${error.message}`);
            if (error.response?.status >= 500 || error.code === 'ECONNABORTED') {
                console.warn(`Retrying page ${page}...`);
                continue; // 서버 에러 시 재시도
            } else {
                break; // 다른 에러일 경우 종료
            }
        }
    }

    return jobs.slice(0, maxResults); // 요청한 최대 개수만 반환
};

module.exports = crawlSaramin;
