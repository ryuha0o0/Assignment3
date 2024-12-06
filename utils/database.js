const { Sequelize } = require('sequelize');

// 환경 변수 로드
require('dotenv').config();

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // 기본 포트는 3306
    dialect: 'mysql',
    logging: false, // SQL 쿼리 로깅 비활성화
});

// 데이터베이스 연결 함수
const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL database.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1); // 연결 실패 시 종료
    }
};

module.exports = { sequelize, connectToDatabase };
