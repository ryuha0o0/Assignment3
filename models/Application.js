const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Job = require('./Job');
const User = require('./User');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), // 상태 정의
        allowNull: false,
        defaultValue: 'PENDING', // 초기 상태
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

// 관계 설정
Application.belongsTo(Job, { as: 'relatedJob', foreignKey: 'jobId' }); // Job과 관계 설정
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' }); // Job -> Applications

User.hasMany(Application, {
    foreignKey: 'userId',
    as: 'applications',
});

Application.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

module.exports = Application;
