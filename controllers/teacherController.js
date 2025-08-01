const fs = require('fs');
const path = require('path');
const { existingTeacherByUUID } = require('../services/authService');
const { getAllTeachersCourse, existingCourseByUUID, getAllStudentsCourses, findAllSingelTeacherCourses } = require('../services/courseService');
const { findAllEnrollmentsByCourseId, getEnrollmentsCountByCourseIds } = require('../services/paymentService');
const { updatedTeacher, findAllTeachers } = require('../services/teacherService');
const { checkCourseAccess } = require('../utilities/roleUtil');
const { findAllPaymentsByTeacherID } = require('../services/teacherPaymentService');
const { Enrollment, Course } = require('../models');

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

const getSingelTeacherDetail = async (req, res) => {
  const { teacherUUID } = req.params;
  try {
    // Check the existence of the teacher
    const teacher = await existingTeacherByUUID(teacherUUID);
    if (!teacher) return res.status(404).json({ message: "استاد پیدا نشد." });

    const courses = await findAllSingelTeacherCourses(teacher.teacherId);
    if (!courses) return res.status(404).json({ success: false, message: 'دوره ای پیدا نشد' });

    const teacherDetail = teacher.toJSON();
    delete teacherDetail.teacherId;
    delete teacherDetail.password;
    delete teacherDetail.email;
    delete teacherDetail.phoneNumber;
    delete teacherDetail.cardNumber;
    delete teacherDetail.iban;
    delete teacherDetail.status;

    res.status(200).json({ message: 'اطلاعات استاد با موفقیت دریافت شد', data: { teacherDetail, courses } })
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت اطلاعات', error: error.message });
  }
};

// Edit teacher detail
const updateTeacherDetail = async (req, res) => {
  try {
    const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;
    const teacherPhoto = req.files['teacherPhoto']?.[0].filename;
    const teachingPreview = req.files['teachingPreview']?.[0].filename;
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
    
    const teacherDetail = await updatedTeacher(req.body, teacherPhoto, teachingPreview, teacher);
    return res.status(200).json({ message: 'اطلاعات استاد با موفقیت ویرایش شد', teacherDetail })
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
    };
    // console.log(courses);

    const filteredCourse = courses.map((course) => {
      const courseObj = course.toJSON();
      delete courseObj.courseId;
      return courseObj;
    });

    res.status(200).json({ message: 'لیست دوره ها با موفقیت دریافت شد', courses: filteredCourse });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت دوره‌ها', error: error.message });
  }
};

// View students enrolled in a specific course
const getCourseStudents = async (req, res) => {
  try {
    // Check for course existence
    // const course = existingCourseByUUID(courseUUID);
    // if (!course) {
    //   return res.status(404).json({ message: 'دوره پیدا نشد.' });
    // }
    const teacherUUID = req.user.role === "teacher" ? req.user.userId : req.user.userId;
    // Check the existence of the teacher
    const teacher = await existingTeacherByUUID(teacherUUID);
    if (!teacher) return res.status(404).json({ message: "استاد پیدا نشد." });
    // Checking the existence of the course
    const courses = await getAllStudentsCourses(teacher.teacherId);
    if (!courses) {
      return res.status(404).json({ message: 'دوره پیدا نشد.' });
    };
    // let students;
    // for(const course of courses) {
    //   students = await findAllEnrollmentsByCourseId(course.courseId);
    //   console.log(course.courseName);

    //   console.log(students);
    //   console.log('=========');

    // if (!students) res.status(404).json({ message: `پرداختی ای برای دوره ${course.courseName}پیدا نشد` })
    // }

    // Collect all students across all courses
    let allStudents = [];

    for (const course of courses) {
      const students = await findAllEnrollmentsByCourseId(course.courseId);
      if (students && students.length > 0) {
        allStudents.push({
          courseName: course.courseName,
          students: students
        });
      } else {
        console.log(`پرداختی ای برای دوره ${course.courseName}پیدا نشد`);
      }
    }

    // If no students were found across all courses
    if (allStudents.length === 0) {
      return res.status(404).json({ message: 'هیچ دانشجویی در دوره‌ها ثبت‌نام نکرده است.' });
    }
    // Access check
    // await checkCourseAccess(req.user, course);

    // Find students who have paid for this course
    // const students = await findAllEnrollmentsByCourseId(course.courseId);
    // if (!students) return res.status(404).json({ message: 'پرداختی ای برای این دوره پیدا نشد' })

    res.status(200).json({ message: 'لیست دانشجویان با موفقیت دریافت شد', students: allStudents });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت لیست دانشجویان', error: error.message });
  }
};

const getAccountingOverview = async (req, res) => {
  try {
    const teacherUUID = req.user?.userId;

    // Check the existence of the teacher
    const teacher = await existingTeacherByUUID(teacherUUID);
    if (!teacher) return res.status(404).json({ success: false, message: "استاد پیدا نشد." });
    // دریافت لیست دوره‌های استاد
    const teacherCourses = await getAllTeachersCourse(teacher.teacherId);
    if (!teacherCourses) {
      return res.status(404).json({ success: false, message: 'دوره پیدا نشد.' });
    };

    // کل درامد ناخالص استاد 
    let grossIncome = 0;
    let netIncome = 0;
    // let incomeByCourse = 0;
    const commissionPercent = 20;
    for (const course of teacherCourses) {
      // Number of students enrolled in the interval
      const enrollmentCount = await getEnrollmentsCountByCourseIds(course.courseId);
      if (!enrollmentCount) return res.status(404).json({ success: false, message: 'واریزی ای برای دوره های استاد پیدا نشد' });

      const courseIncome = enrollmentCount * course.price;
      grossIncome += courseIncome;

    }

    // درآمد کل خالص استاد
    netIncome = grossIncome * (1 - commissionPercent / 100);

    const courses = await Course.findAll({
      where: { teacherId: teacher.teacherId },
      include: [
        {
          model: Enrollment,
          attributes: ['enrollmentId'],
        }
      ]
    })

    // درآمد به تفکیک دوره‌ها
    const incomeByCourse = courses.map(course => {

      const enrollCount = course.Enrollments.length;
      const courseGross = enrollCount * course.price;
      const courseNet = courseGross * (1 - commissionPercent / 100);
      return {
        courseId: course.courseId,
        courseName: course.courseName,
        grossIncome: courseGross,
        netIncome: courseNet
      };
    });

    // دریافتی‌های استاد
    const teacherPayments = await findAllPaymentsByTeacherID(teacher.teacherId);
    if (!teacherPayments) {
      return res.status(404).json({ success: false, message: 'پرداختی ای پیدا نشد' });
    }

    const totalReceived = teacherPayments.reduce((sum, p) => sum + parseInt(p.amount), 0);
    const balance = netIncome - totalReceived;

    return res.status(200).json({
      success: true,
      message: 'گزارش حسابداری استاد',
      data: {
        grossIncome,
        netIncome,
        totalReceived,
        balance,
        incomeByCourse,
        teacherPayments,
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'خطا در دریافت اطلاعات حسابداری', error: err.message });
  }
};

const getTeachersList = async (req, res) => {
  try {
    const teachers = await findAllTeachers();
    if (!teachers) {
      return res.status(404).json({ success: false, message: 'خطا در دریافت لیست استادان' });
    };
    return res.status(200).json({ success: true, message: 'لیست اساتید با موفقیت دریافت شد', teachers });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'خطا در دریافت لیست استادان', error: err.message })
  }
}


module.exports = {
  getTeacherDetail,
  getSingelTeacherDetail,
  updateTeacherDetail,
  getTeacherCourses,
  getCourseStudents,
  getAccountingOverview,
  getTeachersList,
}