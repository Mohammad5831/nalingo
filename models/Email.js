const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Email = sequelize.define('Email', {
    emailId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: true,
});

module.exports = Email;