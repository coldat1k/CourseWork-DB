const customerRepository = require('../repositories/customerRepository');

exports.registerCustomer = async (data) => {
    const existingCustomer = await customerRepository.findCustomerByEmail(data.email_address);
    if (existingCustomer) {
        throw new Error('Клієнт з таким email вже існує');
    }
    const newCustomer = await customerRepository.createCustomer(data);
    return newCustomer;
};