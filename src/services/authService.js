const customerRepository = require('../repositories/customerRepository');
const prisma = require('../config/prismaClient');

exports.registerCustomer = async (data) => {
    const existingCustomer = await customerRepository.findCustomerByEmail(data.email_address);
    if (existingCustomer) {
        throw new Error('Customer with this email already exists');
    }
    const newCustomer = await customerRepository.createCustomer(data);
    return newCustomer;
};

exports.softDeleteCustomer = async (customerId) => {
    try {
        const deletedCustomer = await prisma.customer.update({
            where: {
                customer_id: Number(customerId)
            },
            data: {
                is_active: false,
                deleted_at: new Date()
            }
        });
        return deletedCustomer;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Customer not found');
        }
        throw error;
    }
};