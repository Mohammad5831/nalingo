const { existingTeacherByUUID } = require("../services/authService");
const { getAllTeachersCourse } = require('../services/courseService');
const { usersSignupInCourse } = require('../services/paymentService');
const { createdTeacherPayment, createdTeacherPaymentItem, findAllPayments, findAllPaymentsByTeacherID, } = require('../services/teacherPaymentService');


// Create paid teacher (only admin)
const createPayment = async (req, res) => {
    try {
        const { periodStartDate, periodEndDate } = req.body;
        const paymentProofLink = req.file?.path;
        // Check the existence of the teacher
        const teacher = await existingTeacherByUUID(req.params.teacherUUID);
        if (!teacher) return res.status(404).json({ message: "استاد پیدا نشد." });

        // Checking the existence of teacher's courses
        const courses = await getAllTeachersCourse(teacher.teacherId);
        if (!courses) {
            return res.status(404).json({ message: 'دوره ای پیدا نشد' });
        }

        let totalGross = 0;
        let totalNet = 0;
        const items = [];

        for (const course of courses) {
            // Number of students enrolled in the interval
            const enrollments = await usersSignupInCourse(course.courseId, periodStartDate, periodEndDate);
            if (!enrollments) return res.status(404).json({ message: 'دانشجو ای پیدا نشد' })

            const commissionPercent = 20;
            const gross = enrollments * course.price;
            const net = gross * (1 - commissionPercent / 100);

            totalGross += gross;
            totalNet += net;

            items.push({
                courseName: course.courseName,
                courseId: course.courseId,
                enrollmentsCount: enrollments,
                coursePrice: course.price,
                commissionPercent: commissionPercent,
                grossAmount: gross,
                netAmount: net,
            });
        }

        // Create the main record
        const payment = await createdTeacherPayment(teacher.teacherId, req.body, paymentProofLink, totalGross, totalNet);
        // Create items
        for (const item of items) {
            await createdTeacherPaymentItem(payment.paymentId, item);
        }
        const response = payment.toJSON();
        delete response.paymentId;
        delete response.teacherId;

        res.status(201).json({ message: "پرداخت با موفقیت ایجاد شد", payment: response });
    } catch (err) {
        res.status(500).json({ message: 'پرداخت با مشکل مواجه شد', error: err.message });
    }
};

// Get all payments (only admin)
const getAllPayments = async (req, res) => {
    try {
        const payments = await findAllPayments();
        if (!payments) return res.status(404).json({ message: 'پرداختی ای پیدا نشد' })

        res.status(200).json({ message: 'لیست پرداختی ها با موفقیت دریافت شد', payments });
    } catch (err) {
        res.status(500).json({ message: 'دریافت لیست پرداختی ها با مشکل مواجه شد', error: err.message });
    }
};

// Receive all payments from a teacher (only admin)
const getTeacherPayments = async (req, res) => {
    try {
        const { teacherUUID } = req.params;
        // Check the existence of the teacher
        const teacher = await existingTeacherByUUID(teacherUUID);
        if (!teacher) return res.status(404).json({ message: "استاد پیدا نشد." });
        // Checking the existence of payment
        const payments = await findAllPaymentsByTeacherID(teacher.teacherId);
        if (!payments) {
            return res.status(404).json({ message: 'پرداختی ای پیدا نشد' });
        }

        res.status(200).json({ message: 'لیست پرداختی ها استاد با موفقیت دریافت شد', payments });
    } catch (err) {
        res.status(500).json({ message: 'دریافت لیست پرداختی ها با مشکل مواجه شد', error: err.message });
    }
};


module.exports = {
    createPayment,
    getAllPayments,
    getTeacherPayments,
};