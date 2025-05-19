const { body } = require('express-validator');

const createChapterValidation = [
    body('chapterName')
        .notEmpty().withMessage('نام دوره الزامی است')
        .isString().withMessage('نام دوره باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام دوره حداقل باید سه کاراکتر باشد'),
    body('courseId')
        .notEmpty().withMessage('ایدی دوره الزامی است')
        .isInt().withMessage('ایدی دوره باید عدد باشد'),
    body('teacherId')
        .notEmpty().withMessage('ایدی استاد الزامی است')
        .isInt().withMessage('ایدی استاد باید عدد باشد'),
];

const updateChapterValidation = [
    body('chapterName')
        .optional()
        .isString().withMessage('نام دوره باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام دوره حداقل باید سه کاراکتر باشد'),
    body('courseId')
        .optional()
        .isInt().withMessage('ایدی دوره باید عدد باشد'),
    body('teacherId')
        .optional()
        .isInt().withMessage('ایدی استاد باید عدد باشد'),
];

module.exports = {
    createChapterValidation,
    updateChapterValidation,
}