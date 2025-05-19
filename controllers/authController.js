const { createTeacher, createUser, existingUser, existingTeacher, existingUserByUUID, updatedUser } = require('../services/authService')
const { comparePassword, hashPassword } = require('../utilities/bcryptUtil');
const { generateToken, generateTeacherToken } = require('../utilities/jwtUtil');
const { sendOtpToPhone, verifyOtpCode, saveTempData, getTempData, deleteTempData, } = require('../utilities/otpUtil');

//user

// New User Registration (Student or Admin Only)
const registerSendOTP = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Checking the existence of a user by phone number
    const existUser = await existingUser(req.body.phoneNumber);
    const existTeacher = await existingTeacher(req.body.phoneNumber);
    if (existUser || existTeacher) {
      return res.status(409).json({ message: 'شماره تلفن قبلاً استفاده شده است.' });
    }

    const hashedPass = await hashPassword(password);

    await saveTempData(`register: ${phoneNumber}`, 300, hashedPass);
    await sendOtpToPhone(phoneNumber);

    return res.status(200).json({ message: 'کد تایید با موفقیت ارسال شد' });

  } catch (error) {
    res.status(500).json({ message: 'خطا در ثبت نام و ارسال کد تایید', error: error.message });
  }
};

const registerVerifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!req.body.role) {
      req.body.role = 'student';
    };

    const isValid = await verifyOtpCode(phoneNumber, otp);
    if (!isValid.valid) {
      return res.status(400).json({ message: isValid.reason === 'expired' ? 'کد منقضی شده است' : 'کد نادرست است' });
    }

    if (!['student', 'admin'].includes(req.body.role)) {
      return res.status(403).json({ message: 'نقش معتبر نیست.' });
    }
    // Getting data from Redis
    const password = await getTempData(`register: ${phoneNumber}`);
    if (!password) {
      return res.status(404).json({ message: 'اطلاعات ثبت نام پیدا نشد یا منقضی شده است' });
    };
    // Create a user
    const user = await createUser(phoneNumber, password, req.body.role);
    await deleteTempData(`register: ${phoneNumber}`);

    return res.status(201).json({ message: 'کاربر با موفقیت ثبت‌نام شد.', id: user.userUUID });
  } catch (error) {
    return res.status(500).json({ message: 'خطا در ثبت نام', error: error.message })
  }
};

// User login
const login = async (req, res) => {
  try {
    // Checking the existence of the user
    const user = await existingUser(req.body.phoneNumber);
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد.' });
    }

    // Check password
    const isPasswordValid = comparePassword(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'رمز عبور اشتباه است.' });
    }

    // Generate token
    const token = await generateToken(user);

    return res.status(200).json({ message: 'ورود موفقیت‌آمیز بود.', token: token });
  } catch (error) {
    res.status(500).json({ message: 'خطا در ورود', error: error.message });
  }
};

// Get user details
const getUserDetail = async (req, res) => {
  try {
    const userUUID = req.user.role === ("admin" || 'student') ? req.user.userId : req.user.userId;
    // Checking the existence of a user with a userUUID

    const user = await existingUserByUUID(userUUID);
    if (!user) {
      return res.status(404).json({ message: 'کاربر پیدا نشد' });
    };

    const userDetail = user.toJSON();
    delete userDetail.userId;

    return res.status(200).json({ message: 'اطلاعات کاربر با موفقیت دریافت شد', userDetail })

  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت اطلاعات', error: error.message });
  }
};

// Edit user details
const updateUserDetail = async (req, res) => {
  try {
    const userUUID = req.user.role === ("admin" || 'student') ? req.user.userId : req.user.userId;
    // Checking the existence of a user with a userUUID
    const user = await existingUserByUUID(userUUID);
    if (!user) {
      return res.status(404).json({ message: 'کاربر پیدا نشد' });
    };

    const updateuser = await updatedUser(req.body, user);
    const response = updateuser.toJSON();
    delete response.userId;

    return res.status(200).json({ message: 'اطلاعات با موفقیت ویرایش شد', response });

  } catch (error) {
    res.status(500).json({ message: 'خطا در ویرایش اطلاعات', error: error.message });
  }
}

//teacher

// Teacher registration
const registerTeacher = async (req, res) => {
  try {

    const { phoneNumber, otp } = req.body;

    const isValid = await verifyOtpCode(phoneNumber, otp);
    if (!isValid.valid) {
      return res.status(400).json({ message: isValid.reason === 'expired' ? 'کد منقضی شده است' : 'کد نادرست است' });
    }
    // Getting data from Redis
    const password = await getTempData(`register: ${phoneNumber}`);
    if (!password) {
      return res.status(404).json({ message: 'اطلاعات ثبت نام پیدا نشد یا منقضی شده است' });
    };

    const teacher = await createTeacher(phoneNumber, password);
    await deleteTempData(`register: ${phoneNumber}`);

    return res.status(201).json({ message: 'استاد با موفقیت ثبت‌نام شد.', id: teacher.teacherUUID });

  } catch (error) {
    res.status(500).json({ message: 'خطا در ثبت‌نام استاد', error: error.message });
  }
};


// Teacher login
const loginTeacher = async (req, res) => {
  try {
    // Check the existence of the teacher
    const teacher = await existingTeacher(req.body.phoneNumber);
    if (!teacher) {
      return res.status(404).json({ message: 'استاد یافت نشد.' });
    }
    // Check password
    const isPasswordValid = await comparePassword(req.body.password, teacher.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'رمز عبور اشتباه است.' });
    }
    // Generate token
    const token = await generateTeacherToken(teacher.teacherUUID);

    return res.status(200).json({ message: 'ورود استاد موفقیت‌آمیز بود.', token: token });
  } catch (error) {
    res.status(500).json({ message: 'خطا در ورود استاد', error: error.message });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    return res.status(200).json({ message: 'خروج موفقیت‌آمیز بود.' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در خروج', error: error.message });
  }
};


module.exports = {
  //user
  registerSendOTP,
  registerVerifyOTP,
  // register,
  login,
  getUserDetail,
  updateUserDetail,
  //teacher
  registerTeacher,
  loginTeacher,
  logout
}