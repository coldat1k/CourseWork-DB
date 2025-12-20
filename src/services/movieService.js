const prisma = require('../config/prismaClient');

exports.getAllMovies = async () => {
    return prisma.movie.findMany({
        include: {
            genres: {
                include: {
                    genre: true
                }
            }
        }
    });
};

exports.getMovieById = async (id) => {
    const movie = await prisma.movie.findUnique({
        where: { movie_id: Number(id) },
        include: {
            genres: {
                include: {
                    genre: true
                }
            }
        }
    });
    if (!movie) throw new Error('Movie not found');
    return movie;
};

exports.createMovie = async (data) => {
    const { title, release_date, duration, rating, genreIds } = data;

    const genreData = genreIds && genreIds.length > 0
        ? {
            create: genreIds.map(gId => ({
                genre: { connect: { genre_id: gId } }
            }))
        }
        : undefined;

    return prisma.movie.create({
        data: {
            title,
            release_date: new Date(release_date),
            duration,
            rating,
            genres: genreData
        },
        include: {
            genres: {include: {genre: true}}
        }
    });
};

exports.updateMovie = async (id, data) => {
    const { title, release_date, duration, rating } = data;

    try {
        return await prisma.movie.update({
            where: { movie_id: Number(id) },
            data: {
                title,
                release_date: release_date ? new Date(release_date) : undefined,
                duration,
                rating
            }
        });
    } catch (error) {
        if (error.code === 'P2025') throw new Error('Movie not found');
        throw error;
    }
};

exports.deleteMovie = async (id) => {
    try {
        return await prisma.movie.delete({
            where: { movie_id: Number(id) }
        });
    } catch (error) {
        if (error.code === 'P2025') throw new Error('Movie not found');
        throw error;
    }
};