const { existingCourseByUUID } = require('../services/courseService');
const { creactedChapter, updatedChapter, getAllChaptersByCourseId, existingChapterBychapterUUID } = require('../services/chapterService');
const { checkUserRole, checkChapterAccess } = require('../utilities/roleUtil');
const { existingTeacherByUUID } = require('../services/authService');

// Create a chapter
const createChapter = async (req, res) => {
    try {
        const { courseUUID, chapterName } = req.body;
        const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;

        // Access check
        await checkUserRole(req.user, ['admin', 'teacher']);
        // Check the existence of the teacher
        const teacher = await existingTeacherByUUID(teacherUUID);
        if (!teacher) return res.status(404).json({ message: "استاد پیدا نشد." });
        // Checking the existence of the course
        const course = await existingCourseByUUID(courseUUID);
        if (!course) {
            return res.status(404).json({ message: 'دوره پیدا نشد.' });
        }

        const chapter = await creactedChapter(chapterName, course.courseId, teacher.teacherId)
        res.status(201).json({ message: ' فصل با موفقیت ایجاد شد ', chapter });
    } catch (error) {
        res.status(500).json({ message: 'خطا در ایجاد فصل', error: error.message });
    }
};


// Chapter editing
const updateChapter = async (req, res) => {
    try {
        const { chapterUUID } = req.params;

        // Access check
        await checkChapterAccess(req.user, chapter);
        // Checking the presence of chapter
        const chapter = await existingChapterBychapterUUID(chapterUUID);
        if (!chapter) return res.status(404).json({ message: "فصل موردنظر یافت نشد" });

        const updatechapter = await updatedChapter(chapter, req.body.chapterName);

        res.status(200).json({ message: 'فصل با موفقیت ویرایش شد', updatechapter });
    } catch (error) {
        res.status(500).json({ message: 'خطا در ویرایش فصل', error: error.message });
    }
};

// Remove the chapter
const deleteChapter = async (req, res) => {
    try {
        const { chapterUUID } = req.params;

        // Access check
        await checkChapterAccess(req.user, chapter);
        // Checking the presence of chapter
        const chapter = await existingChapterBychapterUUID(chapterUUID)
        if (!chapter) return res.status(404).json({ message: "فصل موردنظر یافت نشد" });

        await chapter.destroy();
        res.status(204).json({ message: "فصل با موفقیت حذف شد" });
    } catch (error) {
        res.status(500).json({ message: 'خطا در حذف فصل', error: error.message });
    }
};
// Get chapters related to a course with courseUUID
const getChaptersByCourse = async (req, res) => {
    try {
        const { courseUUID } = req.params;
        // Checking the existence of the course
        const course = await existingCourseByUUID(courseUUID);
        if (!course) {
            return res.status(404).json({ message: 'دوره پیدا نشد.' });
        }
        const chapters = await getAllChaptersByCourseId(course.courseId);
        res.status(200).json({ message: 'فصل ها با موفقیت دریافت شدند', chapters });
    } catch (error) {
        res.status(500).json({ message: 'خطا در دریافت فصل', error: error.message });
    }
};

module.exports = {
    createChapter,
    updateChapter,
    deleteChapter,
    getChaptersByCourse,
};