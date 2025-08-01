const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const TeacherPaymentMain = require('./TeacherPayment_Main');
const Course = require('./Course');

const TeacherPaymentItem = sequelize.define('TeacherPaymentItem', {
    itemId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    itemUUID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    paymentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: TeacherPaymentMain,
            key: 'paymentId',
        },
    },
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Course,
            key: 'courseId',
        },
    },
    courseName: {
        type: DataTypes.STRING,
    },
    enrollmentsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    coursePrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    commissionPercent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
    },
    grossAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    netAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
},
    { timestamps: true },
);

module.exports = TeacherPaymentItem;