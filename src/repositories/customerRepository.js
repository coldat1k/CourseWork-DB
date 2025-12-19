const prisma = require('../config/prismaClient');

exports.createCustomer = async (data) => {
    return await prisma.customer.create({
        data: {
            full_name: data.full_name,
            email_address: data.email_address,
            phone_number: data.phone_number
        }
    });
};

exports.findCustomerByEmail = async (email) => {
    return await prisma.customer.findUnique({
        where: { email_address: email }
    });
};

exports.findCustomerById = async (id) => {
    return await prisma.customer.findUnique({
        where: { customer_id: id }
    });
};