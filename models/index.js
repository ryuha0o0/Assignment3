const { sequelize } = require('../utils/database');
const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');
const Bookmark = require('./Bookmark');
const InterviewSchedule = require('./InterviewSchedule');
const Notification = require('./Notification');
const Company = require('./Company');
const Task=require('./Task')

// 모델 간 관계 정의
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });

// 다른 관계 정의
Bookmark.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Bookmark.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Sequelize 객체 및 모든 모델을 내보내기
module.exports = {
    sequelize,
    User,
    Job,
    Application,
    Bookmark,
    InterviewSchedule,
    Notification,
    Company,
    Task
};
