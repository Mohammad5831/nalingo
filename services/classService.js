const { Class, ClassSession, ClassParticipant } = require("../models");

const createdClass = async (data, courseId, teacherId) => {
    const {
        classType,
        totalSessions,
        sessionsStartTime,
        sessionsEndTime,
        sessionDays,
        startDate,
        maxStudents,
    } = data;

    // ایجاد یک کلاس جدید در دیتابیس
    const newClass = await Class.create({
        classType,
        totalSessions,
        sessionsStartTime,
        sessionsEndTime,
        sessionDays,
        startDate,
        maxStudents,
        isFinished: false,
        courseId,
        teacherId,
    });

    // فیلتر کردن classId و classUUID از خروجی
    const { classId, ...filteredClass } = newClass.toJSON();
    return filteredClass;
};

const findClassSessionByRoomId = async (roomId) => {
    const classSession = await ClassSession.findOne({
        where: { roomId, endAt: null },
    });
    return classSession;
};

// joinedAt: new Date(),
const createdClassParticipant = async (CSId, userId, fullName, role) => {
    const classParticipant = await ClassParticipant.create({
        CSId,
        userId,
        fullName,
        role,
        joinedAt: new Date(),
    });
    return classParticipant;
};

const updatedClassParticipant = async (leftAt, duration, CSId, userId, role) => {
    const classParticipant = await ClassParticipant.update(
        { leftAt, duration },
        {
            where: {
                CSId,
                userId,
                role,
            },
        }
    );
    return classParticipant;
};

module.exports = {
    createdClass,
    findClassSessionByRoomId,
    createdClassParticipant,
    updatedClassParticipant,
};