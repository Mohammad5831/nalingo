const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const { updateTeacherValidation } = require('../validation/userValidation');
const { handleValidationErrors } = require('../middlewares/errorHandler');

// Get teacher detail
router.get('/profile',authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher, teacherController.getTeacherDetail);
// Get singel teacher detail
router.get('/detail/:teacherUUID', teacherController.getSingelTeacherDetail);
// View all teacher courses
router.get('/courses',authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher, teacherController.getTeacherCourses);
// // View students enrolled in a specific course
// router.get('/student/:courseUUID',authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher, teacherController.getCourseStudents);
router.get('/student',authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher, teacherController.getCourseStudents);


// Total received payments, list of transactions, and outstanding balance
router.get('/accounting',authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher, teacherController.getAccountingOverview);
// Get all teachers list
router.get('/', teacherController.getTeachersList)


// Edit teacher information
router.put('/',authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher, updateTeacherValidation, handleValidationErrors ,uploadMiddleware.teacher.fields([
  { name: "teacherPhoto", maxCount: 1 }, { name: "teachingPreview", maxCount: 1 }
]), teacherController.updateTeacherDetail);

module.exports = router;