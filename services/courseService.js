const { Course, Teacher, Chapter, Episode } = require('../models');

const createdCourse = async (body, coursePreview, teacherID, options) => {
    const { courseName, description, price, language, level, skillType } = body;

    const course = await Course.create({
        courseName,
        description,
        price,
        coursePreview,
        language,
        level,
        skillType,
        teacherId: teacherID
    }, options);
    const { courseId, teacherId, ...filteredCourse } = course.toJSON();

    return filteredCourse;
};

const updatedCourse = async (body, coursePreview, course, options) => {
    const { courseName, description, price, language, level, skillType } = body;

    await course.update({
        courseName,
        description,
        price,
        coursePreview,
        language,
        level,
        skillType,
    }, options);

    const response = course.toJSON();
    delete response.courseId;
    delete response.teacherId;

    return response;
};

const getDetailsCourse = async (courseUUID) => {
    const course = await Course.findOne({
        where: { courseUUID },
        attributes: {
            exclude: ['teacherId']
        },
        include: [
            {
                model: Teacher,
                attributes: ['teacherUUID', 'teacherName', 'bio']
            },
            {
                model: Chapter,
                attributes: ['chapterUUID', 'chapterName'],
                include: [
                    {
                        model: Episode,
                        attributes: ['episodeUUID', 'episodeName', 'videoLink']
                    }
                ]
            }
        ]
    });

    return course;
};

const existingCourseByUUID = async (courseUUID, options) => {
    const course = await Course.findOne({
        where: { courseUUID }
    }, options);
    return course;
};

const findAllCourses = async () => {
    const courses = await Course.findAll({
        attributes: {
            exclude: ['courseId', 'teacherId']
        },
        include: {
            model: Teacher,
            attributes: ['teacherName', 'bio']
        },
    });

    return courses;
};

const getAllTeachersCourse = async (teacherId) => {
    const courses = await Course.findAll({
        where: { teacherId },
        attributes: ['courseId', 'courseName', 'price', 'description', 'language'],// change
        include: [
            {
                model: Chapter,
                attributes: ['chapterUUID', 'chapterName'],
                include: [
                    {
                        model: Episode,
                        attributes: ['episodeUUID', 'episodeName', 'videoLink'],
                    },
                ],
            },
        ],
    });

    return courses;
}


module.exports = {
    createdCourse,
    updatedCourse,
    existingCourseByUUID,
    getDetailsCourse,
    findAllCourses,
    getAllTeachersCourse
};