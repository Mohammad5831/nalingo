const fs = require('fs');
const path = require('path');
const { existingTeacherByUUID } = require('../services/authService');
const { existingChapterBychapterUUID } = require('../services/chapterService');
const { createdEpisode, updatedEpisode, getAllEpisodeByChapterId, existingEpisodeByEpisodeUUID } = require('../services/episodeService');
const { checkUserRole, checkEpisodeAccess } = require('../utilities/roleUtil');
const { uploadToFTP } = require('../utilities/uploadUtil');

// Create a new episode
const createEpisode = async (req, res) => {
    try {
        console.log(req.body);

        const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;
        const videoLink = req.file ? req.file : null;
        // Access check
        await checkUserRole(req.user, ['admin', 'teacher']);

        // Checking the existence of the teacher
        const teacher = await existingTeacherByUUID(teacherUUID);
        if (!teacher) return res.status(404).json({ success: false, message: "استاد پیدا نشد." });
        // Checking the existence of the chapter
        const chapter = await existingChapterBychapterUUID(req.body.chapterUUID)
        if (!chapter) return res.status(404).json({ success: false, message: "فصل موردنظر یافت نشد" });

        // const result = await uploadToFTP(videoLink.path, videoLink.filename, 'episode')
        // if (!result.success) {
        //     return res.status(500).json({ message: "خطا در اپلود" })
        // }

        const episode = await createdEpisode(req.body, videoLink.filename, chapter.chapterId, teacher.teacherId)

        res.status(201).json({ success: true, message: ' قسمت با موفقیت ایجاد شد ', episode });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در ایجاد قسمت', error: error.message });
    }
};

// Edit episode
const updateEpisode = async (req, res) => {
    try {
        const { episodeUUID } = req.params;
        const videoLink = req.file? req.file: null;

        // Checking the presence of the episode
        const episode = await existingEpisodeByEpisodeUUID(episodeUUID);
        if (!episode) return res.status(404).json({ success: false, message: "قسمت موردنظر یافت نشد" });
        // Access check
        await checkEpisodeAccess(req.user, episode);

        // Check for the existence of the video file and replace it with a new file if it exists
        if (videoLink) {
            if (episode.videoLink) {
                const oldCoursePreview = path.join(__dirname, '..', episode.videoLink);
                if (fs.existsSync(oldCoursePreview)) {
                    fs.unlinkSync(oldCoursePreview);
                }
            }
        };

        const updateepisode = await updatedEpisode(episode, req.body.episodeName, videoLink.filename);

        res.status(200).json({ success: true, message: 'قسمت با موفقیت ویرایش شد', updateepisode });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در ویرایش قسمت', error: error.message });
    }
};

// Delete the episode
const deleteEpisode = async (req, res) => {
    try {
        const { episodeUUID } = req.params;
        // Checking the presence of the episode
        const episode = await existingEpisodeByEpisodeUUID(episodeUUID);
        if (!episode) return res.status(404).json({ success: false, message: "قسمت موردنظر یافت نشد" });
        // Access check
        await checkEpisodeAccess(req.user, episode);
        // Delete the video file of the episode
        if (episode.videoLink) {
            const episodeVideo = path.join(__dirname, '..', episode.videoLink);
            if (fs.existsSync(episodeVideo)) {
                fs.unlinkSync(episodeVideo);
            }
        }

        await episode.destroy();
        res.status(204).json({ success: true, message: "قسمت حذف شد" });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در حذف قسمت', error: error.message });
    }
};
// Get all episodes related to a season with the chapterUUID
const getEpisodesByChapter = async (req, res) => {
    try {
        // Checking the existence of the chapter
        const chapter = await existingChapterBychapterUUID(req.params.chapterUUID)
        if (!chapter) return res.status(404).json({ success: false, message: "فصل موردنظر یافت نشد" });
        // Get a list of episodes
        const episodes = await getAllEpisodeByChapterId(chapter.chapterId);
        if (!episodes) {
            return res.status(404).json({ success: false, message: 'قسمتی یافت نشد' })
        }
        res.status(200).json({ success: true, message: 'لیست دوره ها با موفقیت دریافت شد', episodes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در دریافت قسمت', error: error.message });
    }
};

module.exports = {
    createEpisode,
    updateEpisode,
    deleteEpisode,
    getEpisodesByChapter,
};