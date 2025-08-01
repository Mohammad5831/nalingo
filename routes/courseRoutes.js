const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const {createCourseValidation, updateCourseValidation} = require('../validation/courseValidation');
const { handleValidationErrors } = require('../middlewares/errorHandler');


// View all courses (all users)
router.get('/', courseController.getAllCourses);
// View courses in a specific language
router.get('/language/:language', courseController.getCoursesByLanguage);
// View details of a specific course (all users) and (remove link for people who haven't purchased the course)
router.get('/:courseUUID', authMiddleware.verifyTokenOptional, courseController.getCourseDetails);
// Create a new course (teachers and admins only)
router.post('/', authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher, updateCourseValidation, handleValidationErrors, uploadMiddleware.coursePreview.single('coursePreview'), courseController.createCourse);
// Edit course (course creator or admin only)
// router.put('/:courseUUID', authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher, updateCourseValidation, handleValidationErrors, uploadMiddleware.coursePreview.single('coursePreview'), courseController.updateCourse);
router.put('/:courseUUID', uploadMiddleware.coursePreview.single('coursePreview'), courseController.updateCourse);

// Delete course (course creator or admin only)
router.delete('/:courseUUID', authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher, courseController.deleteCourse);

module.exports = router;