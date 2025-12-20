const { validationResult } = require('express-validator');
const prisma = require('../config/prismaClient');
const authService = require('../services/authService');
const {softDeleteCustomer} = require("../services/authService");

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const result = await authService.registerCustomer(req.body);
        res.status(201).json(result);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email_address } = req.body;
        const customer = await prisma.customer.findUnique({
            where: { email_address: email_address }
        });

        if (!customer) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ 
            message: "Successfully logged in",
            customer_id: customer.customer_id,
            full_name: customer.full_name
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deactivateUser = async (req, res) => {
    const { id } = req.params;
    await softDeleteCustomer(id)

    res.json({
        message: "Successfully deactivated user",
    });
}