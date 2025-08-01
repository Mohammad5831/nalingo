const { body } = require('express-validator');

const createChapterValidation = [
    body('chapterName')
        .notEmpty().withMessage('نام دوره الزامی است')
        .isString().withMessage('نام دوره باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام دوره حداقل باید سه کاراکتر باشد'),
    body('courseUUID')
        .notEmpty().withMessage('ایدی دوره الزامی است')
        .isString().withMessage('ایدی دوره باید عدد باشد'),
];

const updateChapterValidation = [
    body('chapterName')
        .optional()
        .isString().withMessage('نام دوره باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام دوره حداقل باید سه کاراکتر باشد'),
];

module.exports = {
    createChapterValidation,
    updateChapterValidation,
}