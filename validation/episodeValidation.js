const { body } = require('express-validator');

const createEpisodeValidation = [
    body('episodeName')
        .notEmpty().withMessage('نام قسمت الزامی است')
        .isString().withMessage('نام قسمت باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام قسمت حداقل باید سه کاراکتر باشد'),
    body('chapterUUID')
        .notEmpty().withMessage('ایدی فصل الزامی است')
        .isString().withMessage('ایدی فصل باید عدد باشد'),
];

const updateEpisodeValidation = [
    body('chapterName')
        .optional()
        .isString().withMessage('نام قسمت باید رشته باشد')
        .isLength({ min: 3 }).withMessage('نام قسمت حداقل باید سه کاراکتر باشد'),
];

module.exports = {
    createEpisodeValidation,
    updateEpisodeValidation,
}