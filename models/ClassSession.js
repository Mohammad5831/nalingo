const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Class = require('./Class');

const ClassSession = sequelize.define('ClassSession', {
    CSId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CSUUID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    roomId: {
        type: DataTypes.STRING,
    },
    startDate: {
        type: DataTypes.DATE,
    },
    endDate: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'done', 'cancelled'),
        defaultValue: 'scheduled'
    },
    duration: {
        type: DataTypes.INTEGER,
    },
    classId: {
        type: DataTypes.INTEGER,
        references: {
            model: Class,
            key: 'classId'
        },
    },
}, { timestamps: true });

module.exports = ClassSession;