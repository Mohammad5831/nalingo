const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Teacher = require('./Teacher');
const Course = require('./Course');

const Class = sequelize.define('Class', {
    classId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    classUUID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    classType: {
        type: DataTypes.ENUM('private', 'group'),
        allowNull: false,
    },
    totalSessions: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sessionsStartTime: {
        type: DataTypes.TIME //like 16:00
    },
    sessionsEndTime: {
        type: DataTypes.TIME //like 18:00
    },
    sessionDays: {
        type: DataTypes.JSON, //like ['saturaday', 'monday', ...]
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATEONLY,
    },
    maxStudents: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isFinished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    courseId: {
        type: DataTypes.INTEGER,
        references: {
            model: Course,
            key: 'courseId',
        },
    },
    teacherId: {
        type: DataTypes.INTEGER,
        references: {
            model: Teacher,
            key: 'teacherId'
        },
        allowNull: false
    },
}, { timestamps: true });

module.exports = Class;