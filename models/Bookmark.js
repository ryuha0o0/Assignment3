const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const User = require('./User');
const Job = require('./Job');

const Bookmark = sequelize.define('Bookmark', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    jobId: {
        type: DataTypes.INTEGER,
        references: {
            model: Job,
            key: 'id',
        },
        allowNull: false,
    },
}, {
    timestamps: true,
});

// 관계 설정
Bookmark.belongsTo(Job, { as: 'relatedJob', foreignKey: 'jobId' }); // alias 수정

module.exports = Bookmark;
