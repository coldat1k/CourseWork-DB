const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { body } = require('express-validator');

const validateMovie = [
    body('title').notEmpty().withMessage('Title is required'),
    body('release_date').isISO8601().toDate().withMessage('Valid date required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('genreIds').optional().isArray().withMessage('Genre IDs must be an array')
];

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', validateMovie, movieController.createMovie);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;