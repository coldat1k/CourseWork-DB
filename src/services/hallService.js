const prisma = require('../config/prismaClient');

exports.getAllHalls = async () => {
    return prisma.hall.findMany({
        include: {
            seats: true
        }
    });
};

exports.getHallById = async (id) => {
    const hall = await prisma.hall.findUnique({
        where: { hall_id: Number(id) },
        include: { seats: true }
    });
    if (!hall) throw new Error('Hall not found');
    return hall;
};

exports.createHall = async (data) => {
    const { name_hall, type_hall } = data;

    const existing = await prisma.hall.findUnique({
        where: { name_hall }
    });
    if (existing) throw new Error('Hall with this name already exists');

    return prisma.hall.create({
        data: {
            name_hall,
            type_hall
        }
    });
};

exports.updateHall = async (id, data) => {
    try {
        return await prisma.hall.update({
            where: { hall_id: Number(id) },
            data: data
        });
    } catch (error) {
        if (error.code === 'P2025') throw new Error('Hall not found');
        throw error;
    }
};

exports.deleteHall = async (id) => {
    try {
        return await prisma.hall.delete({
            where: { hall_id: Number(id) }
        });
    } catch (error) {
        if (error.code === 'P2025') throw new Error('Hall not found');
        if (error.code === 'P2003') throw new Error('Cannot delete hall because it has related showings or seats');
        throw error;
    }
};