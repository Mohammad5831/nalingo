const { Ticket } = require("../models");

const createdTicket = async (body, userID, userType) => {
    const { title, requestTEXT } = body;

    const ticket = await Ticket.create({
        title,
        requestTEXT,
        userId: userID,
        userType
    });

    const response = ticket.toJSON();
    delete response.ticketId;
    delete response.userId;
    delete response.userType;
    return response;
};

const updatedTicket = async (body, ticket) => {
    ticket.update({
        responseTEXT: body.responseTEXT,
        status: 'answered',
    });

    const response = ticket.toJSON();
    delete response.ticketId;
    delete response.userId;
    return response;
};

const getTicketByUUID = async (ticketUUID) => {
    const ticket = await Ticket.findOne({
        where: { ticketUUID },
    });

    return ticket;
};

const findAllTickets = async () => {
    const tickets = Ticket.findAll({
        attributes: {
            exclude: ['ticketId', 'userId', 'userType'],
        },
    });

    return tickets;
};

module.exports = {
    createdTicket,
    updatedTicket,
    getTicketByUUID,
    findAllTickets,
}