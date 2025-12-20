const express = require('express');
const router = express.Router();
const authController = require('../controllers/customerController');
const { registerValidation } = require('../validators/customerValidator');
const { body } = require('express-validator');

router.post('/register', registerValidation, authController.register);
router.post('/login', [
    body('email_address').isEmail().withMessage('Enter valid email')
], authController.login);
router.patch('/customers/:id/deactivate', authController.deactivateUser);

module.exports = router;