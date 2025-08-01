const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');
const { uploadCourseToFTP, uploadToFTP } = require('../utilities/uploadUtil');
const { createdCourse, updatedCourse, getDetailsCourse, findAllCourses, existingCourseByUUID } = require('../services/courseService');
const { existingTeacherByUUID, existingUserByUUID } = require('../services/authService');
const { checkUserRole, checkCourseAccess } = require('../utilities/roleUtil');
const { checkCourseLanguage } = require('../utilities/courseUtil');
const { existingEnrolment } = require('../services/paymentService');

// Create a new course (admin or instructor only)
const createCourse = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;
      const coursePreview = req.file ? req.file : null;

      // Access check
      await checkUserRole(req.user, ['admin', 'teacher']);
      // Check the existence of the teacher
      const teacher = await existingTeacherByUUID(teacherUUID);
      if (!teacher) return res.status(404).json({ success: false, message: "استاد پیدا نشد." });

      // Check the status of the teacher
      if (teacher.status === 'notactive') {
        return res.status(403).json({ success: false, message: 'وضعیت شما درحالت غیرفعال قرار دارد , از ادمین درخواست کنید وضعیت شما را درحالت فعال قرار دهد' })
      }

      const course = await createdCourse(req.body, coursePreview.filename, teacher.teacherId, { transaction: t });

      res.status(201).json({ success: true, message: "دوره با موفقیت ایجاد شد.", course: course, teacherId: teacher.teacherUUID });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ایجاد دوره', error: error.message });
  }
};

// Course editing (only by the admin or instructor who created the course)
const updateCourse = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const { courseUUID } = req.params;
      const coursePreview = req.file ? req.file : null;
      
      // Checking the existence of the course
      const course = await existingCourseByUUID(courseUUID);
      if (!course) {
        return res.status(404).json({ success: false, message: 'دوره پیدا نشد.' });
      }
      // Access check
      await checkCourseAccess(req.user, course);
      // Check for the existence of the course demo video file and replace it with a new file if it exists.
      if (coursePreview) {
        if (course.coursePreview) {
          const oldCoursePreview = path.join(__dirname, '..', course.coursePreview);
          if (fs.existsSync(oldCoursePreview)) {
            fs.unlinkSync(oldCoursePreview);
          }
        }
      };
      const updatecourse = await updatedCourse(req.body, coursePreview.filename, course, { transaction: t });

      res.status(200).json({ success: true, message: 'دوره با موفقیت ویرایش شد.', updatecourse });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ویرایش دوره', error: error.message });
  }
};

// Delete a course (only by the admin or instructor who created the course)
const deleteCourse = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const { courseUUID } = req.params;

      // Checking the existence of the course
      const course = await existingCourseByUUID(courseUUID);
      if (!course) {
        return res.status(404).json({ success: false, message: 'دوره پیدا نشد.' });
      }
      // Access check
      await checkCourseAccess(req.user, course);
      // Delete the course demo video file
      if (course.coursePreview) {
        const coursePreview = path.join(__dirname, '..', course.coursePreview);
        if (fs.existsSync(coursePreview)) {
          fs.unlinkSync(coursePreview);
        }
      }

      await course.destroy();
      res.status(200).json({ success: true, message: 'دوره با موفقیت حذف شد' });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در حذف دوره', error: error.message });
  }
};

// View all courses (for all users)
const getAllCourses = async (req, res) => {
  try {
    // Get the list of courses
    const courses = await findAllCourses();
    if (!courses) {
      return res.status(404).json({ success: false, message: 'دوره ای پیدا نشد.' });
    }
    res.status(200).json({ success: true, message: 'لیست دوره ها با موفقیت دریافت شد', courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در دریافت لیست دوره‌ها', error: error.message });
  }
};

// Get courses with language
const getCoursesByLanguage = async (req, res) => {
  try {
    const { language } = req.params;
    // Checking the accuracy of the language entered
    await checkCourseLanguage(language);
    // Get the list of courses
    const courses = await findAllCourses();
    if (!courses) {
      return res.status(404).json({ success: false, message: 'دوره ای پیدا نشد.' });
    };
    // Filter courses by language
    const filteredCourses = courses.filter(course => course.language === language);
    if (filteredCourses.length === 0) {
      return res.status(404).json({ success: false, message: 'دوره ای برای این زبان پیدا نشد.' });
    };
    res.status(200).json({ success: true, message: 'لیست دوره ها این زبان با موفقیت دریافت شد', filteredCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در دریافت لیست دوره‌ها', error: error.message });
  };
};

// View course details (with course videos only visible to buyers, admins, or instructors)
const getCourseDetails = async (req, res) => {
  try {
    const { courseUUID } = req.params;
    let teacherUUID;
    let userUUID;
    let user;

    if (req.user?.role === 'teacher') {
      teacherUUID = req.user?.userId;
    } else {
      userUUID = req.user?.userId;
    }
    // Checking the existence of the user
    if (userUUID) {
      user = await existingUserByUUID(userUUID);
      if (!user) {
        return res.status(404).json({ success: false, message: 'کاربر یافت نشد.' });
      }
    }
    // Checking the existence of the course
    const course = await getDetailsCourse(courseUUID);
    if (!course) {
      return res.status(404).json({ success: false, message: 'دوره پیدا نشد.' });
    };

    // Access check
    let hasAccess = false;
    if (req.user) {
      const isTeacher = course.Teacher.teacherUUID === teacherUUID;
      const isAdmin = req.user.role === 'admin';
      
      let hasPurchased = false;
      if (!isTeacher && !isAdmin) {
        hasPurchased = await existingEnrolment(course.courseId, user.userId)
      }
      hasAccess = isTeacher || isAdmin || hasPurchased;        
    }


    if (!hasAccess) {
      course.Chapters?.forEach(chapter => {
        chapter.Episodes?.forEach(episode => {
          episode.videoLink = null; // Remove video links for unauthorized users
        });
      });
    }
    if (hasAccess) {
      hasAccess = true
    } else {
      hasAccess = false
    }
    // console.log(hasAccess);
    const response = course.toJSON()
    delete response.courseId;    
    
    res.status(200).json({ success: true, message: 'دوره با موفقیت پیدا شد', response, hasAccess });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: 'خطا در دریافت جزئیات دوره', error: error.message });
  }
};


module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCoursesByLanguage,
  getCourseDetails,
}
