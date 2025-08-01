const { body } = require('express-validator');

const createCourseValidation = [
    body('courseName')
        .notEmpty().withMessage('نام دوره الزامی است')
        .isString().withMessage('نام دوره باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام دوره حداقل باید سه کاراکتر باشد'),
    body('description')
        .notEmpty().withMessage('توضیحات الزامی است')
        .isString().withMessage('توضیحات باید رشته باشد')
        .isLength({ min: 5 }),
    body('price')
        .notEmpty().withMessage('قیمت الزامی است')
        .isFloat({ gt: 0 }).withMessage('قیمت باید عدد باشد'),
    body('language')
        .notEmpty().withMessage('زبان الزامی است')
        .isIn(['english', 'german', 'spanish', 'chines', 'french', 'arabic', 'russian', 'hindi', 'japanese', 'portuguese'])
        .withMessage('زبان دوره معتبر نیست'),
    body('level')
        .notEmpty().withMessage('سطح دوره الزامی است')
        .isIn(['a1', 'a2', 'b1', 'b2', 'c1', 'c2'])
        .withMessage('سطح دوره معتبر نیست'),
    body('skillType')
        .notEmpty().withMessage('نوع مهارت الزامی است')
        .isIn(['fullSkill', 'listening', 'speaking', 'reading', 'writing', 'grammar'])
        .withMessage('مهارت دوره معتبر نیست'),
    body('courseType')
        .notEmpty().withMessage('نوع دوره الزامی است')
        .isIn(['online', 'offline'])
        .withMessage('نوع دوره معتبر نیست'),
];

const updateCourseValidation = [
    body('courseName')
        .optional()
        .isString().withMessage('نام دوره باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام دوره حداقل باید سه کاراکتر باشد'),
    body('description')
        .optional()
        .isString().withMessage('توضیحات باید رشته باشد')
        .isLength({ min: 5 }),
    body('price')
        .optional()
        .isFloat({ gt: 0 }).withMessage('قیمت باید عدد باشد'),
    body('language')
        .optional()
        .isIn(['english', 'german', 'spanish', 'chines', 'french', 'arabic', 'russian', 'hindi', 'japanese', 'portuguese'])
        .withMessage('زبان دوره معتبر نیست'),
    body('level')
        .optional()
        .isIn(['a1', 'a2', 'b1', 'b2', 'c1', 'c2'])
        .withMessage('سطح دوره معتبر نیست'),
    body('skillType')
        .optional()
        .isIn(['fullSkill', 'listening', 'speaking', 'reading', 'writing', 'grammar'])
        .withMessage('مهارت دوره معتبر نیست'),
    body('courseType')
        .optional()
        .isIn(['online', 'offline'])
        .withMessage('نوع دوره معتبر نیست'),
];

module.exports = {
    createCourseValidation,
    updateCourseValidation,
}