const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hallController');
const { body } = require('express-validator');

const validateHall = [
    body('name_hall').notEmpty().withMessage('Hall name is required'),
    body('type_hall').notEmpty().withMessage('Hall type is required')
];

router.get('/', hallController.getAllHalls);
router.get('/:id', hallController.getHallById);
router.post('/', validateHall, hallController.createHall);
router.put('/:id', hallController.updateHall);
router.delete('/:id', hallController.deleteHall);

module.exports = router;