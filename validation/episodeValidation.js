const { body } = require('express-validator');

const createEpisodeValidation = [
    body('episodeName')
        .notEmpty().withMessage('نام قسمت الزامی است')
        .isString().withMessage('نام قسمت باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام قسمت حداقل باید سه کاراکتر باشد'),
    body('chapterId')
        .notEmpty().withMessage('ایدی فصل الزامی است')
        .isInt().withMessage('ایدی فصل باید عدد باشد'),
    body('teacherId')
        .notEmpty().withMessage('ایدی استاد الزامی است')
        .isInt().withMessage('ایدی استاد باید عدد باشد'),
];

const updateEpisodeValidation = [
    body('chapterName')
        .optional()
        .isString().withMessage('نام قسمت باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام قسمت حداقل باید سه کاراکتر باشد'),
    body('chapterId')
        .optional()
        .isInt().withMessage('ایدی فصل باید عدد باشد'),
    body('teacherId')
        .optional()
        .isInt().withMessage('ایدی استاد باید عدد باشد'),
];

module.exports = {
    createEpisodeValidation,
    updateEpisodeValidation,
}