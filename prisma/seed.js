const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Починаємо оновлення бази...');

  // Очистка (порядок важен из-за Foreign Keys)
  await prisma.ticket.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.showing.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.hall.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.customer.deleteMany();

  console.log('🗑️  База очищена.');

  const hall1 = await prisma.hall.create({
    data: {
      name_hall: 'Red Hall',
      type_hall: 'IMAX',
    },
  });

  const hall2 = await prisma.hall.create({
    data: {
      name_hall: 'Blue Hall',
      type_hall: 'Standard',
    },
  });
  console.log(`✅ Зали створені: ${hall1.name_hall}, ${hall2.name_hall}`);


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
      movie_id: movie.movie_id,
      hall_id: hall1.hall_id,
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
        hall_id: hall1.hall_id,
        row_num: r,
        seat_number: s,
      });
    }
  }

  await prisma.seat.createMany({ data: seatsData });
  console.log(`✅ Створено ${seatsData.length} місць для залу ${hall1.name_hall}.`);


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