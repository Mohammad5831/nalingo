const { body } = require('express-validator');

const registerValidationStepOne = [
    body('phoneNumber')
        .notEmpty().withMessage('شماره تلفن الزامی است')
        .isLength({ min: 11, max: 11 }).withMessage('شماره تلفن باید 11 کاراکتر باشد'),
    body('password')
        .notEmpty().withMessage('رمزعبور الزامی است')
        .matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
        .withMessage('رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ و کوچک باشد.'),
];

const registerValidationStepTwo = [
    body('phoneNumber')
        .notEmpty().withMessage('شماره تلفن الزامی است')
        .isLength({ min: 11, max: 11 }).withMessage('شماره تلفن باید 11 کاراکتر باشد'),
    body('otp')
        .notEmpty().withMessage('کد یکبار مصرف الزامی است')
        .isInt().withMessage('کد یکبار مصرف باید عدد باشد')
        .isLength({ min: 6, max: 6 }).withMessage('کد یکبار مصرف باید شش کاراکتر باشد'),
];

const loginValidation = [
    body('phoneNumber')
        .notEmpty().withMessage('شماره تلفن الزامی است')
        .matches(/^09\d{9}$/).withMessage('فرمت شماره تلفن معتبر نیست'),
    body('password')
        .notEmpty().withMessage('رمزعبور الزامی است')
];

const updateUserValidation = [
    body('firstName')
        .optional()
        .isString().withMessage('نام باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام حداقل باید سه کاراکتر باشد'),
    body('lastName')
        .optional()
        .isString().withMessage('نام خانوادگی باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام خانوادگی حداقل باید سه کاراکتر باشد'),
    body('email')
        .optional()
        .isEmail().withMessage('ایمیل نادرست است')
        .isLength({ min: 10 }).withMessage('ایمیل حداقل باید ده کاراکتر '),
    body('age')
        .optional()
        .isInt().withMessage('سن باید عدد باشد'),
    body('gender')
        .optional()
        .isIn(['men', 'women']).withMessage('جنسیت معتبر نیست'),
    body('role')
        .optional()
        .isIn(['admin', 'student']).withMessage('نقش معتبر نیست'),
    body('status')
        .optional()
        .isIn(['active', 'notactive']).withMessage('وضعیت معتبر نیست'),
];

const updateTeacherValidation = [
    body('teacherName')
        .optional()
        .isString().withMessage('نام استاد باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام حداقل باید سه کاراکتر باشد'),
    body('bio')
        .optional()
        .isString().withMessage('بایوگرافی باید رشته باشد')
        .isLength({ min: 10 }).withMessage('بایوگرافی حداقل باید ده کاراکتر باشد'),
    body('email')
        .optional()
        .isEmail().withMessage('ایمیل نادرست است')
        .isLength({ min: 10 }).withMessage('ایمیل حداقل باید ده کاراکتر '),
    body('cardNumber')
        .optional()
        .isString().withMessage()
        .isLength({ min: 16, max: 16 }).withMessage()
        .isNumeric().withMessage(),
    body('iban')
        .optional()
        .isString().withMessage()
        .matches(/^IR[0-9]{24}$/).withMessage(),
    body('status')
        .optional()
        .isIn(['active', 'notactive']).withMessage('وضعیت معتبر نیست'),
]
module.exports = {
    registerValidationStepOne,
    registerValidationStepTwo,
    loginValidation,
    updateUserValidation,
    updateTeacherValidation,
}