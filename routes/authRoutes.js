const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { registerValidationStepOne, registerValidationStepTwo, loginValidation, updateUserValidation } = require('../validation/userValidation');
const { handleValidationErrors } = require('../middlewares/errorHandler');

//user

// Get user or admin information
router.get('/profile',authMiddleware.verifyToken, authController.getUserDetail);
// Student and admin registration
router.post('/register', registerValidationStepOne, handleValidationErrors, authController.registerSendOTP);
router.post('/register-verify', registerValidationStepTwo, handleValidationErrors, authController.registerVerifyOTP);

// User or admin login
router.post('/login', loginValidation, handleValidationErrors, authController.login);
// Edit user or admin information
router.put('/profile', authMiddleware.verifyToken, updateUserValidation, handleValidationErrors, authController.updateUserDetail);

//teacher 

// Teacher registration
router.post('/register/teacher', registerValidationStepOne, handleValidationErrors, authController.registerSendOTP);
router.post('/register/teacher-verify', registerValidationStepTwo, handleValidationErrors, authController.registerTeacher)

// The arrival of the teacher
router.post('/login/teacher', loginValidation, handleValidationErrors, authController.loginTeacher);

// Logout
router.post('/logout', authMiddleware.verifyToken, authController.logout);

module.exports = router;