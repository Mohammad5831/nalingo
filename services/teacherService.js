const updatedTeacher = async (body, teacherPhoto, teacher) => {
    const { teacherName, bio, email } = body;

    await teacher.update({
        teacherName,
        teacherPhoto,
        bio,
        email,
    });

    const response = teacher.toJSON();
    delete response.teacherId;

    return response;
};

module.exports = {
    updatedTeacher,
}