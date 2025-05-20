const { existingTeacherByUUID } = require('../services/authService');
const { getAllTeachersCourse, existingCourseByUUID } = require('../services/courseService');
const { findAllEnrollmentsByCourseId } = require('../services/paymentService');
const { updatedTeacher } = require('../services/teacherService');
const { checkCourseAccess } = require('../utilities/roleUtil');

// View the teacher's own detail
const getTeacherDetail = async (req, res) => {
  try {
    const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;
    // Check the existence of the teacher
    const teacher = await existingTeacherByUUID(teacherUUID);
    if (!teacher) return res.status(404).json({ message: "استاد پیدا نشد." });
    const { teacherId, ...teacherDetail } = teacher.toJSON();

    res.status(200).json({ message: 'اطلاعات استاد با موفقیت دریافت شد', teacherDetail })
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت اطلاعات', error: error.message });
  }
};


// Edit teacher detail
const updateTeacherDetail = async (req, res) => {
  try {
    const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;
    const teacherPhoto = req.files['teacherPhoto']?.[0].path;
    const teachingPreview = req.files['teachingPreview']?.[0].path;
    
    // Check the existence of the teacher
    const teacher = await existingTeacherByUUID(teacherUUID);
    if (!teacher) return res.status(404).json({ message: "استاد پیدا نشد." });
    // Check for the existence of the teacher's profile photo and replace it with a new profile photo if it exists
    if (teacherPhoto) {
      if (teacher.teacherPhoto) {
        const oldTeacherPhoto = path.join(__dirname, '..', teacher.teacherPhoto);

        if (fs.existsSync(oldTeacherPhoto)) {
          fs.unlinkSync(oldTeacherPhoto);
        }
      }
    };
    if (teachingPreview) {
      if (teacher.teachingPreview) {
        const oldTeachingPreview = path.join(__dirname, '..', teacher.teachingPreview);

        if (fs.existsSync(oldTeachingPreview)) {
          fs.unlinkSync(oldTeachingPreview);
        }
      }
    };

    const updateteacher = await updatedTeacher(req.body, teacherPhoto, teachingPreview, teacher);
    return res.status(200).json({ message: 'اطلاعات استاد با موفقیت ویرایش شد', updateteacher })

  } catch (error) {
    res.status(500).json({ message: 'خطا در ویرایش اطلاعات', error: error.message });
  }
};

// View all teacher courses
const getTeacherCourses = async (req, res) => {
  try {
    const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;
    // Check the existence of the teacher
    const teacher = await existingTeacherByUUID(teacherUUID);
    if (!teacher) return res.status(404).json({ message: "استاد پیدا نشد." });
    // Checking the existence of the course
    const courses = await getAllTeachersCourse(teacher.teacherId);
    if (!courses) {
      return res.status(404).json({ message: 'دوره پیدا نشد.' });
    }
    const filteredCourse = courses.map(({ courseId, ...response }) => response);

    res.status(200).json({ message: 'لیست دوره ها با موفقیت دریافت شد', courses: filteredCourse });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت دوره‌ها', error: error.message });
  }
};

// View students enrolled in a specific course
const getCourseStudents = async (req, res) => {
  try {
    const { courseUUID } = req.params;

    // Access check
    await checkCourseAccess(req.user, course);
    // Check for course existence
    const course = existingCourseByUUID(courseUUID);
    if (!course) {
      return res.status(404).json({ message: 'دوره پیدا نشد.' });
    }

    // Find students who have paid for this course
    const students = await findAllEnrollmentsByCourseId(course.courseId);
    if (!students) return res.status(404).json({ message: 'پرداختی ای برای این دوره پیدا نشد' })

    res.status(200).json({ message: 'لیست دانشجویان با موفقیت دریافت شد', students });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت لیست دانشجویان', error: error.message });
  }
};

module.exports = {
  getTeacherDetail,
  updateTeacherDetail,
  getTeacherCourses,
  getCourseStudents,
}
