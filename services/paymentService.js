const { Op } = require("sequelize");
const { Enrollment, Course, Teacher, User } = require("../models");

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
        include: {
            model: Course,
            attributes: ['courseName', 'price'],
        },
        include: {
            model: User,
            attributes: ['firstName', 'lastName', 'email']
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
}


module.exports = {
    createdEnrollment,
    findAllEnrollments,
    findAllEnrollmentsByUserId,
    findAllEnrollmentsByCourseId,
    existingEnrolment,
    usersSignupInCourse,
}