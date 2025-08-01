const { existingUserByUUID } = require("../services/authService");
const { findAllEnrollmentsByUserId } = require("../services/paymentService");

// View courses purchased by the student
const getMyCourses = async (req, res) => {
  try {
    const userUUID = req.user?.userId;
    // Checking the existence of the user
    const user = await existingUserByUUID(userUUID);
    if (!user) {
      return res.status(404).json({success: false, message: 'کاربر پیدا نشد' });
    };
    // Checking the existence of the purchased course
    const enrollments = await findAllEnrollmentsByUserId(user.userId);
    if (!enrollments) return res.status(404).json({success: false, message: 'دوره ای پیدا نشد' })

    res.status(200).json({success: true, message: 'لیست دوره های ثبت نام شده با موفقیت دریافت شد', enrollments });
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: "خطا در دریافت دوره های خریداری شده دانشجو." });
  }
};

module.exports = {
  getMyCourses,
}
