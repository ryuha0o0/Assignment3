const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // 회사명 중복 방지
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true, // URL은 필수가 아님
        validate: {
            isUrl: true, // 유효한 URL인지 검사
        },
    },
    ceo: {
        type: DataTypes.STRING, // 대표자명
        allowNull: true,
    },
    industry: {
        type: DataTypes.STRING, // 업종
        allowNull: true,
    },
    sales: {
        type: DataTypes.STRING, // 매출 정보
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

module.exports = Company;
