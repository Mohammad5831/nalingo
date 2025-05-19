const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('./Course');
const Teacher = require('./Teacher');

const Chapter = sequelize.define('Chapter', {
  chapterId: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  chapterUUID: { 
    type: DataTypes.UUID, 
    primaryKey: true, 
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  chapterName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  courseId: { 
    type: DataTypes.INTEGER, 
    references: { 
      model: Course, 
      key: 'courseId' 
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

module.exports = Chapter;