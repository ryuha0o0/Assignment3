const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const User = require('./User');


const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User, // User 모델과 연관
            key: 'id',
        },
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    dueDate: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: true, // createdAt, updatedAt 자동 관리
});

User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = Task;
