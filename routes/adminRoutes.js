const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Check token and admin status
router.use(authMiddleware.verifyToken, authMiddleware.isAdmin);

//user

// Get all users
router.get('/users', adminController.getAllUsers);
// Change user role
router.put('/change-role/:userUUID', adminController.changeUserRole);
// Change the teacher's status
router.put('/change-status/:teacherUUID', adminController.changeTeacherStatus);
// Delete user by userUUID
router.delete('/users/:userUUID', adminController.deleteUser);



//course

// Get a list of all courses
router.get('/courses', adminController.getAllCourses);
// Delete course with courseUUID
router.delete('/courses/:courseUUID', adminController.deleteCourse);

module.exports = router;