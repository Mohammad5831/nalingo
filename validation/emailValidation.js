const { body } = require('express-validator');

const createEmailValidation = [
    body('emailAddress')
        .isEmail().withMessage('ایمیل نادرست است')
        .isLength({ min: 10 }).withMessage('ایمیل حداقل باید ده کاراکتر باشد'),
];

const sendEmailValidation = [
    body('subject')
        .notEmpty().withMessage('تیتر پیام الزامی است')
        .isLength({ min: 3 }).withMessage('تیتر پیام حداقل باید سه کاراکتر باشد'),
    body('text')
        .notEmpty().withMessage('متن ایمیل الزامی است')
        .isLength({ min: 3 }).withMessage('متن پیام حداقل باید سه کاراکتر باشد'),
]

module.exports = {
    createEmailValidation,
    sendEmailValidation,
};
