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

module.exports = Application;
