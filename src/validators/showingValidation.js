const { body, param } = require('express-validator');

exports.validateReschedule = [
    param('id')
        .isInt()
        .withMessage('Showing ID must be an integer'),
    body('newStartTime')
        .isISO8601().toDate()
        .withMessage('Valid new start time is required (ISO8601 format)'),
    body('newHallId')
        .optional()
        .isInt()
        .withMessage('Hall ID must be an integer')
];