const { body } = require('express-validator');

exports.validateBooking = [
  body('count')
    .notEmpty()
    .withMessage('Room count is required')
    .isInt({ min: 1, max: 97 })
    .withMessage('Room count must be an integer between 1 and 97'),
  body('mode')
    .optional()
    .isIn(['optimal', 'random'])
    .withMessage('Booking mode must be either "optimal" or "random"'),
];
