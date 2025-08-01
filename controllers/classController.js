const { ClassSession, Class, StudentClass } = require('../models');
const { existingUserByUUID, existingTeacherByUUID } = require('../services/authService');
const { createdClass } = require('../services/classService');
const { existingCourseByUUID } = require('../services/courseService');

const createClass = async (req, res) => {
    const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;
    const { courseUUID } = req.body;
    try {
        const teacher = await existingTeacherByUUID(teacherUUID);
        if (!teacher) return res.status(404).json({ success: false, message: "استاد پیدا نشد." });
        const course = await existingCourseByUUID(courseUUID);
        if (!course) return res.status(404).json({ success: false, message: "دوره موردنظر پیدا نشد." });

        const newClass = await createdClass(req.body, course.courseId, teacher.teacherId);
        return res.status(201).json({success: true, message: 'کلاس با موفقیت ایجاد شد', class: newClass})

    } catch (error) {
        return res.status(500).json({ success: false, message: 'خطا در ساخت کلاس', error: error.message });
    }
};


// ClassSession = CS
// ClassParticipant = CP

const startRoom = async (req, res) => {
    const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;
    const { roomId } = req.body;

    try {
        const teacher = await existingTeacherByUUID(teacherUUID);
        if (!teacher) return res.status(404).json({ success: false, message: "استاد پیدا نشد." });
        const classData = await Class.findOne({
            where: { courseUUID }
        })
        if (!classData) {
            return res.status(400).json({ success: false, message: 'اطلاعات کلاس موردنظر پیدا نشد' });
        }
        if (classData.isFinished) {
            return res.status(400).json({ success: false, message: 'تعداد جلسات مجاز این کلاس به پایان رسیده است' })
        }
        const existingCS = await ClassSession.findOne({
            where: { roomId, endAt: null }
        });
        if (existingCS) {
            return res.status(400).json({ success: false, message: 'کلاس درحال حاضر وجود دارد' });
        };


        const session = await ClassSession.create({
            roomId,
            teacherId: teacher.teacherId,
            startAt: new Date(),
        });

        return res.status(201).json({ success: true, message: 'کلاس با موفقیت ایجاد شد', roomId: session.roomId })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'خطا در ساخت کلاس' });
    }
};

const endRoom = async (req, res) => {
    const { roomId, courseUUID } = req.body;
    try {
        const existingCS = await ClassSession.findOne({
            where: { roomId, endAt: null }
        });
        if (!existingCS) {
            return res.status(400).json({ success: false, message: 'کلاس فعال موردنظر پیدا نشد' });
        };
        const classData = await Class.findOne({
            where: { courseUUID }
        })
        if (!classData) {
            return res.status(400).json({ success: false, message: 'اطلاعات کلاس موردنظر پیدا نشد' });
        }
        let newTotalSession = classData.totalSessions - 1;

        const endAt = new Date();
        const duration = Math.floor((endAt - existingCS.startAt) / 1000);
        await existingCS.update({
            endAt, duration, status: 'done',
        });
        if (newTotalSession === 0) {
            await classData.update({
                totalSessions: newTotalSession,
                isFinished: true
            });
        };
        await classData.update({
            totalSessions: newTotalSession
        })
        return res.status(200).json({ seccess: true, message: 'کلاس با موفقیت پایان یافت', data: { startDate: existingCS.startAt, endDate: endAt, duration } })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'خطا در پایان دادن به کلاس' });
    }
};

const checkJoinable = async (req, res) => {
    const userUUID = req.user?.userId;
    const { roomId, classUUID } = req.body;
    try {
        const user = await existingUserByUUID(userUUID);
        if (!user) {
            return res.status(404).json({ success: false, message: 'کاربر پیدا نشد' })
        }
        const existingCS = await ClassSession.findOne({
            where: { roomId, endAt: null }
        });
        if (!existingCS) {
            return res.status(400).json({ success: false, message: 'کلاس فعال موردنظر پیدا نشد' });
        };

        const classData = Class.findOne({
            where: {classUUID},
        });
        if (!classData) {
            return res.status(400).json({ success: false, message: 'اطلاعات کلاس موردنظر پیدا نشد' });
        };
        const studentClassNumber = await StudentClass.count({
            where: {classId: classData.classId}
        });
        if(studentClassNumber === classData.maxStudent) {
            return res.status(200).json({ success: true, message: 'عضویت درکلاس امکان پذیر نیست , ظرفیت کلاس تکمیل است' })
        }
        
        const studentClass = await StudentClass.findOne({
            where: { userId: user.userId, classId: classData.classId }
        })
        if (!studentClass) {
            return res.status(200).json({ success: true, message: 'عضویت درکلاس امکان پذیر نیست ,شما دانشجو دوره نیستید' })
        }

        return res.status(200).json({ success: true, message: 'عضویت درکلاس امکان پذیر است' })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'خطا در عضویت در کلاس' });
    }
};

module.exports = {
    createClass,
    startRoom,
    endRoom,
    checkJoinable,
}