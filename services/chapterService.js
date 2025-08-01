const { Chapter, Episode } = require("../models");

const creactedChapter = async (chapterName, courseID, teacherID) => {
    const chapter = await Chapter.create({
        chapterName,
        courseId: courseID,
        teacherId: teacherID,
    });
    const { chapterId, courseId, teacherId, ...filteredChapter } =await chapter.toJSON();

    return filteredChapter;
};

const updatedChapter = async (chapter, chapterName) => {
    await chapter.update({ chapterName });

    const response = chapter.toJSON();
    delete response.chapterId;
    delete response.courseId;
    delete response.teacherId;

    return response;
};

const existingChapterBychapterUUID = async (chapterUUID) => {
    const chapter = await Chapter.findOne({
        where: { chapterUUID },
    });

    return chapter;
};

const getAllChaptersByCourseId = async (courseId) => {
    const chapters = await Chapter.findAll({
        where: { courseId },
        attributes: {
            exclude: ['chapterId', 'courseId', 'teacherId'],
        },
        include: {
            model: Episode,
            attributes: ['episodeName'],
        },
    });

    return chapters;
};


module.exports = {
    creactedChapter,
    updatedChapter,
    existingChapterBychapterUUID,
    getAllChaptersByCourseId,
};