const bookingService = require('../../src/services/bookingService');
const prisma = require('../../src/config/prismaClient');
const resetDb = require('../helpers/resetDb');

describe('Booking Service Integration Tests', () => {
    let customerId;
    let sessionId;
    let seatId1;
    let seatId2;

    beforeEach(async () => {
        await resetDb();

        // 1. Create Customer
        const customer = await prisma.customer.create({
            data: {
                full_name: "Booking Tester",
                email_address: "booking@test.com",
                phone_number: "123456"
            }
        });
        customerId = customer.customer_id;

        // 2. Create Hall
        const hall = await prisma.hall.create({
            data: { name_hall: "Test Hall", type_hall: "Standard" }
        });

        // 3. Create Movie
        const movie = await prisma.movie.create({
            data: {
                title: "Test Movie",
                duration: 120,
                release_date: new Date()
            }
        });

        // 4. Create Session (Showing)
        const showing = await prisma.showing.create({
            data: {
                movie_id: movie.movie_id,
                hall_id: hall.hall_id,
                start_time: new Date()
            }
        });
        sessionId = showing.session_id;

        // 5. Create Seats
        const seat1 = await prisma.seat.create({
            data: { hall_id: hall.hall_id, row_num: 1, seat_number: 1 }
        });
        const seat2 = await prisma.seat.create({
            data: { hall_id: hall.hall_id, row_num: 1, seat_number: 2 }
        });
        seatId1 = seat1.seat_id;
        seatId2 = seat2.seat_id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('createBooking', () => {
        it('should create a booking and tickets successfully', async () => {
            const seatIds = [seatId1, seatId2];

            const result = await bookingService.createBooking(customerId, sessionId, seatIds);

            // Check Booking
            expect(result).toHaveProperty('booking_id');
            expect(result.status).toBe('Confirmed');
            expect(Number(result.total_amount)).toBe(300); // 150 * 2

            // Check Tickets in DB
            const tickets = await prisma.ticket.findMany({
                where: { booking_id: result.booking_id }
            });

            expect(tickets).toHaveLength(2);
            expect(tickets[0].status).toBe('Paid');
            expect(Number(tickets[0].price)).toBe(150);
        });

        it('should throw error if seats are already taken', async () => {
            // 1. Simulate an existing booking for Seat 1
            const previousBooking = await prisma.booking.create({
                data: { customer_id: customerId, total_amount: 150, status: 'Confirmed' }
            });

            await prisma.ticket.create({
                data: {
                    booking_id: previousBooking.booking_id,
                    session_id: sessionId,
                    seat_id: seatId1, // Seat 1 is now taken
                    price: 150,
                    status: 'Paid'
                }
            });

            // 2. Try to book Seat 1 and Seat 2
            const seatIds = [seatId1, seatId2];

            // 3. Expect Error
            await expect(bookingService.createBooking(customerId, sessionId, seatIds))
                .rejects
                .toThrow(`Seats ${seatId1} is already taken.`);

            // 4. Ensure Seat 2 was NOT booked (Transaction Rollback check)
            const ticketsForSeat2 = await prisma.ticket.findMany({
                where: { seat_id: seatId2 }
            });
            expect(ticketsForSeat2).toHaveLength(0);
        });
    });
});