const activeRooms = new Map();

const createRoom = (classId, teacherId) => {
    activeRooms.set(classId, {
        teacherId,
        createdAt: new Date(),
    });
};

const isRoomActive = (classId) => {
    return activeRooms.has(classId);
};

const getAllRooms = () => {
    return activeRooms;
};

module.exports = {
    createRoom,
    isRoomActive,
    getAllRooms,
};