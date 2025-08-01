const jwt = require('jsonwebtoken');
const { User, Teacher } = require('../models');

// Check JWT token
const verifyToken = async (req, res, next) => {
  const authorization = req.header('Authorization');
  if (!authorization) {
    return res.status(401).json({ success: false, message: 'توکن ارائه نشده است' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'توکن نامعتبر است' });
  }
};

//Token not mandatory
const verifyTokenOptional = async (req, res, next) => {
  const authorization = req.header('Authorization');
  if (!authorization) {
    req.user = null; // Guest user
    return next();
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null; // If the token is invalid, we continue but without access.
    next();
  }
};

// const jwt = require('jsonwebtoken');

const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
};

module.exports = { socketAuthMiddleware };

// Check the admin role
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { userUUID: req.user.userId }
    });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز: شما ادمین نیستید' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در بررسی نقش کاربر', error: error.message });
  }
};

// Check the teacher role
const isTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({
      where: { teacherUUID: req.user.userId }
    });
    if (!teacher) {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز: شما استاد نیستید' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در بررسی نقش استاد', error: error.message });
  }
};

// Check the admin or teacher role
const IsAdminOrTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({
      where: { teacherUUID: req.user.userId }
    });

    if (req.user && (req.user.role === 'admin' || teacher)) {
      return next();
    } else {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز: شما ادمین یا استاد نیستید' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در بررسی نقش', error: error.message });
  }
}

// Check the student role
const isStudent = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { userUUID: req.user.userId }
    });

    if (!user || user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز: شما دانشجو نیستید' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در بررسی نقش دانشجو', error: error.message });
  }
};

module.exports = {
  verifyToken,
  verifyTokenOptional,
  isAdmin,
  isTeacher,
  IsAdminOrTeacher,
  isStudent,
};