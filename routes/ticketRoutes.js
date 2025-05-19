const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');
const { createTicketValidation, replyTicketValidation } = require('../validation/ticketValidation');
const { handleValidationErrors } = require('../middlewares/errorHandler');

// Check the token
router.use(authMiddleware.verifyToken);

// Get the list of tickets
router.get('/', authMiddleware.isAdmin, ticketController.getAllTickets);
// Create a ticket
router.post('/', createTicketValidation, handleValidationErrors, ticketController.createTicket);
// Reply to ticket
router.put('/:ticketUUID', replyTicketValidation, handleValidationErrors, authMiddleware.isAdmin, ticketController.replyToTicket);

module.exports = router;