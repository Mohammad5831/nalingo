const { body } = require('express-validator');


const createTicketValidation = [
    body('title')
        .notEmpty().withMessage('موضوع تیکت الزامی است')
        .isLength({ min: 5 }).withMessage('موضوع تیکت حداقل باید 5 کاراکتر باشد'),
    body('requestTEXT')
        .optional()
        .isLength({min: 10}).withMessage('متن تیکت حداقل باید 10 کاراکتر باشد'),
    body('userId')
        .notEmpty().withMessage('ایدی کاربر ضروری است')
        .isInt().withMessage('ایدی کاربر باید عدد باشد'),
    body('userType')
        .notEmpty().withMessage('نقش کاربر الزامی است')
        .isIn(['admin', 'teacher', 'student']).withMessage('نقش کاربر معتبر نیست'),
];
const replyTicketValidation = [
    body('responseTEXT')
    .notEmpty().withMessage('پاسخ تیکت الزامی است')
    .isLength({min: 5}).withMessage('پاسخ تیکت حداقل باید پنج کاراکتر باشد')
]

module.exports = {
    createTicketValidation,
    replyTicketValidation,
};