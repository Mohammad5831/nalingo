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
router.get('/:teacherUUID', teacherController.getTeacherDetail);
// View all teacher courses
router.get('/', teacherController.getTeacherCourses);
// View students enrolled in a specific course
router.get('/:courseUUID', teacherController.getCourseStudents);
// Edit teacher information
router.put('/:teacherUUID', updateTeacherValidation, handleValidationErrors ,uploadMiddleware.teacher.fields([
  { name: "teacherPhoto", maxCount: 1 }, { name: "teachingPreview", maxCount: 1 }
]), teacherController.updateTeacherDetail);

module.exports = router;