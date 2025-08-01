const { Op } = require('sequelize');
const { Enrollment, Teacher } = require("../models");

const updatedTeacher = async (body, teacherPhoto, teachingPreview, teacher) => {
    const { teacherName, bio, email, cardNumber, iban } = body;

    await teacher.update({
        teacherName,
        teacherPhoto,
        bio,
        email,
        cardNumber,
        iban,
        teachingPreview,
    });

    const response = teacher.toJSON();
    delete response.teacherId;

    return response;
};

const findAllPayments = async (courseIds) => {
     const payments = await Enrollment.findAll({
          where: { courseId: { [Op.in]: courseIds } },
          attributes: ['amount', 'courseId']
        });

        return payments;
};

const findAllTeachers = async () => {
    const teachers = await Teacher.findAll({
        attributes: {
            exclude: ['teacherId', 'phoneNumber', 'password', 'email', 'bio', 'cardNumber', 'iban', 'status']
        }
    });
    return teachers;
}

module.exports = {
    updatedTeacher,
    findAllPayments,
    findAllTeachers,
}