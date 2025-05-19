const { TeacherPaymentMain, TeacherPaymentItem } = require("../models");

const createdTeacherPayment = async (teacherId, body, paymentProofLink, totalGross, totalNet) => {
    // const { periodStartDate, periodEndDate} = body;

    const payment = await TeacherPaymentMain.create({
        teacherId,
        periodStartDate: '2025-04-01',
        periodEndDate: '2025-06-15',
        TotalGrossAmount: totalGross,
        TotalNetAmount: totalNet,
        paymentProofLink,
        paymentDate: new Date(),
        status: 'paid'
    });
    return payment;
};

const createdTeacherPaymentItem = async (paymentId, item) => {
    await TeacherPaymentItem.create({
        paymentId,
        ...item,
    });
};

const findAllPayments = async () => {
    const payments = await TeacherPaymentMain.findAll({
        attributes: {
            exclude: ['paymentId', 'teacherId'],
        },
        include: {
            model: TeacherPaymentItem,
            attributes: {
                exclude: ['itemId', 'paymentId', 'courseId'],
            },
        },
    });
    return payments;
};

const findAllPaymentsByTeacherID = async (teacherId) => {
    const payments = await TeacherPaymentMain.findAll({
        where: { teacherId },
        include: [{
            model: TeacherPaymentItem,
            attributes: {
                exclude: ['itemId', 'paymentId', 'courseId'],
            },
        }],
        order: [["PeriodStartDate", "DESC"]],
    });
    return payments;
};

const getTeacherPaymentByPaymentUUID = async (paymentUUID) => {
    const payment = await TeacherPaymentMain.findOne({
        where: { paymentUUID },
    });
    return payment;
};

const paymentUploadProof = async (payment, paymentProofLink) => {
    const updatePayment = await payment.update({
        paymentProofLink,
        paymentDate: new Date(),
        status: 'paid'
    })
    return updatePayment;
}

module.exports = {
    createdTeacherPayment,
    createdTeacherPaymentItem,
    findAllPayments,
    findAllPaymentsByTeacherID,
    getTeacherPaymentByPaymentUUID,
    paymentUploadProof,
}