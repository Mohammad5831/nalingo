const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Class = require('./Class');

const StudentClass = sequelize.define('StudentClass', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'userId'
        },
    },
    classId: {
        type: DataTypes.INTEGER,
        references: {
            model: Class,
            key: 'classId'
        },
    },
}, { timestamps: true });

module.exports = StudentClass;