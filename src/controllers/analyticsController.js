const analyticsService = require('../services/analyticsService');

exports.getMovieAnalytics = async (req, res) => {
    try {
        const data = await analyticsService.getTopGrossingMovies();
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHallStats = async (req, res) => {
    try {
        const data = await analyticsService.getHallGenreStats();
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};