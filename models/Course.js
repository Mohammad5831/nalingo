const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Teacher = require('./Teacher');

const Course = sequelize.define('Course', {
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseUUID: { 
    type: DataTypes.UUID, 
    primaryKey: true, 
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  courseName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  coursePreview: {
    type: DataTypes.STRING
  },
  courseType: {
    type: DataTypes.ENUM('online', 'offline'),
    allowNull: false,
  },
  language: {
    type: DataTypes.ENUM('english', 'german', 'spanish', 'chines', 'french', 'arabic', 'russian', 'hindi', 'japanese', 'portuguese'),
    allowNull: false,
  },
  level: {
    type: DataTypes.ENUM('a1', 'a2', 'b1', 'b2', 'c1', 'c2'),
    allowNull: false,
  },
  skillType: {
    type: DataTypes.ENUM('fullSkill', 'listening', 'speaking', 'reading', 'writing', 'grammar'),
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.INTEGER,
    references: {
      model: Teacher,
      key: 'teacherId'
    },
    allowNull: false
  }
}, { timestamps: true });

module.exports = Course;