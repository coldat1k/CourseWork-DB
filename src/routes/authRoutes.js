const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation } = require('../validators/customerValidator');
const { body } = require('express-validator');

router.post('/register', registerValidation, authController.register);
router.post('/login', [
    body('email_address').isEmail().withMessage('Введіть коректний email')
], authController.login);

module.exports = router;