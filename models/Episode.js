const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Chapter = require('./Chapter');
const Teacher = require('./Teacher');

const Episode = sequelize.define('Episode', {
  episodeId: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  episodeUUID: { 
    type: DataTypes.UUID, 
    primaryKey: true, 
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  episodeName: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  videoLink: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  chapterId: { 
    type: DataTypes.INTEGER, 
    references: { 
      model: Chapter, 
      key: 'chapterId' 
    }, 
    allowNull: false 
  },
  teacherId: {
    type: DataTypes.INTEGER,
    references: {
      model: Teacher,
      key: 'teacherId'
    },
    allowNull: false,
  },
}, { timestamps: true });

module.exports = Episode;