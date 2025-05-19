const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const authMiddleware = require('../middlewares/authMiddleware');
const {createChapterValidation, updateChapterValidation} = require('../validation/chapterValidation');
const { handleValidationErrors } = require('../middlewares/errorHandler');

// Check the token
router.use(authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher);

// Get the chapters of a specific period
router.get('/:courseUUID', chapterController.getChaptersByCourse);
//Create a chapter
router.post('/', createChapterValidation, handleValidationErrors, chapterController.createChapter);
// Edit a specific chapter
router.put('/:chapterUUID', updateChapterValidation, handleValidationErrors, chapterController.updateChapter);
// Delete a specific chapter
router.delete('/:chapterUUID', chapterController.deleteChapter);

module.exports = router;