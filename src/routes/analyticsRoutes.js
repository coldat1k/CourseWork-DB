const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/movies', analyticsController.getMovieAnalytics);
router.get('/halls', analyticsController.getHallStats);

module.exports = router;