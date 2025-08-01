const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const Teacher = require('./Teacher');

const TeacherPaymentMain = sequelize.define('TeacherPaymentMain', {
    paymentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    paymentUUID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    teacherId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Teacher,
            key: 'teacherId',
        },
    },
    periodStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    periodEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    totalGrossAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    totalNetAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
        defaultValue: 'pending',
    },
    paymentProofLink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
},
    { timestamps: true },
);

module.exports = TeacherPaymentMain;