const prisma = require('../config/prismaClient');

exports.findTakenSeats = async (sessionId, seatIds) => {
    return await prisma.ticket.findMany({
        where: {
            session_id: sessionId,
            seat_id: { in: seatIds },
            status: { not: 'Cancelled' }
        }
    });
};

exports.getAllTakenSeatsBySession = async (sessionId) => {
    return await prisma.ticket.findMany({
        where: {
            session_id: sessionId,
            status: { not: 'Cancelled' }
        },
        select: { seat_id: true }
    });
};