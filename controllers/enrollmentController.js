const { existingUserByUUID } = require("../services/authService");
const { existingCourseByUUID } = require("../services/courseService");
const { existingEnrolment } = require("../services/paymentService");

// Checking student registration in a course
const usersEnrollment = async (req, res) => {
  try {
    const { userUUID } = req.user?.userId;
    const { courseUUID } = req.params;
    // Checking the existence of the user
    const user = await existingUserByUUID(userUUID);
    if (!user) {
      return res.status(404).json({success: false, message: 'کاربر پیدا نشد' });
    };
    // Checking the existence of the course
    const course = await existingCourseByUUID(courseUUID);
    if (!course) {
      return res.status(404).json({success: false, message: 'دوره پیدا نشد.' });
    }
    // Check if already registered or not
    const existEnrollment = await existingEnrolment(course.courseId, user.userId)
    if (existEnrollment) {
      return res.status(409).json({success: false, message: "دانشجو قبلاً در این دوره ثبت‌نام کرده است." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: "خطا در ثبت‌نام دانشجو." });
  }
};

module.exports = {
  usersEnrollment,
}
