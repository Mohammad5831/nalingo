const jwt = require('jsonwebtoken');
require('dotenv').config();

// User and admin
const generateToken = async (user) => {
  return await jwt.sign({ userId: user.userUUID, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '3d'
  });
};

const generateTeacherToken = async (teacherUUID) => {
  return await jwt.sign({ userId: teacherUUID, role: 'teacher' }, process.env.JWT_SECRET, {
    expiresIn: '3d'
  });
};


module.exports = {
  generateToken,
  generateTeacherToken,
};