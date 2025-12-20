const express = require('express');
const router = express.Router();
const showingController = require('../controllers/showingController');
const {validateReschedule} = require("../validators/showingValidation");

router.put(
    '/:id/reschedule',
    validateReschedule,
    showingController.rescheduleShowing
);

router.get("/", showingController.getAllShowings);

module.exports = router;