const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');

const Enrollment = sequelize.define('Enrollment', {
    enrollmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    enrollmentUUID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'userId'
        },
    },
    courseId: {
        type: DataTypes.INTEGER,
        references: {
            model: Course,
            key: 'courseId'
        },
    },
    paymentRefId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Enrollment;