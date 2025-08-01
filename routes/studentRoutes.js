const express = require('express');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Token and access verification
router.use(authMiddleware.verifyToken, authMiddleware.isStudent);

// View the list of courses purchased by the student
router.get('/my-courses', studentController.getMyCourses)


module.exports = router;