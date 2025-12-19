const prisma = require('../config/prismaClient');

exports.getShowingById = async (sessionId) => {
    return await prisma.showing.findUnique({
        where: { session_id: sessionId },
        include: {
            movie: true,
            hall: true
        }
    });
};

exports.getAllShowings = async () => {
    return await prisma.showing.findMany({
        include: { movie: true, hall: true },
        orderBy: { start_time: 'asc' }
    });
};