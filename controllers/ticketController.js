const { existingUserByUUID, existingTeacherByUUID } = require("../services/authService");
const { createdTicket, getTicketByUUID, updatedTicket, findAllTickets } = require("../services/ticketService");
const { checkUserRole } = require("../utilities/roleUtil");

// Create a ticket
const createTicket = async (req, res) => {
    try {
        const userUUID = req.user.userId;
        const userType = req.user.role;
        let userId;
        // Checking the existence of the user
        if (userType === ('student' || 'admin')) {
            user = await existingUserByUUID(userUUID);
            if (user) userId = user.userId;
        } else if (userType === 'teacher') {
            teacher = await existingTeacherByUUID(teacherUUID);
            if (teacher) userId = teacher.teacherId;
        } else {
            return res.status(403).json({success: false, message: 'نقش نامعتبر است' })
        };
        if (!userId) {
            return res.status(404).json({success: false, message: 'کاربر پیدا نشد' });
        };

        const ticket = await createdTicket(req.body, userId, req.user.role);
        return res.status(201).json({success: true, message: 'تیکت با موفقیت ثبت شد', ticket });

    } catch (error) {
        return res.status(500).json({success: false, message: 'خطا در ایجاد تیکت', error: error.message });
    }

};

// Reply to a ticket (admin only)
const replyToTicket = async (req, res) => {
    try {
        const { ticketUUID } = req.params;
        // Access check
        await checkUserRole(req.user, ['admin']);
        // Get ticket
        const ticket = await getTicketByUUID(ticketUUID);
        if (!ticket) {
            return res.status(404).json({success: false, message: 'تیکت پیدا نشد' });
        }

        const updateticket = await updatedTicket(req.body, ticket);
        if (!updateticket) {
            return res.status(500).json({success: false, message: 'خطا در به‌روزرسانی تیکت' });
        }

        return res.status(200).json({success: true, message: 'پاسخ تیکت با موفقیت ثبت شد', updateticket });
    } catch (error) {
        return res.status(500).json({success: false, message: 'خطا در پاسخ دادن به تیکت', error: error.message });

    };
};

//Get all tickets (admin only)
const getAllTickets = async (req, res) => {
    try {
        // Access check
        await checkUserRole(req.user, ['admin']);
        // Checking for ticket existence
        const tickets = await findAllTickets();
        if (!tickets) {
            return res.status(404).json({success: false, message: 'تیکتی پیدا نشد' });
        }

        return res.status(200).json({success: true, message: 'لیست تیکت ها با موفقیت دریافت شد', tickets })
    } catch (error) {
        return res.status(500).json({success: false, message: 'خطا در دریافت تیکت ها', error: error.message });
    };
};


module.exports = {
    createTicket,
    replyToTicket,
    getAllTickets,
};