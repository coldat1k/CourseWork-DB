const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { body } = require('express-validator');

const bookingValidation = [
    body('customer_id').isInt(),
    body('session_id').isInt(),
    body('seat_ids').isArray({ min: 1 }),
    body('seat_ids.*').isInt()
];

router.post('/', bookingValidation, bookingController.createBooking);
router.get('/history/:customerId', bookingController.getCustomerBookings);
router.get('/seats/:sessionId', bookingController.getSeatsForSession);

module.exports = router;