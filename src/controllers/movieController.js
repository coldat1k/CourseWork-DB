const movieService = require('../services/movieService');
const { validationResult } = require('express-validator');

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await movieService.getAllMovies();
        res.json(movies);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);
        res.json(movie);
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
};

exports.createMovie = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const movie = await movieService.createMovie(req.body);
        res.status(201).json(movie);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const movie = await movieService.updateMovie(req.params.id, req.body);
        res.json(movie);
    } catch (e) {
        const status = e.message === 'Movie not found' ? 404 : 500;
        res.status(status).json({ error: e.message });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        await movieService.deleteMovie(req.params.id);
        res.json({ message: 'Movie deleted successfully' });
    } catch (e) {
        const status = e.message === 'Movie not found' ? 404 : 500;
        res.status(status).json({ error: e.message });
    }
};