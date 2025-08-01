const { existingCourseByUUID } = require('../services/courseService');
const { creactedChapter, updatedChapter, getAllChaptersByCourseId, existingChapterBychapterUUID } = require('../services/chapterService');
const { checkUserRole, checkChapterAccess } = require('../utilities/roleUtil');
const { existingTeacherByUUID } = require('../services/authService');

// Create a chapter
const createChapter = async (req, res) => {
    try {
        const { courseUUID, chapterName } = req.body;
        console.log(chapterName);
        
        const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;

        // Access check
        await checkUserRole(req.user, ['admin', 'teacher']);
        // Check the existence of the teacher
        const teacher = await existingTeacherByUUID(teacherUUID);
        if (!teacher) return res.status(404).json({success: false, message: "استاد پیدا نشد." });
        // Checking the existence of the course
        const course = await existingCourseByUUID(courseUUID);
        if (!course) {
            return res.status(404).json({success: false, message: 'دوره پیدا نشد.' });
        }

        const chapter = await creactedChapter(chapterName, course.courseId, teacher.teacherId)
        res.status(201).json({success: true, message: ' فصل با موفقیت ایجاد شد ', chapter });
    } catch (error) {
        res.status(500).json({success: false, message: 'خطا در ایجاد فصل', error: error.message });
    }
};


// Chapter editing
const updateChapter = async (req, res) => {
    try {
        const { chapterUUID } = req.params;

        // Checking the presence of chapter
        const chapter = await existingChapterBychapterUUID(chapterUUID);
        if (!chapter) return res.status(404).json({success: false, message: "فصل موردنظر یافت نشد" });
        // Access check
        await checkChapterAccess(req.user, chapter);

        const updatechapter = await updatedChapter(chapter, req.body.chapterName);

        res.status(200).json({success: true, message: 'فصل با موفقیت ویرایش شد', updatechapter });
    } catch (error) {
        res.status(500).json({success: false, message: 'خطا در ویرایش فصل', error: error.message });
    }
};

// Remove the chapter
const deleteChapter = async (req, res) => {
    try {
        const { chapterUUID } = req.params;

        // Checking the presence of chapter
        const chapter = await existingChapterBychapterUUID(chapterUUID)
        if (!chapter) return res.status(404).json({success: false, message: "فصل موردنظر یافت نشد" });
        // Access check
        await checkChapterAccess(req.user, chapter);

        await chapter.destroy();
        res.status(200).json({success: true, message: "فصل با موفقیت حذف شد" });
    } catch (error) {
        res.status(500).json({success: false, message: 'خطا در حذف فصل', error: error.message });
    }
};
// Get chapters related to a course with courseUUID
const getChaptersByCourse = async (req, res) => {
    try {
        const { courseUUID } = req.params;
        // Checking the existence of the course
        const course = await existingCourseByUUID(courseUUID);
        if (!course) {
            return res.status(404).json({success: false, message: 'دوره پیدا نشد.' });
        }
        const chapters = await getAllChaptersByCourseId(course.courseId);
        if(!chapters) {
            return res.status(404).json({success:false ,message: 'فصلی پیدا نشد'})
        }
        res.status(200).json({success: true, message: 'فصل ها با موفقیت دریافت شدند', chapters });
    } catch (error) {
        res.status(500).json({success: false, message: 'خطا در دریافت فصل', error: error.message });
    }
};

module.exports = {
    createChapter,
    updateChapter,
    deleteChapter,
    getChaptersByCourse,
};