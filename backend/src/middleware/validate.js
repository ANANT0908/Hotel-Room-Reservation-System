const { body } = require('express-validator');

exports.validateBooking = [
  body('count')
    .notEmpty()
    .withMessage('Room count is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Room count must be an integer between 1 and 5'),
];
