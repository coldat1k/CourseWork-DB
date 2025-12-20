const hallService = require('../../src/services/hallService');
const prisma = require('../../src/config/prismaClient');
const resetDb = require('../helpers/resetDb');

describe('Hall Service Integration Tests', () => {

    beforeEach(async () => {
        await resetDb();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('createHall', () => {
        it('should create a new hall successfully', async () => {
            const data = {
                name_hall: "IMAX Hall",
                type_hall: "Premium"
            };

            const result = await hallService.createHall(data);

            expect(result).toHaveProperty('hall_id');
            expect(result.name_hall).toBe(data.name_hall);

            const dbRecord = await prisma.hall.findUnique({
                where: { hall_id: result.hall_id }
            });
            expect(dbRecord).toBeTruthy();
        });

        it('should throw error if hall name already exists', async () => {
            await hallService.createHall({
                name_hall: "Duplicate Hall",
                type_hall: "Standard"
            });

            await expect(hallService.createHall({
                name_hall: "Duplicate Hall",
                type_hall: "VIP"
            })).rejects.toThrow('Hall with this name already exists');
        });
    });

    describe('getAllHalls', () => {
        it('should return all halls', async () => {
            await hallService.createHall({ name_hall: "Hall 1", type_hall: "Standard" });
            await hallService.createHall({ name_hall: "Hall 2", type_hall: "VIP" });

            const result = await hallService.getAllHalls();

            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty('seats');
        });
    });

    describe('getHallById', () => {
        it('should return hall by id with seats', async () => {
            const created = await hallService.createHall({
                name_hall: "Target Hall",
                type_hall: "Standard"
            });

            const result = await hallService.getHallById(created.hall_id);

            expect(result.name_hall).toBe("Target Hall");
            expect(result).toHaveProperty('seats');
        });

        it('should throw error if hall not found', async () => {
            await expect(hallService.getHallById(9999))
                .rejects
                .toThrow('Hall not found');
        });
    });

    describe('updateHall', () => {
        it('should update hall details', async () => {
            const created = await hallService.createHall({
                name_hall: "Old Name",
                type_hall: "Old Type"
            });

            const updated = await hallService.updateHall(created.hall_id, {
                name_hall: "New Name",
                type_hall: "New Type"
            });

            expect(updated.name_hall).toBe("New Name");

            const dbRecord = await prisma.hall.findUnique({
                where: { hall_id: created.hall_id }
            });
            expect(dbRecord.name_hall).toBe("New Name");
        });

        it('should throw error if updating non-existent hall', async () => {
            await expect(hallService.updateHall(9999, { name_hall: "Test" }))
                .rejects
                .toThrow('Hall not found');
        });
    });

    describe('deleteHall', () => {
        it('should delete hall successfully', async () => {
            const created = await hallService.createHall({
                name_hall: "To Delete",
                type_hall: "Standard"
            });

            await hallService.deleteHall(created.hall_id);

            const dbRecord = await prisma.hall.findUnique({
                where: { hall_id: created.hall_id }
            });
            expect(dbRecord).toBeNull();
        });

        it('should throw error if hall has related seats (P2003)', async () => {
            const created = await hallService.createHall({
                name_hall: "Linked Hall",
                type_hall: "Standard"
            });

            await prisma.seat.create({
                data: {
                    hall_id: created.hall_id,
                    row_num: 1,
                    seat_number: 1
                }
            });

            await expect(hallService.deleteHall(created.hall_id))
                .rejects
                .toThrow('Cannot delete hall because it has related showings or seats');
        });
    });
});