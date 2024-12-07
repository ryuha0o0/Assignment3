const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Job = sequelize.define('Job', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    experience: {
        type: DataTypes.STRING,
        defaultValue: 'unknown',
    },
    education: {
        type: DataTypes.STRING,
        defaultValue: 'No education provided',
    },
    employmentType: {
        type: DataTypes.STRING,
        defaultValue: 'No employment type provided',
    },
    deadline: {
        type: DataTypes.STRING,
        defaultValue: 'No deadline provided',
    },
    sector: {
        type: DataTypes.STRING,
        defaultValue: 'No sector provided',
    },
    salary: {
        type: DataTypes.STRING,
        defaultValue: 'No salary info',
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
});

// 관계 설정
Job.associate = (models) => {
    Job.hasMany(models.Application, {
        foreignKey: 'jobId',
        as: 'applications', // alias 설정
    });
    Job.hasMany(models.Bookmark, {
        foreignKey: 'jobId',
        as: 'bookmarks', // Bookmark와의 관계 설정
    });
};

module.exports = Job;
