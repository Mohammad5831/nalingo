const express = require('express');
const router = express.Router();
const episodeController = require('../controllers/episodeController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const {createEpisodeValidation, updateEpisodeValidation} = require('../validation/episodeValidation');
const { handleValidationErrors } = require('../middlewares/errorHandler');

// Access check
router.use(authMiddleware.verifyToken, authMiddleware.IsAdminOrTeacher)

// Get all episodes of a specific chapter
router.get('/:chapterUUID', episodeController.getEpisodesByChapter);
// Create a new section (by admin or teacher)
router.post('/', uploadMiddleware.courseEpisodes.single('videoLink'), episodeController.createEpisode);
// Edit episode
router.put('/:episodeUUID', updateEpisodeValidation, handleValidationErrors, uploadMiddleware.courseEpisodes.single('videoLink'), episodeController.updateEpisode);
// Delete the episode
router.delete('/:episodeUUID', episodeController.deleteEpisode);

module.exports = router;