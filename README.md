# 프로젝트: Job Management API

이 프로젝트는 다양한 API를 제공하여 사용자들이 회사 정보, 북마크, 작업 지원, 인터뷰 일정을 효율적으로 관리할 수 있도록 돕습니다.

*http://113.198.66.75:17082/api-docs/ 에서 테스트해 볼 수 있습니다.*

-Authorization 칸에는 'Bearer <토큰>' 형식으로 입력해주세요 Header가 Authorization: Bearer <토큰> 형식이 되어야 합니다.

예시 : -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyIiwiaWF0IjoxNzM0MjM4MzM3LCJleHAiOjE3MzQzMjQ3Mzd9.uUhEEL8cZQnJSR3_M54vxGpgdi9jV7OWl200WEhrp9I"

문의 사항: tothfl1564@gmail.com

## 주요 API 목록

1. **Company API**
    - 회사 정보
2. **Bookmark API**
    - 채용 공고 북마크 
3. **Application API**
    - 작업 지원 관리
4. **Interview API**
    - 인터뷰 일정 관리
5. **Auth API**
    - 회원 관리
6. **Job API**
    - 채용 공고
7. **Notification API**
    - 알림 관리
8. **Task API**
    - 할 일 관리

## PDF 문서

API 명세에 대한 상세 설명은 아래 PDF 파일에서 확인할 수 있습니다.

[API 명세 PDF 다운로드](./Assignment3_readme.pdf)

## 설치 및 실행 방법

다음 명령어를 따라 프로젝트를 로컬 환경에서 실행하세요:

1. **의존성 설치**

```bash
npm install
```

2. **서버 실행**

```bash
node server.js
```

또는 아래 명령어로 클라이언트 및 서버를 동시에 실행:

```bash
npm start
```

*크롤링은 node server.js 실행 시 자동으로 진행됩니다. 원치 않으시면 
server.js 에서 
const { crawlSaramin, crawlSaraminCompanies } = require('./crawlers/saraminCrawler'); 
부분을 주석처리 해주세요*

## 기술 스택

- **Node.js**
- **Express.js**
- **Mysql** (데이터베이스)
