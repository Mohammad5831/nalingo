const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require('../middlewares/authMiddleware');

// Token check
router.use(authMiddleware.verifyToken);

// Send payment request
router.post("/request", paymentController.requestPayment);
// Checking the payment result (Callback from Zarinpal)
router.post("/verify", paymentController.verifyPayment);

module.exports = router;