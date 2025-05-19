const express = require("express");
const router = express.Router();
const teacherPaymentController = require("../controllers/teacherPaymentController");
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Token check and admin access
router.use(authMiddleware.verifyToken, authMiddleware.isAdmin);

// Get all payments with details
router.get("/", teacherPaymentController.getAllPayments);
// Receive payments from a specific teacher
router.get("/:teacherUUID", teacherPaymentController.getTeacherPayments);
// Create a new payment for a teacher (calculating courses and students)
router.post("/:teacherUUID", uploadMiddleware.paymentProofLink.single('paymentProofLink'), teacherPaymentController.createPayment);

module.exports = router;