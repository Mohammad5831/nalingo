const { findAllUsers, existingUserByUUID, existingTeacherByUUID } = require('../services/authService');
const { findAllCourses, existingCourseByUUID } = require('../services/courseService');
const { findAllEnrollments } = require('../services/paymentService');
const { checkUserRole } = require('../utilities/roleUtil');

//user

// Get a list of all users
const getAllUsers = async (req, res) => {
  try {
    // Access check
    await checkUserRole(req.user, ['admin']);

    const users = await findAllUsers();
    res.status(200).json({success: true, message: 'لیست کاربران با موفقیت دریافت شد', users: users.users, teachers: users.teachers });
  } catch (error) {
    res.status(500).json({success: false, message: 'خطا در دریافت لیست کاربران', error: error.message });
  }
};

// Delete user by userUUID
const deleteUser = async (req, res) => {
  const { userUUID } = req.params;
  try {
    // Access check
    await checkUserRole(req.user, ['admin']);

    const user = await existingUserByUUID(userUUID);
    if (!user) {
      return res.status(404).json({success: false, message: 'کاربر یافت نشد' });
    }
    await user.destroy();
    res.status(204).json({success: true, message: 'کاربر با موفقیت حذف شد' });
  } catch (error) {
    res.status(500).json({success: false, message: 'خطا در حذف کاربر', error: error.message });
  }
};

// Change user role
const changeUserRole = async (req, res) => {
  try {
    const { userUUID } = req.params;

    // Access check
    await checkUserRole(req.user, ['admin']);

    if (!['student', 'admin'].includes(req.body.role)) {
      return res.status(403).json({success: false, message: 'نقش معتبر نیست.' });
    }

    const user = await existingUserByUUID(userUUID);
    if (!user) {
      return res.status(404).json({success: false, message: 'کاربر یافت نشد' });
    }

    await user.update({ role: req.body.role });
    const updateuser = user.toJSON();
    delete updateuser.userId;

    return res.status(200).json({success: true, message: 'نقش با موفقیت تغییر یافت', updateuser });

  } catch (error) {
    res.status(500).json({success: false, message: 'خطا در تغییر نفش', error: error.message });
  }
};

// Change the teacher's status
const changeTeacherStatus = async (req, res) => {
  try {
    const { teacherUUID } = req.params;

    // Access check
    await checkUserRole(req.user, ['admin']);

    if (!['active', 'notactive'].includes(req.body.status)) {
      return res.status(400).json({success: false, message: 'وضعیت معتبر نیست.' });
    };
    const teacher = await existingTeacherByUUID(teacherUUID);
    if (!teacher) return res.status(404).json({success: false, message: 'استاد پیدا نشد' })

    await teacher.update({ status: req.body.status });
    const updateteacher = teacher.toJSON();
    delete updateteacher.teacherId;

    return res.status(200).json({success: true, message: 'وضعیت با موفقیت تغییر یافت', updateteacher });

  } catch (error) {
    res.status(500).json({success: false, message: 'خطا در تغییر وضعیت', error: error.message });
  }
}

// course

// Get a list of all courses
const getAllCourses = async (req, res) => {
  try {
    // Access check
    await checkUserRole(req.user, ['admin']);
    const courses = await findAllCourses();

    res.status(200).json({success: true, message: 'لیست دوره ها با موفقیت دریافت شد', courses });
  } catch (error) {
    res.status(500).json({success: false, message: 'خطا در دریافت لیست دوره‌ها', error: error.message });
  }
};
// Delete course by courseUUID
const deleteCourse = async (req, res) => {
  const { courseUUID } = req.params;
  try {
    // Access check
    await checkUserRole(req.user, ['admin']);
    const course = await existingCourseByUUID(courseUUID)
    if (!course) {
      return res.status(404).json({success: false, message: 'دوره یافت نشد' });
    }
    await course.destroy();
    res.status(204).json({success: true, message: 'دوره با موفقیت حذف شد' });
  } catch (error) {
    res.status(500).json({success: false, message: 'خطا در حذف دوره', error: error.message });
  }
};


// Get all registrations (for admin)
const getAllEnrollments = async (req, res) => {
  try {
    // Access check
    await checkUserRole(req.user, ['admin']);
    const enrollments = await findAllEnrollments();

    res.status(200).json({success: true, message: 'لیست دوره های ثبت نام شده با موفقیت دریافت شد', enrollments });
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: "خطا در دریافت لیست دوره های ثبت نام شده ثبت‌نام‌ها." });
  }
};

module.exports = {
  //users
  getAllUsers,
  deleteUser,
  changeUserRole,
  changeTeacherStatus,
  //courses
  getAllCourses,
  deleteCourse,
  getAllEnrollments,
};