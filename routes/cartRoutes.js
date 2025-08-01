const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

// Check the token
router.use(authMiddleware.verifyToken);

// Get shopping cart courses
router.get('/', cartController.getCartCourses);
// Add course to cart
router.post('/:courseUUID', cartController.addCourseToCart);
// Remove course from cart
router.delete('/:courseUUID', cartController.removeCourseFromCart);

module.exports = router;