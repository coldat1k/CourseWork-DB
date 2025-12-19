const showingService = require('../services/showingService');
const { validationResult } = require('express-validator');

exports.rescheduleShowing = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { newStartTime, newHallId } = req.body;

        const updatedShowing = await showingService.rescheduleShowing(
            Number(id),
            newStartTime,
            newHallId ? Number(newHallId) : undefined
        );

        res.json({
            message: "Showing rescheduled successfully",
            data: updatedShowing
        });

    } catch (error) {
        if (error.message === "Showing not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "Another showing is already scheduled in this hall at this time") {
            return res.status(409).json({ error: error.message });
        }

        res.status(500).json({ error: error.message });
    }
};