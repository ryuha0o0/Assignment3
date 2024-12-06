const { sequelize } = require('../utils/database');
const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');
const Bookmark = require('./Bookmark');
const InterviewSchedule = require('./InterviewSchedule');
const Notification = require('./Notification');
const Company = require('./Company');

// 모델 간 관계 정의
Application.belongsTo(Job, { foreignKey: 'jobId' });
Application.belongsTo(User, { foreignKey: 'applicantId' });

InterviewSchedule.belongsTo(Application, { foreignKey: 'applicationId' });

Bookmark.belongsTo(User, { foreignKey: 'userId' });
Bookmark.belongsTo(Job, { foreignKey: 'jobId' });

Notification.belongsTo(User, { foreignKey: 'userId' });

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
};
