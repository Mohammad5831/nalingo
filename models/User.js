const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  userId: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true,
  },
  userUUID: { 
    type: DataTypes.UUID, 
    primaryKey: true, 
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  firstName: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  lastName: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  phoneNumber: { 
    type: DataTypes.STRING, 
    unique: true,
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: true 
  },
  age: { 
    type: DataTypes.INTEGER,
    allowNull: true 
  },
  gender: { 
    type: DataTypes.ENUM('men', 'women'),
    allowNull: true 
  },
  role: { 
    type: DataTypes.ENUM('admin', 'student'), 
    allowNull: false,
    defaultValue: 'student',
  },
  status: {
    type: DataTypes.ENUM('active', 'notactive'),
    allowNull: false,
    defaultValue: 'notactive',
  },
}, { timestamps: true });

module.exports = User;