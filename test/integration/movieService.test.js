const movieServiceTest = require('../../src/services/movieService');
const prisma = require('../../src/config/prismaClient');
const resetDb = require('../helpers/resetDb');

describe('Movie Service Integration Tests', () => {
    let genreId;

    beforeEach(async () => {
        await resetDb();
        const genre = await prisma.genre.create({
            data: { genre_name: 'Action' }
        });
        genreId = genre.genre_id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('createMovie', () => {
        it('should create a movie with genres successfully', async () => {
            const data = {
                title: "Inception",
                release_date: "2010-07-16",
                duration: 148,
                rating: 8.8,
                genreIds: [genreId]
            };

            const result = await movieServiceTest.createMovie(data);

            expect(result).toHaveProperty('movie_id');
            expect(result.title).toBe(data.title);
            expect(result.genres).toHaveLength(1);
            expect(result.genres[0].genre.genre_name).toBe('Action');

            const dbRecord = await prisma.movie.findUnique({
                where: { movie_id: result.movie_id }
            });
            expect(dbRecord).toBeTruthy();
        });
    });

    describe('getAllMovies', () => {
        it('should return all movies with included genres', async () => {
            await movieServiceTest.createMovie({
                title: "Movie 1",
                release_date: "2020-01-01",
                duration: 100,
                rating: 5,
                genreIds: [genreId]
            });
            await movieServiceTest.createMovie({
                title: "Movie 2",
                release_date: "2020-01-02",
                duration: 120,
                rating: 6,
                genreIds: []
            });

            const result = await movieServiceTest.getAllMovies();

            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty('genres');
        });
    });

    describe('getMovieById', () => {
        it('should return movie by id', async () => {
            const created = await movieServiceTest.createMovie({
                title: "Target Movie",
                release_date: "2022-01-01",
                duration: 90,
                rating: 7,
                genreIds: [genreId]
            });

            const result = await movieServiceTest.getMovieById(created.movie_id);

            expect(result.title).toBe("Target Movie");
            expect(result.genres).toHaveLength(1);
        });

        it('should throw error if movie not found', async () => {
            await expect(movieServiceTest.getMovieById(99999))
                .rejects
                .toThrow('Movie not found');
        });
    });

    describe('updateMovie', () => {
        it('should update movie details', async () => {
            const created = await movieServiceTest.createMovie({
                title: "Old Title",
                release_date: "2020-01-01",
                duration: 100,
                rating: 5,
                genreIds: []
            });

            const updateData = {
                title: "New Title",
                duration: 150
            };

            const result = await movieServiceTest.updateMovie(created.movie_id, updateData);

            expect(result.title).toBe("New Title");
            expect(result.duration).toBe(150);

            const dbRecord = await prisma.movie.findUnique({
                where: { movie_id: created.movie_id }
            });
            expect(dbRecord.title).toBe("New Title");
        });

        it('should throw error if updating non-existent movie', async () => {
            await expect(movieServiceTest.updateMovie(99999, { title: "Fail" }))
                .rejects
                .toThrow('Movie not found');
        });
    });

    describe('deleteMovie', () => {
        it('should delete movie successfully', async () => {
            const created = await movieServiceTest.createMovie({
                title: "To Delete",
                release_date: "2020-01-01",
                duration: 100,
                rating: 5,
                genreIds: []
            });

            await movieServiceTest.deleteMovie(created.movie_id);

            const dbRecord = await prisma.movie.findUnique({
                where: { movie_id: created.movie_id }
            });
            expect(dbRecord).toBeNull();
        });

        it('should throw error if deleting non-existent movie', async () => {
            await expect(movieServiceTest.deleteMovie(99999))
                .rejects
                .toThrow('Movie not found');
        });
    });
});