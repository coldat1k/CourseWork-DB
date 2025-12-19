const hallService = require('../services/hallService');
const { validationResult } = require('express-validator');

exports.getAllHalls = async (req, res) => {
    try {
        const halls = await hallService.getAllHalls();
        res.json(halls);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getHallById = async (req, res) => {
    try {
        const hall = await hallService.getHallById(req.params.id);
        res.json(hall);
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
};

exports.createHall = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const hall = await hallService.createHall(req.body);
        res.status(201).json(hall);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.updateHall = async (req, res) => {
    try {
        const hall = await hallService.updateHall(req.params.id, req.body);
        res.json(hall);
    } catch (e) {
        const status = e.message === 'Hall not found' ? 404 : 500;
        res.status(status).json({ error: e.message });
    }
};

exports.deleteHall = async (req, res) => {
    try {
        await hallService.deleteHall(req.params.id);
        res.json({ message: 'Hall deleted successfully' });
    } catch (e) {
        const status = e.message === 'Hall not found' ? 404 : 400;
        res.status(status).json({ error: e.message });
    }
};