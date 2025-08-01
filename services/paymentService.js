const { Op, where } = require("sequelize");
const { Enrollment, Course, Teacher, User, Transaction } = require("../models");

const createdEnrollment = async (userId, courseId, refId) => {
    await Enrollment.create({
        userId,
        courseId,
        paymentRefId: refId,
    });
};

const findAllEnrollments = async () => {
    const enrollments = await Enrollment.findAll({
        attributes: ['enrollmentId', 'userId', 'courseId'],
        order: [['createdAt', 'DESC']],
        include: {
            model: Course,
            attributes: ['courseUUID', 'courseName', 'price', 'language', 'skillType'],
        },
        include: {
            model: Teacher,
            attributes: ['teacherName', 'bio']
        },
    })
    return enrollments
}

const findAllEnrollmentsByUserId = async (userId) => {
    const enrollments = await Enrollment.findAll({
        where: { userId },
        attributes: {
            exclude: ['enrollmentId', 'userId', 'courseId'],
        },
        include: {
            model: Course,
            attributes: ['courseUUID', 'courseName', 'price', 'language', 'skillType'],
        },
    });
    return enrollments
};

const findAllEnrollmentsByCourseId = async (courseId) => {
    const enrollments = await Enrollment.findAll({
        where: { courseId },
        attributes: [],
        include: {
            model: Course,
            attributes: ['courseName', 'price'],
        },
        include: {
            model: User,
            attributes: ['firstName', 'lastName', 'gender', 'age']
        }
    });
    return enrollments;
}

const existingEnrolment = async (courseId, userId) => {
    const enrollment = await Enrollment.findOne({
        where: { courseId, userId },
    });
    
    return enrollment;
}

const usersSignupInCourse = async (courseId, periodStartDate, periodEndDate) => {
    const enrollments = await Enrollment.count({
        where: {
            courseId,
            createdAt: { [Op.between]: [periodStartDate, periodEndDate] }
        },
    });
    return enrollments
};

const getEnrollmentsCountByCourseIds = async (courseId) => {
    // console.log(courseId);
    
    const enrollments = await Enrollment.count({
        where: { courseId },
    });
console.log(enrollments);

    return enrollments;
};

const createdTransaction = async (userId, courseId, amount) => {
    const transaction = await Transaction.create({
        userId,
        courseId,
        amount,
        status: 'pending'
    });
    return transaction.transactionUUID;
};

const updatedTransactionByUUID = async (transactionUUID, cardPan, amount, paymentRefId, fee, authority) => {
    await Transaction.update({
        cardPan,
        amount,
        paymentRefId,
        fee,
        authority,
        status: 'paid'
    }, {
        where: { transactionUUID },
    }
    );
};

const cancelledTransaction = async (transactionUUID) => {
    await Transaction.update({
        status: 'cancelled'
    }, {
        where: { transactionUUID },
    }
    );
}

module.exports = {
    createdEnrollment,
    findAllEnrollments,
    findAllEnrollmentsByUserId,
    findAllEnrollmentsByCourseId,
    existingEnrolment,
    usersSignupInCourse,
    getEnrollmentsCountByCourseIds,
    createdTransaction,
    updatedTransactionByUUID,
}