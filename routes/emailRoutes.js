const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const authMiddleware = require('../middlewares/authMiddleware');
const {createEmailValidation, sendEmailValidation} = require('../validation/emailValidation');
const { handleValidationErrors } = require('../middlewares/errorHandler');

// Create email 
router.post('/create-email',
    createEmailValidation,
    handleValidationErrors,
    emailController.createEmail
);
// Send email to users
router.post(
    '/send-email',
    sendEmailValidation,
    handleValidationErrors,
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    emailController.sendMassEmail
);

module.exports = router;