const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User')

const Ticket = sequelize.define('Ticket', {
    ticketId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ticketUUID: { 
        type: DataTypes.UUID, 
        primaryKey: true, 
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    requestTEXT: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    responseTEXT: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'answered'),
        defaultValue: 'pending',
        allowNull: false,
    },
    userId: { 
        type: DataTypes.INTEGER, 
        references: { 
          model: User, 
          key: 'userId' 
        },
    },
    userType: {
        type: DataTypes.ENUM('admin', 'teacher', 'student'),
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = Ticket;