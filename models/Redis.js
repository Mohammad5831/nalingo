const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Redis = sequelize.define('Redis', {
    phoneNumber: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
});

module.exports = Redis;

