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
    applicantId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    appliedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

// 관계 설정
Application.associate = (models) => {
    Application.belongsTo(models.Job, {
        foreignKey: 'jobId',
        as: 'job', // alias 설정
    });
    Application.belongsTo(models.User, {
        foreignKey: 'applicantId',
        as: 'applicant', // alias 설정
    });
};

module.exports = Application;
