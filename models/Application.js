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
        references: {
            model: Job,
            key: 'id',
        },
        allowNull: false,
    },
    appliedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    userId: { // User 모델과의 관계를 위한 외래 키
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // 참조할 테이블 이름
            key: 'id', // 참조할 컬럼 이름
        },
    },
}, {
    timestamps: false,
});

// 관계 설정
Application.belongsTo(Job, { as: 'relatedJob', foreignKey: 'jobId' }); // alias 수정


// User와 Application의 관계 정의
User.hasMany(Application, {
    foreignKey: 'userId',
    as: 'applications',
});

Application.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});
module.exports = Application;
