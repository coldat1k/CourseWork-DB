const customerService = require('../../src/services/authService');
const prisma = require('../../src/config/prismaClient');
const resetDb = require('../helpers/resetDb');

describe('Customer Service Integration Tests', () => {

    beforeEach(async () => {
        await resetDb();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('registerCustomer', () => {
        it('should register a new customer successfully', async () => {
            const newUserData = {
                full_name: "Integration Tester",
                email_address: "new@test.com",
                phone_number: "555-0199"
            };

            const result = await customerService.registerCustomer(newUserData);

            expect(result).toHaveProperty('customer_id');
            expect(result.email_address).toBe(newUserData.email_address);

            const dbRecord = await prisma.customer.findUnique({
                where: { email_address: newUserData.email_address }
            });
            expect(dbRecord).toBeTruthy();
            expect(dbRecord.full_name).toBe("Integration Tester");
        });

        it('should throw error if email already exists', async () => {
            await prisma.customer.create({
                data: {
                    full_name: "Existing User",
                    email_address: "busy@test.com",
                    phone_number: "111"
                }
            });

            const duplicateData = {
                full_name: "New Name",
                email_address: "busy@test.com",
                phone_number: "222"
            };

            await expect(customerService.registerCustomer(duplicateData))
                .rejects
                .toThrow('Customer with this email already exists');
        });
    });

    describe('softDeleteCustomer', () => {
        it('should soft delete an existing customer', async () => {
            const customer = await prisma.customer.create({
                data: {
                    full_name: "To Delete",
                    email_address: "delete@test.com",
                    phone_number: "999",
                    is_active: true
                }
            });

            const result = await customerService.softDeleteCustomer(customer.customer_id);

            expect(result.is_active).toBe(false);
            expect(result.deleted_at).not.toBeNull();

            const dbRecord = await prisma.customer.findUnique({
                where: { customer_id: customer.customer_id }
            });
            expect(dbRecord.is_active).toBe(false);
        });

        it('should throw error if customer does not exist', async () => {
            const nonExistentId = 99999;

            await expect(customerService.softDeleteCustomer(nonExistentId))
                .rejects
                .toThrow('Customer not found');
        });
    });
});