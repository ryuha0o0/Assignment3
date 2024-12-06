const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Application = require('./Application');

const InterviewSchedule = sequelize.define('InterviewSchedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    applicationId: {
        type: DataTypes.INTEGER,
        references: {
            model: Application,
            key: 'id',
        },
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Canceled'),
        defaultValue: 'Scheduled',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

module.exports = InterviewSchedule;
