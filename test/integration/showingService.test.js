const showingService = require('../../src/services/showingService');
const prisma = require('../../src/config/prismaClient');
const resetDb = require('../helpers/resetDb');

describe('Showing Service Integration Tests', () => {
    let movieId, hallId1, hallId2, showingId;

    beforeEach(async () => {
        await resetDb();

        const movie = await prisma.movie.create({
            data: {
                title: "Test Movie",
                duration: 120,
                release_date: new Date()
            }
        });
        movieId = movie.movie_id;

        const hall1 = await prisma.hall.create({
            data: { name_hall: "Hall A", type_hall: "Standard" }
        });
        hallId1 = hall1.hall_id;

        const hall2 = await prisma.hall.create({
            data: { name_hall: "Hall B", type_hall: "VIP" }
        });
        hallId2 = hall2.hall_id;

        const showing = await prisma.showing.create({
            data: {
                movie_id: movieId,
                hall_id: hallId1,
                start_time: new Date("2025-01-01T10:00:00.000Z")
            }
        });
        showingId = showing.session_id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('rescheduleShowing', () => {
        it('should reschedule showing successfully to a free time slot', async () => {
            const newTime = "2025-01-01T14:00:00.000Z";

            const result = await showingService.rescheduleShowing(showingId, newTime, hallId1);

            expect(result.start_time.toISOString()).toBe(newTime);
            expect(result.hall_id).toBe(hallId1);

            const dbRecord = await prisma.showing.findUnique({
                where: { session_id: showingId }
            });
            expect(dbRecord.start_time.toISOString()).toBe(newTime);
        });

        it('should reschedule showing successfully to a different hall', async () => {
            const newTime = "2025-01-01T10:00:00.000Z";

            const result = await showingService.rescheduleShowing(showingId, newTime, hallId2);

            expect(result.hall_id).toBe(hallId2);

            const dbRecord = await prisma.showing.findUnique({
                where: { session_id: showingId }
            });
            expect(dbRecord.hall_id).toBe(hallId2);
        });

        it('should throw error if new time conflicts with existing showing in the same hall', async () => {
            await prisma.showing.create({
                data: {
                    movie_id: movieId,
                    hall_id: hallId1,
                    start_time: new Date("2025-01-01T13:00:00.000Z")
                }
            });

            const conflictingTime = "2025-01-01T12:00:00.000Z";

            await expect(showingService.rescheduleShowing(showingId, conflictingTime, hallId1))
                .rejects
                .toThrow("Another showing is already scheduled in this hall at this time");
        });

        it('should throw error if showing does not exist', async () => {
            await expect(showingService.rescheduleShowing(9999, "2025-01-01T10:00:00.000Z"))
                .rejects
                .toThrow("Showing not found");
        });
    });

    describe('getAllShowings', () => {
        it('should return all showings with movie and hall included', async () => {
            const result = await showingService.getAllShowings();

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('movie');
            expect(result[0]).toHaveProperty('hall');
            expect(result[0].movie.title).toBe("Test Movie");
        });
    });
});