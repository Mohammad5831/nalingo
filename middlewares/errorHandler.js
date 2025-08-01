const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(err => err.msg)
    return res.status(422).json({success: false, message: 'خطا در ارسال درخواست', error: message})
  };
  next()
};

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'خطای داخلی سرور',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};

module.exports = {
  errorHandler,
  handleValidationErrors,
};