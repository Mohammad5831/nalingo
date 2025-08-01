const { User, Teacher } = require('../models');
const { changeUserStatus } = require('../utilities/userUtil');

//user

const existingUser = async (phoneNumber) => {
    const existingUser = await User.findOne({ where: { phoneNumber } });
    return existingUser;
};


const existingUserByUUID = async (userUUID) => {
    const existingUser = await User.findOne({ where: { userUUID } });
    return existingUser;
}

const findAllUsers = async () => {
    const users = await User.findAll({
        attributes: ['userUUID', 'firstName', 'lastName', 'email', 'phoneNumber', 'role', 'status']
    });
    const teachers = await Teacher.findAll({
        attributes: ['teacherUUID', 'teacherName', 'phoneNumber', 'bio', 'status']
    })

    return { users, teachers };
};

const updatedUser = async (body, user) => {
    const { firstName, lastName, email, age, gender } = body;

    await user.update({
        firstName,
        lastName,
        email,
        age,
        gender
    });
    if (firstName && lastName && email && age && gender) {
        await changeUserStatus(user);
    }

    return user;
};


const createUser = async (phoneNumber, password, role) => {
    const user = await User.create({
        phoneNumber,
        password,
        role
    });

    return user;
};


//teacher

const existingTeacher = async (phoneNumber) => {
    const existingTeacher = await Teacher.findOne({ where: { phoneNumber } });
    return existingTeacher;
};

const existingTeacherByUUID = async (teacherUUID) => {
    const existingTeacher = await Teacher.findOne({ where: { teacherUUID } });
    return existingTeacher;
}

const createTeacher = async (phoneNumber, password) => {
    const teacher = await Teacher.create({
        phoneNumber,
        password,
    });

    return teacher;
};




module.exports = {
    //user
    createUser,
    existingUser,
    existingUserByUUID,
    findAllUsers,
    updatedUser,
    // teacher
    createTeacher,
    existingTeacher,
    existingTeacherByUUID,
}