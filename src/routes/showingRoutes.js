const express = require('express');
const router = express.Router();
const showingController = require('../controllers/showingController');

const { validateReschedule } = require('../validation/showingValidation');

router.put(
    '/:id/reschedule',
    validateReschedule,
    showingController.rescheduleShowing
);

module.exports = router;