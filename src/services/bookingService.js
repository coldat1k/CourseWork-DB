const prisma = require('../config/prismaClient');

exports.createBooking = async (customerId, sessionId, seatIds) => {
    const TICKET_PRICE = 150.00;
    const totalAmount = TICKET_PRICE * seatIds.length;


    return prisma.$transaction(async (tx) => {
        const takenSeats = await tx.ticket.findMany({
            where: {
                session_id: sessionId,
                seat_id: {in: seatIds},
                status: {not: 'Cancelled'}
            }
        });

        if (takenSeats.length > 0) {
            throw new Error(`Seats ${takenSeats.map(t => t.seat_id).join(', ')} is already taken.`);
        }
        const booking = await tx.booking.create({
            data: {
                customer_id: customerId,
                total_amount: totalAmount,
                status: 'Confirmed'
            }
        });

        const ticketsData = seatIds.map(seatId => ({
            booking_id: booking.booking_id,
            session_id: sessionId,
            seat_id: seatId,
            price: TICKET_PRICE,
            status: 'Paid'
        }));

        await tx.ticket.createMany({
            data: ticketsData
        });

        return booking;
    });
};