const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ClassSession = require('./ClassSession');
const User = require('./User');

const ClassParticipant = sequelize.define('ClassParticipant', {
    CPId: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  CPUUID: { 
    type: DataTypes.UUID, 
    primaryKey: true, 
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  fullName: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.STRING
  },
  joinedAt: {
    type: DataTypes.DATE,
  },
  leftAt: {
    type: DataTypes.DATE,
  },
  duration: {
    type: DataTypes.INTEGER,
  },
  CSId: {
    type: DataTypes.INTEGER,
    references: {
        model: ClassSession,
        key: 'CSId',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
        model: User,
        key: 'userId',
    },
  },
}, { timestamps: true });

module.exports = ClassParticipant;