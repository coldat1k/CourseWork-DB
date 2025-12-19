const prisma = require('../config/prismaClient');

const serializeBigInt = (data) => {
    return JSON.parse(JSON.stringify(data, (key, value) =>
        typeof value === 'bigint'
            ? Number(value)
            : value
    ));
};

exports.getTopGrossingMovies = async () => {
    try {
        const result = await prisma.$queryRaw`
            SELECT 
                m.title,
                COUNT(t.ticket_id) as tickets_sold,
                COALESCE(SUM(t.price), 0) as total_revenue,
                AVG(t.price) as avg_ticket_price
            FROM "MOVIE" m
            JOIN "SHOWING" s ON m.movie_id = s.movie_id
            JOIN "TICKET" t ON s.session_id = t.session_id
            WHERE t.status = 'Paid'
            GROUP BY m.movie_id, m.title
            ORDER BY total_revenue DESC
            LIMIT 5;
        `;
        return serializeBigInt(result);
    } catch (error) {
        throw error;
    }
};

exports.getTopCustomers = async (minSpent = 500) => {
    try {
        const result = await prisma.$queryRaw`
            SELECT 
                c.full_name,
                c.email_address,
                COUNT(b.booking_id) as total_bookings,
                SUM(b.total_amount) as total_spent,
                MAX(b.booking_date) as last_booking_date
            FROM "CUSTOMER" c
            JOIN "BOOKING" b ON c.customer_id = b.customer_id
            WHERE c.is_active = true AND b.status = 'Confirmed'
            GROUP BY c.customer_id, c.full_name, c.email_address
            HAVING SUM(b.total_amount) >= ${minSpent}
            ORDER BY total_spent DESC;
        `;
        return serializeBigInt(result);
    } catch (error) {
        throw error;
    }
};

exports.getHallGenreStats = async () => {
    try {
        const result = await prisma.$queryRaw`
            SELECT 
                h.name_hall,
                g.genre_name,
                COUNT(t.ticket_id) as tickets_sold
            FROM "HALL" h
            JOIN "SHOWING" s ON h.hall_id = s.hall_id
            JOIN "MOVIE" m ON s.movie_id = m.movie_id
            JOIN "MOVIE_GENRE" mg ON m.movie_id = mg.movie_id
            JOIN "GENRE" g ON mg.genre_id = g.genre_id
            LEFT JOIN "TICKET" t ON s.session_id = t.session_id
            WHERE t.status = 'Paid'
            GROUP BY h.hall_id, h.name_hall, g.genre_id, g.genre_name
            ORDER BY h.name_hall ASC, tickets_sold DESC;
        `;
        return serializeBigInt(result);
    } catch (error) {
        throw error;
    }
};