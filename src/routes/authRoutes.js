const express = require('express');
const router = express.Router();
const authController = require('../controllers/customerController');
const { registerValidation } = require('../validators/customerValidator');
const { body } = require('express-validator');

router.post('/register', registerValidation, authController.register);
router.post('/login', [
    body('email').isEmail().withMessage('Enter valid email')
], authController.login);

module.exports = router;