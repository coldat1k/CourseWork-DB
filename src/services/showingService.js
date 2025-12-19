const prisma = require('../config/prismaClient');

exports.rescheduleShowing = async (showingId, newStartTime, newHallId) => {
    if (!newStartTime) throw new Error("New start time is required");

    const newStart = new Date(newStartTime);
    const durationMinutes = 120;
    const newEnd = new Date(newStart.getTime() + durationMinutes * 60000);

    return prisma.$transaction(async (tx) => {
        const currentShowing = await tx.showing.findUnique({
            where: { session_id: showingId }
        });

        if (!currentShowing) throw new Error("Showing not found");

        const conflictingShowings = await tx.showing.findMany({
            where: {
                hall_id: newHallId || currentShowing.hall_id,
                session_id: { not: showingId },
                start_time: {
                    lte: newEnd,
                    gte: new Date(newStart.getTime() - durationMinutes * 60000)
                }
            }
        });

        if (conflictingShowings.length > 0) {
            throw new Error("Another showing is already scheduled in this hall at this time");
        }

        const updatedShowing = await tx.showing.update({
            where: { session_id: showingId },
            data: {
                start_time: newStart,
                hall_id: newHallId || currentShowing.hall_id
            }
        });

        return updatedShowing;
    });
};