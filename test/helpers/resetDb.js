const prisma = require('../../src/config/prismaClient');

const resetDb = async () => {
    await prisma.$transaction([
        prisma.ticket.deleteMany(),
        prisma.booking.deleteMany(),
        prisma.showing.deleteMany(),
        prisma.seat.deleteMany(),
        prisma.movieGenre.deleteMany(),


        prisma.movie.deleteMany(),
        prisma.hall.deleteMany(),
        prisma.genre.deleteMany(),
        prisma.customer.deleteMany(),
    ]);
};

module.exports = resetDb;