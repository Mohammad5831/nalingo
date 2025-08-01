const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.verifyToken, authMiddleware.isTeacher, classController.createClass)

router.post('/start-room', authMiddleware.verifyToken, authMiddleware.isTeacher, classController.startRoom)

router.post('/end-room', authMiddleware.verifyToken, authMiddleware.isTeacher, classController.endRoom);

router.post('/join-room', authMiddleware.verifyToken, authMiddleware.isStudent, classController.checkJoinable);


module.exports = router;