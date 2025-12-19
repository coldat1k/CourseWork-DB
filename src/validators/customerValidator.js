const { body } = require('express-validator');

exports.registerValidation = [
    body('full_name').notEmpty().withMessage('Ім’я обов’язкове'),
    body('email_address').isEmail().withMessage('Некоректний email'),
    body('phone_number').isMobilePhone().withMessage('Некоректний номер телефону'),
];