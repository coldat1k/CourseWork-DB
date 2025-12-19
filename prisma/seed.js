const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Починаємо оновлення бази...');
  await prisma.ticket.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.showing.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.hall.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();

  console.log('🗑️  База очищена.');
  const hall = await prisma.hall.create({
    data: {
      hall_id: 1,
      name_hall: '1 Зала',
      type_hall: 'IMAX',
    },
  });
  console.log(`✅ Зала створена: ${hall.name_hall}`);
  const genre = await prisma.genre.create({
    data: {
      genre_name: 'Sci-Fi',
    },
  });
  const movie = await prisma.movie.create({
    data: {
      title: 'Interstellar',
      duration: 169,
      release_date: new Date('2014-11-07'),
      rating: 8.7,
      genres: {
        create: {
          genre_id: genre.genre_id
        }
      }
    },
  });
  console.log(`✅ Фільм створено: ${movie.title}`);
  const showing = await prisma.showing.create({
    data: {
      session_id: 1,
      movie_id: movie.movie_id,
      hall_id: hall.hall_id,
      start_time: new Date(new Date().setHours(20, 0, 0, 0)),
    },
  });
  console.log(`✅ Сеанс створено! ID: ${showing.session_id}`);
  const rows = 5;
  const seatsPerRow = 8;
  const seatsData = [];

  for (let r = 1; r <= rows; r++) {
    for (let s = 1; s <= seatsPerRow; s++) {
      seatsData.push({
        hall_id: hall.hall_id,
        row_num: r,
        seat_number: s,
      });
    }
  }

  await prisma.seat.createMany({ data: seatsData });
  console.log(`✅ Створено ${seatsData.length} місць.`);
  await prisma.customer.create({
    data: {
        full_name: "Test User",
        email_address: "test@example.com",
        phone_number: "1234567890"
    }
  });
  console.log('✅ Тестовий клієнт створений.');
}

main()
  .catch((e) => {
    console.error('❌ ПОМИЛКА:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });