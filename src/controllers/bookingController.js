const bookingService = require('../services/bookingService');
const { validationResult } = require('express-validator');
const prisma = require('../config/prismaClient');

exports.createBooking = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { customer_id, session_id, seat_ids } = req.body;

        const bookingResult = await bookingService.createBooking(
            customer_id, 
            session_id, 
            seat_ids
        );

        res.status(201).json({
            message: 'Бронювання успішне',
            booking: bookingResult
        });

    } catch (error) {
        console.error("Booking Error:", error);
        if (error.message.includes('вже зайняті')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Помилка сервера при бронюванні' });
    }
};

exports.getCustomerBookings = async (req, res) => {
    try {
        const customerId = parseInt(req.params.customerId);
        
        const bookings = await prisma.booking.findMany({
            where: { customer_id: customerId },
            include: {
                tickets: {
                    include: {
                        seat: true,
                        showing: {
                            include: {
                                movie: true,
                                hall: true
                            }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSeatsForSession = async (req, res) => {
    try {
        const sessionId = parseInt(req.params.sessionId);
        const showing = await prisma.showing.findUnique({
            where: { session_id: sessionId }
        });

        if (!showing) return res.status(404).json({ error: 'Сеанс не знайдено' });
        const allSeats = await prisma.seat.findMany({
            where: { hall_id: showing.hall_id },
            orderBy: [{ row_num: 'asc' }, { seat_number: 'asc' }]
        });
        const takenTickets = await prisma.ticket.findMany({
            where: {
                session_id: sessionId,
                status: { not: 'Cancelled' }
            },
            select: { seat_id: true }
        });

        const takenSeatIds = new Set(takenTickets.map(t => t.seat_id));

        const seatsWithStatus = allSeats.map(seat => ({
            ...seat,
            is_taken: takenSeatIds.has(seat.seat_id)
        }));

        res.json(seatsWithStatus);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка отримання місць' });
    }
};