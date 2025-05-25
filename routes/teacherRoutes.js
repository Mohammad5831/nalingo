const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const { updateTeacherValidation } = require('../validation/userValidation');
const { handleValidationErrors } = require('../middlewares/errorHandler');

// Token and access verification
router.use(authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher)

// Get teacher detail
router.get('/', teacherController.getTeacherDetail);
// View all teacher courses
router.get('/courses', teacherController.getTeacherCourses);
// View students enrolled in a specific course
router.get('/student/:courseUUID', teacherController.getCourseStudents);


// Total received payments, list of transactions, and outstanding balance
router.get('/accounting', teacherController.getAccountingOverview);


// Edit teacher information
router.put('/:teacherUUID', updateTeacherValidation, handleValidationErrors ,uploadMiddleware.teacher.fields([
  { name: "teacherPhoto", maxCount: 1 }, { name: "teachingPreview", maxCount: 1 }
]), teacherController.updateTeacherDetail);

module.exports = router;