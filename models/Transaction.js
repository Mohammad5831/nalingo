const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');

const Transaction = sequelize.define('Transaction', {
    transactionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    transactionUUID: {
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
        allowNull: true,
    },
    cardPan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amount: {
        type: DataTypes.INTEGER,
    },
    fee: {
        type: DataTypes.INTEGER,
    },
    authority: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('paid', 'cancelled', 'pending'),
        defaultValue: 'pending',
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = Transaction;