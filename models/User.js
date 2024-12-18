const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Users',
    timestamps: false,
});

// 비밀번호 해싱
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

// 비밀번호 비교 메서드
User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// 관계 설정
User.associate = (models) => {
    User.hasMany(models.Application, {
        foreignKey: 'applicantId',
        as: 'applications', // alias 설정
    });
};

module.exports = User;
